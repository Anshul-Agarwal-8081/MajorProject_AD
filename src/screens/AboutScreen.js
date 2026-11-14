import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const PURPOSE_POINTS = [
  'Make beach information easier for visitors to understand.',
  'Show verified database records when available and clearly marked demo data otherwise.',
  'Encourage people to follow lifeguards and official local advisories.',
];

export default function AboutScreen({ navigation }) {
  const { dataSource, apiError } = useApp();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={21} color="#0B3A5B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="water" size={30} color="#ffffff" />
          </View>
          <Text style={styles.title}>CoastSafe India</Text>
          <Text style={styles.tagline}>A simple coastal safety companion</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Why this project exists</Text>
          <Text style={styles.body}>
            CoastSafe India is an academic project exploring how beach details, safety notes, and coastal alerts can be presented clearly to people visiting India’s shores.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>What you can explore</Text>
          {PURPOSE_POINTS.map((point) => (
            <View key={point} style={styles.pointRow}>
              <Ionicons name="checkmark-circle" size={18} color="#0E7C86" />
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={20} color="#8A5A00" />
          <Text style={styles.noticeText}>
            {dataSource === 'api'
              ? 'Connected to the CoastSafe database. Verified environmental and suitability records are shown only when available; the separate Open-Meteo forecast is a model, not an official warning. Always follow official advisories and local lifeguards.'
              : 'Demo or offline mode is active. Sample conditions and alerts are not live safety information. Always follow official advisories and local lifeguards.'}
          </Text>
        </View>
        {apiError ? <Text style={styles.connectionNote}>{apiError}</Text> : null}
        <Text style={styles.version}>CoastSafe India · Academic project</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#e7f2f8', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#122433' },
  headerSpacer: { width: 38 },
  content: { padding: 16, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingVertical: 28, marginBottom: 16, borderRadius: 18, backgroundColor: '#0B3A5B' },
  logo: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#0E7C86', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 23, fontWeight: '800', color: '#ffffff' },
  tagline: { marginTop: 5, fontSize: 14, color: '#d4e9f3' },
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e3edf3' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#122433', marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 21, color: '#5C7284' },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginTop: 8 },
  pointText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#5C7284' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, backgroundColor: '#FFF6E5', marginTop: 2 },
  noticeText: { flex: 1, fontSize: 13, lineHeight: 19, color: '#72501b' },
  connectionNote: { marginTop: 8, color: '#72501b', fontSize: 12, lineHeight: 17 },
  version: { marginTop: 20, textAlign: 'center', fontSize: 12, color: '#8293a1' },
});
