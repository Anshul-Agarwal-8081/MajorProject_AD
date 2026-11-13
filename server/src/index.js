
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

// Health-check route
app.use('/api/health', require('./routes/health'));

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`CoastSafe API running at http://localhost:${config.port}`);
});
