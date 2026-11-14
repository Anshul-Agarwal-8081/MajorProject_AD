import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useCatalogue } from '../hooks/useCatalogue';
import BeachCard from '../components/BeachCard';
import SearchBar from '../components/SearchBar';

const ACTIVITIES_LIST = [
  { id: 'all', label: 'All Activities' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'surfing', label: 'Surfing' },
  { id: 'boating', label: 'Boating' },
];

const SUITABILITY_LIST = [
  { id: 'all', label: 'All Statuses' },
  { id: 'suitable', label: 'Suitable' },
  { id: 'caution', label: 'Caution' },
  { id: 'notSuitable', label: 'Not Suitable' },
];

const SORT_OPTIONS = [
  { id: 'distance', label: 'Nearest' },
  { id: 'suitability', label: 'Suitability' },
  { id: 'name', label: 'A-Z' },
  { id: 'waves', label: 'Wave Height' },
];

export default function ExploreScreen({ route, navigation }) {
  const initialSearch = route.params?.initialSearch || '';
  const initialActivity = route.params?.initialActivity || 'all';
  const initialSuitability = route.params?.initialSuitability || 'all';

  const [query, setQuery] = useState(initialSearch);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState(initialActivity);
  const [selectedSuitability, setSelectedSuitability] = useState(initialSuitability);
  const [selectedSort, setSelectedSort] = useState('distance');

  // Hook into project's filter engine
  const { catalogue, filtered } = useCatalogue({
    query,
    state: selectedState,
    activity: selectedActivity,
    suitability: selectedSuitability,
    sort: selectedSort,
  });
  const statesList = ['All', ...new Set(catalogue.map((beach) => beach.state).filter(Boolean).sort((a, b) => a.localeCompare(b)))];

  const resetFilters = () => {
    setQuery('');
    setSelectedState('All');
    setSelectedActivity('all');
    setSelectedSuitability('all');
    setSelectedSort('distance');
  };

  const hasActiveFilters =
    query.length > 0 ||
    selectedState !== 'All' ||
    selectedActivity !== 'all' ||
    selectedSuitability !== 'all' ||
    selectedSort !== 'distance';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.foam} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerTitle}>Explore Coastal India</Text>
            <Text style={styles.headerSubtitle}>
              Discover beaches by safety, state, or marine activity
            </Text>
          </View>
          {hasActiveFilters && (
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Ionicons name="refresh-outline" size={14} color={colors.teal} />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Local Search Bar */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Filter by beach, city or state..."
        />
      </View>

      {/* Filter Chips Bar */}
      <View style={styles.filterSection}>
        {/* State Filter Chips */}
        <View style={styles.filterRow}>
          <Text style={styles.filterCategoryLabel}>State:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalPills}
          >
            {statesList.map((st) => {
              const isSelected = selectedState === st;
              return (
                <TouchableOpacity
                  key={st}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setSelectedState(st)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {st}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Activity Filter Chips */}
        <View style={styles.filterRow}>
          <Text style={styles.filterCategoryLabel}>Sport:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalPills}
          >
            {ACTIVITIES_LIST.map((act) => {
              const isSelected = selectedActivity === act.id;
              return (
                <TouchableOpacity
                  key={act.id}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setSelectedActivity(act.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {act.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Suitability Filter Chips */}
        <View style={styles.filterRow}>
          <Text style={styles.filterCategoryLabel}>Safety:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalPills}
          >
            {SUITABILITY_LIST.map((suit) => {
              const isSelected = selectedSuitability === suit.id;
              return (
                <TouchableOpacity
                  key={suit.id}
                  style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  onPress={() => setSelectedSuitability(suit.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                    {suit.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Sorting Chips */}
        <View style={styles.filterRow}>
          <Text style={styles.filterCategoryLabel}>Sort:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalPills}
          >
            {SORT_OPTIONS.map((opt) => {
              const isSelected = selectedSort === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.sortPill, isSelected && styles.sortPillActive]}
                  onPress={() => setSelectedSort(opt.id)}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={12} color={colors.white} style={{ marginRight: 3 }} />
                  )}
                  <Text style={[styles.sortPillText, isSelected && styles.sortPillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Results Count Banner */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCountText}>
          Showing <Text style={styles.resultsCountHighlight}>{filtered.length}</Text> coastal locations
        </Text>
        <View style={styles.demoTag}>
          <Ionicons name="flask-outline" size={11} color={colors.muted} />
          <Text style={styles.demoTagText}>Demo Prototype</Text>
        </View>
      </View>

      {/* Beach Cards List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BeachCard
            beach={item}
            variant="compact"
            preferredActivity={selectedActivity === 'all' ? 'swimming' : selectedActivity}
            onPress={() => navigation.navigate('BeachDetail', { beach: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search" size={40} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>No Matching Beaches Found</Text>
            <Text style={styles.emptyDesc}>
              Try adjusting your search terms or clearing your state / activity filters.
            </Text>
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={resetFilters}>
              <Text style={styles.clearFiltersBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: colors.foam,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.turquoiseSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ocean,
  },
  filterSection: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterCategoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    width: 52,
    paddingLeft: 16,
  },
  horizontalPills: {
    paddingRight: 16,
    gap: 6,
  },
  filterPill: {
    backgroundColor: colors.foam,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterPillActive: {
    backgroundColor: colors.ocean,
    borderColor: colors.ocean,
  },
  filterPillText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sortPillActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  sortPillText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
  },
  sortPillTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCountText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
  },
  resultsCountHighlight: {
    color: colors.ocean,
    fontWeight: '800',
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  demoTagText: {
    fontSize: 10,
    color: colors.muted,
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  clearFiltersBtn: {
    backgroundColor: colors.ocean,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearFiltersBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});

