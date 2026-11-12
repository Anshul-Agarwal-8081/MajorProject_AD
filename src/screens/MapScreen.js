import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow, STATUS_META } from '../theme';
import { useCatalogue } from '../hooks/useCatalogue';
import SuitabilityBadge from '../components/SuitabilityBadge';

const { width, height } = Dimensions.get('window');

const MAP_LEGEND_ITEMS = [
  { label: 'Suitable', color: colors.suitable, desc: 'Safe for recreation' },
  { label: 'Caution', color: colors.caution, desc: 'Moderate wave/current' },
  { label: 'Not Suitable', color: colors.notSuitable, desc: 'High hazard risk' },
  { label: 'Insufficient Data', color: colors.insufficient, desc: 'Unverified sensor' },
];

export default function MapScreen({ navigation }) {
  const { catalogue } = useCatalogue();
  const [selectedBeach, setSelectedBeach] = useState(catalogue[0] || null);
  const [viewMode, setViewMode] = useState('radar'); // 'radar' | 'list'

  const handleMarkerSelect = (beach) => {
    setSelectedBeach(beach);
  };

  const handleOpenDetail = (beach) => {
    navigation.navigate('BeachDetail', { beachId: beach.id });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.oceanDeep} />

      {/* Top Floating Header */}
      <SafeAreaView edges={['top']} style={styles.topHeaderOverlay}>
        <View style={styles.headerBar}>
          <View>
            <View style={styles.headerTitleRow}>
              <Ionicons name="map" size={20} color={colors.turquoiseSoft} />
              <Text style={styles.headerTitle}>Coastal India Map</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              {catalogue.length} Monitored Coastal Stations
            </Text>
          </View>

          {/* View Mode Toggle Pill */}
          <View style={styles.togglePillGroup}>
            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'radar' && styles.toggleBtnActive]}
              onPress={() => setViewMode('radar')}
            >
              <Ionicons
                name="locate"
                size={14}
                color={viewMode === 'radar' ? colors.white : colors.turquoiseSoft}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  viewMode === 'radar' && styles.toggleBtnTextActive,
                ]}
              >
                Radar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons
                name="list"
                size={14}
                color={viewMode === 'list' ? colors.white : colors.turquoiseSoft}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  viewMode === 'list' && styles.toggleBtnTextActive,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Main Map View Area */}
      {viewMode === 'radar' ? (
        /* Coastal Radar & Interactive Schematic Map */
        <View style={styles.radarContainer}>
          <View style={styles.radarGridRing1} />
          <View style={styles.radarGridRing2} />
          <View style={styles.radarGridRing3} />
          <View style={styles.radarCrosshairH} />
          <View style={styles.radarCrosshairV} />

          <Text style={styles.arabianSeaLabel}>Arabian Sea</Text>
          <Text style={styles.bayOfBengalLabel}>Bay of Bengal</Text>
          <Text style={styles.indianOceanLabel}>Indian Ocean</Text>

          <ScrollView
            contentContainerStyle={styles.schematicCanvas}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.coastOutlineCard}>
              <View style={styles.coastOutlineHeader}>
                <Ionicons name="compass-outline" size={18} color={colors.turquoise} />
                <Text style={styles.coastOutlineTitle}>Indian Coastline Geo-Stations</Text>
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>SIMULATED GPS</Text>
                </View>
              </View>

              <Text style={styles.coastOutlineSub}>
                Tap any station marker along the western, eastern, and island coastlines to inspect conditions.
              </Text>

              <View style={styles.stationsList}>
                {catalogue.map((beach) => {
                  const status = beach.assessment?.swimming?.status || 'suitable';
                  const statusMeta = STATUS_META[status] || STATUS_META.suitable;
                  const isSelected = selectedBeach?.id === beach.id;

                  return (
                    <TouchableOpacity
                      key={beach.id}
                      style={[
                        styles.stationMarkerItem,
                        isSelected && styles.stationMarkerItemSelected,
                      ]}
                      onPress={() => handleMarkerSelect(beach)}
                      activeOpacity={0.85}
                    >
                      <View
                        style={[
                          styles.stationStatusDot,
                          {
                            backgroundColor: statusMeta.color,
                          },
                        ]}
                      >
                        <Ionicons name="water" size={10} color={colors.white} />
                      </View>

                      <View style={styles.stationTexts}>
                        <Text style={styles.stationName} numberOfLines={1}>
                          {beach.name}
                        </Text>
                        <Text style={styles.stationLocation}>
                          {beach.city}, {beach.state}
                        </Text>
                      </View>

                      <SuitabilityBadge status={status} size="small" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        /* Full List Mode */
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          <Text style={styles.listHeaderTitle}>All Monitored Beaches</Text>
          {catalogue.map((beach) => {
            const status = beach.assessment?.swimming?.status || 'suitable';
            const isSelected = selectedBeach?.id === beach.id;
            const distanceText = beach.distanceKm != null ? `${Number(beach.distanceKm).toFixed(1)} km` : 'Coastal India';

            return (
              <TouchableOpacity
                key={beach.id}
                style={[
                  styles.beachListCard,
                  isSelected && styles.beachListCardSelected,
                ]}
                onPress={() => handleMarkerSelect(beach)}
                activeOpacity={0.88}
              >
                <Image source={{ uri: beach.image }} style={styles.beachListImage} />
                <View style={styles.beachListInfo}>
                  <Text style={styles.beachListName}>{beach.name}</Text>
                  <Text style={styles.beachListLoc}>
                    {beach.city}, {beach.state}
                  </Text>
                  <View style={styles.beachListMeta}>
                    <SuitabilityBadge status={status} size="small" />
                    <Text style={styles.beachListDist}>{distanceText}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.beachListArrow}
                  onPress={() => handleOpenDetail(beach)}
                >
                  <Ionicons name="arrow-forward-circle" size={26} color={colors.teal} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Floating Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendHeader}>Marker Legend:</Text>
        <View style={styles.legendItemsRow}>
          {MAP_LEGEND_ITEMS.map((item, idx) => (
            <View key={idx} style={styles.legendPill}>
              <View style={[styles.legendColorDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabelText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Selected Beach Bottom Preview Card */}
      {selectedBeach && (
        <View style={styles.bottomCardWrapper}>
          <View style={styles.bottomCard}>
            <Image source={{ uri: selectedBeach.image }} style={styles.bottomCardImage} />

            <View style={styles.bottomCardContent}>
              <View style={styles.bottomCardTopRow}>
                <SuitabilityBadge
                  status={selectedBeach.assessment?.swimming?.status || 'suitable'}
                  size="small"
                />
                <Text style={styles.bottomCardDistance}>
                  {selectedBeach.distanceKm != null
                    ? `${Number(selectedBeach.distanceKm).toFixed(1)} km away`
                    : 'Coastal India'}
                </Text>
              </View>

              <Text style={styles.bottomCardTitle} numberOfLines={1}>
                {selectedBeach.name}
              </Text>
              <Text style={styles.bottomCardSub} numberOfLines={1}>
                {selectedBeach.city}, {selectedBeach.state}
              </Text>

              <View style={styles.bottomCardParams}>
                <View style={styles.bottomParamChip}>
                  <Ionicons name="water-outline" size={11} color={colors.ocean} />
                  <Text style={styles.bottomParamText}>
                    Wave: {selectedBeach.conditions?.waveHeightM != null ? `${selectedBeach.conditions.waveHeightM}m` : '0.8m'}
                  </Text>
                </View>
                <View style={styles.bottomParamChip}>
                  <Ionicons name="speedometer-outline" size={11} color={colors.teal} />
                  <Text style={styles.bottomParamText}>
                    Wind: {selectedBeach.conditions?.windSpeedKmh != null ? `${selectedBeach.conditions.windSpeedKmh}k/h` : '16k/h'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewDetailActionBtn}
                onPress={() => handleOpenDetail(selectedBeach)}
                activeOpacity={0.85}
              >
                <Text style={styles.viewDetailActionText}>Inspect Full Beach Details</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2744',
  },
  topHeaderOverlay: {
    backgroundColor: 'rgba(7, 38, 60, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 20,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.turquoiseSoft,
    marginTop: 1,
  },
  togglePillGroup: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 3,
    gap: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: colors.teal,
  },
  toggleBtnText: {
    color: colors.turquoiseSoft,
    fontSize: 11,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  radarContainer: {
    flex: 1,
    backgroundColor: '#0A2540',
    position: 'relative',
    overflow: 'hidden',
  },
  radarGridRing1: {
    position: 'absolute',
    top: height * 0.15,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    borderWidth: 1,
    borderColor: 'rgba(26, 166, 166, 0.15)',
  },
  radarGridRing2: {
    position: 'absolute',
    top: height * 0.22,
    left: width * 0.25,
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    borderWidth: 1,
    borderColor: 'rgba(26, 166, 166, 0.22)',
  },
  radarGridRing3: {
    position: 'absolute',
    top: height * 0.28,
    left: width * 0.37,
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: (width * 0.26) / 2,
    borderWidth: 1,
    borderColor: 'rgba(26, 166, 166, 0.3)',
  },
  radarCrosshairH: {
    position: 'absolute',
    top: height * 0.35,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(26, 166, 166, 0.15)',
  },
  radarCrosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: width * 0.5,
    width: 1,
    backgroundColor: 'rgba(26, 166, 166, 0.15)',
  },
  arabianSeaLabel: {
    position: 'absolute',
    top: 90,
    left: 20,
    color: 'rgba(216, 244, 243, 0.4)',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  bayOfBengalLabel: {
    position: 'absolute',
    top: 90,
    right: 20,
    color: 'rgba(216, 244, 243, 0.4)',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  indianOceanLabel: {
    position: 'absolute',
    bottom: 260,
    alignSelf: 'center',
    color: 'rgba(216, 244, 243, 0.3)',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
  },
  schematicCanvas: {
    padding: 16,
    paddingBottom: 260,
  },
  coastOutlineCard: {
    backgroundColor: 'rgba(10, 37, 64, 0.85)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(26, 166, 166, 0.3)',
  },
  coastOutlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  coastOutlineTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  demoBadge: {
    backgroundColor: colors.turquoiseSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  demoBadgeText: {
    color: colors.ocean,
    fontSize: 9,
    fontWeight: '800',
  },
  coastOutlineSub: {
    color: colors.turquoiseSoft,
    fontSize: 11,
    marginBottom: 14,
    lineHeight: 16,
  },
  stationsList: {
    gap: 8,
  },
  stationMarkerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stationMarkerItemSelected: {
    backgroundColor: 'rgba(26, 166, 166, 0.25)',
    borderColor: colors.turquoise,
  },
  stationStatusDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stationTexts: {
    flex: 1,
  },
  stationName: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  stationLocation: {
    color: colors.turquoiseSoft,
    fontSize: 11,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  listContent: {
    padding: 16,
    paddingBottom: 260,
  },
  listHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  beachListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  beachListCardSelected: {
    borderColor: colors.teal,
    borderWidth: 2,
  },
  beachListImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  beachListInfo: {
    flex: 1,
    marginLeft: 10,
  },
  beachListName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  beachListLoc: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 4,
  },
  beachListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  beachListDist: {
    fontSize: 11,
    color: colors.ocean,
    fontWeight: '600',
  },
  beachListArrow: {
    padding: 6,
  },
  legendContainer: {
    position: 'absolute',
    top: 74,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(7, 38, 60, 0.92)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 10,
  },
  legendHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.turquoiseSoft,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  legendItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabelText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  bottomCardWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
    zIndex: 25,
  },
  bottomCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  bottomCardImage: {
    width: 100,
    height: 125,
    borderRadius: 12,
  },
  bottomCardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  bottomCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomCardDistance: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  bottomCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginTop: 2,
  },
  bottomCardSub: {
    fontSize: 11,
    color: colors.muted,
  },
  bottomCardParams: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  bottomParamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.foam,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  bottomParamText: {
    fontSize: 10,
    color: colors.ink,
    fontWeight: '600',
  },
  viewDetailActionBtn: {
    backgroundColor: colors.ocean,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  viewDetailActionText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});

