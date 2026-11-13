/* global process */
import { beaches as demoBeaches } from '../data/beachList';

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '');

function normalizeBeachList(payload) {
  const list = Array.isArray(payload) ? payload : payload?.beaches;
  if (!Array.isArray(list)) throw new Error('Beach API response must contain a beaches array.');
  return list;
}

function normalizeBeach(payload) {
  const beach = payload?.beach || payload;
  if (!beach || typeof beach !== 'object' || !beach.id) {
    throw new Error('Beach API response did not include a beach.');
  }
  return beach;
}

async function getJson(path) {
  const response = await fetch(`${configuredBaseUrl}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Beach API request failed (${response.status}).`);
  return response.json();
}

export function searchBeaches(items, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return items;
  return items.filter((beach) =>
    [beach.name, beach.state, beach.city, beach.region]
      .filter(Boolean)
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
}

export function getSavedBeaches(items, favoriteIds) {
  const savedIds = new Set(favoriteIds.map(String));
  return items.filter((beach) => savedIds.has(String(beach.id)));
}

export async function getBeaches() {
  if (configuredBaseUrl) {
    try {
      return { beaches: normalizeBeachList(await getJson('/beaches')), source: 'api' };
    } catch (error) {
      console.warn('Using local beach data:', error.message);
    }
  }
  return { beaches: demoBeaches, source: 'demo' };
}

export async function getBeachById(id, fallbackBeach) {
  if (configuredBaseUrl) {
    try {
      return { beach: normalizeBeach(await getJson(`/beaches/${encodeURIComponent(id)}`)), source: 'api' };
    } catch (error) {
      console.warn(`Using local details for beach ${id}:`, error.message);
    }
  }
  return {
    beach: demoBeaches.find((item) => String(item.id) === String(id)) || fallbackBeach || null,
    source: 'demo',
  };
}
