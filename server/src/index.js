
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/health', require('./routes/health'));
app.use('/api/beaches', require('./routes/beaches'));

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('API error:', err.message);

  const status = err.status || 500;

  res.status(status).json({
    error: status === 503
      ? 'Service temporarily unavailable'
      : 'Internal server error',
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`CoastSafe API running at http://localhost:${config.port}`);
});
