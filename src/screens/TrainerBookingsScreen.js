import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert, Modal,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const UPCOMING = [
  { id: '1', client: 'Aiman F.', type: 'Weight Loss', date: 'Mon, 28 Apr', time: '9:00 AM', session: '3 of 4', location: 'Home visit - Melawati', status: 'confirmed' },
  { id: '2', client: 'Nurul H.', type: 'Yoga', date: 'Wed, 30 Apr', time: '11:00 AM', session: '1 of 1', location: 'Home visit - Ampang', status: 'confirmed' },
  { id: '3', client: 'Kevin L.', type: 'Strength', date: 'Fri, 2 May', time: '3:00 PM', session: '5 of 8', location: 'Gym - Wangsa Maju', status: 'confirmed' },
];

const PAST = [
  { id: '4', client: 'Aiman F.', type: 'Weight Loss', date: 'Mon, 21 Apr', time: '9:00 AM', session: '2 of 4', location: 'Home visit - Melawati', status: 'completed', earned: 'RM 54.60' },
  { id: '5', client: 'Sarah M.', type: 'HIIT', date: 'Sat, 19 Apr', time: '10:00 AM', session: '1 of 1', location: 'Outdoor - KLCC Park', status: 'completed', earned: 'RM 72.80' },
  { id: '6', client: 'Kevin L.', type: 'Strength', date: 'Wed, 16 Apr', time: '3:00 PM', session: '4 of 8', location: 'Gym - Wangsa Maju', status: 'completed', earned: 'RM 54.60' },
];

export default function TrainerBookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState({ upcoming: UPCOMING, past: PAST });

  const data = activeTab === 'Upcoming' ? sessions.upcoming : sessions.past;

  const confirmCancel = () => {
    setCancelModal(false);
    Alert.alert(
      'Session Cancelled',
      `Your session with ${selectedSession.client} on ${selectedSession.date} has been cancelled. The client will be notified and refunded automatically.`,
      [{ text: 'OK', onPress: () => {
        setSessions(prev => ({
          ...prev,
          upcoming: prev.upcoming.filter(s => s.id !== selectedSession.id),
          past: [{ ...selectedSession, status: 'cancelled' }, ...prev.past],
        }));
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={styles.header}>
        <Text style={styles.title}>My Sessions</Text>
        <Text style={styles.sub}>Manage your client bookings</Text>
      </View>

      <View style={styles.tabRow}>
        {['Upcoming', 'Past'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {data.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No sessions yet</Text>
            <Text style={styles.emptySub}>Your bookings will appear here</Text>
          </View>
        )}
        {data.map(s => (
          <View key={s.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{s.client[0]}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.clientName}>{s.client}</Text>
                <Text style={styles.sessionType}>{s.type}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, s.status === 'confirmed' && styles.statusConfirmed, s.status === 'completed' && styles.statusCompleted, s.status === 'cancelled' && styles.statusCancelled]}>
                    <Text style={[styles.statusText, s.status === 'confirmed' && styles.statusTextConfirmed, s.status === 'completed' && styles.statusTextCompleted, s.status === 'cancelled' && styles.statusTextCancelled]}>
                      {s.status === 'confirmed' ? 'Confirmed' : s.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </Text>
                  </View>
                  {s.earned && <Text style={styles.earnedText}>{s.earned} earned</Text>}
                </View>
              </View>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}><Text style={styles.metaIcon}>📅</Text><Text style={styles.metaText}>{s.date} · {s.time}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaIcon}>📍</Text><Text style={styles.metaText}>{s.location}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaIcon}>🔁</Text><Text style={styles.metaText}>{s.session}</Text></View>
            </View>
            {s.status === 'confirmed' && (
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.chatBtn} onPress={() => navigation.navigate('Chat', { booking: { id: s.id, trainerName: s.client, trainerEmoji: '👤', day: s.date, time: s.time } })}>
                  <Text style={styles.chatBtnText}>💬 Message Client</Text>
                </TouchableOpacity>
                <View style={styles.bottomActions}>
                  <TouchableOpacity style={styles.logBtn} onPress={() => navigation.navigate('SessionTracker', { clientName: s.client })}>
                    <Text style={styles.logBtnText}>Log Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => { setSelectedSession(s); setCancelModal(true); }}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {s.status === 'completed' && (
              <TouchableOpacity style={styles.progressBtn} onPress={() => navigation.navigate('ClientProgress', { clientName: s.client })}>
                <Text style={styles.progressBtnText}>📈 View Client Progress</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal visible={cancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cancel Session</Text>
            {selectedSession && (
              <>
                <View style={styles.modalRow}><Text style={styles.modalLabel}>Client</Text><Text style={styles.modalValue}>{selectedSession.client}</Text></View>
                <View style={styles.modalRow}><Text style={styles.modalLabel}>Date</Text><Text style={styles.modalValue}>{selectedSession.date}</Text></View>
                <View style={styles.modalRow}><Text style={styles.modalLabel}>Time</Text><Text style={styles.modalValue}>{selectedSession.time}</Text></View>
              </>
            )}
            <View style={styles.policyBox}>
              <Text style={styles.policyTitle}>⚠️ Please note</Text>
              <Text style={styles.policyText}>Cancelling a confirmed session will trigger an automatic full refund to your client. Repeated cancellations may affect your trainer rating and account standing.</Text>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalKeep} onPress={() => setCancelModal(false)}>
                <Text style={styles.modalKeepText}>Keep Session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={confirmCancel}>
                <Text style={styles.modalCancelText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: 4, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.gold },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#000', fontWeight: '700' },
  list: { flex: 1, paddingHorizontal: spacing.xl },
  card: { backgroundColor: colors.dark3, borderRadius: radius.md, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', padding: spacing.md, gap: spacing.md, alignItems: 'flex-start' },
  avatarWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#000' },
  cardInfo: { flex: 1 },
  clientName: { fontSize: 14, fontWeight: '600', color: colors.text },
  sessionType: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  statusConfirmed: { backgroundColor: '#0e2000' },
  statusCompleted: { backgroundColor: colors.dark4 },
  statusCancelled: { backgroundColor: '#2a0000' },
  statusText: { fontSize: 10, fontWeight: '600' },
  statusTextConfirmed: { color: colors.green },
  statusTextCompleted: { color: colors.textMuted },
  statusTextCancelled: { color: colors.red },
  earnedText: { fontSize: 11, color: colors.green, fontWeight: '600' },
  cardDivider: { height: 0.5, backgroundColor: colors.dark4 },
  cardMeta: { padding: spacing.md, gap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIcon: { fontSize: 12 },
  metaText: { fontSize: 11, color: colors.textMuted },
  cardActions: { gap: spacing.sm, padding: spacing.md, paddingTop: 0 },
  chatBtn: { padding: 10, borderRadius: radius.sm, backgroundColor: colors.gold, alignItems: 'center' },
  chatBtnText: { fontSize: 13, color: '#000', fontWeight: '700' },
  bottomActions: { flexDirection: 'row', gap: spacing.sm },
  logBtn: { flex: 1, padding: 8, borderRadius: radius.sm, backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', borderWidth: 0.5, borderColor: colors.gold },
  logBtnText: { fontSize: 12, color: colors.gold, fontWeight: '500' },
  cancelBtn: { flex: 1, padding: 8, borderRadius: radius.sm, borderWidth: 0.5, borderColor: colors.red, alignItems: 'center' },
  cancelBtnText: { fontSize: 12, color: colors.red, fontWeight: '500' },
  progressBtn: { margin: spacing.md, marginTop: 0, padding: 8, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center' },
  progressBtnText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.lg },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.dark2, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, borderTopWidth: 0.5, borderColor: colors.dark4 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.red, marginBottom: spacing.lg },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  modalLabel: { fontSize: 13, color: colors.textMuted },
  modalValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  policyBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, borderLeftWidth: 2, borderLeftColor: colors.gold },
  policyTitle: { fontSize: 12, fontWeight: '600', color: colors.gold, marginBottom: spacing.sm },
  policyText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  modalBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  modalKeep: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.gold, alignItems: 'center' },
  modalKeepText: { fontSize: 14, color: '#000', fontWeight: '700' },
  modalCancel: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: '#2a0000', alignItems: 'center', borderWidth: 0.5, borderColor: colors.red },
  modalCancelText: { fontSize: 14, color: colors.red, fontWeight: '700' },
});
