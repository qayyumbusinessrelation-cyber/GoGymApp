import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

const CLIENTS = [
  { id: '1', name: 'Aiman F.', goal: 'Weight Loss', sessions: 8, nextSession: 'Mon, 28 Apr 9:00 AM', progress: 75, status: 'active' },
  { id: '2', name: 'Nurul H.', goal: 'Yoga & Flexibility', sessions: 4, nextSession: 'Wed, 30 Apr 11:00 AM', progress: 50, status: 'active' },
  { id: '3', name: 'Kevin L.', goal: 'Strength Training', sessions: 12, nextSession: 'Fri, 2 May 3:00 PM', progress: 90, status: 'active' },
  { id: '4', name: 'Sarah M.', goal: 'HIIT & Cardio', sessions: 2, nextSession: 'Not scheduled', progress: 20, status: 'new' },
];

const TODAY_SESSIONS = [
  { id: '1', client: 'Aiman F.', time: '9:00 AM', type: 'Weight Loss', location: 'Home visit - Melawati' },
  { id: '2', client: 'Nurul H.', time: '11:00 AM', type: 'Yoga', location: 'Home visit - Ampang' },
];

export default function TrainerHomeScreen({ navigation }) {
  const [trainerName, setTrainerName] = useState('');
  const [addClientModal, setAddClientModal] = useState(false);

  useEffect(() => {
    loadTrainer();
  }, []);

  const loadTrainer = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('users').select('full_name').eq('id', user.id).single();
    if (data) setTrainerName(data.full_name || 'Trainer');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.trainerName}>{trainerName || 'Trainer'} 💪</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{CLIENTS.length}</Text>
            <Text style={styles.statLabel}>Active Clients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{TODAY_SESSIONS.length}</Text>
            <Text style={styles.statLabel}>Today's Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>RM 327</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Today's sessions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODAY'S SESSIONS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PTCalendar')}>
              <Text style={styles.seeAll}>View Calendar →</Text>
            </TouchableOpacity>
          </View>
          {TODAY_SESSIONS.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No sessions today 🎉</Text>
            </View>
          ) : (
            TODAY_SESSIONS.map(s => (
              <View key={s.id} style={styles.sessionCard}>
                <View style={styles.sessionTime}>
                  <Text style={styles.sessionTimeText}>{s.time}</Text>
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionClient}>{s.client}</Text>
                  <Text style={styles.sessionType}>{s.type}</Text>
                  <Text style={styles.sessionLocation}>📍 {s.location}</Text>
                </View>
                <View style={styles.sessionActions}>
                  <TouchableOpacity style={styles.sessionBtn}
                    onPress={() => navigation.navigate('SessionTracker', { clientName: s.client })}>
                    <Text style={styles.sessionBtnText}>Log</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sessionBtnGold}
                    onPress={() => navigation.navigate('Chat', { booking: { trainerName: s.client, trainerEmoji: '👤', day: 'Today', time: s.time } })}>
                    <Text style={styles.sessionBtnGoldText}>Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Client list */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MY CLIENTS</Text>
            <TouchableOpacity style={styles.addClientBtn} onPress={() => navigation.navigate('AddClient')}>
              <Text style={styles.addClientBtnText}>+ Add Client</Text>
            </TouchableOpacity>
          </View>
          {CLIENTS.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.clientCard}
              onPress={() => navigation.navigate('ClientProgram', { clientName: c.name })}
            >
              <View style={styles.clientAvatar}>
                <Text style={styles.clientAvatarText}>{c.name[0]}</Text>
              </View>
              <View style={styles.clientInfo}>
                <View style={styles.clientTopRow}>
                  <Text style={styles.clientName}>{c.name}</Text>
                  <View style={[styles.clientStatusBadge, c.status === 'new' && styles.clientStatusNew]}>
                    <Text style={[styles.clientStatusText, c.status === 'new' && styles.clientStatusTextNew]}>
                      {c.status === 'new' ? 'New' : 'Active'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.clientGoal}>{c.goal}</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${c.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{c.sessions} sessions</Text>
                </View>
                <Text style={styles.nextSession}>🗓 {c.nextSession}</Text>
              </View>
              <Text style={styles.clientChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickGrid}>
            {[
              { icon: '📅', label: 'Calendar', screen: 'PTCalendar' },
              { icon: '📋', label: 'Programs', screen: 'ClientProgram', params: { clientName: 'Aiman F.' } },
              { icon: '📈', label: 'Progress', screen: 'ClientProgress', params: { clientName: 'Aiman F.' } },
              { icon: '💰', label: 'Earnings', screen: 'TrainerEarnings' },
            ].map(a => (
              <TouchableOpacity
                key={a.label}
                style={styles.quickCard}
                onPress={() => navigation.navigate(a.screen, a.params)}
              >
                <Text style={styles.quickIcon}>{a.icon}</Text>
                <Text style={styles.quickLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  greeting: { fontSize: 13, color: colors.textMuted },
  trainerName: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: 2 },
  notifBtn: { padding: spacing.sm },
  notifIcon: { fontSize: 22 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.gold },
  statLabel: { fontSize: 9, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted },
  seeAll: { fontSize: 12, color: colors.gold },
  emptyCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  emptyText: { fontSize: 13, color: colors.textMuted },
  sessionCard: { flexDirection: 'row', backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, gap: spacing.md, alignItems: 'center' },
  sessionTime: { backgroundColor: colors.gold, borderRadius: radius.sm, padding: spacing.sm, minWidth: 60, alignItems: 'center' },
  sessionTimeText: { fontSize: 12, fontWeight: '700', color: '#000' },
  sessionInfo: { flex: 1 },
  sessionClient: { fontSize: 14, fontWeight: '600', color: colors.text },
  sessionType: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sessionLocation: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sessionActions: { gap: spacing.sm },
  sessionBtn: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center' },
  sessionBtnText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  sessionBtnGold: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 0.5, borderColor: colors.gold, alignItems: 'center' },
  sessionBtnGoldText: { fontSize: 11, color: colors.gold, fontWeight: '600' },
  addClientBtn: { backgroundColor: colors.gold, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6 },
  addClientBtnText: { fontSize: 12, fontWeight: '700', color: '#000' },
  clientCard: { flexDirection: 'row', backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, alignItems: 'center', gap: spacing.md },
  clientAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  clientAvatarText: { fontSize: 18, fontWeight: '700', color: '#000' },
  clientInfo: { flex: 1 },
  clientTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  clientName: { fontSize: 14, fontWeight: '600', color: colors.text },
  clientStatusBadge: { backgroundColor: '#0e2000', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  clientStatusNew: { backgroundColor: 'rgba(201,168,76,0.15)' },
  clientStatusText: { fontSize: 10, fontWeight: '600', color: colors.green },
  clientStatusTextNew: { color: colors.gold },
  clientGoal: { fontSize: 11, color: colors.textMuted },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  progressTrack: { flex: 1, height: 4, backgroundColor: colors.dark4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.gold, borderRadius: 2 },
  progressText: { fontSize: 10, color: colors.textMuted, minWidth: 55 },
  nextSession: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  clientChevron: { fontSize: 20, color: colors.textMuted },
  quickGrid: { flexDirection: 'row', gap: spacing.sm },
  quickCard: { flex: 1, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  quickIcon: { fontSize: 24, marginBottom: spacing.sm },
  quickLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
});
