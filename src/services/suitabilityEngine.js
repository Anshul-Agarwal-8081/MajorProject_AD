import { DEMO_ASSESSED } from '../data/sources';
import { STATUS } from '../theme';

/**
 * Simulated recreational-suitability rules.
 * Replace this module later without changing screens.
 * Thresholds are prototype choices, not an official standard.
 *
 * Critical demonstration alerts force Not Suitable.
 * Warning alerts prevent a result from staying at Suitable.
 * Information alerts are reported and do not change the status.
 * A missing required reading produces Insufficient Data unless a
 * critical alert already forces Not Suitable.
 */

const ACTIVITY_LABEL = {
  swimming: 'Swimming',
  surfing: 'Surfing',
  boating: 'Boating',
};

function worst(levels) {
  if (levels.includes(STATUS.notSuitable)) return STATUS.notSuitable;
  if (levels.includes(STATUS.insufficient)) return STATUS.insufficient;
  if (levels.includes(STATUS.caution)) return STATUS.caution;
  return STATUS.suitable;
}

function highFactor(value, suitableMax, cautionMax, unit, label, decimals = 1) {
  if (value == null || Number.isNaN(Number(value))) {
    return {
      label,
      reading: 'Not in the demonstration record',
      assessment: STATUS.insufficient,
      note: `${label} is missing, so this factor cannot be judged.`,
    };
  }
  const reading = `${Number(value).toFixed(decimals)} ${unit}`;
  if (value > cautionMax) {
    return {
      label,
      reading,
      assessment: STATUS.notSuitable,
      note: `${label} is above ${cautionMax} ${unit}, the demonstration limit for this activity.`,
    };
  }
  if (value > suitableMax) {
    return {
      label,
      reading,
      assessment: STATUS.caution,
      note: `${label} is above ${suitableMax} ${unit} and within the caution band.`,
    };
  }
  return {
    label,
    reading,
    assessment: STATUS.suitable,
    note: `${label} is within the comfortable demonstration range.`,
  };
}

function waterFactor(quality, activity) {
  if (!quality?.status) {
    return {
      label: 'Water quality',
      reading: 'Not in the demonstration record',
      assessment: STATUS.insufficient,
      note: 'No water-quality sample is stored for this beach.',
      optional: true,
    };
  }
  const reading = quality.status;
  if (reading === 'Excellent' || reading === 'Good') {
    return { label: 'Water quality', reading, assessment: STATUS.suitable, note: quality.note };
  }
  if (reading === 'Fair') {
    return {
      label: 'Water quality',
      reading,
      assessment: activity === 'boating' ? STATUS.suitable : STATUS.caution,
      note: quality.note,
    };
  }
  return {
    label: 'Water quality',
    reading,
    assessment: activity === 'boating' ? STATUS.caution : STATUS.notSuitable,
    note: quality.note,
  };
}

function surfingWaveFactor(height) {
  if (height == null) {
    return {
      label: 'Wave height',
      reading: 'Not in the demonstration record',
      assessment: STATUS.insufficient,
      note: 'Wave height is required for a surfing assessment.',
    };
  }
  const reading = `${Number(height).toFixed(1)} m`;
  if (height < 0.4) {
    return { label: 'Wave height', reading, assessment: STATUS.notSuitable, note: 'Below 0.4 m is treated as too flat for surfing.' };
  }
  if (height > 3) {
    return { label: 'Wave height', reading, assessment: STATUS.notSuitable, note: 'Above 3.0 m is treated as too large for recreational surfing.' };
  }
  if (height < 0.8) {
    return { label: 'Wave height', reading, assessment: STATUS.caution, note: 'From 0.4 m to 0.8 m is a marginal surfing band.' };
  }
  if (height > 2.2) {
    return { label: 'Wave height', reading, assessment: STATUS.caution, note: 'From 2.2 m to 3.0 m is only a caution band for experienced surfers.' };
  }
  return { label: 'Wave height', reading, assessment: STATUS.suitable, note: 'From 0.8 m to 2.2 m is the comfortable surfing band in this rule set.' };
}

function periodFactor(period) {
  if (period == null) {
    return {
      label: 'Swell period',
      reading: 'Not in the demonstration record',
      assessment: STATUS.insufficient,
      note: 'Swell period is required before surfing can be cleared.',
    };
  }
  const reading = `${period} s`;
  if (period < 8) {
    return { label: 'Swell period', reading, assessment: STATUS.caution, note: 'A period under 8 s is treated as short and choppier.' };
  }
  return { label: 'Swell period', reading, assessment: STATUS.suitable, note: 'A period of 8 s or more is treated as organised enough for surfing.' };
}

function contextFactor(label, value, note) {
  if (value == null || value === '') return null;
  return { label, reading: String(value), assessment: 'context', note };
}

function factorsFor(activity, conditions, waterQuality) {
  if (!conditions) return [];
  const sharedContext = [
    contextFactor('Wave direction', conditions.waveDirection, 'Shown for context. Direction alone does not change the status.'),
    contextFactor('Swell height', conditions.swellHeightM != null ? `${conditions.swellHeightM.toFixed(1)} m` : null, 'Swell height is context here; the activity rules use wave height and, for surfing, period.'),
    contextFactor('Wind direction', conditions.windDirection, 'Shown for context. The rules currently use wind speed, not offshore or onshore direction.'),
    contextFactor('Weather', conditions.weather, 'Sky condition from the demonstration record.'),
  ].filter(Boolean);

  let scored = [];
  if (activity === 'swimming') {
    scored = [
      highFactor(conditions.waveHeightM, 1, 1.8, 'm', 'Wave height'),
      highFactor(conditions.currentSpeedMs, 0.4, 0.8, 'm/s', 'Ocean current', 2),
      highFactor(conditions.windSpeedKmh, 25, 40, 'km/h', 'Wind speed', 0),
      waterFactor(waterQuality, activity),
    ];
  } else if (activity === 'surfing') {
    scored = [
      surfingWaveFactor(conditions.waveHeightM),
      periodFactor(conditions.swellPeriodS),
      highFactor(conditions.windSpeedKmh, 22, 34, 'km/h', 'Wind speed', 0),
      highFactor(conditions.currentSpeedMs, 0.6, 1, 'm/s', 'Ocean current', 2),
      waterFactor(waterQuality, activity),
    ];
  } else {
    scored = [
      highFactor(conditions.waveHeightM, 1.2, 2, 'm', 'Wave height'),
      highFactor(conditions.windSpeedKmh, 22, 35, 'km/h', 'Wind speed', 0),
      highFactor(conditions.currentSpeedMs, 0.5, 0.9, 'm/s', 'Ocean current', 2),
      waterFactor(waterQuality, activity),
    ];
  }
  return [...scored, ...sharedContext];
}

function recommendationsFor(activity, status) {
  const common = [
    'This is a demonstration assessment, not a lifeguard instruction or a government warning.',
    'Local flags, police and lifeguards override this screen.',
  ];
  if (status === STATUS.insufficient) {
    return [
      `Do not treat the missing ${ACTIVITY_LABEL[activity].toLowerCase()} reading as a clearance.`,
      'Wait for a fuller observation before choosing this activity.',
      ...common,
    ];
  }
  if (status === STATUS.notSuitable) {
    return [
      `Do not ${activity === 'boating' ? 'launch' : 'enter the water'} for ${ACTIVITY_LABEL[activity].toLowerCase()} while this status stands.`,
      'Move back from the wet sand if waves or surge are reaching the beach.',
      ...common,
    ];
  }
  if (status === STATUS.caution) {
    return [
      'Inexperienced visitors should postpone this activity.',
      'Stay where you can stand, and leave the water if the current moves you along the beach.',
      ...common,
    ];
  }
  return [
    `Conditions in this sample sit inside the ${ACTIVITY_LABEL[activity].toLowerCase()} comfort band.`,
    'Recheck if the wind rises, a squall arrives, or a warning is posted.',
    ...common,
  ];
}

function explain(activity, status, factors, critical, warnings) {
  const name = ACTIVITY_LABEL[activity];
  if (critical.length) {
    return `${name} is Not Suitable because a simulated critical alert covers this beach: “${critical[0].title}”. The sea readings underneath are still shown, but they do not override that alert in this rule set.`;
  }
  if (status === STATUS.insufficient) {
    const missing = factors
      .filter((factor) => factor.assessment === STATUS.insufficient && !factor.optional)
      .map((factor) => factor.label.toLowerCase());
    return `${name} is Insufficient Data because the demonstration record does not include ${missing.join(' and ') || 'a required reading'}.`;
  }
  const drivers = factors.filter((factor) => factor.assessment === STATUS.notSuitable || factor.assessment === STATUS.caution);
  const detail = drivers.map((factor) => `${factor.label.toLowerCase()} at ${factor.reading}`).join('; ');
  if (status === STATUS.notSuitable) {
    return `${name} is Not Suitable because ${detail}.`;
  }
  if (status === STATUS.caution) {
    const warningText = warnings.length ? ` A simulated warning also applies: “${warnings[0].title}”.` : '';
    return `${name} is Caution because ${detail || 'a simulated warning applies'}.${warningText}`;
  }
  return `${name} is Suitable under the demonstration rules. The scored readings sit inside the comfortable ranges.`;
}

export function assessActivity(activity, conditions, alerts = [], waterQuality) {
  const factors = factorsFor(activity, conditions, waterQuality);
  const critical = alerts.filter((alert) => alert.severity === 'critical');
  const warnings = alerts.filter((alert) => alert.severity === 'warning');
  const required = factors.filter((factor) => factor.assessment !== 'context' && !factor.optional);

  if (!conditions) {
    return {
      activity,
      status: STATUS.insufficient,
      factors: [],
      explanation: `${ACTIVITY_LABEL[activity]} is Insufficient Data because this beach has no demonstration conditions record.`,
      recommendations: recommendationsFor(activity, STATUS.insufficient),
      assessedAt: DEMO_ASSESSED,
      engine: 'Simulated rule-based assessment',
    };
  }

  let status = worst(required.map((factor) => factor.assessment));
  const water = factors.find((factor) => factor.label === 'Water quality');
  if (water && water.assessment !== STATUS.insufficient) {
    status = worst([status, water.assessment]);
  }
  if (critical.length) status = STATUS.notSuitable;
  else if (warnings.length && status === STATUS.suitable) status = STATUS.caution;

  return {
    activity,
    status,
    factors,
    explanation: explain(activity, status, factors, critical, warnings),
    recommendations: recommendationsFor(activity, status),
    assessedAt: DEMO_ASSESSED,
    engine: 'Simulated rule-based assessment',
    activeAlertCount: alerts.length,
  };
}

export function assessBeach(conditions, alerts, waterQuality) {
  return {
    swimming: assessActivity('swimming', conditions, alerts, waterQuality),
    surfing: assessActivity('surfing', conditions, alerts, waterQuality),
    boating: assessActivity('boating', conditions, alerts, waterQuality),
  };
}
