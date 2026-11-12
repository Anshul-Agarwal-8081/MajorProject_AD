import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, STATUS_META } from '../theme';

export default function SuitabilityBadge({ status, size = 'medium', showDot = true }) {
  const meta = STATUS_META[status] || {
    label: status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : 'Unknown',
    color: colors.muted,
    soft: colors.foam,
  };

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: meta.soft,
          borderColor: meta.color + '40',
          paddingHorizontal: isSmall ? 6 : isLarge ? 12 : 9,
          paddingVertical: isSmall ? 3 : isLarge ? 6 : 4,
        },
      ]}
    >
      {showDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: meta.color,
              width: isSmall ? 5 : isLarge ? 8 : 6,
              height: isSmall ? 5 : isLarge ? 8 : 6,
              borderRadius: isSmall ? 3 : isLarge ? 4 : 3,
            },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: meta.color,
            fontSize: isSmall ? 10 : isLarge ? 13 : 11,
          },
        ]}
      >
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    marginRight: 5,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

