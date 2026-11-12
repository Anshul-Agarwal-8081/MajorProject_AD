import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadow } from '../theme';
import { useCatalogue } from '../hooks/useCatalogue';
import { useApp } from '../context/AppContext';
import BeachCard from '../components/BeachCard';
import SearchBar from '../components/SearchBar';

const { width } = Dimensions.get('window');

const ACTIVITY_TILES = [
  {
    id: 'swimming',
    label: 'Swimming',
    icon: 'water-outline',
    color1: '#0284C7',
    color2: '#00B4D8',
  },
  {
    id: 'surfing',
    label: 'Surfing',
    icon: 'boat-outline',
    color1: colors.ocean,
    color2: '#0E5FA6',
  },
  {
    id: 'boating',
    label: 'Boating',
    icon: 'navigate-outline',
    color1: '#0F766E',
    color2: colors.teal,
  },
];

export default function HomeScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { catalogue, counts } = useCatalogue();
  const { locationLabel, notifications } = useApp();

  // Highlight popular beaches specifically requested in the prompt:
  // Baga Beach, Calangute Beach, Marina Beach, Kovalam Beach, Puri Beach, Radhanagar Beach
  const requestedBeachIds = ['baga', 'calangute', 'marina', 'kovalam', 'puri', 'radhanagar'];
  const popularBeaches = requestedBeachIds
    .map((id) => catalogue.find((b) => b.id === id))
    .filter(Boolean);

  // Nearby beaches (sorted by distance)
  const nearbyBeaches = [...catalogue]
    .filter((b) => b.distanceKm != null)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 6);

  const handleSearchSubmit = (text) => {
    navigation.navigate('Explore', { initialSearch: text });
  };

  const handleActivityPress = (activityKey) => {
    navigation.navigate('Explore', { initialActivity: activityKey });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.oceanDeep} />

      {/* Hero Header with Coastal Gradient */}
      <LinearGradient
        colors={[colors.oceanDeep, colors.ocean, '#0077B6']}
        style={styles.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          {/* Top Brand Bar */}
          <View style={styles.topBrandBar}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Ionicons name="shield-checkmark" size={24} color={colors.white} />
              </View>
              <View>
                <Text style={styles.brandTitle}>CoastSafe India</Text>
                <Text style={styles.brandSub}>Coastal Safety & Recreation Advisor</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.alertIconBtn}
              onPress={() => navigation.navigate('Alerts')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>7</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Welcome Greeting */}
          <View style={styles.greetingBox}>
            <Text style={styles.greetingTitle}>Explore India's Coast Safely</Text>
            <Text style={styles.greetingSubtitle}>
              Near {locationLabel} • Check beach suitability before entering the ocean
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchTerm}
              onChangeText={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search beaches, cities or states (e.g. Goa, Puri)..."
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                style={styles.quickSearchGo}
                onPress={() => handleSearchSubmit(searchTerm)}
              >
                <Text style={styles.quickSearchGoText}>Explore</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic Safety Conditions Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryTitleRow}>
              <Ionicons name="analytics" size={18} color={colors.ocean} />
              <Text style={styles.summaryTitle}>Today's Safety Overview</Text>
            </View>
            <View style={styles.prototypeTag}>
              <Text style={styles.prototypeTagText}>SIMULATED DATA</Text>
            </View>
          </View>

          <View style={styles.summaryMetricsRow}>
            <TouchableOpacity
              style={[styles.metricBox, { backgroundColor: colors.suitableSoft }]}
              onPress={() => navigation.navigate('Explore', { initialSuitability: 'suitable' })}
            >
              <Text style={[styles.metricCount, { color: colors.suitable }]}>
                {counts.suitable || 0}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.suitable }]}>Suitable</Text>
              <View style={[styles.metricDot, { backgroundColor: colors.suitable }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.metricBox, { backgroundColor: colors.cautionSoft }]}
              onPress={() => navigation.navigate('Explore', { initialSuitability: 'caution' })}
            >
              <Text style={[styles.metricCount, { color: colors.caution }]}>
                {counts.caution || 0}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.caution }]}>Caution</Text>
              <View style={[styles.metricDot, { backgroundColor: colors.caution }]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.metricBox, { backgroundColor: colors.notSuitableSoft }]}
              onPress={() => navigation.navigate('Explore', { initialSuitability: 'notSuitable' })}
            >
              <Text style={[styles.metricCount, { color: colors.notSuitable }]}>
                {counts.notSuitable || 0}
              </Text>
              <Text style={[styles.metricLabel, { color: colors.notSuitable }]}>Not Suitable</Text>
              <View style={[styles.metricDot, { backgroundColor: colors.notSuitable }]} />
            </TouchableOpacity>
          </View>

          <Text style={styles.summaryFooterNote}>
            Calculated across {catalogue.length} monitored coastal stations in India.
          </Text>
        </View>

        {/* Informational Advisory Notice */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={22} color={colors.teal} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoBannerTitle}>Ocean Conditions Can Change Rapidly</Text>
            <Text style={styles.infoBannerDesc}>
              Beach conditions and rip currents shift with tide changes. Always obey flags posted by lifeguards and local port authorities.
            </Text>
          </View>
        </View>

        {/* Quick Access Activity Tiles */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Recreational Activities</Text>
          <Text style={styles.sectionHeaderSub}>Filter beaches tailored to your ocean sport</Text>

          <View style={styles.quickTilesRow}>
            {ACTIVITY_TILES.map((act) => (
              <TouchableOpacity
                key={act.id}
                style={styles.activityTile}
                onPress={() => handleActivityPress(act.id)}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={[act.color1, act.color2]}
                  style={styles.activityTileGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name={act.icon} size={28} color={colors.white} />
                  <Text style={styles.activityTileLabel}>{act.label}</Text>
                  <View style={styles.actCountBadge}>
                    <Text style={styles.actCountText}>Explore</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nearby Beaches Section */}
        {nearbyBeaches.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleRow}>
              <View>
                <Text style={styles.sectionHeaderTitle}>📍 Nearby Beaches</Text>
                <Text style={styles.sectionHeaderSub}>Beaches closest to your reference location</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {nearbyBeaches.map((beach) => (
                <BeachCard
                  key={beach.id}
                  beach={beach}
                  variant="horizontal"
                  onPress={() => navigation.navigate('BeachDetail', { beachId: beach.id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Popular Coastal Destinations (Baga, Calangute, Marina, Kovalam, Puri, Radhanagar) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleRow}>
            <View>
              <Text style={styles.sectionHeaderTitle}>⭐ Popular Indian Beaches</Text>
              <Text style={styles.sectionHeaderSub}>Key coastal destinations from Goa to Andamans</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.viewAllText}>Explore</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {popularBeaches.map((beach) => (
              <BeachCard
                key={beach.id}
                beach={beach}
                variant="horizontal"
                onPress={() => navigation.navigate('BeachDetail', { beachId: beach.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Interactive Map Discovery Banner */}
        <TouchableOpacity
          style={styles.mapPromptCard}
          onPress={() => navigation.navigate('Map')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.oceanDeep, colors.ocean]}
            style={styles.mapPromptGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.mapPromptTextSide}>
              <View style={styles.mapPinBadge}>
                <Ionicons name="map" size={16} color={colors.white} />
                <Text style={styles.mapPinText}>Interactive Map</Text>
              </View>
              <Text style={styles.mapPromptHeading}>View All Beaches on Indian Coastal Map</Text>
              <Text style={styles.mapPromptBody}>
                Color-coded markers show live swimming safety status along the coastline.
              </Text>
            </View>
            <View style={styles.mapPromptIconSide}>
              <View style={styles.mapPromptCircle}>
                <Ionicons name="navigate" size={26} color={colors.white} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Academic Prototype Footer Notice */}
        <View style={styles.academicFooter}>
          <Ionicons name="school-outline" size={18} color={colors.muted} />
          <Text style={styles.academicFooterText}>
            CoastSafe India • Academic Research Prototype (Phase 1)
          </Text>
          <Text style={styles.academicFooterSub}>
            All ocean readings are simulated demonstration values.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  heroGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...shadow,
  },
  safeHeader: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  topBrandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  brandSub: {
    fontSize: 11,
    color: colors.turquoiseSoft,
    fontWeight: '500',
  },
  alertIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.notSuitable,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.oceanDeep,
  },
  notifBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
  },
  greetingBox: {
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 32,
  },
  greetingSubtitle: {
    fontSize: 12,
    color: colors.turquoiseSoft,
    marginTop: 4,
  },
  searchWrapper: {
    position: 'relative',
  },
  quickSearchGo: {
    position: 'absolute',
    right: 6,
    top: 6,
    bottom: 6,
    backgroundColor: colors.teal,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickSearchGoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  prototypeTag: {
    backgroundColor: colors.turquoiseSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  prototypeTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.ocean,
    letterSpacing: 0.4,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  metricCount: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  summaryFooterNote: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  infoBanner: {
    marginHorizontal: 16,
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 1,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.oceanDeep,
    marginBottom: 2,
  },
  infoBannerDesc: {
    fontSize: 12,
    color: '#0369A1',
    lineHeight: 16,
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    paddingHorizontal: 16,
  },
  sectionHeaderSub: {
    fontSize: 12,
    color: colors.muted,
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
  },
  quickTilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 10,
  },
  activityTile: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadow,
  },
  activityTileGrad: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  activityTileLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 4,
  },
  actCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  actCountText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  mapPromptCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 22,
    ...shadow,
  },
  mapPromptGrad: {
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
  },
  mapPromptTextSide: {
    flex: 1,
    paddingRight: 10,
  },
  mapPinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  mapPinText: {
    color: colors.turquoiseSoft,
    fontSize: 10,
    fontWeight: '700',
  },
  mapPromptHeading: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  mapPromptBody: {
    color: colors.turquoiseSoft,
    fontSize: 11,
    lineHeight: 16,
  },
  mapPromptIconSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPromptCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  academicFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 4,
  },
  academicFooterText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
    textAlign: 'center',
  },
  academicFooterSub: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
  },
});

