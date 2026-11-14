import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadow } from '../theme';
import { useApp } from '../context/AppContext';

const RECREATIONAL_SPORTS = [
  { id: 'swimming', label: 'Swimming', icon: 'water-outline' },
  { id: 'surfing', label: 'Surfing', icon: 'boat-outline' },
  { id: 'boating', label: 'Boating', icon: 'navigate-outline' },
];

export default function ProfileScreen({ navigation }) {
  const {
    profile,
    toggleActivity,
    notificationPrefs,
    setNotificationPref,
    locationLabel,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const selectedActivities = profile?.activities || ['swimming', 'boating'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.oceanDeep} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card with Coastal Gradient */}
        <LinearGradient
          colors={[colors.oceanDeep, colors.ocean, '#0077B6']}
          style={styles.profileHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={42} color={colors.ocean} />
            </View>
            <View style={styles.onlineBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.white} />
            </View>
          </View>

          <Text style={styles.profileName}>{profile?.name || 'Guest Explorer'}</Text>
          <Text style={styles.profileEmail}>Location: {locationLabel}</Text>

          <View style={styles.phaseBadge}>
            <Ionicons name="flask-outline" size={12} color={colors.turquoiseSoft} />
            <Text style={styles.phaseBadgeText}>Guest profile · saved on this device</Text>
          </View>
        </LinearGradient>

        <View style={styles.contentPadding}>
          {/* Section: Preferred Recreational Activities */}
          <View style={styles.cardSection}>
            <View style={styles.cardHeader}>
              <Ionicons name="fitness-outline" size={20} color={colors.ocean} />
              <View>
                <Text style={styles.cardTitle}>Preferred Coastal Activities</Text>
                <Text style={styles.cardSubtitle}>
                  Tailor safety alerts to your primary recreational sports
                </Text>
              </View>
            </View>

            <View style={styles.sportsRow}>
              {RECREATIONAL_SPORTS.map((sport) => {
                const isSelected = selectedActivities.includes(sport.id);
                return (
                  <TouchableOpacity
                    key={sport.id}
                    style={[styles.sportTile, isSelected && styles.sportTileActive]}
                    onPress={() => toggleActivity(sport.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={sport.icon}
                      size={22}
                      color={isSelected ? colors.white : colors.ocean}
                    />
                    <Text
                      style={[
                        styles.sportTileText,
                        isSelected && styles.sportTileTextActive,
                      ]}
                    >
                      {sport.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={10} color={colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Preferences are stored locally; push delivery is not connected. */}
          <View style={styles.cardSection}>
            <View style={styles.cardHeader}>
              <Ionicons name="notifications-outline" size={20} color={colors.ocean} />
              <View>
                <Text style={styles.cardTitle}>Notification Preferences</Text>
                <Text style={styles.cardSubtitle}>
                  Saved on this device. Automatic remote alert delivery is not connected.
                </Text>
              </View>
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleLabel}>Local notification previews</Text>
                <Text style={styles.toggleDesc}>Show a preview when you save an alert on this device</Text>
              </View>
              <Switch
                value={notificationPrefs?.enabled !== false}
                onValueChange={(val) => setNotificationPref('enabled', val)}
                trackColor={{ false: colors.line, true: colors.teal }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleLabel}>Critical alerts</Text>
                <Text style={styles.toggleDesc}>Allow saved critical alerts in local notification previews</Text>
              </View>
              <Switch
                value={notificationPrefs?.critical !== false}
                onValueChange={(val) => setNotificationPref('critical', val)}
                trackColor={{ false: colors.line, true: colors.teal }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleLabel}>Warnings</Text>
                <Text style={styles.toggleDesc}>Allow saved warning alerts in local notification previews</Text>
              </View>
              <Switch
                value={notificationPrefs?.warning !== false}
                onValueChange={(val) => setNotificationPref('warning', val)}
                trackColor={{ false: colors.line, true: colors.teal }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleLabel}>Information notes</Text>
                <Text style={styles.toggleDesc}>Allow saved information alerts in local notification previews</Text>
              </View>
              <Switch
                value={notificationPrefs?.information === true}
                onValueChange={(val) => setNotificationPref('information', val)}
                trackColor={{ false: colors.line, true: colors.teal }}
                thumbColor={colors.white}
              />
            </View>
          </View>

          <View style={styles.cardSection}>
            <View style={styles.notificationHeader}>
              <View><Text style={styles.cardTitle}>In-app notifications</Text><Text style={styles.cardSubtitle}>Items saved on this device</Text></View>
              <TouchableOpacity onPress={markAllNotificationsRead} accessibilityRole="button"><Text style={styles.markRead}>Mark all read</Text></TouchableOpacity>
            </View>
            {(notifications || []).slice(0, 6).map((item) => (
              <TouchableOpacity key={item.id} style={[styles.notificationEntry, !item.read && styles.notificationUnread]} onPress={() => markNotificationRead(item.id)} accessibilityRole="button">
                <Ionicons name="notifications-outline" size={17} color={colors.teal} />
                <View style={{ flex: 1 }}><Text style={styles.notificationTitle}>{item.title}</Text><Text style={styles.notificationBody} numberOfLines={2}>{item.body}</Text></View>
                <Text style={styles.notificationDemo}>{item.isDemo === false ? 'DB' : 'DEMO'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section: About CoastSafe India */}
          <View style={styles.cardSection}>
            <TouchableOpacity
              style={styles.aboutLink}
              onPress={() => navigation.navigate('About')}
              activeOpacity={0.75}
              accessibilityRole="button"
            >
              <View style={styles.aboutLinkIcon}>
                <Ionicons name="information-circle-outline" size={21} color={colors.ocean} />
              </View>
              <View style={styles.aboutLinkText}>
                <Text style={styles.cardTitle}>About CoastSafe India</Text>
                <Text style={styles.cardSubtitle}>Project purpose and data note</Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Section: Safety Disclaimer */}
          <View style={styles.disclaimerSection}>
            <View style={styles.disclaimerHeader}>
              <Ionicons name="shield-alert" size={22} color={colors.notSuitable} />
              <Text style={styles.disclaimerTitle}>Academic Safety Disclaimer</Text>
            </View>
            <Text style={styles.disclaimerText}>
              This application is an educational prototype. With a connected server, it shows verified database assessments and separately labelled model forecasts. Demo or offline mode uses clearly labelled sample conditions and alerts.
              {'\n\n'}
              Always obey official advisories from the National Disaster Management Authority (NDMA), Indian Coast Guard, and local lifeguard patrols.
            </Text>
          </View>

          {/* App Version Info */}
          <View style={styles.versionFooter}>
            <Text style={styles.versionTitle}>CoastSafe India</Text>
            <Text style={styles.versionNumber}>v1.0.0-prototype (Phase 1 Evaluation Build)</Text>
            <Text style={styles.versionTech}>Expo React Native • Indian Ocean Coastal Safety</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  profileHero: {
    paddingTop: 24,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.suitable,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  profileEmail: {
    fontSize: 12,
    color: colors.turquoiseSoft,
    marginTop: 2,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  phaseBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardSection: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
  },
  aboutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  markRead: { color: colors.teal, fontSize: 11, fontWeight: '700' },
  notificationEntry: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 10, borderRadius: 10, backgroundColor: colors.foam, marginTop: 6 },
  notificationUnread: { borderLeftWidth: 3, borderLeftColor: colors.teal },
  notificationTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  notificationBody: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
  notificationDemo: { color: colors.demo, fontSize: 9, fontWeight: '800' },
  aboutLinkIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.infoSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aboutLinkText: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  cardSubtitle: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
  sportsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  sportTile: {
    flex: 1,
    backgroundColor: colors.foam,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.line,
    position: 'relative',
  },
  sportTileActive: {
    backgroundColor: colors.ocean,
    borderColor: colors.ocean,
  },
  sportTileText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ocean,
    marginTop: 6,
  },
  sportTileTextActive: {
    color: colors.white,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  toggleTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  toggleDesc: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 15,
  },
  aboutBody: {
    fontSize: 12,
    color: colors.ink,
    lineHeight: 18,
    marginBottom: 12,
  },
  roadmapBox: {
    backgroundColor: colors.foam,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  roadmapHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ocean,
    marginBottom: 6,
  },
  roadmapItem: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 17,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
    color: colors.ink,
  },
  disclaimerSection: {
    backgroundColor: colors.notSuitableSoft,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderLeftWidth: 5,
    borderLeftColor: colors.notSuitable,
    borderWidth: 1,
    borderColor: colors.notSuitable + '30',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.notSuitable,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#7F1D1D',
    lineHeight: 17,
  },
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 3,
  },
  versionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ocean,
  },
  versionNumber: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
  },
  versionTech: {
    fontSize: 10,
    color: colors.muted,
  },
});

