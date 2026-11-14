import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';

const pages = [
  { icon: 'water', title: 'Explore India’s coast', body: 'Find beach details, visitor facilities and practical safety tips.' },
  { icon: 'shield-checkmark', title: 'Check activity guidance', body: 'See sample swimming, surfing and boating assessments with reasons.' },
  { icon: 'information-circle', title: 'Know what is demo data', body: 'Conditions and alerts are examples, not live readings or official warnings.' },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const { completeOnboarding } = useApp();
  const current = pages[page];
  const finish = page === pages.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brand}><Ionicons name="water" size={22} color={colors.white} /><Text style={styles.brandText}>CoastSafe India</Text></View>
      <View style={styles.content}>
        <View style={styles.icon}><Ionicons name={current.icon} size={48} color={colors.teal} /></View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.body}>{current.body}</Text>
        <View style={styles.dots}>{pages.map((item, index) => <View key={item.title} style={[styles.dot, index === page && styles.activeDot]} />)}</View>
      </View>
      <View style={styles.actions}>
        {!finish ? <TouchableOpacity onPress={completeOnboarding} accessibilityRole="button"><Text style={styles.skip}>Skip</Text></TouchableOpacity> : <View />}
        <TouchableOpacity style={styles.next} onPress={() => (finish ? completeOnboarding() : setPage(page + 1))} accessibilityRole="button">
          <Text style={styles.nextText}>{finish ? 'Get started' : 'Continue'}</Text><Ionicons name={finish ? 'arrow-forward' : 'chevron-forward'} size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.foam, padding: 24, justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.ocean, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14 },
  brandText: { color: colors.white, fontWeight: '700' },
  content: { alignItems: 'center', paddingHorizontal: 12 },
  icon: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.turquoiseSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { color: colors.ink, fontSize: 26, fontWeight: '800', textAlign: 'center' },
  body: { color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 12 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.line },
  activeDot: { width: 24, backgroundColor: colors.teal },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 50 },
  skip: { color: colors.muted, fontWeight: '600', padding: 12 },
  next: { backgroundColor: colors.ocean, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', gap: 8, alignItems: 'center' },
  nextText: { color: colors.white, fontWeight: '700' },
});
