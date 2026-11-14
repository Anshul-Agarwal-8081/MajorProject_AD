# CoastSafe India

CoastSafe India is a React Native Expo beach information app backed by a small Express API and PostgreSQL database. The app is intended as a college project/demo. It does not replace lifeguards, local authorities, or official marine warnings.

## What works

- Browse, search, filter, and sort the beach catalogue. The API-backed catalogue uses the 15 seeded database beaches; if the API is unavailable, the app falls back to its local demo catalogue.
- Open beach details, inspect facilities and coordinates, save favourites, and compare two beaches.
- View activity suitability for swimming, surfing, and boating. The sample database has no verified suitability results, so it correctly shows **Insufficient Data** with a reason. Local fallback results are marked demo.
- View verified environmental records when the database has them. None are seeded. Beach details can separately request an Open-Meteo Marine model forecast, labelled unverified and never used to calculate suitability.
- Browse active verified alerts from PostgreSQL. The seeded scenario alerts are only exposed by demo routes and are labelled demo in the app. No official warnings are seeded.
- Use profile preferences, favourites, and notification previews stored locally on the device. The map screen displays interactive schematic markers from beach coordinates; it is not a tile-based navigation map.

## Requirements

- Node.js 20.6 or newer and npm.
- PostgreSQL 14 or newer (or a PostgreSQL-compatible managed database).
- Expo Go for supported testing, or an Expo development build if the platform needs native modules not included in Expo Go.

## Set up PostgreSQL and the API

Create an empty database, then from the project root load the schema and sample beach/demo-alert records:

```sh
createdb coastsafe_india
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/schema.sql
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/seed_beaches.sql
psql -d coastsafe_india -v ON_ERROR_STOP=1 -f database/seed_alerts.sql
```

Configure the backend’s private connection string and start Express:

```sh
cd server
cp .env.example .env
# Edit server/.env and set DATABASE_URL for your local PostgreSQL user.
npm install
npm start
```

The default backend listens on `0.0.0.0:3000` so a phone on the same Wi-Fi can reach it. `http://127.0.0.1:3000/health` should return JSON with `status: "ok"` and `database: "connected"`. For a phone, use the computer’s LAN IPv4 address in the Expo API URL; `localhost` on the phone means the phone itself. Do not put `DATABASE_URL` in the Expo app or commit either `.env` file.

## Start the mobile app

From the repository root, copy the mobile example and edit the URL for the device you use:

```sh
cp .env.example .env
npm install
npm start
```

The example uses `http://127.0.0.1:3000`, suitable for a simulator/browser running on the same computer. For a physical phone, set `EXPO_PUBLIC_API_URL` to `http://<computer-LAN-IP>:3000`, for example `http://192.168.1.20:3000`, then restart Expo. Both devices must be on a network that permits local connections. If the URL is missing, or the health/beach-list call fails, the app labels and uses the local demo catalogue. A partial failure for suitability or alerts leaves the API beach list available and shows a partial-data message.

## Routes

All endpoints return JSON. Validation and server errors use `{ "error": { "code": "...", "message": "..." } }`.

| Route | Purpose |
| --- | --- |
| `GET /health` | API and database health |
| `GET /beaches?q=Goa&state=Goa&sort=name&limit=20&offset=0` | Search/list; `activity` and `status` support suitability filters |
| `GET /beaches/:id` | Beach details |
| `GET /beaches/:id/environment` | Current verified records or missing/outdated status |
| `GET /beaches/:id/environment/forecast` | Separate unverified Open-Meteo Marine model forecast |
| `GET /beaches/:id/suitability?activity=swimming` | Per-beach activity result or insufficient/outdated reason |
| `GET /suitability?activity=surfing` | Current verified suitability list |
| `GET /alerts?type=wave&severity=warning&location=Goa` | Active verified alerts and filters |
| `GET /alerts/:id` | One active verified alert |
| `GET /demo/alerts` and `/demo/alerts/:id` | Clearly separated sample scenarios |
| `GET /compare?ids=1,2` | Two beaches with current data needed by compare screen |

The API also has `GET /beaches/:id/alerts` for beach-specific and coast-wide active verified alerts. See [database/README.md](database/README.md) for schema, data constraints, provider status, and SQL examples.

## Test

With the database loaded and `server/.env` configured:

```sh
cd server
npm test
```

From the project root:

```sh
npx expo lint
```

The backend smoke test uses a temporary HTTP port and checks the route contract against the configured PostgreSQL database. It does not create verified environmental data or active alerts. See [docs/COLLEGE_DEMO_GUIDE.md](docs/COLLEGE_DEMO_GUIDE.md) for a presentation flow and demo checklist.
