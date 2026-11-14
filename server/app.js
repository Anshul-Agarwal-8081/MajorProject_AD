const express = require('express');

const ACTIVITIES = new Set(['swimming', 'surfing', 'boating']);
const SORTS = new Set(['name', 'state', 'updated']);
const ALERT_TYPES = new Set(['weather', 'wave', 'current', 'water_quality', 'access', 'training_scenario', 'general', 'other']);
const SEVERITIES = new Set(['info', 'warning', 'critical', 'unknown']);
const forecastCache = new Map();
const FORECAST_CACHE_MS = 10 * 60 * 1000;

function apiError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function positiveId(value, label = 'ID') {
  if (!/^[1-9]\d*$/.test(String(value))) {
    throw apiError(400, 'INVALID_ID', `${label} must be a positive integer.`);
  }
  return String(value);
}

function queryText(value, label, maxLength = 100) {
  if (value === undefined) return undefined;
  const result = String(value).trim();
  if (!result) return undefined;
  if (result.length > maxLength) throw apiError(400, 'INVALID_QUERY', `${label} must be ${maxLength} characters or fewer.`);
  return result;
}

function pageOptions(query) {
  const limit = query.limit === undefined ? 50 : Number(query.limit);
  const offset = query.offset === undefined ? 0 : Number(query.offset);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw apiError(400, 'INVALID_PAGINATION', 'limit must be an integer from 1 to 100.');
  }
  if (!Number.isInteger(offset) || offset < 0 || offset > 100000) {
    throw apiError(400, 'INVALID_PAGINATION', 'offset must be a non-negative integer up to 100000.');
  }
  return { limit, offset };
}

function validActivity(value) {
  if (value && !ACTIVITIES.has(value)) {
    throw apiError(400, 'INVALID_ACTIVITY', 'activity must be swimming, surfing, or boating.');
  }
  return value;
}

function beachColumns(alias = 'b') {
  return `${alias}.beach_id AS id, ${alias}.name, ${alias}.state,
    ${alias}.location AS city, ${alias}.location AS region, ${alias}.latitude,
    ${alias}.longitude, ${alias}.description, ${alias}.facilities,
    ${alias}.created_at, ${alias}.updated_at`;
}

function createApp({ pool, fetchImpl = global.fetch }) {
  if (!pool || typeof pool.query !== 'function') throw new Error('createApp requires a PostgreSQL pool.');
  const app = express();
  app.disable('x-powered-by');
  // Read-only API endpoints are consumed by the Expo web preview as well as native apps.
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.use(express.json({ limit: '32kb' }));

  app.get('/health', async (req, res, next) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
      next(apiError(503, 'DATABASE_UNAVAILABLE', 'The database is temporarily unavailable.'));
    }
  });

  app.get('/beaches', async (req, res, next) => {
    try {
      const { limit, offset } = pageOptions(req.query);
      const q = queryText(req.query.q, 'q');
      const state = queryText(req.query.state, 'state');
      const activity = validActivity(queryText(req.query.activity, 'activity', 20));
      const status = queryText(req.query.status, 'status', 30);
      const sort = queryText(req.query.sort, 'sort', 20) || 'name';
      if (!SORTS.has(sort)) throw apiError(400, 'INVALID_SORT', 'sort must be name, state, or updated.');
      if (status && !['suitable', 'caution', 'not_suitable', 'insufficient_data'].includes(status)) {
        throw apiError(400, 'INVALID_STATUS', 'status must be suitable, caution, not_suitable, or insufficient_data.');
      }
      if (status && !activity) throw apiError(400, 'ACTIVITY_REQUIRED', 'activity is required when filtering by status.');
      const orderBy = sort === 'updated' ? 'b.updated_at DESC, b.name ASC' : `b.${sort} ASC`;
      const result = await pool.query(
        `SELECT ${beachColumns('b')}, COUNT(*) OVER()::int AS total_count
         FROM beaches b
         WHERE ($1::text IS NULL OR b.name ILIKE '%' || $1 || '%'
           OR b.state ILIKE '%' || $1 || '%' OR b.location ILIKE '%' || $1 || '%'
             OR EXISTS (SELECT 1 FROM unnest(b.facilities) AS facility(value) WHERE value ILIKE '%' || $1 || '%'))
           AND ($2::text IS NULL OR b.state ILIKE '%' || $2 || '%')
           AND ($3::text IS NULL OR $4::text = 'insufficient_data' OR EXISTS (
             SELECT 1 FROM current_verified_suitability s
             WHERE s.beach_id = b.beach_id AND s.activity = $3
               AND ($4::text IS NULL OR s.status = $4)))
           AND ($4::text IS NULL OR $4 <> 'insufficient_data' OR NOT EXISTS (
             SELECT 1 FROM current_verified_suitability s
             WHERE s.beach_id = b.beach_id AND s.activity = $3))
         ORDER BY ${orderBy}, b.beach_id
         LIMIT $5 OFFSET $6`,
        [q, state || null, activity, status || null, limit, offset],
      );
      const beaches = result.rows.map(({ total_count, ...beach }) => beach);
      const total = result.rows[0]?.total_count ?? 0;
      res.json({ beaches, pagination: { limit, offset, total }, dataStatus: 'available' });
    } catch (error) { next(error); }
  });

  app.get('/beaches/:id/environment/forecast', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Beach ID');
      const beachResult = await pool.query(`SELECT ${beachColumns()} FROM beaches b WHERE b.beach_id = $1`, [id]);
      if (!beachResult.rowCount) throw apiError(404, 'BEACH_NOT_FOUND', 'Beach not found.');
      const beach = beachResult.rows[0];
      if (beach.latitude == null || beach.longitude == null) {
        return res.json({ beachId: beach.id, forecast: null, dataStatus: 'insufficient_data', message: 'Coordinates are not available for this beach.' });
      }
      const cacheKey = `${beach.latitude},${beach.longitude}`;
      const cached = forecastCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) return res.json({ beachId: beach.id, ...cached.payload, cached: true });
      const url = new URL('https://marine-api.open-meteo.com/v1/marine');
      url.search = new URLSearchParams({
        latitude: String(beach.latitude), longitude: String(beach.longitude),
        current: 'wave_height,wave_period,ocean_current_velocity', timezone: 'Asia/Kolkata',
      }).toString();
      let response;
      try {
        response = await fetchImpl(url, { signal: AbortSignal.timeout(8000), headers: { Accept: 'application/json' } });
      } catch (error) {
        throw apiError(503, 'MARINE_PROVIDER_UNAVAILABLE', 'Marine forecast is temporarily unavailable.');
      }
      if (!response.ok) throw apiError(503, 'MARINE_PROVIDER_UNAVAILABLE', 'Marine forecast is temporarily unavailable.');
      const body = await response.json();
      const current = body.current;
      if (!current || !current.time) throw apiError(502, 'MARINE_DATA_UNAVAILABLE', 'The provider did not return current marine forecast data.');
      const forecast = {
        provider: 'Open-Meteo Marine API', type: 'model_forecast', verificationStatus: 'unverified',
        isDemo: false, beachId: beach.id,
        requestedCoordinates: { latitude: Number(beach.latitude), longitude: Number(beach.longitude) },
        modelGridCoordinates: { latitude: body.latitude, longitude: body.longitude },
        recordedAt: current.time,
        current: {
          waveHeight: current.wave_height ?? null,
          wavePeriod: current.wave_period ?? null,
          oceanCurrentVelocity: current.ocean_current_velocity ?? null,
        },
        units: {
          waveHeight: body.current_units?.wave_height ?? null,
          wavePeriod: body.current_units?.wave_period ?? null,
          oceanCurrentVelocity: body.current_units?.ocean_current_velocity ?? null,
        },
        attribution: 'Open-Meteo; marine model provider attribution applies.',
        disclaimer: 'This is a model forecast, not a verified observation or official safety warning. It is not used to calculate activity suitability.',
      };
      const payload = { forecast, dataStatus: 'model_forecast' };
      forecastCache.set(cacheKey, { payload, expiresAt: Date.now() + FORECAST_CACHE_MS });
      res.json({ beachId: beach.id, ...payload, cached: false });
    } catch (error) { next(error); }
  });

  app.get('/beaches/:id/environment', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Beach ID');
      const beach = await pool.query('SELECT beach_id FROM beaches WHERE beach_id = $1', [id]);
      if (!beach.rowCount) throw apiError(404, 'BEACH_NOT_FOUND', 'Beach not found.');
      const result = await pool.query(
        `SELECT observation_id, observation_type, measurement, value, unit, source,
                source_url, recorded_at, valid_until
         FROM current_verified_environment WHERE beach_id = $1 ORDER BY recorded_at DESC`, [id]);
      if (result.rowCount) return res.json({ observations: result.rows, dataStatus: 'available', stale: false });
      const stale = await pool.query(
        `SELECT COUNT(*)::int AS count, MAX(recorded_at) AS last_recorded_at
         FROM environmental_observations WHERE beach_id = $1 AND verification_status = 'verified' AND is_demo = FALSE`, [id]);
      const hasExpired = stale.rows[0].count > 0;
      res.json({ observations: [], dataStatus: hasExpired ? 'outdated' : 'insufficient_data', stale: hasExpired,
        lastRecordedAt: stale.rows[0].last_recorded_at,
        message: hasExpired ? 'The latest verified environmental records have expired.' : 'No current verified environmental records are available.' });
    } catch (error) { next(error); }
  });

  app.get('/beaches/:id/suitability', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Beach ID');
      const activity = validActivity(queryText(req.query.activity, 'activity', 20));
      if (!activity) throw apiError(400, 'ACTIVITY_REQUIRED', 'activity is required: swimming, surfing, or boating.');
      const beach = await pool.query('SELECT beach_id FROM beaches WHERE beach_id = $1', [id]);
      if (!beach.rowCount) throw apiError(404, 'BEACH_NOT_FOUND', 'Beach not found.');
      const result = await pool.query(
        `SELECT assessment_id, beach_id, activity, status, reason, source, assessed_at, expires_at
         FROM current_verified_suitability WHERE beach_id = $1 AND activity = $2
         ORDER BY assessed_at DESC LIMIT 1`, [id, activity]);
      if (result.rowCount) return res.json({ assessment: result.rows[0], dataStatus: 'available', stale: false });
      const stale = await pool.query(
        `SELECT MAX(assessed_at) AS last_assessed_at FROM suitability_assessments
         WHERE beach_id = $1 AND activity = $2 AND verification_status = 'verified' AND is_demo = FALSE`, [id, activity]);
      const outdated = stale.rows[0].last_assessed_at != null;
      res.json({ assessment: { beach_id: Number(id), activity, status: 'insufficient_data',
        reason: outdated ? 'The latest verified assessment has expired.' : 'No current verified suitability assessment is available.',
        source: null, assessed_at: stale.rows[0].last_assessed_at, expires_at: null },
        dataStatus: outdated ? 'outdated' : 'insufficient_data', stale: outdated });
    } catch (error) { next(error); }
  });

  app.get('/suitability', async (req, res, next) => {
    try {
      const activity = validActivity(queryText(req.query.activity, 'activity', 20));
      const beachId = req.query.beach_id === undefined ? null : positiveId(req.query.beach_id, 'beach_id');
      const result = await pool.query(
        `SELECT s.assessment_id, s.beach_id, b.name AS beach_name, s.activity, s.status,
                s.reason, s.source, s.assessed_at, s.expires_at
         FROM current_verified_suitability s JOIN beaches b USING (beach_id)
         WHERE ($1::text IS NULL OR s.activity = $1) AND ($2::bigint IS NULL OR s.beach_id = $2)
         ORDER BY b.name, s.activity`, [activity || null, beachId]);
      res.json({ assessments: result.rows, dataStatus: result.rowCount ? 'available' : 'insufficient_data', message: result.rowCount ? undefined : 'No current verified suitability assessments are available.' });
    } catch (error) { next(error); }
  });

  app.get('/beaches/:id/alerts', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Beach ID');
      const beach = await pool.query('SELECT beach_id FROM beaches WHERE beach_id = $1', [id]);
      if (!beach.rowCount) throw apiError(404, 'BEACH_NOT_FOUND', 'Beach not found.');
      const result = await pool.query(
        `SELECT alert_id, beach_id, title, alert_type, severity, description,
          affected_location, source, issued_at, updated_at, expires_at
         FROM active_verified_alerts WHERE beach_id = $1 OR beach_id IS NULL ORDER BY issued_at DESC`, [id]);
      res.json({ alerts: result.rows, dataStatus: result.rowCount ? 'available' : 'insufficient_data' });
    } catch (error) { next(error); }
  });

  app.get('/alerts', async (req, res, next) => {
    try {
      const { limit, offset } = pageOptions(req.query);
      const type = queryText(req.query.type || req.query.alert_type, 'type', 30);
      const severity = queryText(req.query.severity, 'severity', 20);
      const q = queryText(req.query.q || req.query.location, 'q');
      const beachId = req.query.beach_id === undefined ? null : positiveId(req.query.beach_id, 'beach_id');
      if (type && !ALERT_TYPES.has(type)) throw apiError(400, 'INVALID_ALERT_TYPE', 'Unknown alert type.');
      if (severity && !SEVERITIES.has(severity)) throw apiError(400, 'INVALID_SEVERITY', 'severity must be info, warning, critical, or unknown.');
      const result = await pool.query(
        `SELECT alert_id, beach_id, title, alert_type, severity, description,
                affected_location, source, issued_at, updated_at, expires_at,
                COUNT(*) OVER()::int AS total_count
         FROM active_verified_alerts
         WHERE ($1::text IS NULL OR alert_type = $1) AND ($2::text IS NULL OR severity = $2)
           AND ($3::text IS NULL OR title ILIKE '%' || $3 || '%' OR description ILIKE '%' || $3 || '%'
             OR affected_location ILIKE '%' || $3 || '%')
           AND ($4::bigint IS NULL OR beach_id = $4 OR beach_id IS NULL)
         ORDER BY issued_at DESC LIMIT $5 OFFSET $6`, [type || null, severity || null, q || null, beachId, limit, offset]);
      const alerts = result.rows.map(({ total_count, ...alert }) => alert);
      res.json({ alerts, pagination: { limit, offset, total: result.rows[0]?.total_count ?? 0 }, dataStatus: alerts.length ? 'available' : 'insufficient_data' });
    } catch (error) { next(error); }
  });

  app.get('/alerts/:id', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Alert ID');
      const result = await pool.query(
        `SELECT alert_id, beach_id, title, alert_type, severity, description,
                affected_location, source, issued_at, updated_at, expires_at
         FROM active_verified_alerts WHERE alert_id = $1`, [id]);
      if (!result.rowCount) throw apiError(404, 'ALERT_NOT_FOUND', 'Active verified alert not found.');
      res.json({ alert: result.rows[0] });
    } catch (error) { next(error); }
  });

  app.get('/demo/alerts', async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT alert_id, beach_id, title, alert_type, severity, description, affected_location,
                source, issued_at, updated_at, expires_at, verification_status, is_demo
         FROM alerts WHERE is_demo = TRUE ORDER BY issued_at DESC`);
      res.json({ demo: true, alerts: result.rows, dataStatus: 'demo' });
    } catch (error) { next(error); }
  });

  app.get('/demo/alerts/:id', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Alert ID');
      const result = await pool.query(
        `SELECT alert_id, beach_id, title, alert_type, severity, description, affected_location,
                source, issued_at, updated_at, expires_at, verification_status, is_demo
         FROM alerts WHERE alert_id = $1 AND is_demo = TRUE`, [id]);
      if (!result.rowCount) throw apiError(404, 'DEMO_ALERT_NOT_FOUND', 'Demo alert not found.');
      res.json({ demo: true, alert: result.rows[0] });
    } catch (error) { next(error); }
  });

  app.get('/compare', async (req, res, next) => {
    try {
      const idsRaw = queryText(req.query.ids, 'ids', 100);
      if (!idsRaw) throw apiError(400, 'INVALID_COMPARE_IDS', 'ids must contain exactly two beach IDs, for example ?ids=1,2.');
      const ids = idsRaw.split(',').map((id) => positiveId(id, 'Beach ID'));
      if (ids.length !== 2 || ids[0] === ids[1]) throw apiError(400, 'INVALID_COMPARE_IDS', 'Provide two different beach IDs.');
      const beaches = await pool.query(`SELECT ${beachColumns()} FROM beaches b WHERE b.beach_id = ANY($1::bigint[])`, [ids]);
      if (beaches.rowCount !== 2) throw apiError(404, 'BEACH_NOT_FOUND', 'Both beaches must exist to compare them.');
      const [env, suitability, alerts] = await Promise.all([
        pool.query(`SELECT observation_id, beach_id, observation_type, measurement, value, unit, source, recorded_at, valid_until FROM current_verified_environment WHERE beach_id = ANY($1::bigint[]) ORDER BY beach_id, recorded_at DESC`, [ids]),
        pool.query(`SELECT DISTINCT ON (beach_id, activity) assessment_id, beach_id, activity, status, reason, source, assessed_at, expires_at FROM current_verified_suitability WHERE beach_id = ANY($1::bigint[]) ORDER BY beach_id, activity, assessed_at DESC`, [ids]),
        pool.query(`SELECT alert_id, beach_id, title, alert_type, severity, description, affected_location, source, issued_at, expires_at FROM active_verified_alerts WHERE beach_id = ANY($1::bigint[]) OR beach_id IS NULL ORDER BY issued_at DESC`, [ids]),
      ]);
      const byBeach = beaches.rows.map((beach) => {
        const beachAssessments = suitability.rows.filter((item) => String(item.beach_id) === String(beach.id));
        const activities = ['swimming', 'surfing', 'boating'].map((activity) => beachAssessments.find((item) => item.activity === activity)
          || { beach_id: beach.id, activity, status: 'insufficient_data', reason: 'No current verified suitability assessment is available.', source: null, assessed_at: null, expires_at: null });
        return { ...beach,
          environmental: env.rows.filter((item) => String(item.beach_id) === String(beach.id)),
          suitability: activities,
          alerts: alerts.rows.filter((item) => item.beach_id == null || String(item.beach_id) === String(beach.id)),
        };
      });
      res.json({ beaches: byBeach, dataStatus: 'available', safetyDataNote: 'Only current verified data is included. Missing suitability entries are marked insufficient_data.' });
    } catch (error) { next(error); }
  });

  app.get('/beaches/:id', async (req, res, next) => {
    try {
      const id = positiveId(req.params.id, 'Beach ID');
      const result = await pool.query(`SELECT ${beachColumns()} FROM beaches b WHERE b.beach_id = $1`, [id]);
      if (!result.rowCount) throw apiError(404, 'BEACH_NOT_FOUND', 'Beach not found.');
      res.json({ beach: result.rows[0] });
    } catch (error) { next(error); }
  });

  app.use((req, res, next) => next(apiError(404, 'ROUTE_NOT_FOUND', 'Route not found.')));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const databaseUnavailable = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', '57P01', '28P01', '3D000'].includes(error.code);
    const status = error.status || (databaseUnavailable ? 503 : 500);
    const code = error.status ? error.code : status === 503 ? 'DATABASE_UNAVAILABLE' : 'INTERNAL_ERROR';
    if (status >= 500) console.error('API request failed:', error.message);
    res.status(status).json({ error: { code, message: status >= 500 && !error.status ? 'The request could not be completed.' : error.message } });
  });
  return app;
}

module.exports = { createApp };
