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

`server/` contains a read-only Express API using PostgreSQL through the `pg` connection pool. It reads its private database URL from an environment file. Use Node.js 20.6 or newer for the `--env-file` option below; see the [Node.js CLI documentation](https://nodejs.org/api/cli.html#--env-filefile). The connection pool follows the standard node-postgres configuration described in its [connection guide](https://node-postgres.com/features/connecting).

In a second Terminal window:

```sh
cd server
cp .env.example .env
```

Open `server/.env` in a text editor and replace the placeholder values with your local PostgreSQL username and password. Keep that file private; `.gitignore` excludes it. Do not put the database URL in the mobile app or commit it.

Install the backend dependencies and start the API:

```sh
npm install
npm start
```

### Routes

All routes return JSON. Successful lists use `{ beaches: [...] }`, `{ observations: [...] }`, `{ assessments: [...] }`, or `{ alerts: [...] }`; errors use `{ error: { code, message } }`. Missing or expired verified records return `dataStatus: "insufficient_data"` or `"outdated"` rather than made-up values.

- `GET /health` — API and PostgreSQL connectivity check; returns 503 if the database is unavailable.
- `GET /beaches?q=Goa&state=Goa&sort=name&limit=20&offset=0` — list/search beaches. `sort` accepts `name`, `state`, or `updated`. Search also checks location and facility names.
- `GET /beaches?activity=swimming&status=caution` — filter by a current verified assessment. `status=insufficient_data` lists beaches without a current verified assessment for that activity.
- `GET /beaches/:id` — beach details.
- `GET /beaches/:id/environment` — only current, verified, non-demo database readings. Expired reviewed records are reported as outdated but not returned as current readings.
- `GET /beaches/:id/environment/forecast` — optional Open-Meteo Marine API model output. It is marked `model_forecast` and `verificationStatus: "unverified"`; it is separate from verified observations and never drives suitability results. Provider failures return a structured 503.
- `GET /beaches/:id/suitability?activity=swimming` — verified assessment, or an explicit `insufficient_data` / `outdated` result with reason.
- `GET /suitability?activity=surfing&beach_id=1` — current verified assessments across or for one beach.
- `GET /beaches/:id/alerts` — current verified alerts for that beach and coast-wide notices.
- `GET /alerts?type=wave&severity=warning&location=Goa&beach_id=1` — active verified alerts with optional filters and pagination.
- `GET /alerts/:id` — details for an active verified alert; expired, unverified, and demo alerts are not returned here.
- `GET /demo/alerts` and `GET /demo/alerts/:id` — explicitly demo-only scenarios, separate from the public active-alert routes.
- `GET /compare?ids=1,2` — beach details plus current verified environmental data, activity suitability (missing results are `insufficient_data`), and active alerts for two beaches.

Beach IDs must be positive integers. `limit` is 1–100 and `offset` is non-negative. Invalid filters return HTTP 400; unknown records/routes return HTTP 404. Database errors return a structured error without exposing credentials or SQL details.

The sample database has no real environmental readings, suitability assessments, or active verified alerts. Those endpoints therefore report missing verified data. The seeded scenarios appear only on `/demo/alerts` and each includes its demo and unverified flags.

### Data provider status

Open-Meteo documents a Marine API that supplies wave height, wave period, and ocean-current model fields. The backend requests only those documented fields at a beach’s saved coordinates and labels the response as an unverified model forecast. It does not persist those model values as verified environmental readings or generate suitability. See [Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api) for limitations and attribution requirements.

INCOIS publishes Ocean State Forecast information and exposes an ERDDAP catalog for scientific dataset search and download. The public material available during implementation did not document a per-beach OSF forecast API suitable for this app, so the backend does not guess an INCOIS URL or claim INCOIS integration. See [INCOIS Ocean State Forecast](https://www.incois.gov.in/oceanservices/osfforecast.jsp) and [INCOIS ERDDAP](https://erddap.incois.gov.in/erddap/index.html).

### Verify the API

With PostgreSQL running and sample data loaded, configure `server/.env`, then run:

```sh
cd server
npm test
```

This smoke test starts the app on a temporary local port and checks health, search, details, verified-data statuses, suitability, alert separation, comparison, and invalid routes against the configured PostgreSQL database.

The Expo app reads beaches, suitability, and active verified alerts from this API when `EXPO_PUBLIC_API_URL` is configured. If the URL is absent or the server cannot be reached, it switches to the local catalogue and labels the data as demo. Favorites, profile preferences, and notification previews remain on the device in AsyncStorage because the project has no account system. See the repository `README.md` for app setup and `docs/COLLEGE_DEMO_GUIDE.md` for the demo walkthrough.
