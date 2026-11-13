import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const statusLook = {
  Suitable: { color: '#15803d', bg: '#dcfce7' },
  Caution: { color: '#b45309', bg: '#fef3c7' },
  'Not Suitable': { color: '#b91c1c', bg: '#fee2e2' },
};

export default function BeachCard({ beach, onPress }) {
  const look = statusLook[beach.swimming] || { color: '#6b7280', bg: '#f3f4f6' };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: beach.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{beach.name}</Text>
        <Text style={styles.state}>{beach.state}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {beach.description}
        </Text>

        <View style={[styles.badge, { backgroundColor: look.bg }]}>
          <Text style={[styles.badgeText, { color: look.color }]} numberOfLines={2}>
            Swimming: {beach.swimming} (demo)
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
