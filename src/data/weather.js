import { getConditions } from './conditions';

const OBSERVED_HOURS = ['00:00', '03:00', '06:00', '09:00'];
const FORECAST_HOURS = ['12:00', '15:00', '18:00', '21:00'];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function waveAround(base, index, kind) {
  const shift = Math.sin(index * 1.3 + base) * (kind === 'forecast' ? 0.25 : 0.12);
  return Math.round(clamp(base + shift, 0.1, 4) * 10) / 10;
}

export function getEnvironmentSeries(beachId) {
  const conditions = getConditions(beachId);
  if (!conditions) return null;

  const observed = OBSERVED_HOURS.map((label, index) => ({
    label,
    kind: 'observation',
    waveHeightM: waveAround(conditions.waveHeightM, index, 'observation'),
    windSpeedKmh: Math.round(clamp(conditions.windSpeedKmh + Math.cos(index) * 3, 0, 70)),
    temperatureC: Math.round(conditions.temperatureC - 1 + index * 0.4),
    precipitationMm: index === 2 ? conditions.precipitationMm : 0,
  }));

  const forecast = FORECAST_HOURS.map((label, index) => ({
    label,
    kind: 'forecast',
    waveHeightM: waveAround(conditions.waveHeightM, index + 4, 'forecast'),
    windSpeedKmh: Math.round(clamp(conditions.windSpeedKmh + 4 + index * 1.5, 0, 70)),
    temperatureC: Math.round(conditions.temperatureC + 1 - index * 0.3),
    precipitationMm: index > 1 ? Math.round(conditions.precipitationMm + index) : conditions.precipitationMm,
  }));

  return {
    observed,
    forecast,
    combined: [...observed, ...forecast],
    note: 'Modelled demonstration series. Forecast bars are not an Open-Meteo response, and observation bars are not instrument records.',
  };
}
