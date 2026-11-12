import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';

export default function OceanParamCard({
  icon,
  label,
  value,
  subtext,
  status = 'normal',
  style,
}) {
  const isAlert = status === 'alert';
  const isCaution = status === 'caution';

  return (
    <View style={[styles.card, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isAlert
              ? colors.notSuitableSoft
              : isCaution
              ? colors.cautionSoft
              : colors.turquoiseSoft,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={22}
          color={
            isAlert
              ? colors.notSuitable
              : isCaution
              ? colors.caution
              : colors.ocean
          }
        />
      </View>

      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {subtext ? (
        <Text style={styles.subtext} numberOfLines={1}>
          {subtext}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    ...shadow,
    borderWidth: 1,
    borderColor: colors.line,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
});

