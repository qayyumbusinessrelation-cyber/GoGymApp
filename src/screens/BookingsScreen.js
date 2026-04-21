import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const UPCOMING = [
  { id: '1', trainer: 'Hafiz Rahman', spec: 'Weight Loss & Cardio', emoji: '🏋️', date: 'Mon, 28 Apr', time: '10:00 AM', package: '4 Sessions', session: '2 of 4', price: 'RM 228', status: 'confirmed' },
  { id: '2', trainer: 'Siti Norzah', spec: 'Yoga & Flexibility', emoji: '🧘', date: 'Wed, 30 Apr', time: '9:00 AM', package: 'Single Session', session: '1 of 1', price: 'RM 45', status: 'confirmed' },
];

const PAST = [
  { id: '3', trainer: 'Razif Amir', spec: 'Strength & Powerlifting', emoji: '💪', date: 'Mon, 14 Apr', time: '3:00 PM', package: '8 Sessions', session: '8 of 8', price: 'RM 540', status: 'completed', rating: 5 },
  { id: '4', trainer: 'Amirah Lim', spec: 'Muay Thai & Fitness', emoji: '🥊', date: 'Fri, 10 Apr', time: '5:00 PM', package: '4 Sessions', session: '4 of 4', price: 'RM 209', status: 'completed', rating: 4 },
  { id: '5', trainer: 'Danial Ooi', spec: 'Calisthenics & Mobility', emoji: '🤸', date: 'Tue, 1 Apr', time: '11:00 AM', package: 'Single Session', session: '1 of 1', price: 'RM 50', status: 'cancelled', rating: null },
];

const TABS = ['Upcoming', 'Past'];

export default function BookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const data = activeTab === 'Upcoming' ? UPCOMING : PAST;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.sub}>Track your training sessions</Text>
      </View>

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

      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {data.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySub}>Book a trainer to get started</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.emptyBtnText}>Find a Trainer</Text>
            </TouchableOpacity>
          </View>
        )}

        {data.map(b => (
          <View key={b.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarEmoji}>{b.emoji}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.trainerName}>{b.trainer}</Text>
                <Text style={styles.trainerSpec}>{b.spec}</Text>
                <View style={styles.statusRow}>
                  <View style={[
                    styles.statusBadge,
                    b.status === 'confirmed' && styles.statusConfirmed,
                    b.status === 'completed' && styles.statusCompleted,
                    b.status === 'cancelled' && styles.statusCancelled,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      b.status === 'confirmed' && styles.statusTextConfirmed,
                      b.status === 'completed' && styles.statusTextCompleted,
                      b.status === 'cancelled' && styles.statusTextCancelled,
                    ]}>
                      {b.status === 'confirmed' ? 'Confirmed' : b.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </Text>
                  </View>
                  {b.rating && (
                    <Text style={styles.ratingText}>{'⭐'.repeat(b.rating)}</Text>
                  )}
                </View>
              </View>
              <Text style={styles.price}>{b.price}</Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottom}>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>📅</Text>
                <Text style={styles.metaText}>{b.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>🕐</Text>
                <Text style={styles.metaText}>{b.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>🔁</Text>
                <Text style={styles.metaText}>{b.session}</Text>
              </View>
            </View>

            {b.status === 'confirmed' && (
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.rescheduleBtn}>
                  <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {b.status === 'completed' && !b.rating && (
              <TouchableOpacity style={styles.reviewBtn}>
                <Text style={styles.reviewBtnText}>Leave a Review</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, letterSpacing: 0.5 },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: 4, marginBottom: spacing.lg },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.gold },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#000', fontWeight: '700' },
  list: { flex: 1, paddingHorizontal: spacing.xl },
  card: { backgroundColor: colors.dark3, borderRadius: radius.md, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.md },
  avatarWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 24 },
  cardInfo: { flex: 1 },
  trainerName: { fontSize: 14, fontWeight: '600', color: colors.text },
  trainerSpec: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 6 },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  statusConfirmed: { backgroundColor: '#0e2000' },
  statusCompleted: { backgroundColor: colors.dark4 },
  statusCancelled: { backgroundColor: '#2a0000' },
  statusText: { fontSize: 10, fontWeight: '600' },
  statusTextConfirmed: { color: colors.green },
  statusTextCompleted: { color: colors.textMuted },
  statusTextCancelled: { color: colors.red },
  ratingText: { fontSize: 11 },
  price: { fontSize: 14, fontWeight: '700', color: colors.gold },
  cardDivider: { height: 0.5, backgroundColor: colors.dark4 },
  cardBottom: { flexDirection: 'row', padding: spacing.md, gap: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 12 },
  metaText: { fontSize: 11, color: colors.textMuted },
  cardActions: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, paddingTop: 0 },
  rescheduleBtn: { flex: 1, padding: 8, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center' },
  rescheduleBtnText: { fontSize: 12, color: colors.text, fontWeight: '500' },
  cancelBtn: { flex: 1, padding: 8, borderRadius: radius.sm, borderWidth: 0.5, borderColor: colors.red, alignItems: 'center' },
  cancelBtnText: { fontSize: 12, color: colors.red, fontWeight: '500' },
  reviewBtn: { margin: spacing.md, marginTop: 0, padding: 8, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center' },
  reviewBtnText: { fontSize: 12, color: colors.gold, fontWeight: '500' },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.lg },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 6, marginBottom: spacing.xl },
  emptyBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
});
