/* global process */

const baseUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '') || '';
const ACTIVITIES = ['swimming', 'surfing', 'boating'];

async function getJson(path) {
  if (!baseUrl) throw new Error('The CoastSafe API URL is not configured.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message || `API request failed (${response.status}).`);
    return payload;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The CoastSafe server did not respond in time.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function loadCoastData() {
  if (!baseUrl) {
    return {
      dataSource: 'demo', connected: false, remoteBeaches: null, remoteAssessments: [], remoteAlerts: [],
      apiError: 'API URL is not configured. Showing clearly labelled local demo data.',
    };
  }

  try {
    await getJson('/health');
    const { beaches } = await getJson('/beaches?limit=100&sort=name');
    if (!Array.isArray(beaches)) throw new Error('The beach API returned an invalid response.');

    const results = await Promise.allSettled([
      ...ACTIVITIES.map((activity) => getJson(`/suitability?activity=${activity}`)),
      getJson('/alerts?limit=100'),
      getJson('/demo/alerts'),
    ]);
    const remoteAssessments = results.slice(0, ACTIVITIES.length)
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value.assessments || []);
    const alertResult = results[ACTIVITIES.length];
    const remoteAlerts = alertResult.status === 'fulfilled' ? alertResult.value.alerts || [] : [];
    const demoAlertResult = results[ACTIVITIES.length + 1];
    const remoteDemoAlerts = demoAlertResult.status === 'fulfilled' ? demoAlertResult.value.alerts || [] : [];
    const hasPartialFailure = results.some((result) => result.status === 'rejected');

    return {
      dataSource: 'api', connected: true, remoteBeaches: beaches, remoteAssessments, remoteAlerts, remoteDemoAlerts,
      apiError: hasPartialFailure ? 'The server is reachable, but some safety data could not be loaded.' : '',
    };
  } catch (error) {
    return {
      dataSource: 'demo', connected: false, remoteBeaches: null, remoteAssessments: [], remoteAlerts: [], remoteDemoAlerts: [],
      apiError: `${error.message} Showing clearly labelled local demo data.`,
    };
  }
}

export async function getBeachEnvironmentalInfo(serverBeachId) {
  if (!serverBeachId) return { dataStatus: 'insufficient_data', observations: [], forecast: null, message: 'This beach is available only in the local demo catalogue.' };
  const [environment, forecast] = await Promise.allSettled([
    getJson(`/beaches/${encodeURIComponent(serverBeachId)}/environment`),
    getJson(`/beaches/${encodeURIComponent(serverBeachId)}/environment/forecast`),
  ]);
  const environmentData = environment.status === 'fulfilled'
    ? environment.value
    : { observations: [], dataStatus: 'unavailable', message: environment.reason?.message || 'Verified environmental data could not be loaded.' };
  const forecastData = forecast.status === 'fulfilled'
    ? forecast.value
    : { forecast: null, dataStatus: 'unavailable', message: forecast.reason?.message || 'The model forecast is unavailable.' };
  return { ...environmentData, forecast: forecastData.forecast, forecastStatus: forecastData.dataStatus, forecastMessage: forecastData.message || '' };
}

export async function getBeachComparison(serverBeachIds) {
  if (serverBeachIds.length !== 2 || serverBeachIds.some((id) => !id)) {
    throw new Error('Select two beaches that are available in the connected database.');
  }
  const ids = serverBeachIds.map(encodeURIComponent).join(',');
  const payload = await getJson(`/compare?ids=${ids}`);
  if (!Array.isArray(payload.beaches)) throw new Error('The compare API returned an invalid response.');
  return payload.beaches;
}

export function isCoastApiConfigured() {
  return Boolean(baseUrl);
}
