import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';

const SEVERITY_COLORS = {
  critical: colors.notSuitable,
  warning: colors.caution,
  advisory: colors.teal,
  info: colors.info,
  demo: colors.demo,
};

export default function AlertCard({ alert, onPress }) {
  const accentColor = SEVERITY_COLORS[alert.severity] || colors.caution;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: accentColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: accentColor + '18' }]}>
          <Ionicons name="warning-outline" size={24} color={accentColor} />
        </View>

        <View style={styles.headerTexts}>
          <View style={styles.titleBadgeRow}>
            <Text style={styles.title} numberOfLines={2}>
              {alert.title}
            </Text>
            <View style={[styles.severityBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.severityText}>{(alert.severity || 'warning').toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.regionRow}>
            <Ionicons name="location-sharp" size={13} color={colors.muted} />
            <Text style={styles.regionText} numberOfLines={1}>
              {alert.region || alert.state}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description}>{alert.description}</Text>

      {alert.action ? (
        <View style={styles.alternativeBox}>
          <Ionicons name="shield-checkmark" size={14} color={colors.teal} />
          <Text style={styles.alternativeText}>{alert.action}</Text>
        </View>
      ) : null}

      <View style={styles.footerRow}>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={12} color={colors.muted} />
          <Text style={styles.timeText}>{alert.issuedAt || 'Sample bulletin'}</Text>
        </View>

        <View style={[styles.statusTag, { backgroundColor: accentColor + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: accentColor }]} />
          <Text style={[styles.statusText, { color: accentColor }]}>Sample</Text>
        </View>
      </View>

      <View style={styles.demoTag}>
        <Ionicons name="flask-outline" size={11} color={colors.muted} />
        <Text style={styles.demoTagText}>Simulated Demonstration Record</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 5,
    ...shadow,
    borderWidth: 1,
    borderTopColor: colors.line,
    borderRightColor: colors.line,
    borderBottomColor: colors.line,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTexts: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  severityText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  regionText: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 3,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
    marginBottom: 10,
  },
  alternativeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.turquoiseSoft,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    gap: 6,
  },
  alternativeText: {
    fontSize: 11,
    color: colors.ocean,
    fontWeight: '500',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    color: colors.muted,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  demoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  demoTagText: {
    fontSize: 10,
    color: colors.muted,
    fontStyle: 'italic',
  },
});

