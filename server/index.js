const { Pool } = require('pg');
const { createApp } = require('./app');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Copy .env.example to .env and configure it.');
  process.exit(1);
}

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PGPOOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'coastsafe-india-api',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
});

pool.on('error', (error) => console.error('Unexpected PostgreSQL pool error:', error.message));
const app = createApp({ pool });
const server = app.listen(port, host, () => {
  console.log(`CoastSafe API listening on http://${host}:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; closing CoastSafe API.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => shutdown(signal));
