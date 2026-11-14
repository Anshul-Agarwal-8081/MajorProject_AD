// src/components/DemoBanner.js
// ---------------------------------------------------------
// A small yellow warning banner shown on screens that display
// suitability or ocean data. It reminds the user that all
// values are sample data and NOT real safety advice.
//
// Usage: just drop <DemoBanner /> anywhere in your screen.
// ---------------------------------------------------------

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function DemoBanner() {
  const { dataSource, apiError, refreshCoastData } = useApp();
  const isConnected = dataSource === 'api';
  const isLoading = dataSource === 'loading';

  return (
    <View style={styles.banner}>
      <Ionicons name="information-circle-outline" size={16} color="#92400e" />
      <View style={styles.copy}>
        <Text style={styles.text}>
          {isLoading
            ? 'Connecting to CoastSafe. Local demo data is shown until the server responds.'
            : isConnected
              ? 'Beach directory is connected. Safety results appear only when verified; forecasts are labelled separately.'
              : 'DEMO MODE — sample beaches, conditions and alerts are not real-time safety advice.'}
        </Text>
        {apiError ? <Text style={styles.detail}>{apiError}</Text> : null}
        {!isConnected && !isLoading ? (
          <TouchableOpacity onPress={refreshCoastData} accessibilityRole="button">
            <Text style={styles.retry}>Retry server connection</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  copy: { flex: 1 },
  detail: { color: '#92400e', fontSize: 11, lineHeight: 15, marginTop: 3 },
  retry: { color: '#0B3A5B', fontSize: 12, fontWeight: '700', marginTop: 6 },
});

