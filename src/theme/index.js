export const colors = {
  ocean: '#0B3A5B',
  oceanDeep: '#07263C',
  teal: '#0E7C86',
  turquoise: '#1AA6A6',
  turquoiseSoft: '#D8F4F3',
  foam: '#F4F8FB',
  white: '#FFFFFF',
  ink: '#122433',
  muted: '#5C7284',
  line: '#D7E4EE',
  suitable: '#1F8A4C',
  suitableSoft: '#E5F6EC',
  caution: '#B7791F',
  cautionSoft: '#FFF4D8',
  notSuitable: '#C53636',
  notSuitableSoft: '#FDECEC',
  insufficient: '#6E7B8A',
  insufficientSoft: '#EEF1F4',
  demo: '#8A5A00',
  demoBg: '#FFF6E5',
  info: '#0E7C86',
  infoSoft: '#E5F6F7',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
};

export const shadow = {
  shadowColor: '#0B3A5B',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 3,
};

export const STATUS = {
  suitable: 'suitable',
  caution: 'caution',
  notSuitable: 'notSuitable',
  insufficient: 'insufficient',
};

export const STATUS_META = {
  suitable: { label: 'Suitable', color: colors.suitable, soft: colors.suitableSoft },
  caution: { label: 'Caution', color: colors.caution, soft: colors.cautionSoft },
  notSuitable: { label: 'Not Suitable', color: colors.notSuitable, soft: colors.notSuitableSoft },
  insufficient: { label: 'Insufficient Data', color: colors.insufficient, soft: colors.insufficientSoft },
};

export const ACTIVITIES = [
  { id: 'swimming', label: 'Swimming', icon: 'swim', blurb: 'Entering the water to swim or wade.' },
  { id: 'surfing', label: 'Surfing', icon: 'surfing', blurb: 'Riding wind waves or swell on a board.' },
  { id: 'boating', label: 'Boating', icon: 'sail-boat', blurb: 'Small recreational boats near the beach.' },
];

export function statusMeta(status) {
  return STATUS_META[status] || STATUS_META.insufficient;
}
