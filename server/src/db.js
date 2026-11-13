
const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseUrl.includes('localhost')
    ? false
    : { rejectUnauthorized: false }
});

// Handle unexpected database connection errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

module.exports = pool;
