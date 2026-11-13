// src/screens/HomeScreen.js
// ---------------------------------------------------------
// The first screen users see when they open CoastSafe India.
//
// What this screen does:
//   1. Shows an app header with the name and tagline
//   2. Shows a DemoBanner reminding users data is not real
//   3. Shows a horizontal scroll of popular beach cards
//   4. Shows 3 simple beach safety tips
//
// All data comes from src/data/beachList.js (local, no API).
// ---------------------------------------------------------

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { popularBeaches } from '../data/beachList';
import DemoBanner from '../components/DemoBanner';

// ── Safety tips shown at the bottom of the screen ──────────
// These are static educational facts, not live data
const SAFETY_TIPS = [
  {
    id: '1',
    icon: 'flag-outline',
    title: 'Understand Beach Flags',
    body: 'Red = no swimming. Yellow = swim with caution. Green = safe conditions. Always obey lifeguard flags.',
  },
  {
    id: '2',
    icon: 'water-outline',
    title: 'Escape a Rip Current',
    body: 'Stay calm. Do not fight the current. Swim parallel to the shoreline until free, then swim back to shore.',
  },
  {
    id: '3',
    icon: 'call-outline',
    title: 'Emergency Numbers',
    body: 'National Emergency: 112\nIndian Coast Guard: 1554\nTourist Helpline: 1800-111-363',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B3A5B" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── 1. App Header ───────────────────────────────── */}
        <View style={styles.header}>
          <Ionicons name="water" size={34} color="#ffffff" />
          <Text style={styles.appName}>CoastSafe India</Text>
          <Text style={styles.tagline}>Your beach safety companion</Text>
        </View>

        {/* ── 2. Demo Data Notice ──────────────────────────── */}
        <DemoBanner />

        {/* ── 3. Popular Beaches (horizontal scroll) ───────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Beaches</Text>

          {/*
            ScrollView with horizontal={true} lets cards scroll left-right.
            showsHorizontalScrollIndicator={false} hides the scrollbar.
          */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularRow}
          >
            {popularBeaches.map(beach => (
              <TouchableOpacity
                key={beach.id}
                style={styles.featuredCard}
                activeOpacity={0.85}
                // Navigate to BeachDetail, passing the full beach object
                onPress={() => navigation.navigate('BeachDetail', { beach })}
              >
                <Image
                  source={{ uri: beach.image }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName} numberOfLines={1}>
                    {beach.name}
                  </Text>
                  <Text style={styles.featuredState}>{beach.state}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── 4. Safety Tips ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beach Safety Tips</Text>

          {SAFETY_TIPS.map(tip => (
            <View key={tip.id} style={styles.tipCard}>
              <Ionicons
                name={tip.icon}
                size={22}
                color="#0B3A5B"
                style={styles.tipIcon}
              />
              <View style={styles.tipTextBox}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipBody}>{tip.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Header block at the top
  header: {
    backgroundColor: '#0B3A5B',   // dark ocean blue
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  appName: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  tagline: {
    color: '#93c5fd',   // light blue subtitle
    fontSize: 14,
    marginTop: 4,
  },

  // Generic section wrapper
  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },

  // Horizontal beach cards
  popularRow: {
    paddingRight: 16,
  },
  featuredCard: {
    width: 160,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  featuredImage: {
    width: 160,
    height: 110,
  },
  featuredInfo: {
    padding: 10,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  featuredState: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Safety tip cards
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipTextBox: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
});
