-- Descriptive CoastSafe sample beach records. These are place records only.
-- No live weather, ocean readings, water-quality results, or safety status is seeded.
-- Coordinates are approximate map pins already used by the app's static catalogue.
-- Re-running this file updates these records instead of duplicating them.

INSERT INTO beaches (name, state, location, latitude, longitude, description, facilities)
VALUES
  (
    'Palolem Beach', 'Goa', 'Canacona, South Goa', 15.009900, 74.023200,
    'A sandy bay between two headlands in Canacona. Goa Tourism describes Palolem as a fishing beach with beach huts and small food and souvenir stalls.',
    ARRAY['Beach huts', 'Food shacks', 'Souvenir stalls']::TEXT[]
  ),
  (
    'Kovalam Beach', 'Kerala', 'Kovalam, Thiruvananthapuram district', 8.400400, 76.978400,
    'A coastal destination made up of several crescent-shaped beaches, including Lighthouse Beach, Hawah (Eve’s) Beach, and Samudra Beach.',
    ARRAY['Lighthouse', 'Dining', 'Accommodation nearby']::TEXT[]
  ),
  (
    'Marina Beach', 'Tamil Nadu', 'Chennai, Chennai district', 13.050000, 80.282400,
    'A long urban beach along the Bay of Bengal, extending through Chennai from Besant Nagar toward Fort St. George.',
    ARRAY['Food stalls', 'Handicraft stalls', 'Aquarium nearby']::TEXT[]
  ),
  (
    'Puri Beach', 'Odisha', 'Puri, Puri district', 19.794800, 85.825000,
    'A Bay of Bengal beach in the coastal city of Puri, near the city’s railway station and other visitor attractions.',
    ARRAY[]::TEXT[]
  ),
  (
    'Om Beach', 'Karnataka', 'Gokarna, Uttara Kannada district', 14.516000, 74.326000,
    'A beach near Gokarna whose two curved inlets form a shape associated with the Om symbol. Coastal trails connect it with nearby beaches.',
    ARRAY['Beach shacks', 'Cafes', 'Water-sport operators (availability varies)']::TEXT[]
  ),
  (
    'Mandvi Beach', 'Gujarat', 'Mandvi, Kutch district', NULL, NULL,
    'A golden-brown sandy beach in the coastal town of Mandvi, near the Rukmavati River estuary and the historic port area.',
    ARRAY['Food vendors', 'Camel-ride operators (availability varies)']::TEXT[]
  ),
  (
    'Kashid Beach', 'Maharashtra', 'Kashid, Raigad district', NULL, NULL,
    'A Konkan coast beach about 30 km from Alibaug, with a sandy shoreline and nearby coastal hills.',
    ARRAY[]::TEXT[]
  ),
  (
    'Rushikonda Beach', 'Andhra Pradesh', 'Visakhapatnam district', NULL, NULL,
    'A beach about 8 km north of Visakhapatnam along the coastal road, described by Andhra Pradesh Tourism as a destination for shoreline walks and visitor activities.',
    ARRAY['Tourist resort nearby', 'Jet-ski operators (availability varies)', 'Horse rides (availability varies)']::TEXT[]
  ),
  (
    'Digha Beach', 'West Bengal', 'Digha, Purba Medinipur district', NULL, NULL,
    'A coastal resort town in Purba Medinipur, with a sandy shoreline and casuarina plantations along parts of the coast.',
    ARRAY[]::TEXT[]
  ),
  (
    'Radhanagar Beach', 'Andaman and Nicobar Islands', 'Swaraj Dweep (Havelock Island), South Andaman district', 11.983000, 92.952000,
    'A sandy beach backed by forest on Swaraj Dweep, also known as Havelock Island. Neil’s Cove is a nearby coastal feature.',
    ARRAY['Washrooms', 'Lockers', 'Changing rooms', 'Toilets', 'Snack and beverage vendors']::TEXT[]
  ),
  (
    'Baga Beach', 'Goa', 'Bardez, North Goa', 15.555300, 73.751700,
    'A coastal beach in Bardez, North Goa. This entry contains descriptive place information only.',
    ARRAY[]::TEXT[]
  ),
  (
    'Varkala Beach', 'Kerala', 'Varkala, Thiruvananthapuram district', 8.737900, 76.706000,
    'A beach in Varkala, Thiruvananthapuram district. This entry contains descriptive place information only.',
    ARRAY[]::TEXT[]
  ),
  (
    'Mahabalipuram Beach', 'Tamil Nadu', 'Mamallapuram, Chengalpattu district', 12.620800, 80.194500,
    'A beach in the Mamallapuram (Mahabalipuram) area of Chengalpattu district. This entry contains descriptive place information only.',
    ARRAY[]::TEXT[]
  ),
  (
    'Kanyakumari Beach', 'Tamil Nadu', 'Kanyakumari, Kanyakumari district', 8.088300, 77.538500,
    'A beach in Kanyakumari town, Tamil Nadu. This entry contains descriptive place information only.',
    ARRAY[]::TEXT[]
  ),
  (
    'Juhu Beach', 'Maharashtra', 'Juhu, Mumbai Suburban district', 19.098000, 72.826000,
    'An urban beach in Mumbai’s Juhu neighbourhood. This entry contains descriptive place information only.',
    ARRAY[]::TEXT[]
  )
ON CONFLICT (name, state) DO UPDATE SET
  location = EXCLUDED.location,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  description = EXCLUDED.description,
  facilities = EXCLUDED.facilities,
  updated_at = CURRENT_TIMESTAMP;
