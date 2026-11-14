import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useCatalogue } from '../hooks/useCatalogue';
import { ACTIVITIES, colors, statusMeta } from '../theme';

export default function CompareScreen({ navigation }) {
  const { catalogue } = useCatalogue();
  const { compareIds, setCompareSelection } = useApp();
  const selected = useMemo(() => compareIds.map((id) => catalogue.find((beach) => beach.id === id)).filter(Boolean), [compareIds, catalogue]);
  const choose = (id) => {
    if (compareIds.includes(id)) setCompareSelection(compareIds.filter((value) => value !== id));
    else if (compareIds.length < 2) setCompareSelection([...compareIds, id]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back"><Ionicons name="arrow-back" size={22} color={colors.ocean} /></TouchableOpacity><Text style={styles.title}>Compare beaches</Text><View style={{ width: 22 }} /></View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.notice}>Choose two beaches. Suitability and conditions are labelled demonstration data.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chooser}>
          {catalogue.map((beach) => {
            const active = compareIds.includes(beach.id);
            return <TouchableOpacity key={beach.id} onPress={() => choose(beach.id)} style={[styles.chip, active && styles.chipActive]} accessibilityRole="button" accessibilityState={{ selected: active }}><Text style={[styles.chipText, active && styles.chipTextActive]}>{active ? '✓ ' : ''}{beach.name}</Text></TouchableOpacity>;
          })}
        </ScrollView>
        {selected.length === 2 ? (
          <>
            <View style={styles.beachNames}><Text style={styles.columnHead}>Information</Text>{selected.map((beach) => <Text key={beach.id} style={styles.beachName}>{beach.name}</Text>)}</View>
            <CompareRow label="Location" values={selected.map((beach) => `${beach.city}, ${beach.state}`)} />
            <CompareRow label="About" values={selected.map((beach) => beach.description || 'No description is available.')} />
            <CompareRow label="Facilities" values={selected.map((beach) => beach.facilities?.join(', ') || 'Not listed')} />
            {ACTIVITIES.map((activity) => <CompareRow key={activity.id} label={`${activity.label} (demo)`} values={selected.map((beach) => {
              const result = beach.assessment?.[activity.id];
              return result ? `${statusMeta(result.status).label}: ${result.explanation}` : 'Insufficient Data';
            })} />)}
            <CompareRow label="Wave height (demo)" values={selected.map((beach) => beach.conditions?.waveHeightM != null ? `${beach.conditions.waveHeightM} m` : 'Not available')} />
          </>
        ) : <Text style={styles.empty}>Select {2 - selected.length} more beach{selected.length === 1 ? '' : 'es'} to compare.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

function CompareRow({ label, values }) {
  return <View style={styles.row}><Text style={styles.rowLabel}>{label}</Text>{values.map((value, index) => <Text key={index} style={styles.cell}>{value}</Text>)}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.foam },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: colors.white },
  title: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 36 },
  notice: { color: colors.muted, lineHeight: 20, marginBottom: 12 },
  chooser: { gap: 8, paddingBottom: 16 },
  chip: { borderRadius: 18, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.ocean, borderColor: colors.ocean },
  chipText: { color: colors.ink, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  beachNames: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: colors.turquoiseSoft, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  columnHead: { flex: 1, color: colors.ocean, fontWeight: '700' },
  beachName: { flex: 1, color: colors.ocean, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 8, padding: 12, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
  rowLabel: { flex: 1, color: colors.ink, fontWeight: '700' },
  cell: { flex: 1, color: colors.muted, lineHeight: 19 },
  empty: { backgroundColor: colors.white, padding: 18, borderRadius: 12, color: colors.muted, lineHeight: 22 },
});
