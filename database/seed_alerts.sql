-- Clearly labelled development-only alert scenarios.
-- These are not observations, official warnings, or active safety advisories.
-- Every row is unverified, marked as demo data, and expired before 2026.
-- Re-running this file does not create duplicate sample rows.

WITH sample_alerts (beach_name, state, title, description, affected_location, issued_at, expires_at) AS (
  VALUES
    (
      'Puri Beach', 'Odisha',
      '[DEMO] Training scenario: high-wave response',
      'Illustrative development scenario only. It does not report observed wave conditions or an official warning. Follow current guidance from local authorities.',
      'Puri coast, Odisha',
      TIMESTAMPTZ '2025-01-15 09:00:00+05:30',
      TIMESTAMPTZ '2025-01-15 15:00:00+05:30'
    ),
    (
      'Marina Beach', 'Tamil Nadu',
      '[DEMO] Training scenario: strong-current response',
      'Illustrative development scenario only. It does not report an observed current or an official warning. Follow current guidance from local authorities.',
      'Chennai coast, Tamil Nadu',
      TIMESTAMPTZ '2025-01-16 10:00:00+05:30',
      TIMESTAMPTZ '2025-01-16 16:00:00+05:30'
    ),
    (
      'Palolem Beach', 'Goa',
      '[DEMO] Training scenario: coastal wind response',
      'Illustrative development scenario only. It does not report observed wind conditions or an official warning. Follow current guidance from local authorities.',
      'Canacona coast, Goa',
      TIMESTAMPTZ '2025-01-17 11:00:00+05:30',
      TIMESTAMPTZ '2025-01-17 17:00:00+05:30'
    ),
    (
      'Radhanagar Beach', 'Andaman and Nicobar Islands',
      '[DEMO] Training scenario: beach access notice',
      'Illustrative development scenario only. It does not describe an actual closure or official warning. Follow current guidance from local authorities.',
      'Swaraj Dweep, Andaman and Nicobar Islands',
      TIMESTAMPTZ '2025-01-18 12:00:00+05:30',
      TIMESTAMPTZ '2025-01-18 18:00:00+05:30'
    )
)
INSERT INTO alerts (
  beach_id, title, alert_type, severity, description, affected_location,
  source, issued_at, updated_at, expires_at, verification_status, is_demo
)
SELECT b.beach_id, s.title, 'training_scenario', 'unknown', s.description,
       s.affected_location, 'CoastSafe India demo data (not an authority)',
       s.issued_at, s.issued_at, s.expires_at, 'unverified', TRUE
FROM sample_alerts AS s
JOIN beaches AS b
  ON b.name = s.beach_name
 AND b.state = s.state
WHERE NOT EXISTS (
  SELECT 1
  FROM alerts AS existing
  WHERE existing.title = s.title
    AND existing.affected_location = s.affected_location
    AND existing.issued_at = s.issued_at
)
AND NOT EXISTS (
  -- Avoid duplicating sample exercises created by the earlier Task 5 seed file.
  SELECT 1
  FROM alerts AS legacy_demo
  WHERE legacy_demo.is_demo = TRUE
    AND legacy_demo.affected_location = s.affected_location
    AND legacy_demo.issued_at = s.issued_at
);
