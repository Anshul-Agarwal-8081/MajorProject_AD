
const express = require('express');
const pool = require('../db');

const router = express.Router();

const DISCLAIMER =
  'Suitability values are demonstration data, not live or official safety information.';

function formatBeach(row) {
  return {
    id: String(row.beach_id),
    name: row.beach_name,
    state: row.state,
    description: row.description,
    image: row.image_url || null,
    isPopular: Boolean(row.is_popular),

    location: {
      name: row.location,
      latitude: row.latitude == null ? null : Number(row.latitude),
      longitude: row.longitude == null ? null : Number(row.longitude),
    },

    facilities: row.facilities || [],
    safety: row.safety || [],

    swimming: row.swimming || null,
    surfing: row.surfing || null,
    boating: row.boating || null,

    suitabilityDisclaimer: DISCLAIMER,
  };
}

// GET /api/beaches
// Returns all beaches.
router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        beach_id,
        beach_name,
        state,
        location,
        latitude,
        longitude,
        description,
        image_url,
        is_popular,
        facilities,
        safety,
        swimming,
        surfing,
        boating
      FROM beaches
      ORDER BY beach_id ASC
    `);

    const beaches = result.rows.map(formatBeach);

    res.status(200).json({
      beaches,
      count: beaches.length,
      disclaimer: DISCLAIMER,
    });
  } catch (error) {
    console.error('Failed to fetch beaches:', error.message);

    const apiError = new Error('Service temporarily unavailable');
    apiError.status = 503;
    next(apiError);
  }
});

// GET /api/beaches/:id
// Returns one beach by its numeric ID.
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(404).json({
        error: 'Beach not found',
      });
    }

    const result = await pool.query(
      `
        SELECT
          beach_id,
          beach_name,
          state,
          location,
          latitude,
          longitude,
          description,
          image_url,
          is_popular,
          facilities,
          safety,
          swimming,
          surfing,
          boating
        FROM beaches
        WHERE beach_id = $1
        LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Beach not found',
      });
    }

    res.status(200).json({
      beach: formatBeach(result.rows[0]),
      disclaimer: DISCLAIMER,
    });
  } catch (error) {
    console.error('Failed to fetch beach:', error.message);

    const apiError = new Error('Service temporarily unavailable');
    apiError.status = 503;
    next(apiError);
  }
});

module.exports = router;
