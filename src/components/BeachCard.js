// src/components/BeachCard.js
// ---------------------------------------------------------
// A single card shown in the Beaches screen list.
// Displays: beach photo, name, state, description, swim status.
//
// Props:
//   beach  — a beach object from src/data/beachList.js
//   onPress — function called when the card is tapped
// ---------------------------------------------------------

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// Map each status string to a colour for the badge
const STATUS_COLOR = {
  Safe: '#16a34a',      // green
  Caution: '#d97706',   // amber
  'Not Safe': '#dc2626', // red
};
const STATUS_BG = {
  Safe: '#dcfce7',
  Caution: '#fef3c7',
  'Not Safe': '#fee2e2',
};

export default function BeachCard({ beach, onPress }) {
  // Pick the right colours for the swimming status badge
  const color = STATUS_COLOR[beach.swimming] || '#6b7280';
  const bg = STATUS_BG[beach.swimming] || '#f3f4f6';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Left: beach thumbnail */}
      <Image source={{ uri: beach.image }} style={styles.image} />

      {/* Right: text info */}
      <View style={styles.info}>
        <Text style={styles.name}>{beach.name}</Text>
        <Text style={styles.state}>{beach.state}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {beach.description}
        </Text>

        {/* Swimming status badge — clearly marked as Demo */}
        <View style={[styles.badge, { backgroundColor: bg }]}>
          <Text style={[styles.badgeText, { color }]}>
            🏊 Swimming: {beach.swimming} (Demo)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 115,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  state: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 7,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
