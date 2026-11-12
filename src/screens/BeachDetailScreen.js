import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadow, STATUS_META } from '../theme';
import { useBeach } from '../hooks/useCatalogue';
import OceanParamCard from '../components/OceanParamCard';
import SuitabilityBadge from '../components/SuitabilityBadge';

const { width } = Dimensions.get('window');

const ACTIVITY_INFO = {
  swimming: { label: 'Swimming', icon: 'water' },
  surfing: { label: 'Surfing', icon: 'boat' },
  boating: { label: 'Boating', icon: 'navigate' },
};

function SuitabilityCard({ activityKey, data }) {
  const meta = ACTIVITY_INFO[activityKey] || { label: activityKey, icon: 'shield' };
  const statusMeta = STATUS_META[data?.status] || {
    label: data?.status || 'Unknown',
    color: colors.muted,
    soft: colors.foam,
  };

  return (
    <View style={[styles.activityCard, { borderLeftColor: statusMeta.color }]}>
      <View style={styles.activityHeader}>
        <View style={[styles.activityIconWrap, { backgroundColor: statusMeta.soft }]}>
          <Ionicons name={meta.icon} size={20} color={statusMeta.color} />
        </View>

        <View style={styles.activityTitleWrap}>
          <Text style={styles.activityTitle}>{meta.label}</Text>
          <Text style={styles.activitySub}>Recreational Marine Condition</Text>
        </View>

        <SuitabilityBadge status={data?.status} size="medium" />
      </View>

      <Text style={styles.activityExplanation}>{data?.explanation}</Text>

      {data?.factors?.length > 0 && (
        <View style={styles.factorsList}>
          {data.factors.map((f, i) => (
            <View key={i} style={styles.factorRow}>
              <View style={[styles.factorDot, { backgroundColor: STATUS_META[f.assessment]?.color || colors.muted }]} />
              <Text style={styles.factorText}>
                <Text style={styles.factorLabel}>{f.label}: </Text>
                {f.reading} ({f.note})
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function BeachDetailScreen({ route, navigation }) {
  const { beachId } = route.params || { beachId: 'baga' };
  const beach = useBeach(beachId);

  if (!beach) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundWrap}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.muted} />
          <Text style={styles.notFoundText}>Beach not found</Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.returnBtnText}>Return to Explore</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const overallStatus = beach.assessment?.swimming?.status || 'suitable';
  const distanceText = beach.distanceKm != null
    ? `${Number(beach.distanceKm).toFixed(1)} km away`
    : 'Coastal India';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Large Hero Image with Gradient & Navigation Bar */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: beach.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(7, 38, 60, 0.65)', 'transparent', 'rgba(11, 58, 91, 0.95)']}
            style={styles.heroGradient}
            locations={[0, 0.45, 1]}
          />

          <SafeAreaView edges={['top']} style={styles.heroNav}>
            <TouchableOpacity
              style={styles.navCircleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color={colors.white} />
            </TouchableOpacity>

            <View style={styles.stateChip}>
              <Ionicons name="location" size={12} color={colors.turquoiseSoft} />
              <Text style={styles.stateChipText}>{beach.state}</Text>
            </View>
          </SafeAreaView>

          {/* Hero Bottom Info Overlay */}
          <View style={styles.heroBottomText}>
            <View style={styles.heroBadgeRow}>
              <SuitabilityBadge status={overallStatus} size="large" />
              <View style={styles.heroDistanceChip}>
                <Ionicons name="navigate-outline" size={12} color={colors.white} />
                <Text style={styles.heroDistanceText}>{distanceText}</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>{beach.name}</Text>
            <Text style={styles.heroSubtitle}>
              {beach.city}, {beach.state}
            </Text>
          </View>
        </View>

        {/* Prototype Notice Banner */}
        <View style={styles.demoBanner}>
          <Ionicons name="flask" size={18} color={colors.caution} style={{ marginTop: 2 }} />
          <View style={styles.demoBannerContent}>
            <Text style={styles.demoBannerTitle}>Academic Prototype • Demonstration Data</Text>
            <Text style={styles.demoBannerDesc}>
              All ocean measurements, wave heights, and suitability statuses shown are simulated dummy readings. Do not rely on them for real swimming or boating safety.
            </Text>
          </View>
        </View>

        {/* Section A: About Beach Description */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="information-circle-outline" size={20} color={colors.ocean} />
            <Text style={styles.sectionHeaderTitle}>About This Coastline</Text>
          </View>
          <Text style={styles.descriptionText}>{beach.description}</Text>
          {beach.safetyNotes?.length > 0 && (
            <View style={styles.safetyNotesBox}>
              <Text style={styles.safetyNotesHeading}>Location Notes:</Text>
              {beach.safetyNotes.map((note, i) => (
                <Text key={i} style={styles.safetyNoteItem}>• {note}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Section B: Recreational Suitability Cards (Swimming, Surfing, Boating) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.ocean} />
            <Text style={styles.sectionHeaderTitle}>Recreational Suitability</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Suitability ratings for major coastal activities:
          </Text>

          <View style={styles.suitabilityCardsList}>
            <SuitabilityCard activityKey="swimming" data={beach.assessment?.swimming} />
            <SuitabilityCard activityKey="surfing" data={beach.assessment?.surfing} />
            <SuitabilityCard activityKey="boating" data={beach.assessment?.boating} />
          </View>
        </View>

        {/* Section C: Ocean Conditions */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="analytics-outline" size={20} color={colors.ocean} />
            <Text style={styles.sectionHeaderTitle}>Oceanographic Conditions</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Simulated sensor readings for sea state and coastal weather:
          </Text>

          <View style={styles.paramsGrid}>
            <OceanParamCard
              icon="water"
              label="Wave Height"
              value={beach.conditions?.waveHeightM != null ? `${beach.conditions.waveHeightM} m` : '1.0 m'}
              subtext={beach.conditions?.waveDirection ? `Dir: ${beach.conditions.waveDirection}` : 'Nearshore wave'}
              status={beach.conditions?.waveHeightM > 2 ? 'alert' : 'normal'}
            />
            <OceanParamCard
              icon="trending-up"
              label="Swell"
              value={beach.conditions?.swellHeightM != null ? `${beach.conditions.swellHeightM} m` : '1.2 m'}
              subtext={beach.conditions?.swellPeriodS ? `${beach.conditions.swellPeriodS}s period` : 'Dominant swell'}
            />
            <OceanParamCard
              icon="arrow-forward-circle"
              label="Ocean Current"
              value={beach.conditions?.currentSpeedMs != null ? `${beach.conditions.currentSpeedMs} m/s` : '0.4 m/s'}
              subtext={beach.conditions?.currentDirection || 'Nearshore flow'}
            />
            <OceanParamCard
              icon="speedometer"
              label="Wind Speed"
              value={beach.conditions?.windSpeedKmh != null ? `${beach.conditions.windSpeedKmh} km/h` : '16 km/h'}
              subtext={beach.conditions?.windDirection ? `Dir: ${beach.conditions.windDirection}` : 'Surface wind'}
            />
            <OceanParamCard
              icon="thermometer"
              label="Water Temp"
              value={beach.conditions?.temperatureC != null ? `${beach.conditions.temperatureC}°C` : '29°C'}
              subtext={beach.conditions?.weather || 'Surface weather'}
            />
            <OceanParamCard
              icon="sunny"
              label="Sun Schedule"
              value={beach.sunrise || '06:20 AM'}
              subtext={`Sunset: ${beach.sunset || '06:00 PM'}`}
            />
          </View>
        </View>

        {/* Section D: Water Quality */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="leaf-outline" size={20} color={colors.suitable} />
            <Text style={styles.sectionHeaderTitle}>Water Quality Status</Text>
          </View>
          <View style={styles.waterQualityRow}>
            <View style={styles.wqBadge}>
              <Ionicons name="checkmark-done-circle" size={22} color={colors.suitable} />
              <Text style={styles.wqBadgeText}>{beach.waterQuality?.status || 'Good'}</Text>
            </View>
            <View style={styles.wqDemoPill}>
              <Text style={styles.wqDemoPillText}>Simulated Reading</Text>
            </View>
          </View>
          <Text style={styles.wqNote}>
            {beach.waterQuality?.note || 'Water quality reflects clarity and demonstration bacterial grading. Live monitoring will be implemented via coastal environmental sensors in future development phases.'}
          </Text>
        </View>

        {/* Section E: Last Updated Timestamp */}
        <View style={styles.timestampCard}>
          <View style={styles.timestampRow}>
            <Ionicons name="time-outline" size={16} color={colors.muted} />
            <Text style={styles.timestampTitle}>Last Data Ingestion:</Text>
            <Text style={styles.timestampVal}>{beach.lastUpdated}</Text>
          </View>
          <Text style={styles.timestampNotice}>
            Prototype data refreshed periodically for academic evaluation purposes only.
          </Text>
        </View>

        {/* Section F: Official Safety Disclaimer */}
        <View style={styles.safetyDisclaimerCard}>
          <View style={styles.disclaimerHeaderRow}>
            <Ionicons name="warning" size={24} color={colors.notSuitable} />
            <Text style={styles.disclaimerTitle}>Safety Advisory & Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerBody}>
            CoastSafe India is an informational academic prototype. Coastal sea states, rip currents, and meteorological phenomena can change unexpectedly within minutes.
            {'\n\n'}
            Always follow flags and warnings posted by coastal police, lifeguards, NDMA, and local port authorities. Never swim in isolated or red-flagged beach zones.
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.88}
        >
          <Ionicons name="chevron-back" size={18} color={colors.white} />
          <Text style={styles.returnBtnText}>Back to Beach List</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    width: width,
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 10,
  },
  navCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 58, 91, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stateChipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  heroBottomText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  heroDistanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  heroDistanceText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.turquoiseSoft,
    marginTop: 4,
    fontWeight: '500',
  },
  demoBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.cautionSoft,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FCD34D',
    gap: 10,
  },
  demoBannerContent: {
    flex: 1,
  },
  demoBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 2,
  },
  demoBannerDesc: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    padding: 16,
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
  },
  safetyNotesBox: {
    marginTop: 10,
    backgroundColor: colors.foam,
    padding: 10,
    borderRadius: 10,
  },
  safetyNotesHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 4,
  },
  safetyNoteItem: {
    fontSize: 11,
    color: colors.ink,
    lineHeight: 16,
  },
  suitabilityCardsList: {
    gap: 10,
  },
  activityCard: {
    backgroundColor: colors.foam,
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityTitleWrap: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  activitySub: {
    fontSize: 10,
    color: colors.muted,
  },
  activityExplanation: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  factorsList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 4,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  factorText: {
    fontSize: 11,
    color: colors.ink,
  },
  factorLabel: {
    fontWeight: '700',
  },
  paramsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  waterQualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wqBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.suitable,
  },
  wqDemoPill: {
    backgroundColor: colors.turquoiseSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  wqDemoPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.ocean,
  },
  wqNote: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  timestampCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  timestampTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  timestampVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
  },
  timestampNotice: {
    fontSize: 11,
    color: colors.muted,
    fontStyle: 'italic',
  },
  safetyDisclaimerCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: colors.notSuitableSoft,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 5,
    borderLeftColor: colors.notSuitable,
    borderWidth: 1,
    borderColor: colors.notSuitable + '30',
  },
  disclaimerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.notSuitable,
  },
  disclaimerBody: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
  },
  returnBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: colors.ocean,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    ...shadow,
  },
  returnBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  notFoundWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 12,
    marginBottom: 20,
  },
});

