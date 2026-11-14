# CoastSafe India database

This folder contains the PostgreSQL schema, sample data, and backend query examples. The database stores beach descriptions and has separate tables for environmental readings, activity assessments, and coastal alerts.

## What is included

- `beaches`: 15 descriptive beach records with optional approximate map coordinates.
- `environmental_observations`: weather and ocean measurements with units, source, recorded time, verification details, and an expiry time.
- `suitability_assessments`: swimming, surfing, and boating results with a reason, source, assessment time, expiry, and verification details.
- `alerts`: typed and ranked notices with an affected location, source, issue/update/expiry times, and demo/verification flags.

The environmental and suitability tables are intentionally empty in the sample database. The app's existing weather, ocean conditions, suitability results, and alerts are simulated demonstrations, so they must not be copied into the database as live or verified information. The four seeded alert scenarios are marked `is_demo = TRUE`, `verification_status = 'unverified'`, and `severity = 'unknown'`; their titles also begin with `[DEMO]`.

Environmental records and suitability results each reference a beach. An alert can reference one beach; a `NULL` `beach_id` means it covers a wider area. There is no `users`, `profiles`, or `saved_beaches` table because the repository has no real account system: its profile is a demo profile, and favorites are kept on the device with AsyncStorage. Add account-linked favorites only when the project has real authentication.

## Checks that protect safety data

- Coordinates must be in range and must be supplied as a latitude/longitude pair.
- A verified environmental reading needs a source, unit, recorded time, reviewer, verification time, and a future validity window. Demo readings cannot be verified.
- A conclusive suitability result (`suitable`, `caution`, or `not_suitable`) must be verified, reviewed, and expire after its assessment time. An incomplete result should use `unknown` or `insufficient_data`.
- A verified alert needs a known severity, reviewer, issue time, and expiry time. Demo alerts must remain unverified.
- The views `current_verified_environment`, `current_verified_suitability`, and `active_verified_alerts` return only verified, non-demo, unexpired records. Use these views for safety-facing backend responses.

These checks make incomplete or demo rows harder to mistake for current safety information. They do not replace local authorities, lifeguards, or a human review process.

## Create the database and insert the sample data

Install PostgreSQL and make sure its server is running. Open Terminal in the project folder (the folder containing `package.json`). Create the database:

```sh
createdb coastsafe_india
```

Run these files in order:

```sh
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/schema.sql
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/seed_beaches.sql
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/seed_alerts.sql
```

`schema.sql` is safe to run again. It also upgrades the earlier CoastSafe schema in place: it renames the old beach and alert columns, adds the new tables and checks, preserves existing records, and marks the earlier sample exercise alerts as demo data.

The seed files are also safe to run again. They update matching beach rows and skip duplicate demo alerts.

On a demo-only database, run the included validation script:

```sh
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/verify_sample_data.sql
```

It checks the expected beach and demo-alert minimums, the alert links and demo flags, and confirms there are no sample readings, assessments, or active verified alerts. Do not run this particular validation script after adding real environmental or suitability records; its zero-row checks are for the sample setup.

Check the sample counts:

```sh
psql -d coastsafe_india -c "SELECT COUNT(*) AS beaches FROM beaches;"
psql -d coastsafe_india -c "SELECT COUNT(*) AS demo_alerts FROM alerts WHERE is_demo;"
psql -d coastsafe_india -c "SELECT COUNT(*) AS environment_rows FROM environmental_observations;"
psql -d coastsafe_india -c "SELECT COUNT(*) AS suitability_rows FROM suitability_assessments;"
psql -d coastsafe_india -c "SELECT COUNT(*) AS active_verified_alerts FROM active_verified_alerts;"
```

Expected for a fresh database: **15 beaches, 4 demo alerts, 0 environmental readings, 0 suitability assessments, and 0 active verified alerts.**

## Retrieve information with `psql`

Open an interactive SQL session:

```sh
psql -d coastsafe_india
```

At the `coastsafe_india=>` prompt, list and search beaches:

```sql
SELECT beach_id, name, state, location, latitude, longitude
FROM beaches
ORDER BY state, name;

SELECT beach_id, name, state, location
FROM beaches
WHERE name ILIKE '%Varkala%'
   OR state ILIKE '%Varkala%';
```

See the sample scenarios and their explicit demo status:

```sql
SELECT title, severity, source, verification_status, is_demo, expires_at
FROM alerts
ORDER BY issued_at DESC;
```

To leave `psql`, type `\q` and press Return. The full parameterized examples for beaches, readings, assessments, and alerts are in `queries.sql`. Its `$1` and `$2` markers are values supplied by a PostgreSQL driver, so it is not one script to paste directly into `psql`.

## Start the PostgreSQL backend

The repository did not contain a backend, so `server/` now has a small read-only Node.js API. It connects to PostgreSQL with the `pg` connection pool and reads its private database URL from an environment file. The Node `--env-file` option used below requires Node.js 20.6 or newer; see the [Node.js CLI documentation](https://nodejs.org/api/cli.html#--env-filefile). The connection pool uses the standard node-postgres configuration described in its [connection guide](https://node-postgres.com/features/connecting).

In a second Terminal window:

```sh
cd server
cp .env.example .env
```

Open `server/.env` in a text editor and replace the placeholder values with your local PostgreSQL username and password. Keep that file private; `.gitignore` excludes it. Do not put the database URL in the mobile app or commit it.

Install the backend dependency and start the API:

```sh
npm install
npm start
```

The API is read-only and provides:

- `GET http://localhost:3000/health` — check that the API can reach PostgreSQL.
- `GET http://localhost:3000/beaches` and `/beaches?q=Goa` — list and search beaches.
- `GET http://localhost:3000/beaches/1` — retrieve a beach by its database ID.
- `GET http://localhost:3000/beaches/1/environment` — retrieve only current verified readings.
- `GET http://localhost:3000/beaches/1/suitability?activity=swimming` — retrieve current verified assessments.
- `GET http://localhost:3000/alerts` — retrieve active verified non-demo alerts.
- `GET http://localhost:3000/demo/alerts` — inspect the clearly marked development scenarios.

Because the sample database has no real observations, assessments, or active verified alerts, the corresponding safety endpoints return empty arrays until reviewed records are added.

The existing `src/services/beachService.js` already understands the API's beach response format, but `src/hooks/useCatalogue.js` currently reads the local demo catalogue directly. Setting an API URL alone will not switch the screens to database data; that client integration is a separate step. The SQL views and backend routes are ready for that integration without treating the app's simulated safety data as verified.
