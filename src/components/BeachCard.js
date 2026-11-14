import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statusLook = {
  Suitable: { color: '#15803d', bg: '#dcfce7' },
  Caution: { color: '#b45309', bg: '#fef3c7' },
  'Not Suitable': { color: '#b91c1c', bg: '#fee2e2' },
};

export default function BeachCard({ beach, onPress, isFavorite = false, onFavoritePress, preferredActivity = 'swimming' }) {
  const rawStatus = beach.assessment?.[preferredActivity]?.status || beach[preferredActivity] || beach.swimming;
  const statusLabels = { suitable: 'Suitable', caution: 'Caution', notSuitable: 'Not Suitable', not_suitable: 'Not Suitable', insufficient: 'Insufficient Data', insufficient_data: 'Insufficient Data' };
  const shownStatus = statusLabels[rawStatus] || rawStatus || 'Insufficient Data';
  const look = statusLook[shownStatus] || { color: '#6b7280', bg: '#f3f4f6' };
  const sourceLabel = beach.dataSource === 'api'
    ? (shownStatus === 'Insufficient Data' ? 'no verified result' : 'verified record')
    : 'demo';

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: beach.image }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name}>{beach.name}</Text>
          <Text style={styles.state}>{beach.state}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {beach.description}
          </Text>

          <View style={[styles.badge, { backgroundColor: look.bg }]}>
            <Text style={[styles.badgeText, { color: look.color }]} numberOfLines={2}>
              {preferredActivity[0].toUpperCase() + preferredActivity.slice(1)}: {shownStatus} · {sourceLabel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {onFavoritePress ? (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`${isFavorite ? 'Remove' : 'Save'} ${beach.name} ${isFavorite ? 'from' : 'to'} saved beaches`}
        >
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={isFavorite ? '#C53636' : '#0B3A5B'} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
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
  cardContent: {
    flexDirection: 'row',
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
  favoriteButton: {
    position: 'absolute',
    top: 8,
    left: 56,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
});
