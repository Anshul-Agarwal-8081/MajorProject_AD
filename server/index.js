const http = require('node:http');
const { URL } = require('node:url');
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Copy .env.example to .env and configure it.');
  process.exit(1);
}

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const allowedActivities = new Set(['swimming', 'surfing', 'boating']);

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function isBeachId(value) {
  return /^[1-9][0-9]*$/.test(value);
}

async function handleRequest(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return sendJson(response, 405, { error: 'Only GET requests are supported.' });
  }

  const url = new URL(request.url, 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path === '/health') {
    await pool.query('SELECT 1');
    return sendJson(response, 200, { status: 'ok', database: 'connected' });
  }

  if (path === '/beaches') {
    const search = url.searchParams.get('q')?.trim() || null;
    const state = url.searchParams.get('state')?.trim() || null;
    const result = await pool.query(
      `SELECT beach_id AS id, name, state, location AS city, location AS region,
              latitude, longitude, description, facilities
       FROM beaches
       WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%'
              OR state ILIKE '%' || $1 || '%' OR location ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR state ILIKE '%' || $2 || '%')
       ORDER BY state, name`,
      [search, state],
    );
    return sendJson(response, 200, { beaches: result.rows });
  }

  if (path === '/alerts') {
    const result = await pool.query(
      `SELECT alert_id, beach_id, title, alert_type, severity, description,
              affected_location, source, issued_at, updated_at, expires_at
       FROM active_verified_alerts
       ORDER BY issued_at DESC`,
    );
    return sendJson(response, 200, { alerts: result.rows });
  }

  if (path === '/demo/alerts') {
    const result = await pool.query(
      `SELECT alert_id, beach_id, title, alert_type, severity, description,
              affected_location, source, issued_at, updated_at, expires_at,
              verification_status, is_demo
       FROM alerts
       WHERE is_demo = TRUE
       ORDER BY issued_at DESC`,
    );
    return sendJson(response, 200, { demo: true, alerts: result.rows });
  }

  const beachChildMatch = path.match(/^\/beaches\/([^/]+)\/(environment|suitability|alerts)$/);
  if (beachChildMatch) {
    const [, beachId, resource] = beachChildMatch;
    if (!isBeachId(beachId)) return sendJson(response, 400, { error: 'Beach ID must be a positive integer.' });

    if (resource === 'environment') {
      const result = await pool.query(
        `SELECT observation_id, observation_type, measurement, value, unit,
                source, source_url, recorded_at, valid_until
         FROM current_verified_environment
         WHERE beach_id = $1
         ORDER BY recorded_at DESC`,
        [beachId],
      );
      return sendJson(response, 200, { observations: result.rows });
    }

    if (resource === 'suitability') {
      const activity = url.searchParams.get('activity')?.trim() || null;
      if (activity && !allowedActivities.has(activity)) {
        return sendJson(response, 400, { error: 'Activity must be swimming, surfing, or boating.' });
      }
      const result = await pool.query(
        `SELECT DISTINCT ON (activity)
                assessment_id, beach_id, activity, status, reason, source,
                assessed_at, expires_at
         FROM current_verified_suitability
         WHERE beach_id = $1 AND ($2::text IS NULL OR activity = $2)
         ORDER BY activity, assessed_at DESC`,
        [beachId, activity],
      );
      return sendJson(response, 200, { assessments: result.rows });
    }

    const result = await pool.query(
      `SELECT alert_id, beach_id, title, alert_type, severity, description,
              affected_location, source, issued_at, updated_at, expires_at
       FROM active_verified_alerts
       WHERE beach_id = $1 OR beach_id IS NULL
       ORDER BY issued_at DESC`,
      [beachId],
    );
    return sendJson(response, 200, { alerts: result.rows });
  }

  const beachMatch = path.match(/^\/beaches\/([^/]+)$/);
  if (beachMatch) {
    const [, beachId] = beachMatch;
    if (!isBeachId(beachId)) return sendJson(response, 400, { error: 'Beach ID must be a positive integer.' });
    const result = await pool.query(
      `SELECT beach_id AS id, name, state, location AS city, location AS region,
              latitude, longitude, description, facilities, created_at, updated_at
       FROM beaches
       WHERE beach_id = $1`,
      [beachId],
    );
    if (result.rowCount === 0) return sendJson(response, 404, { error: 'Beach not found.' });
    return sendJson(response, 200, { beach: result.rows[0] });
  }

  return sendJson(response, 404, { error: 'Route not found.' });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Request failed:', error.message);
    if (!response.headersSent) return sendJson(response, 500, { error: 'The request could not be completed.' });
    response.destroy();
  });
});

server.listen(port, host, () => {
  console.log(`CoastSafe API listening on http://${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      pool.end().finally(() => process.exit(0));
    });
  });
}
