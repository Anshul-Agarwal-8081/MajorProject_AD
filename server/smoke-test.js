const assert = require('node:assert/strict');
const { Pool } = require('pg');
const { createApp } = require('./app');

if (!process.env.DATABASE_URL) {
  console.error('Set DATABASE_URL before running the API smoke tests.');
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
  const server = createApp({ pool }).listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const request = async (path, options = {}) => {
    const response = await fetch(`${baseUrl}${path}`, options);
    const body = response.status === 204 ? null : await response.json();
    return { status: response.status, body };
  };

  try {
    const preflight = await request('/beaches', {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:8081', 'Access-Control-Request-Method': 'GET' },
    });
    assert.equal(preflight.status, 204);

    let result = await request('/health');
    assert.equal(result.status, 200);
    assert.equal(result.body.database, 'connected');

    result = await request('/beaches?limit=100&sort=name');
    assert.equal(result.status, 200);
    assert.ok(result.body.beaches.length >= 15, 'expected at least 15 seeded beaches');
    const first = result.body.beaches[0];
    const second = result.body.beaches[1];

    result = await request('/beaches?q=Palolem&state=Goa');
    assert.equal(result.status, 200);
    assert.ok(result.body.beaches.some((beach) => beach.name === 'Palolem Beach'));
    const palolem = result.body.beaches.find((beach) => beach.name === 'Palolem Beach');

    result = await request('/beaches?activity=swimming&status=insufficient_data');
    assert.equal(result.status, 200);
    assert.ok(result.body.beaches.length >= 15, 'beaches without verified assessments should be filterable as insufficient data');

    result = await request(`/beaches/${first.id}`);
    assert.equal(result.status, 200);
    assert.equal(String(result.body.beach.id), String(first.id));

    result = await request(`/beaches/${first.id}/environment`);
    assert.equal(result.status, 200);
    assert.ok(['available', 'outdated', 'insufficient_data'].includes(result.body.dataStatus));
    assert.ok(Array.isArray(result.body.observations));

    result = await request(`/beaches/${first.id}/suitability?activity=swimming`);
    assert.equal(result.status, 200);
    assert.ok(['available', 'outdated', 'insufficient_data'].includes(result.body.dataStatus));
    assert.ok(result.body.assessment.status);

    result = await request(`/beaches/${palolem.id}/environment/forecast`);
    assert.ok([200, 502, 503].includes(result.status), 'forecast should return model data or a structured provider error');
    if (result.status === 200) {
      assert.equal(result.body.forecast.verificationStatus, 'unverified');
      assert.equal(result.body.forecast.type, 'model_forecast');
    } else assert.ok(result.body.error.code);

    result = await request('/suitability?activity=surfing');
    assert.equal(result.status, 200);
    assert.ok(Array.isArray(result.body.assessments));

    result = await request('/alerts?severity=warning');
    assert.equal(result.status, 200);
    assert.ok(Array.isArray(result.body.alerts));

    result = await request('/demo/alerts');
    assert.equal(result.status, 200);
    assert.equal(result.body.demo, true);
    assert.ok(result.body.alerts.every((alert) => alert.is_demo === true));
    if (result.body.alerts.length) {
      const demoId = result.body.alerts[0].alert_id;
      result = await request(`/demo/alerts/${demoId}`);
      assert.equal(result.status, 200);
      assert.equal(result.body.alert.is_demo, true);
    }

    result = await request(`/beaches/${first.id}/alerts`);
    assert.equal(result.status, 200);
    assert.ok(Array.isArray(result.body.alerts));

    result = await request(`/compare?ids=${first.id},${second.id}`);
    assert.equal(result.status, 200);
    assert.equal(result.body.beaches.length, 2);
    assert.ok(result.body.beaches.every((beach) => beach.suitability.length === 3));

    result = await request('/beaches/not-an-id');
    assert.equal(result.status, 400);
    assert.equal(result.body.error.code, 'INVALID_ID');

    result = await request('/not-a-route');
    assert.equal(result.status, 404);
    assert.equal(result.body.error.code, 'ROUTE_NOT_FOUND');

    console.log('CoastSafe API smoke tests passed: health, beach search/details, verified data status, suitability, alerts, demo alerts, comparison, and validation.');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
  }
}

main().catch((error) => {
  console.error('CoastSafe API smoke tests failed:', error.message);
  process.exitCode = 1;
});
