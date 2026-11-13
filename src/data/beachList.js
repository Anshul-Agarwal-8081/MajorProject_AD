// Sample beaches for the CoastSafe prototype.
// Swimming, surfing and boating labels are made up for the demo.
// They are not live readings.

export const beaches = [
  {
    id: '1',
    name: 'Baga Beach',
    state: 'Goa',
    description:
      'A busy North Goa beach with shacks, a creek at the north end, and a lot of visitors on weekends. Water sports boats work close to the swimming area in season.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    isPopular: true,
    facilities: ['Lifeguards', 'Parking', 'Washrooms', 'Food stalls', 'Water sports'],
    safety: [
      'The creek mouth can pull harder when the tide is going out.',
      'Keep clear of the lanes used by the water-sports boats.',
    ],
    swimming: 'Suitable',
    surfing: 'Caution',
    boating: 'Suitable',
  },
  {
    id: '2',
    name: 'Calangute Beach',
    state: 'Goa',
    description:
      'The long main beach of North Goa. The slope is gentle and lifeguard towers are usually staffed through the tourist season.',
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    isPopular: true,
    facilities: ['Lifeguards', 'Showers', 'Parking', 'Food stalls', 'First aid'],
    safety: [
      'Swim between the flags when they are up.',
      'Small boats run along parts of the beach, so do not drift out past the swim area.',
    ],
    swimming: 'Suitable',
    surfing: 'Caution',
    boating: 'Suitable',
  },
  {
    id: '3',
    name: 'Marina Beach',
    state: 'Tamil Nadu',
    description:
      'A very long city beach in Chennai. People mainly use it for walks. The surf and the alongshore current make bathing a poor idea in this sample.',
    image:
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
    isPopular: true,
    facilities: ['Parking', 'Food stalls', 'Promenade', 'Washrooms'],
    safety: [
      'Treat this as a walking beach in the sample record.',
      'The current along the shore is the main hazard in the surf.',
    ],
    swimming: 'Caution',
    surfing: 'Not Suitable',
    boating: 'Caution',
  },
  {
    id: '4',
    name: 'Kovalam Beach',
    state: 'Kerala',
    description:
      'Two coves under the lighthouse near Thiruvananthapuram. One side is the usual swimming bay. Fishing boats use the other cove.',
    image:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    isPopular: true,
    facilities: ['Lifeguards', 'Parking', 'Washrooms', 'Food stalls', 'Changing rooms'],
    safety: [
      'Stay out of the channel the fishing boats use.',
      'Rocks around the lighthouse are slippery when wet.',
    ],
    swimming: 'Suitable',
    surfing: 'Caution',
    boating: 'Suitable',
  },
  {
    id: '5',
    name: 'Varkala Beach',
    state: 'Kerala',
    description:
      'A cliff beach. The water gets deep quickly and the swell is often cleaner than on the sandy beaches further north. The cliff path is separate from where you enter the sea.',
    image:
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80',
    isPopular: false,
    facilities: ['Parking', 'Food stalls', 'Washrooms', 'First aid'],
    safety: [
      'Do not jump from the cliff.',
      'After a bigger set, a rip can open beside the rocky points.',
    ],
    swimming: 'Caution',
    surfing: 'Suitable',
    boating: 'Caution',
  },
  {
    id: '6',
    name: 'Puri Beach',
    state: 'Odisha',
    description:
      'A wide beach near the Jagannath Temple. It looks flat from the road, but the shore break on the Bay of Bengal is stronger than it appears.',
    image:
      'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&q=80',
    isPopular: false,
    facilities: ['Lifeguards', 'Parking', 'Washrooms', 'Food stalls'],
    safety: [
      'Bathing is often closed when the waves are high, even if the sky is clear.',
      'Do not swim next to the fishing-boat landing.',
    ],
    swimming: 'Not Suitable',
    surfing: 'Not Suitable',
    boating: 'Caution',
  },
  {
    id: '7',
    name: 'Radhanagar Beach',
    state: 'Andaman & Nicobar',
    description:
      'A long white-sand beach on Havelock. The water in this sample is clear and calm, with boat traffic kept toward the ends of the beach.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    isPopular: true,
    facilities: ['Lifeguards', 'Changing rooms', 'Washrooms', 'Parking'],
    safety: [
      'Swim in daylight and stay in the usual bathing stretch.',
      'Boats use the two ends of the beach, not the middle.',
    ],
    swimming: 'Suitable',
    surfing: 'Caution',
    boating: 'Suitable',
  },
  {
    id: '8',
    name: 'Juhu Beach',
    state: 'Maharashtra',
    description:
      'A well-known Mumbai beach used for evening walks and street food. In this sample the water is not fit for swimming.',
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    isPopular: false,
    facilities: ['Parking', 'Food stalls', 'Promenade', 'Washrooms'],
    safety: [
      'Use the beach as a promenade in this prototype.',
      'Drains along the tide line are not bathing spots.',
    ],
    swimming: 'Not Suitable',
    surfing: 'Not Suitable',
    boating: 'Caution',
  },
  {
    id: '9',
    name: 'Murudeshwar Beach',
    state: 'Karnataka',
    description:
      'A curved bay beside the temple and the tall Shiva statue. On a light-wind day the bay is easier than the open coast outside the headland.',
    image:
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&q=80',
    isPopular: false,
    facilities: ['Parking', 'Washrooms', 'Food stalls', 'Boat rides'],
    safety: [
      'Stay inside the bay. The outer rocks are more exposed.',
      'The temple steps get crowded around sunset, so watch your footing.',
    ],
    swimming: 'Caution',
    surfing: 'Caution',
    boating: 'Suitable',
  },
  {
    id: '10',
    name: 'Tarkarli Beach',
    state: 'Maharashtra',
    description:
      'A clear beach in Sindhudurg, at the mouth of the Karli backwater. People swim on the sea side and take boats toward the coast from the southern end.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
    isPopular: false,
    facilities: ['Boat rides', 'Washrooms', 'Food stalls', 'Parking', 'Changing rooms'],
    safety: [
      'The current at the backwater mouth is different from the open beach.',
      'Scuba and boat counters operate from the south end. Give them room.',
    ],
    swimming: 'Suitable',
    surfing: 'Caution',
    boating: 'Suitable',
  },
];

export const popularBeaches = beaches.filter((beach) => beach.isPopular);
