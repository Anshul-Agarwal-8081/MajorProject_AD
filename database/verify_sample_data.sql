-- Run only against the demo/sample database after loading both seed files.
-- This file asserts that the demo dataset contains no safety observations,
-- suitability clearances, or active verified alerts.

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM beaches) < 15 THEN
    RAISE EXCEPTION 'Expected at least 15 beach records.';
  END IF;

  IF (SELECT COUNT(*) FROM alerts WHERE is_demo = TRUE) < 4 THEN
    RAISE EXCEPTION 'Expected at least 4 clearly marked demo alerts.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM alerts
    WHERE is_demo = TRUE
      AND (verification_status <> 'unverified' OR severity <> 'unknown' OR expires_at > CURRENT_TIMESTAMP)
  ) THEN
    RAISE EXCEPTION 'A demo alert is verified, has a safety severity, or has not expired.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM alerts a
    LEFT JOIN beaches b ON b.beach_id = a.beach_id
    WHERE a.is_demo = TRUE AND b.beach_id IS NULL
  ) THEN
    RAISE EXCEPTION 'A demo alert does not refer to an existing beach.';
  END IF;

  IF (SELECT COUNT(*) FROM environmental_observations) <> 0 THEN
    RAISE EXCEPTION 'The sample database must not contain fabricated environmental readings.';
  END IF;

  IF (SELECT COUNT(*) FROM suitability_assessments) <> 0 THEN
    RAISE EXCEPTION 'The sample database must not contain fabricated suitability results.';
  END IF;

  IF (SELECT COUNT(*) FROM active_verified_alerts) <> 0 THEN
    RAISE EXCEPTION 'A demo alert is visible as an active verified alert.';
  END IF;
END
$$;

SELECT 'sample data check passed' AS result,
       (SELECT COUNT(*) FROM beaches) AS beaches,
       (SELECT COUNT(*) FROM alerts WHERE is_demo = TRUE) AS demo_alerts,
       (SELECT COUNT(*) FROM environmental_observations) AS environment_rows,
       (SELECT COUNT(*) FROM suitability_assessments) AS suitability_rows,
       (SELECT COUNT(*) FROM active_verified_alerts) AS active_verified_alerts;
