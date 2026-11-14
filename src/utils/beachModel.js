import { alertsForBeach } from '../data/alerts';
import { beaches } from '../data/beaches';
import { beaches as visitorDetails } from '../data/beachList';
import { getConditions } from '../data/conditions';
import { assessBeach } from '../services/suitabilityEngine';
import { haversineKm } from './geo';

const DB_STATUS = {
  suitable: 'suitable',
  caution: 'caution',
  not_suitable: 'notSuitable',
};

function cleanName(value) {
  return String(value || '').toLocaleLowerCase().replace(/[^a-z0-9]/g, '').replace(/beach$/, '');
}

function backendAssessment(beachId, activity, assessments) {
  const record = assessments.find((item) => String(item.beach_id) === String(beachId) && item.activity === activity);
  if (!record) {
    return { status: 'insufficient', explanation: 'No current verified suitability assessment is available.', source: null };
  }
  return {
    status: DB_STATUS[record.status] || 'insufficient',
    explanation: record.reason,
    source: record.source,
    assessedAt: record.assessed_at,
    expiresAt: record.expires_at,
  };
}

export function normalizeBackendAlert(record, remoteBeaches = []) {
  const beach = remoteBeaches.find((item) => String(item.id) === String(record.beach_id));
  const categories = { wave: 'high_wave', current: 'strong_current', weather: 'severe_weather', water_quality: 'water_quality', access: 'general' };
  return {
    id: String(record.alert_id),
    serverId: record.alert_id,
    category: categories[record.alert_type] || record.alert_type || 'general',
    title: record.title,
    severity: record.severity === 'info' ? 'information' : record.severity,
    beachIds: beach ? [String(beach.id)] : [],
    region: record.affected_location,
    state: beach?.state || record.affected_location,
    issuedAt: record.issued_at,
    updatedAt: record.updated_at,
    expiresAt: record.expires_at,
    description: record.description,
    action: '',
    source: record.source,
    isDemo: record.is_demo === true,
    dataSource: record.is_demo === true ? 'demo' : 'api',
  };
}

function buildBackendCatalogue(origin, remoteBeaches, assessments, remoteAlerts) {
  const result = remoteBeaches.map((record, index) => {
    const local = beaches.find((item) => cleanName(item.name) === cleanName(record.name));
    const details = visitorDetails.find((item) => cleanName(item.name) === cleanName(record.name));
    const id = local?.id || `db-${record.id}`;
    const beachAlerts = remoteAlerts
      .filter((alert) => alert.beach_id == null || String(alert.beach_id) === String(record.id))
      .map((alert) => normalizeBackendAlert(alert, remoteBeaches));
    const assessment = Object.fromEntries(['swimming', 'surfing', 'boating'].map((activity) => [
      activity,
      backendAssessment(record.id, activity, assessments),
    ]));
    return {
      ...local,
      id,
      serverId: String(record.id),
      name: record.name,
      state: record.state,
      city: record.city || record.location || local?.city || record.state,
      region: record.region || local?.region || record.location || '',
      latitude: record.latitude == null ? null : Number(record.latitude),
      longitude: record.longitude == null ? null : Number(record.longitude),
      description: record.description || 'No description is available.',
      facilities: Array.isArray(record.facilities) ? record.facilities : [],
      safety: [],
      safetyNotes: [],
      waterQuality: null,
      conditions: null,
      alerts: beachAlerts,
      assessment,
      dataSource: 'api',
      image: local?.image || details?.image || null,
      imageNote: 'Illustrative photo from the local app catalogue; it is not verified imagery for this beach.',
      popular: Boolean(local?.popular || local?.recommended || index < 4),
      recommended: Boolean(local?.recommended),
      distanceKm: origin && Number.isFinite(Number(record.latitude)) && Number.isFinite(Number(record.longitude))
        ? haversineKm(origin, { latitude: Number(record.latitude), longitude: Number(record.longitude) })
        : null,
    };
  });
  return result;
}

export function buildCatalogue(origin, { dataSource = 'demo', remoteBeaches, remoteAssessments = [], remoteAlerts = [] } = {}) {
  if (dataSource === 'api' && Array.isArray(remoteBeaches)) {
    return buildBackendCatalogue(origin, remoteBeaches, remoteAssessments, remoteAlerts);
  }
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
      dataSource: 'demo',
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
