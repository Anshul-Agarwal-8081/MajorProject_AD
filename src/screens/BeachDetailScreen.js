// src/screens/BeachDetailScreen.js
// ---------------------------------------------------------
// Shows full information for one beach.
// The beach object is passed from BeachesScreen or HomeScreen
// via navigation params: navigation.navigate('BeachDetail', { beach }).
//
// What this screen shows:
//   1. Full-width beach photo with a Back button
//   2. Beach name and state
//   3. Description
//   4. Demo recreational suitability table (swim/surf/boat)
//   5. A disclaimer reminding the user the data is not real
// ---------------------------------------------------------

import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DemoBanner from '../components/DemoBanner';

// ── Colour maps for the suitability status badge ───────────
const STATUS_COLOR = {
  Safe: '#16a34a',
  Caution: '#d97706',
  'Not Safe': '#dc2626',
};
const STATUS_BG = {
  Safe: '#dcfce7',
  Caution: '#fef3c7',
  'Not Safe': '#fee2e2',
};

// ── Small helper component: one row in the suitability table ─
function SuitabilityRow({ icon, activity, status }) {
  const color = STATUS_COLOR[status] || '#6b7280';
  const bg = STATUS_BG[status] || '#f3f4f6';

  return (
    <View style={rowStyles.row}>
      <Ionicons name={icon} size={18} color="#475569" />
      <Text style={rowStyles.activity}>{activity}</Text>
      {/* Coloured badge */}
      <View style={[rowStyles.badge, { backgroundColor: bg }]}>
        <Text style={[rowStyles.badgeText, { color }]}>{status}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activity: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 10,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

// ── Main Screen ────────────────────────────────────────────
export default function BeachDetailScreen({ navigation, route }) {
  // route.params contains whatever was passed in navigate().
  // We destructure the beach object from it.
  const { beach } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── 1. Hero Image + Back Button ──────────────────── */}
        <View>
          <Image source={{ uri: beach.image }} style={styles.heroImage} />
          {/* Back button floats on top of the image */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

          {/* ── 2. Name and State ──────────────────────────── */}
          <Text style={styles.name}>{beach.name}</Text>
          <View style={styles.stateRow}>
            <Ionicons name="location-outline" size={14} color="#64748b" />
            <Text style={styles.state}> {beach.state}</Text>
          </View>

          {/* ── 3. Description ────────────────────────────── */}
          <Text style={styles.description}>{beach.description}</Text>

          {/* ── 4. Suitability Table ──────────────────────── */}
          <Text style={styles.sectionTitle}>Recreational Suitability</Text>
          <DemoBanner />

          <View style={styles.suitCard}>
            <SuitabilityRow
              icon="water-outline"
              activity="Swimming"
              status={beach.swimming}
            />
            <SuitabilityRow
              icon="boat-outline"
              activity="Surfing"
              status={beach.surfing}
            />
            <SuitabilityRow
              icon="navigate-outline"
              activity="Boating"
              status={beach.boating}
            />
          </View>

          {/* ── 5. Disclaimer ─────────────────────────────── */}
          <View style={styles.disclaimer}>
            <Ionicons name="warning-outline" size={16} color="#92400e" />
            <Text style={styles.disclaimerText}>
              {' '}These values are sample data created for academic
              demonstration. Do not use them to make real safety decisions at
              any beach.
            </Text>
          </View>

        </View>
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

  // Large photo at the top
  heroImage: {
    width: '100%',
    height: 240,
  },
  // Back arrow on top of the photo
  backButton: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    borderRadius: 20,
    padding: 8,
  },

  // Content below the photo
  content: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B3A5B',
    marginTop: 4,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  state: {
    fontSize: 13,
    color: '#64748b',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },

  // White card holding the three suitability rows
  suitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // Yellow disclaimer box at the bottom
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },
});
