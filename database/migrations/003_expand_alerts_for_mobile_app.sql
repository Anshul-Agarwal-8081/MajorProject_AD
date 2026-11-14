-- CoastSafe India
-- Migration 003: Expand alerts table for mobile app integration.

ALTER TABLE alerts
ADD COLUMN IF NOT EXISTS external_id TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS severity TEXT,
ADD COLUMN IF NOT EXISTS beach_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS action TEXT,
ADD COLUMN IF NOT EXISTS source TEXT;

-- Preserve the original alert IDs used by the mobile app.
CREATE UNIQUE INDEX IF NOT EXISTS alerts_external_id_idx
ON alerts (external_id)
WHERE external_id IS NOT NULL;
