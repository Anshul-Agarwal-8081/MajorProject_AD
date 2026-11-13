
const express = require('express');
const router = express.Router();

// GET /api/health
router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString()
  });
});

module.exports = router;
