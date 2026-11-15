-- CoastSafe India PostgreSQL query examples for a backend using node-postgres.
-- $1, $2 are bound parameters. Do not concatenate user input into SQL strings.
-- The safety-facing views contain only verified, non-demo, unexpired records.

-- 1. List beaches.
SELECT beach_id, name, state, location, latitude, longitude, description, facilities
FROM beaches
ORDER BY state, name;

-- 2. Search by a partial beach name or state. Bind $1 to the search text.
SELECT beach_id, name, state, location, latitude, longitude, description, facilities
FROM beaches
WHERE name ILIKE '%' || $1 || '%'
   OR state ILIKE '%' || $1 || '%'
ORDER BY state, name;

-- 3. Retrieve one beach by its ID. Bind $1 to beach_id.
SELECT beach_id, name, state, location, latitude, longitude, description,
       facilities, created_at, updated_at
FROM beaches
WHERE beach_id = $1;

-- 4. View latest verified, unexpired environmental readings for one beach.
-- Bind $1 to beach_id. No readings are seeded in this project.
SELECT observation_id, observation_type, measurement, value, unit,
       source, source_url, recorded_at, valid_until
FROM current_verified_environment
WHERE beach_id = $1
ORDER BY recorded_at DESC;

-- 5. View current verified suitability results for one beach and activity.
-- Bind $1 to beach_id and $2 to swimming, surfing, or boating.
SELECT assessment_id, activity, status, reason, source, assessed_at, expires_at
FROM current_verified_suitability
WHERE beach_id = $1
  AND activity = $2
ORDER BY assessed_at DESC;

-- 6. View all currently active, verified, non-demo alerts.
SELECT alert_id, beach_id, title, alert_type, severity, description,
       affected_location, source, issued_at, updated_at, expires_at
FROM active_verified_alerts
ORDER BY issued_at DESC;

-- 7. View active, verified alerts for one beach and wider-area alerts.
-- Bind $1 to beach_id.
SELECT alert_id, beach_id, title, alert_type, severity, description,
       affected_location, source, issued_at, updated_at, expires_at
FROM active_verified_alerts
WHERE beach_id = $1 OR beach_id IS NULL
ORDER BY issued_at DESC;

-- 8. Development-only: inspect the sample alert scenarios. These are not live.
SELECT alert_id, title, alert_type, severity, description, affected_location,
       source, issued_at, updated_at, expires_at, verification_status, is_demo
FROM alerts
WHERE is_demo = TRUE
ORDER BY issued_at DESC;
