import { alertsForBeach } from '../data/alerts';
import { beaches } from '../data/beaches';
import { beaches as visitorDetails } from '../data/beachList';
import { getConditions } from '../data/conditions';
import { assessBeach } from '../services/suitabilityEngine';
import { haversineKm } from './geo';

export function buildCatalogue(origin) {
  return beaches.map((beach) => {
    const visitorRecord = visitorDetails.find((item) => item.name === beach.name) || {};
    const conditions = getConditions(beach.id);
    const beachAlerts = alertsForBeach(beach);
    const assessment = assessBeach(conditions, beachAlerts, beach.waterQuality);
    return {
      ...visitorRecord,
      ...beach,
      facilities: beach.facilities || visitorRecord.facilities || [],
      safety: beach.safety || beach.safetyNotes || visitorRecord.safety || [],
      conditions,
      alerts: beachAlerts,
      assessment,
      distanceKm: origin ? haversineKm(origin, beach) : null,
    };
  });
}

export function filterCatalogue(items, { query = '', state = 'All', activity = 'all', suitability = 'all', sort = 'distance' } = {}) {
  const text = query.trim().toLowerCase();
  let next = items.filter((beach) => {
    const matchesText = !text || [beach.name, beach.city, beach.state, beach.region, beach.description]
      .join(' ')
      .toLowerCase()
      .includes(text);
    const matchesState = state === 'All' || beach.state === state;
    const activityKey = activity === 'all' ? 'swimming' : activity;
    const matchesSuitability = suitability === 'all' || beach.assessment[activityKey]?.status === suitability;
    return matchesText && matchesState && matchesSuitability;
  });

  const activityKey = activity === 'all' ? 'swimming' : activity;
  const rank = { suitable: 0, caution: 1, notSuitable: 2, insufficient: 3 };
  next = [...next].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'waves') return (b.conditions?.waveHeightM || 0) - (a.conditions?.waveHeightM || 0);
    if (sort === 'suitability') {
      return (rank[a.assessment[activityKey]?.status] ?? 9) - (rank[b.assessment[activityKey]?.status] ?? 9);
    }
    return (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999);
  });
  return next;
}

export function countByStatus(items, activity = 'swimming') {
  return items.reduce((counts, beach) => {
    const status = beach.assessment[activity]?.status || 'insufficient';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { suitable: 0, caution: 0, notSuitable: 0, insufficient: 0 });
}
