# CoastSafe India: college demo guide

## Before the presentation

1. Start PostgreSQL and load the schema/sample data using the commands in the project [README](../README.md).
2. Start the Express API from `server/` with a valid private `server/.env`.
3. Check `http://127.0.0.1:3000/health` on the development computer. It should report that PostgreSQL is connected.
4. Set the root `.env` `EXPO_PUBLIC_API_URL` to that computer’s LAN URL if presenting on a physical phone. Restart Expo after changing it. A simulator on the same computer can use `http://127.0.0.1:3000`.
5. Start Expo at the project root with `npm start`, then open the app in a simulator or Expo Go.
6. If the API cannot be reached, the app still opens using the local catalogue and shows a **Demo mode** banner. For a phone, check that the phone and computer share Wi-Fi and that the firewall permits port 3000.

## Suggested 5-minute walkthrough

1. **Onboarding and Home:** introduce the app and explain that the banner indicates whether the screen is using PostgreSQL or local demo data.
2. **Beach list and Explore:** search for a beach or state, try activity/status filters, and change sorting. Point out the 15 seeded records.
3. **Beach detail:** show description, facilities, coordinates, and the three activity assessments. The sample DB has no verified assessments, so each reports insufficient data with a reason. Explain that this is intentional, not an app failure.
4. **Environment:** show the verified-record section reporting no current records. If an Open-Meteo request succeeds, show it separately as an **unverified model forecast**. It must not be described as an observation or official forecast.
5. **Map:** show the schematic marker view and state/activity filters. Markers use database coordinates, where available; this view has no map tiles or routing.
6. **Alerts:** show the active verified-alert feed (empty in the seed DB), then open demo scenarios and call out their `[DEMO]` labels. There are no seeded official warnings and no remote push-notification service.
7. **Save and compare:** save a beach, open Saved, and compare two beaches. Favourites and compare selections are device-local; compare facts use the API when connected.
8. **Profile/About:** change local notification-category preferences and explain that profile/settings are stored on the device. A notification preview can be requested locally from a sample alert, subject to OS permission; it is not a subscribed live alert.

## What is real in this demo

- PostgreSQL stores beach descriptions/facilities/coordinates and four alerts explicitly marked as demo scenarios.
- The Express routes, validation, health check, database errors, and client fallback have working contracts.
- Environmental records, verified suitability results, and active verified alerts are intentionally absent from the fresh seed database.
- Open-Meteo Marine model values may be fetched on demand for coordinates. They are unverified model output, subject to provider availability, and displayed separately.
- INCOIS is not integrated: the public documentation checked did not provide a suitable documented per-beach API endpoint, so this project does not guess one.
- The app has no login/account backend. Preferences and saved beaches persist on the device. The marker map is schematic. Local notification previews are not remote push delivery.

## If something fails during the demo

- **Demo mode appears:** use the local app as planned, or check backend health, `EXPO_PUBLIC_API_URL`, Wi-Fi/LAN IP, firewall, and server logs. Restart Expo after `.env` changes.
- **Health reports database unavailable:** check PostgreSQL is running and that `server/.env` has the correct `DATABASE_URL`; make sure the seed scripts ran.
- **No environmental data or active alerts:** expected for the sample DB. Do not enter made-up readings or call sample alerts official.
- **Forecast request fails:** provider/network access is optional. Explain that the app reports unavailable model output and retains the verified-data status.
- **Favourites/notification preferences look old:** use Profile → Reset demo data to clear the local demo storage, then relaunch.

## Reset a fresh sample database

For a disposable demo database, run the schema and seed commands again as documented in the main README. The schema and seed scripts are designed to be repeatable. The reset action inside the app clears only device-local demo state; it does not delete PostgreSQL data.
