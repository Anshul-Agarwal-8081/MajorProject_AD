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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const statusLook = {
  Suitable: { text: '#15803d', bg: '#dcfce7' },
  Caution: { text: '#b45309', bg: '#fef3c7' },
  'Not Suitable': { text: '#b91c1c', bg: '#fee2e2' },
};

const activities = [
  { key: 'swimming', label: 'Swimming', icon: 'water-outline' },
  { key: 'surfing', label: 'Surfing', icon: 'flag-outline' },
  { key: 'boating', label: 'Boating', icon: 'boat-outline' },
];

const facilityIcon = {
  Lifeguards: 'shield-checkmark-outline',
  Parking: 'car-outline',
  Washrooms: 'business-outline',
  Showers: 'water-outline',
  'Food stalls': 'restaurant-outline',
  'First aid': 'medkit-outline',
  'Water sports': 'boat-outline',
  'Changing rooms': 'shirt-outline',
  'Boat rides': 'boat-outline',
  Promenade: 'walk-outline',
};

// Same few tips on every beach. They are general advice, not a forecast.
const visitorTips = [
  {
    title: 'Stay where a lifeguard can see you',
    text: 'If flags are out, swim between them. If there is no flagged area, stay in shallow water and do not swim alone.',
  },
  {
    title: 'If a rip pulls you out',
    text: 'Do not swim straight at the beach. Swim along the shore until the pull drops, then come in with the waves.',
  },
  {
    title: 'Watch children in the wash',
    text: 'A small shore break can knock a child over. Stay close enough to reach them.',
  },
  {
    title: 'Ask before you go in',
    text: 'Wind and tide change through the day. A lifeguard or local boatman will know more than this screen.',
  },
];

function StatusRow({ icon, label, status }) {
  const look = statusLook[status] || { text: '#64748b', bg: '#f1f5f9' };

  return (
    <View style={styles.statusRow}>
      <Ionicons name={icon} size={18} color="#475569" />
      <Text style={styles.activityName}>{label}</Text>
      <View style={[styles.badge, { backgroundColor: look.bg }]}>
        <Text style={[styles.badgeText, { color: look.text }]}>{status || 'Unknown'}</Text>
      </View>
    </View>
  );
}

export default function BeachDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const beach = route.params?.beach;
  const { isFavorite, toggleFavorite } = useApp();

  if (!beach) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Beach not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.missingLink}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const facilities = beach.facilities || [];
  const safetyNotes = beach.safety || [];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: beach.image }} style={styles.hero} />
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 8 }]}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { top: insets.top + 8 }]}
            onPress={() => toggleFavorite(beach.id)}
            accessibilityRole="button"
            accessibilityLabel={`${isFavorite(beach.id) ? 'Remove' : 'Save'} ${beach.name} ${isFavorite(beach.id) ? 'from' : 'to'} saved beaches`}
          >
            <Ionicons name={isFavorite(beach.id) ? 'heart' : 'heart-outline'} size={22} color={isFavorite(beach.id) ? '#fecaca' : '#fff'} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{beach.name}</Text>
          <View style={styles.stateRow}>
            <Ionicons name="location-outline" size={15} color="#64748b" />
            <Text style={styles.state}>{beach.state}</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{beach.description}</Text>

          <Text style={styles.sectionTitle}>Facilities</Text>
          <Text style={styles.sectionHint}>From the sample record for this beach.</Text>
          {facilities.length === 0 ? (
            <Text style={styles.emptyLine}>Nothing listed for this beach.</Text>
          ) : (
            <View style={styles.chipWrap}>
              {facilities.map((item) => (
                <View key={item} style={styles.chip}>
                  <Ionicons
                    name={facilityIcon[item] || 'checkmark-circle-outline'}
                    size={14}
                    color="#0B3A5B"
                  />
                  <Text style={styles.chipText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.sectionTitle}>Safety information</Text>
          {safetyNotes.map((note) => (
            <View key={note} style={styles.noteRow}>
              <View style={styles.noteDot} />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Sample suitability</Text>
          <View style={styles.demoBox}>
            <Ionicons name="information-circle-outline" size={18} color="#92400e" />
            <Text style={styles.demoText}>
              Suitable, Caution and Not Suitable are demonstration data for this
              college prototype. They are not a real-time safety assessment, and
              they should not be used to decide whether the water is safe.
            </Text>
          </View>

          <View style={styles.statusCard}>
            {activities.map((activity) => (
              <StatusRow
                key={activity.key}
                icon={activity.icon}
                label={activity.label}
                status={beach[activity.key]}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Tips for visitors</Text>
          {visitorTips.map((tip) => (
            <View key={tip.title} style={styles.tipCard}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  hero: {
    width: '100%',
    height: 240,
    backgroundColor: '#cbd5e1',
  },
  backBtn: {
    position: 'absolute',
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    padding: 8,
  },
  saveBtn: {
    position: 'absolute',
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    padding: 8,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0B3A5B',
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  state: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 6,
  },
  sectionHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -4,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 18,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#1e293b',
  },
  emptyLine: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0B3A5B',
    marginTop: 7,
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#334155',
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  demoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#92400e',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1e293b',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0B3A5B',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3A5B',
    marginBottom: 10,
  },
  missingLink: {
    fontSize: 15,
    color: '#0E7C86',
  },
});
