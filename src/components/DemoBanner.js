// src/components/DemoBanner.js
// ---------------------------------------------------------
// A small yellow warning banner shown on screens that display
// suitability or ocean data. It reminds the user that all
// values are sample data and NOT real safety advice.
//
// Usage: just drop <DemoBanner /> anywhere in your screen.
// ---------------------------------------------------------

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DemoBanner() {
  return (
    <View style={styles.banner}>
      <Ionicons name="information-circle-outline" size={16} color="#92400e" />
      <Text style={styles.text}>
        {' '}Sample data only — not real-time safety advice
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',   // light yellow
    borderColor: '#fcd34d',       // golden border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  text: {
    color: '#92400e',   // dark amber text
    fontSize: 13,
    flex: 1,
  },
});

