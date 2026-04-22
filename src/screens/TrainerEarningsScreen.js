import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const WEEKLY_DATA = [
  { week: 'This Week', sessions: 6, gross: 360, commission: 32.40, net: 327.60, status: 'pending' },
  { week: 'Last Week', sessions: 8, gross: 480, commission: 43.20, net: 436.80, status: 'paid' },
  { week: '14 Apr', sessions: 5, gross: 300, commission: 27.00, net: 273.00, status: 'paid' },
  { week: '7 Apr', sessions: 7, gross: 420, commission: 37.80, net: 382.20, status: 'paid' },
];

const RECENT_SESSIONS = [
  { id: '1', client: 'Aiman F.', date: 'Wed, 22 Apr', time: '10:00 AM', rate: 'RM 60', commission: 'RM 5.40', net: 'RM 54.60', status: 'completed' },
  { id: '2', client: 'Nurul H.', date: 'Tue, 21 Apr', time: '9:00 AM', rate: 'RM 60', commission: 'RM 5.40', net: 'RM 54.60', status: 'completed' },
  { id: '3', client: 'Kevin L.', date: 'Mon, 20 Apr', time: '3:00 PM', rate: 'RM 60', commission: 'RM 5.40', net: 'RM 54.60', status: 'completed' },
  { id: '4', client: 'Sarah M.', date: 'Sat, 18 Apr', time: '11:00 AM', rate: 'RM 60', commission: 'RM 5.40', net: 'RM 54.60', status: 'completed' },
  { id: '5', client: 'Razif A.', date: 'Fri, 17 Apr', time: '5:00 PM', rate: 'RM 60', commission: 'RM 5.40', net: 'RM 54.60', status: 'pending' },
];

const PAYOUT_HISTORY = [
  { id: '1', date: 'Mon, 21 Apr', amount: 'RM 436.80', sessions: 8, bank: 'Maybank ****1234', status: 'completed' },
  { id: '2', date: 'Mon, 14 Apr', amount: 'RM 273.00', sessions: 5, bank: 'Maybank ****1234', status: 'completed' },
  { id: '3', date: 'Mon, 7 Apr', amount: 'RM 382.20', sessions: 7, bank: 'Maybank ****1234', status: 'completed' },
];

const TABS = ['Overview', 'Sessions', 'Payouts'];

export default function TrainerEarningsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Overview');

  const totalEarned = PAYOUT_HISTORY.reduce((a, b) => a + parseFloat(b.amount.replace('RM ', '')), 0);
  const pendingAmount = WEEKLY_DATA[0].net;
  const totalSessions = WEEKLY_DATA.reduce((a, b) => a + b.sessions, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>My Earnings</Text>
          <Text style={styles.sub}>Payout every Monday</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Hero stats */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total earned (all time)</Text>
        <Text style={styles.heroAmount}>RM {totalEarned.toFixed(2)}</Text>
        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>RM {pendingAmount.toFixed(2)}</Text>
            <Text style={styles.heroStatLabel}>Pending payout</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{totalSessions}</Text>
            <Text style={styles.heroStatLabel}>Total sessions</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>9%</Text>
            <Text style={styles.heroStatLabel}>Commission rate</Text>
          </View>
        </View>
        <View style={styles.nextPayoutBadge}>
          <Text style={styles.nextPayoutText}>⏱ Next payout: Monday, 28 Apr</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>WEEKLY BREAKDOWN</Text>
            {WEEKLY_DATA.map((w, i) => (
              <View key={i} style={styles.weekCard}>
                <View style={styles.weekTop}>
                  <View>
                    <Text style={styles.weekLabel}>{w.week}</Text>
                    <Text style={styles.weekSessions}>{w.sessions} sessions completed</Text>
                  </View>
                  <View style={[styles.weekStatusBadge, w.status === 'paid' ? styles.badgePaid : styles.badgePending]}>
                    <Text style={[styles.weekStatusText, w.status === 'paid' ? styles.badgePaidText : styles.badgePendingText]}>
                      {w.status === 'paid' ? 'Paid' : 'Pending'}
                    </Text>
                  </View>
                </View>
                <View style={styles.weekDivider} />
                <View style={styles.weekBottom}>
                  <View style={styles.weekFigure}>
                    <Text style={styles.weekFigureLabel}>Gross</Text>
                    <Text style={styles.weekFigureValue}>RM {w.gross.toFixed(2)}</Text>
                  </View>
                  <View style={styles.weekFigure}>
                    <Text style={styles.weekFigureLabel}>Commission (9%)</Text>
                    <Text style={styles.weekFigureValueRed}>- RM {w.commission.toFixed(2)}</Text>
                  </View>
                  <View style={styles.weekFigure}>
                    <Text style={styles.weekFigureLabel}>You receive</Text>
                    <Text style={styles.weekFigureValueGold}>RM {w.net.toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>How payouts work</Text>
              <Text style={styles.infoText}>
                All sessions completed during the week are grouped and paid out every Monday directly to your registered bank account. You will receive a notification when your payout is processed.
              </Text>
            </View>
          </View>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'Sessions' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>
            {RECENT_SESSIONS.map(s => (
              <View key={s.id} style={styles.sessionCard}>
                <View style={styles.sessionTop}>
                  <View style={styles.sessionAvatar}>
                    <Text style={styles.sessionAvatarText}>{s.client[0]}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionClient}>{s.client}</Text>
                    <Text style={styles.sessionDate}>{s.date} · {s.time}</Text>
                  </View>
                  <View style={[styles.sessionStatusBadge, s.status === 'completed' ? styles.badgePaid : styles.badgePending]}>
                    <Text style={[styles.sessionStatusText, s.status === 'completed' ? styles.badgePaidText : styles.badgePendingText]}>
                      {s.status === 'completed' ? 'Done' : 'Pending'}
                    </Text>
                  </View>
                </View>
                <View style={styles.sessionEarnings}>
                  <View style={styles.sessionFigure}>
                    <Text style={styles.sessionFigureLabel}>Session rate</Text>
                    <Text style={styles.sessionFigureValue}>{s.rate}</Text>
                  </View>
                  <View style={styles.sessionFigure}>
                    <Text style={styles.sessionFigureLabel}>GoGym (9%)</Text>
                    <Text style={styles.sessionFigureValueRed}>- {s.commission}</Text>
                  </View>
                  <View style={styles.sessionFigure}>
                    <Text style={styles.sessionFigureLabel}>Your cut</Text>
                    <Text style={styles.sessionFigureValueGold}>{s.net}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PAYOUTS TAB */}
        {activeTab === 'Payouts' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>PAYOUT HISTORY</Text>
            {PAYOUT_HISTORY.map(p => (
              <View key={p.id} style={styles.payoutCard}>
                <View style={styles.payoutTop}>
                  <View style={styles.payoutIcon}>
                    <Text style={styles.payoutIconText}>🏦</Text>
                  </View>
                  <View style={styles.payoutInfo}>
                    <Text style={styles.payoutDate}>{p.date}</Text>
                    <Text style={styles.payoutBank}>{p.bank}</Text>
                    <Text style={styles.payoutSessions}>{p.sessions} sessions</Text>
                  </View>
                  <View style={styles.payoutRight}>
                    <Text style={styles.payoutAmount}>{p.amount}</Text>
                    <View style={styles.badgePaid}>
                      <Text style={styles.badgePaidText}>Paid</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.bankBox}>
              <Text style={styles.bankTitle}>Registered bank account</Text>
              <Text style={styles.bankDetails}>Maybank · ****1234</Text>
              <TouchableOpacity style={styles.bankChangeBtn}>
                <Text style={styles.bankChangeBtnText}>Change bank account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backBtn: { width: 32 },
  backIcon: { fontSize: 22, color: colors.gold },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  heroCard: { marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 0.5, borderColor: colors.gold, marginBottom: spacing.lg },
  heroLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  heroAmount: { fontSize: 36, fontWeight: '700', color: colors.gold, marginBottom: spacing.lg },
  heroRow: { flexDirection: 'row', marginBottom: spacing.lg },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatDivider: { width: 0.5, backgroundColor: colors.dark4 },
  heroStatValue: { fontSize: 16, fontWeight: '700', color: colors.text },
  heroStatLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  nextPayoutBadge: { backgroundColor: colors.dark4, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, alignSelf: 'flex-start' },
  nextPayoutText: { fontSize: 12, color: colors.textMuted },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: 4, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.gold },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#000', fontWeight: '700' },
  content: { flex: 1 },
  tabContent: { paddingHorizontal: spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  weekCard: { backgroundColor: colors.dark3, borderRadius: radius.md, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  weekTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  weekLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  weekSessions: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  weekStatusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  badgePaid: { backgroundColor: '#0e2000', borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  badgePending: { backgroundColor: colors.dark4, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  weekStatusText: { fontSize: 11, fontWeight: '600' },
  badgePaidText: { fontSize: 11, fontWeight: '600', color: colors.green },
  badgePendingText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  weekDivider: { height: 0.5, backgroundColor: colors.dark4 },
  weekBottom: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
  weekFigure: { flex: 1 },
  weekFigureLabel: { fontSize: 10, color: colors.textMuted, marginBottom: 2 },
  weekFigureValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  weekFigureValueRed: { fontSize: 13, fontWeight: '600', color: colors.red },
  weekFigureValueGold: { fontSize: 13, fontWeight: '700', color: colors.gold },
  infoBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderLeftWidth: 2, borderLeftColor: colors.gold, marginTop: spacing.md },
  infoTitle: { fontSize: 13, fontWeight: '600', color: colors.gold, marginBottom: spacing.sm },
  infoText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  sessionCard: { backgroundColor: colors.dark3, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  sessionTop: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  sessionAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  sessionAvatarText: { fontSize: 16, fontWeight: '700', color: '#000' },
  sessionInfo: { flex: 1 },
  sessionClient: { fontSize: 14, fontWeight: '600', color: colors.text },
  sessionDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sessionStatusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  sessionStatusText: { fontSize: 11, fontWeight: '600' },
  sessionEarnings: { flexDirection: 'row', padding: spacing.md, paddingTop: 0, gap: spacing.sm },
  sessionFigure: { flex: 1 },
  sessionFigureLabel: { fontSize: 10, color: colors.textMuted, marginBottom: 2 },
  sessionFigureValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  sessionFigureValueRed: { fontSize: 13, fontWeight: '600', color: colors.red },
  sessionFigureValueGold: { fontSize: 13, fontWeight: '700', color: colors.gold },
  payoutCard: { backgroundColor: colors.dark3, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, padding: spacing.md },
  payoutTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  payoutIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  payoutIconText: { fontSize: 20 },
  payoutInfo: { flex: 1 },
  payoutDate: { fontSize: 14, fontWeight: '600', color: colors.text },
  payoutBank: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  payoutSessions: { fontSize: 11, color: colors.textMuted },
  payoutRight: { alignItems: 'flex-end', gap: 6 },
  payoutAmount: { fontSize: 16, fontWeight: '700', color: colors.gold },
  bankBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.dark4, marginTop: spacing.lg },
  bankTitle: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  bankDetails: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  bankChangeBtn: { borderWidth: 0.5, borderColor: colors.gold, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center' },
  bankChangeBtnText: { fontSize: 13, color: colors.gold, fontWeight: '500' },
});
