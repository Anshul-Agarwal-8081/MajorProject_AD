export const notificationCategories = [
  {
    id: 'critical',
    label: 'Critical alerts',
    detail: 'Simulated storm-surge and other critical items.',
  },
  {
    id: 'warning',
    label: 'Warnings',
    detail: 'High waves, swell, current, wind and severe weather.',
  },
  {
    id: 'information',
    label: 'Information notes',
    detail: 'Lower-urgency coastal notes and exercises.',
  },
  {
    id: 'nearby',
    label: 'Nearby beaches only',
    detail: 'Limit the in-app centre to beaches near the selected location.',
  },
];

export const seedNotifications = [
  {
    id: 'note-1',
    alertId: 'alert-gopalpur-surge',
    title: 'Critical demo: storm surge at Gopalpur',
    body: 'A simulated critical warning is active for Gopalpur Beach. This is not an official warning.',
    category: 'critical',
    beachId: 'gopalpur',
    createdAt: '2026-11-12T04:20:00+05:30',
    read: false,
  },
  {
    id: 'note-2',
    alertId: 'alert-puri-wave',
    title: 'Warning demo: high waves at Puri',
    body: 'The demonstration assessment marks Puri not suitable for swimming while this item is valid.',
    category: 'warning',
    beachId: 'puri',
    createdAt: '2026-11-12T06:35:00+05:30',
    read: false,
  },
  {
    id: 'note-3',
    alertId: 'alert-north-goa-info',
    title: 'Information demo: North Goa swell note',
    body: 'A moderate swell note is filed for Baga, Calangute, Anjuna and Vagator.',
    category: 'information',
    beachId: 'baga',
    createdAt: '2026-11-12T06:05:00+05:30',
    read: true,
  },
  {
    id: 'note-4',
    alertId: null,
    title: 'Prototype notification centre is on this device',
    body: 'Push delivery is not connected. New items you preview are stored locally.',
    category: 'information',
    beachId: null,
    createdAt: '2026-11-12T09:05:00+05:30',
    read: true,
  },
];
