// src/screens/BeachesScreen.js
// ---------------------------------------------------------
// Shows a searchable list of all 10 Indian beaches.
//
// How the search works (simple, no library needed):
//   - useState stores the text the user types
//   - We use JavaScript's .filter() + .includes() to find matches
//   - Every keystroke re-runs the filter — React re-renders the list
//
// All data comes from src/data/beachList.js (local, no API).
// Tap a beach card to open its detail screen.
// ---------------------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { getBeaches, searchBeaches } from '../services/beachService';
import BeachCard from '../components/BeachCard';
import DemoBanner from '../components/DemoBanner';
import { useApp } from '../context/AppContext';

export default function BeachesScreen({ navigation }) {
  // searchText is the current value of the search input
  // setSearchText updates it every time the user types a character
  const [searchText, setSearchText] = useState('');
  const [beaches, setBeaches] = useState([]);
  const { isFavorite, toggleFavorite } = useApp();

  useEffect(() => {
    let active = true;
    getBeaches().then(({ beaches: items }) => {
      if (active) setBeaches(items);
    });
    return () => { active = false; };
  }, []);

  // ── Search / filter logic ───────────────────────────────
  // We filter the full beaches array based on what the user typed.
  // .toLowerCase() makes the search case-insensitive.
  // We check if the beach NAME or STATE contains the search query.
  const filteredBeaches = searchBeaches(beaches, searchText);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* ── Screen Header ──────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.heading}>Indian Beaches</Text>
        <Text style={styles.subheading}>
          {beaches.length} beaches in demo dataset
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction} onPress={() => navigation.navigate('Explore')}>
            <Ionicons name="options-outline" size={16} color="#0B3A5B" />
            <Text style={styles.headerActionText}>Explore filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction} onPress={() => navigation.navigate('Map')}>
            <Ionicons name="map-outline" size={16} color="#0B3A5B" />
            <Text style={styles.headerActionText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Demo Data Notice ───────────────────────────────── */}
      <DemoBanner />

      {/* ── Search Bar ─────────────────────────────────────── */}
      {/*
        TextInput is a standard React Native component.
        value={searchText} and onChangeText={setSearchText} keep
        the input and state in sync (this is called "controlled input").
      */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#64748b"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by beach name or state..."
          placeholderTextColor="#94a3b8"
          value={searchText}
          onChangeText={setSearchText}
        />
        {/* Only show the clear (✕) button when there is text typed */}
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} accessibilityRole="button" accessibilityLabel="Clear beach search" hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Beach List ─────────────────────────────────────── */}
      {/*
        FlatList is React Native's efficient list component.
        It only renders items that are currently visible on screen.
        keyExtractor tells FlatList which field to use as a unique key.
        ListEmptyComponent is shown when filteredBeaches is empty.
      */}
      <FlatList
        data={filteredBeaches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BeachCard
            beach={item}
            onPress={() => navigation.navigate('BeachDetail', { beach: item })}
            isFavorite={isFavorite(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={44} color="#cbd5e1" />
            <Text style={styles.emptyText}>
              No beaches found for "{searchText}"
            </Text>
            <Text style={styles.emptyHint}>
              Try searching for a beach name or state
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Screen heading
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3A5B',
  },
  subheading: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  headerAction: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 9, backgroundColor: '#e7f2f8', paddingHorizontal: 11, paddingVertical: 8 },
  headerActionText: { fontSize: 12, fontWeight: '700', color: '#0B3A5B' },

  // Search bar container
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1e293b',
  },
  clearIcon: {
    paddingLeft: 8,
  },

  // FlatList padding
  listContent: {
    paddingVertical: 6,
    paddingBottom: 24,
  },

  // Empty state (no search results)
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  emptyHint: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});

