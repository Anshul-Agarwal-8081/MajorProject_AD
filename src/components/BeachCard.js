import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';
import SuitabilityBadge from './SuitabilityBadge';

export default function BeachCard({ beach, onPress, variant = 'standard', preferredActivity = 'swimming' }) {
  const [imageError, setImageError] = useState(false);
  const isCompact = variant === 'compact';
  const isHorizontal = variant === 'horizontal';

  // Get status for current or selected activity
  const activityAssessment = beach.assessment?.[preferredActivity] || beach.assessment?.swimming;
  const status = activityAssessment?.status || 'suitable';

  const distanceText = beach.distanceKm != null
    ? `${Number(beach.distanceKm).toFixed(1)} km away`
    : beach.distance || 'Coastal India';

  if (isCompact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <View style={styles.compactImageWrapper}>
          <Image
            source={{
              uri: imageError
                ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                : beach.image,
            }}
            style={styles.compactImage}
            onError={() => setImageError(true)}
          />
          <View style={styles.compactStatusOverlay}>
            <SuitabilityBadge status={status} size="small" />
          </View>
        </View>

        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {beach.name}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color={colors.teal} />
            <Text style={styles.locationText} numberOfLines={1}>
              {beach.city}, {beach.state}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.distanceChip}>
              <Ionicons name="navigate-outline" size={11} color={colors.ocean} />
              <Text style={styles.distanceText}>{distanceText}</Text>
            </View>
            {beach.conditions?.waveHeightM != null && (
              <View style={styles.waveChip}>
                <Ionicons name="water-outline" size={11} color={colors.teal} />
                <Text style={styles.waveText}>{beach.conditions.waveHeightM}m wave</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.chevronWrap}>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </TouchableOpacity>
    );
  }

  // Standard Horizontal Carousel Card
  return (
    <TouchableOpacity
      style={[
        styles.standardCard,
        isHorizontal ? styles.horizontalCardWidth : styles.fullWidthCard,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: imageError
              ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
              : beach.image,
          }}
          style={styles.cardImage}
          onError={() => setImageError(true)}
        />
        <View style={styles.badgeOverlay}>
          <SuitabilityBadge status={status} size="small" />
        </View>
        <View style={styles.distanceBadge}>
          <Ionicons name="navigate" size={10} color={colors.white} />
          <Text style={styles.distanceBadgeText}>{distanceText}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {beach.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={colors.muted} />
          <Text style={styles.locationText} numberOfLines={1}>
            {beach.city}, {beach.state}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>Wave</Text>
            <Text style={styles.paramVal}>
              {beach.conditions?.waveHeightM != null ? `${beach.conditions.waveHeightM}m` : '0.8m'}
            </Text>
          </View>
          <View style={styles.paramDivider} />
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>Wind</Text>
            <Text style={styles.paramVal}>
              {beach.conditions?.windSpeedKmh != null ? `${beach.conditions.windSpeedKmh}k/h` : '16k/h'}
            </Text>
          </View>
          <View style={styles.paramDivider} />
          <View style={styles.paramItem}>
            <Text style={styles.paramLabel}>Water</Text>
            <Text style={[styles.paramVal, { color: colors.suitable }]}>
              {beach.waterQuality?.status || 'Good'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
  },
  compactImageWrapper: {
    position: 'relative',
    width: 95,
    height: 95,
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactStatusOverlay: {
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.turquoiseSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ocean,
    marginLeft: 3,
  },
  waveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.foam,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  waveText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.teal,
    marginLeft: 3,
  },
  chevronWrap: {
    paddingHorizontal: 4,
  },

  standardCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
  },
  horizontalCardWidth: {
    width: 220,
    marginRight: 14,
  },
  fullWidthCard: {
    width: '100%',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 135,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(11, 58, 91, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  distanceBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  paramItem: {
    alignItems: 'center',
    flex: 1,
  },
  paramLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '500',
  },
  paramVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 1,
  },
  paramDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.line,
  },
});

