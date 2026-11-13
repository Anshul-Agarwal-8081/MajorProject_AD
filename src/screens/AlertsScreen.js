import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';
import { alerts, filterAlerts } from '../data/alerts';
import AlertCard from '../components/AlertCard';

const SEVERITY_FILTERS = [
  { id: 'all', label: 'All Bulletins' },
  { id: 'warning', label: 'Warnings' },
  { id: 'critical', label: 'Critical' },
  { id: 'advisory', label: 'Advisories' },
];

export default function AlertsScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAlertModal, setSelectedAlertModal] = useState(null);

  const filteredAlerts = useMemo(() => {
    return filterAlerts(alerts, activeFilter);
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.foam} />

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.titleRow}>
              <Ionicons name="notifications" size={24} color={colors.ocean} />
              <Text style={styles.title}>Safety Alerts & Advisories</Text>
            </View>
            <Text style={styles.subtitle}>
              Coastal meteorological & oceanographic warning bulletins
            </Text>
          </View>

          <View style={styles.alertCounterBadge}>
            <Text style={styles.alertCounterText}>{alerts.length}</Text>
          </View>
        </View>

        {/* Mandatory Academic Disclaimer Banner */}
        <View style={styles.demoWarningBanner}>
          <Ionicons name="shield-alert-outline" size={20} color={colors.caution} style={{ marginTop: 1 }} />
          <View style={styles.demoWarningTextWrap}>
            <Text style={styles.demoWarningTitle}>ACADEMIC PROTOTYPE WARNING</Text>
            <Text style={styles.demoWarningBody}>
              All bulletins listed below are simulated demonstration data for university evaluation. They do not constitute official emergency announcements.
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}
        >
          {SEVERITY_FILTERS.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterPill, isSelected && styles.filterPillActive]}
                onPress={() => setActiveFilter(f.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterPillText, isSelected && styles.filterPillTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Alerts Stream */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusSummaryRow}>
          <Text style={styles.activeAdvisoriesCount}>
            {filteredAlerts.length} {filteredAlerts.length === 1 ? 'Advisory' : 'Advisories'} Active
          </Text>
          <Text style={styles.sourceLabel}>Simulated INCOIS Feed</Text>
        </View>

        {filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onPress={() => setSelectedAlertModal(alert)}
          />
        ))}

        <View style={styles.emergencyContactsCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="call" size={18} color={colors.ocean} />
            <Text style={styles.emergencyTitle}>Important Coastal Helplines (India)</Text>
          </View>
          <Text style={styles.emergencySub}>
            Emergency responders for authentic coastal distress:
          </Text>

          <View style={styles.contactRow}>
            <Text style={styles.contactName}>National Emergency Helpline:</Text>
            <Text style={styles.contactNum}>112</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactName}>Indian Coast Guard Helpline:</Text>
            <Text style={styles.contactNum}>1554</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactName}>Disaster Management (NDMA):</Text>
            <Text style={styles.contactNum}>1078</Text>
          </View>
        </View>
      </ScrollView>

      {/* Alert Inspection Modal */}
      {selectedAlertModal && (
        <Modal
          visible={!!selectedAlertModal}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedAlertModal(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View
                  style={[
                    styles.modalIconWrap,
                    {
                      backgroundColor: colors.cautionSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name="warning-outline"
                    size={28}
                    color={colors.caution}
                  />
                </View>

                <View style={styles.modalTitleWrap}>
                  <Text style={styles.modalTitle}>{selectedAlertModal.title}</Text>
                  <Text style={styles.modalRegion}>{selectedAlertModal.region || selectedAlertModal.state}</Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedAlertModal(null)}
                >
                  <Ionicons name="close" size={20} color={colors.muted} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.modalMetaRow}>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>Severity</Text>
                    <Text style={[styles.modalMetaVal, { color: colors.caution }]}>
                      {(selectedAlertModal.severity || 'warning').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>Status</Text>
                    <Text style={styles.modalMetaVal}>Active</Text>
                  </View>
                  <View style={styles.modalMetaItem}>
                    <Text style={styles.modalMetaLabel}>Issued</Text>
                    <Text style={styles.modalMetaVal}>{selectedAlertModal.issuedAt || 'Active'}</Text>
                  </View>
                </View>

                <Text style={styles.modalSectionHeading}>Official Advisory Summary</Text>
                <Text style={styles.modalDescriptionText}>
                  {selectedAlertModal.description}
                </Text>

                {selectedAlertModal.action ? (
                  <View style={styles.modalAltBox}>
                    <Text style={styles.modalAltHeading}>Recommended Visitor Action:</Text>
                    <Text style={styles.modalAltText}>
                      {selectedAlertModal.action}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.modalSourceBox}>
                  <Text style={styles.modalSourceText}>
                    Issuing Channel: {selectedAlertModal.source}
                  </Text>
                </View>

                <View style={styles.modalDemoWarning}>
                  <Text style={styles.modalDemoWarningText}>
                    ⚠️ DEMONSTRATION PROTOTYPE: This advisory is simulated for academic research demonstration.
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setSelectedAlertModal(null)}
              >
                <Text style={styles.modalDismissBtnText}>Close Advisory</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.foam,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: colors.foam,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  alertCounterBadge: {
    backgroundColor: colors.notSuitable,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertCounterText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  demoWarningBanner: {
    backgroundColor: colors.cautionSoft,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
    marginBottom: 10,
  },
  demoWarningTextWrap: {
    flex: 1,
  },
  demoWarningTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 1,
  },
  demoWarningBody: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 15,
  },
  filterPillsRow: {
    paddingVertical: 4,
    gap: 8,
  },
  filterPill: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterPillActive: {
    backgroundColor: colors.ocean,
    borderColor: colors.ocean,
  },
  filterPillText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },
  statusSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeAdvisoriesCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  sourceLabel: {
    fontSize: 11,
    color: colors.muted,
    fontStyle: 'italic',
  },
  emergencyContactsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  emergencySub: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  contactName: {
    fontSize: 12,
    color: colors.ink,
    fontWeight: '500',
  },
  contactNum: {
    fontSize: 13,
    color: colors.ocean,
    fontWeight: '800',
  },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitleWrap: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  modalRegion: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    maxHeight: 380,
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.foam,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalMetaItem: {
    alignItems: 'center',
    flex: 1,
  },
  modalMetaLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '600',
    marginBottom: 2,
  },
  modalMetaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  modalSectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
  },
  modalDescriptionText: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 14,
  },
  modalAltBox: {
    backgroundColor: colors.turquoiseSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  modalAltHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ocean,
    marginBottom: 2,
  },
  modalAltText: {
    fontSize: 12,
    color: colors.ocean,
    lineHeight: 17,
  },
  modalSourceBox: {
    paddingVertical: 8,
  },
  modalSourceText: {
    fontSize: 11,
    color: colors.muted,
    fontStyle: 'italic',
  },
  modalDemoWarning: {
    backgroundColor: colors.cautionSoft,
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 14,
  },
  modalDemoWarningText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalDismissBtn: {
    backgroundColor: colors.ocean,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  modalDismissBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

