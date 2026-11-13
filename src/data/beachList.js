// src/data/beachList.js
// ---------------------------------------------------------
// Local sample beach data for CoastSafe India (college project).
//
// ⚠️ IMPORTANT: All suitability values (swimming, surfing, boating)
// are DEMO values chosen for prototype demonstration only.
// They are NOT real-time or official safety assessments.
// ---------------------------------------------------------

export const beaches = [
  {
    id: '1',
    name: 'Baga Beach',
    state: 'Goa',
    description:
      'A lively North Goa beach popular for water sports, beach shacks and nightlife. Lifeguards are usually present during the tourist season.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    isPopular: true,
    // Demo suitability — NOT real assessments
    swimming: 'Safe',
    surfing: 'Caution',
    boating: 'Safe',
  },
  {
    id: '2',
    name: 'Calangute Beach',
    state: 'Goa',
    description:
      'Called the "Queen of Beaches", it is the busiest beach in North Goa with water sports, cafes and lifeguard posts.',
    image:
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    isPopular: true,
    swimming: 'Safe',
    surfing: 'Caution',
    boating: 'Safe',
  },
  {
    id: '3',
    name: 'Marina Beach',
    state: 'Tamil Nadu',
    description:
      'One of the longest urban beaches in the world, stretching 13 km along the Bay of Bengal in Chennai. Strong currents make swimming risky.',
    image:
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80',
    isPopular: true,
    swimming: 'Caution',
    surfing: 'Not Safe',
    boating: 'Caution',
  },
  {
    id: '4',
    name: 'Kovalam Beach',
    state: 'Kerala',
    description:
      'A crescent-shaped beach near Thiruvananthapuram with calm waters, a lighthouse, and Ayurveda centres popular among tourists.',
    image:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    isPopular: true,
    swimming: 'Safe',
    surfing: 'Caution',
    boating: 'Safe',
  },
  {
    id: '5',
    name: 'Varkala Beach',
    state: 'Kerala',
    description:
      'A cliff-top beach known for its dramatic red laterite cliffs, natural mineral springs and yoga retreat centres along the cliff path.',
    image:
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800&q=80',
    isPopular: false,
    swimming: 'Caution',
    surfing: 'Safe',
    boating: 'Caution',
  },
  {
    id: '6',
    name: 'Puri Beach',
    state: 'Odisha',
    description:
      'A famous pilgrimage and tourist beach near the Jagannath Temple. The Bay of Bengal creates strong surf here — caution is advised.',
    image:
      'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&q=80',
    isPopular: false,
    swimming: 'Not Safe',
    surfing: 'Not Safe',
    boating: 'Caution',
  },
  {
    id: '7',
    name: 'Radhanagar Beach',
    state: 'Andaman & Nicobar',
    description:
      "Voted among Asia's best beaches, this pristine Havelock Island beach is known for turquoise waters, dense forests and beautiful sunsets.",
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    isPopular: true,
    swimming: 'Safe',
    surfing: 'Caution',
    boating: 'Safe',
  },
  {
    id: '8',
    name: 'Juhu Beach',
    state: 'Maharashtra',
    description:
      "Mumbai's famous 6-km stretch popular for evening walks, street food and Bollywood sightings. Pollution makes it unsafe for swimming.",
    image:
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    isPopular: false,
    swimming: 'Not Safe',
    surfing: 'Not Safe',
    boating: 'Caution',
  },
  {
    id: '9',
    name: 'Murudeshwar Beach',
    state: 'Karnataka',
    description:
      'A scenic beach overlooking a tall Shiva statue and the Arabian Sea. The Murudeshwar temple complex makes it a popular pilgrimage site.',
    image:
      'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=800&q=80',
    isPopular: false,
    swimming: 'Caution',
    surfing: 'Caution',
    boating: 'Safe',
  },
  {
    id: '10',
    name: 'Tarkarli Beach',
    state: 'Maharashtra',
    description:
      'A quiet beach in Sindhudurg district with crystal-clear waters, coral reefs and scuba diving opportunities — one of Maharashtra\'s hidden gems.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80',
    isPopular: false,
    swimming: 'Safe',
    surfing: 'Caution',
    boating: 'Safe',
  },
];

// Helper: returns only beaches marked as popular
// Used by the Home screen to show the "Popular Beaches" section
export const popularBeaches = beaches.filter(beach => beach.isPopular);

