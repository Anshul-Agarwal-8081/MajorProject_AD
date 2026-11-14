-- Descriptive CoastSafe sample beach records only.
-- No live weather, water-quality, or current-safety readings are included.
-- Facilities are included only where tourism/government sources list them.
-- Re-running this file updates the existing sample rows instead of duplicating them.

INSERT INTO beaches (beach_name, state, location, description, facilities)
VALUES
  (
    'Palolem Beach',
    'Goa',
    'Canacona, South Goa',
    'A sandy bay between two headlands in Canacona. Goa Tourism describes Palolem as a fishing beach with beach huts and small food and souvenir stalls.',
    ARRAY['Beach huts', 'Food shacks', 'Souvenir stalls']::TEXT[]
  ),
  (
    'Kovalam Beach',
    'Kerala',
    'Kovalam, Thiruvananthapuram district',
    'A coastal destination made up of several crescent-shaped beaches, including Lighthouse Beach, Hawah (Eve’s) Beach, and Samudra Beach.',
    ARRAY['Lighthouse', 'Dining', 'Accommodation nearby']::TEXT[]
  ),
  (
    'Marina Beach',
    'Tamil Nadu',
    'Chennai, Chennai district',
    'A long urban beach along the Bay of Bengal, extending through Chennai from Besant Nagar toward Fort St. George.',
    ARRAY['Food stalls', 'Handicraft stalls', 'Aquarium nearby']::TEXT[]
  ),
  (
    'Puri Beach',
    'Odisha',
    'Puri, Puri district',
    'A Bay of Bengal beach in the coastal city of Puri, near the city’s railway station and other visitor attractions.',
    ARRAY[]::TEXT[]
  ),
  (
    'Om Beach',
    'Karnataka',
    'Gokarna, Uttara Kannada district',
    'A beach near Gokarna whose two curved inlets form a shape associated with the Om symbol. Coastal trails connect it with nearby beaches.',
    ARRAY['Beach shacks', 'Cafes', 'Water-sport operators (availability varies)']::TEXT[]
  ),
  (
    'Mandvi Beach',
    'Gujarat',
    'Mandvi, Kutch district',
    'A golden-brown sandy beach in the coastal town of Mandvi, near the Rukmavati River estuary and the historic port area.',
    ARRAY['Food vendors', 'Camel-ride operators (availability varies)']::TEXT[]
  ),
  (
    'Kashid Beach',
    'Maharashtra',
    'Kashid, Raigad district',
    'A Konkan coast beach about 30 km from Alibaug, with a sandy shoreline and nearby coastal hills.',
    ARRAY[]::TEXT[]
  ),
  (
    'Rushikonda Beach',
    'Andhra Pradesh',
    'Visakhapatnam district',
    'A beach about 8 km north of Visakhapatnam along the coastal road, described by Andhra Pradesh Tourism as a destination for shoreline walks and visitor activities.',
    ARRAY['Tourist resort nearby', 'Jet-ski operators (availability varies)', 'Horse rides (availability varies)']::TEXT[]
  ),
  (
    'Digha Beach',
    'West Bengal',
    'Digha, Purba Medinipur district',
    'A coastal resort town in Purba Medinipur, with a sandy shoreline and casuarina plantations along parts of the coast.',
    ARRAY[]::TEXT[]
  ),
  (
    'Radhanagar Beach',
    'Andaman and Nicobar Islands',
    'Swaraj Dweep (Havelock Island), South Andaman district',
    'A sandy beach backed by forest on Swaraj Dweep, also known as Havelock Island. Neil’s Cove is a nearby coastal feature.',
    ARRAY['Washrooms', 'Lockers', 'Changing rooms', 'Toilets', 'Snack and beverage vendors']::TEXT[]
  )
ON CONFLICT (beach_name, state) DO UPDATE SET
  location = EXCLUDED.location,
  description = EXCLUDED.description,
  facilities = EXCLUDED.facilities,
  updated_at = CURRENT_TIMESTAMP;
