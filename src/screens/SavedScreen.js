import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BeachCard from '../components/BeachCard';
import { useApp } from '../context/AppContext';
import { getBeaches, getSavedBeaches } from '../services/beachService';

export default function SavedScreen({ navigation }) {
  const { favorites, isFavorite, toggleFavorite } = useApp();
  const [beaches, setBeaches] = useState([]);
  useEffect(() => {
    let active = true;
    getBeaches().then(({ beaches: items }) => { if (active) setBeaches(items); });
    return () => { active = false; };
  }, []);
  const savedBeaches = useMemo(
    () => getSavedBeaches(beaches, favorites),
    [beaches, favorites],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={styles.header}>
        <Text style={styles.title}>Saved beaches</Text>
        <Text style={styles.subtitle}>Your favourite places along the coast</Text>
      </View>
      <FlatList
        data={savedBeaches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BeachCard
            beach={item}
            onPress={() => navigation.navigate('BeachDetail', { beach: item })}
            isFavorite={isFavorite(item.id)}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={savedBeaches.length ? styles.listContent : styles.emptyList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={(
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={30} color="#0B3A5B" />
            </View>
            <Text style={styles.emptyTitle}>No saved beaches yet</Text>
            <Text style={styles.emptyText}>Browse beaches and tap the heart to keep a place here.</Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('Beaches')}>
              <Text style={styles.browseButtonText}>Browse beaches</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#0B3A5B' },
  subtitle: { marginTop: 3, fontSize: 13, color: '#64748b' },
  listContent: { paddingTop: 4, paddingBottom: 24 },
  emptyList: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 48 },
  emptyState: { alignItems: 'center' },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e7f2f8', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#122433' },
  emptyText: { marginTop: 6, maxWidth: 280, fontSize: 14, lineHeight: 20, color: '#5C7284', textAlign: 'center' },
  browseButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18, backgroundColor: '#0B3A5B', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
  browseButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
});
