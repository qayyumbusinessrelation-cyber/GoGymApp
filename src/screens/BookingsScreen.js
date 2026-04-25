import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  StyleSheet, SafeAreaView, StatusBar, Modal,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const UPCOMING = [
  { id: '1', trainer: 'Hafiz Rahman', spec: 'Weight Loss & Cardio', emoji: '🏋️', date: 'Mon, 28 Apr', time: '10:00 AM', package: '4 Sessions', session: '2 of 4', price: 'RM 228', status: 'confirmed', trainerObj: { name: 'Hafiz Rahman', spec: 'Weight Loss & Cardio', emoji: '🏋️', rating: '4.9', sessions: 120 } },
  { id: '2', trainer: 'Siti Norzah', spec: 'Yoga & Flexibility', emoji: '🧘', date: 'Wed, 30 Apr', time: '9:00 AM', package: 'Single Session', session: '1 of 1', price: 'RM 45', status: 'confirmed', trainerObj: { name: 'Siti Norzah', spec: 'Yoga & Flexibility', emoji: '🧘', rating: '4.8', sessions: 85 } },
];

const PAST = [
  { id: '3', trainer: 'Razif Amir', spec: 'Strength & Powerlifting', emoji: '💪', date: 'Mon, 14 Apr', time: '3:00 PM', package: '8 Sessions', session: '8 of 8', price: 'RM 540', status: 'completed', rating: 5, trainerObj: { name: 'Razif Amir', spec: 'Strength & Powerlifting', emoji: '💪', rating: '5.0', sessions: 200 } },
  { id: '4', trainer: 'Amirah Lim', spec: 'Muay Thai & Fitness', emoji: '🥊', date: 'Fri, 10 Apr', time: '5:00 PM', package: '4 Sessions', session: '4 of 4', price: 'RM 209', status: 'completed', rating: null, trainerObj: { name: 'Amirah Lim', spec: 'Muay Thai & Fitness', emoji: '🥊', rating: '4.7', sessions: 60 } },
  { id: '5', trainer: 'Danial Ooi', spec: 'Calisthenics & Mobility', emoji: '🤸', date: 'Tue, 1 Apr', time: '11:00 AM', package: 'Single Session', session: '1 of 1', price: 'RM 50', status: 'cancelled', rating: null, trainerObj: { name: 'Danial Ooi', spec: 'Calisthenics & Mobility', emoji: '🤸', rating: '4.8', sessions: 95 } },
];

const TABS = ['Upcoming', 'Past'];

export default function BookingsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState({ upcoming: UPCOMING, past: PAST });
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const data = activeTab === 'Upcoming' ? bookings.upcoming : bookings.past;

  const handleCancelPress = (booking) => {
    setSelectedBooking(booking);
    setCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setCancelModal(false);
    const hours = 25; // Mock — in real app calculate from session date/time
    const refundMessage = hours > 24
      ? 'You will receive a full refund within 3-5 business days.'
      : 'As the session is within 24 hours, you will receive a 50% refund within 3-5 business days.';

    Alert.alert(
      'Booking Cancelled',
      `Your session with ${selectedBooking.trainer} has been cancelled. ${refundMessage}`,
      [{ text: 'OK', onPress: () => {
        setBookings(prev => ({
          ...prev,
          upcoming: prev.upcoming.filter(b => b.id !== selectedBooking.id),
          past: [{ ...selectedBooking, status: 'cancelled' }, ...prev.past],
        }));
      }}]
    );
  };

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
                  {b.rating && <Text style={styles.ratingText}>{'⭐'.repeat(b.rating)}</Text>}
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
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => navigation.navigate('Chat', {
                    booking: { id: b.id, trainerName: b.trainer, trainerEmoji: b.emoji, day: b.date, time: b.time }
                  })}
                >
                  <Text style={styles.chatBtnText}>💬 Message Trainer</Text>
                </TouchableOpacity>
                <View style={styles.bottomActions}>
                  <TouchableOpacity
                    style={styles.rescheduleBtn}
                    onPress={() => navigation.navigate('Availability', { booking: b })}
                  >
                    <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => handleCancelPress(b)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {b.status === 'completed' && !b.rating && (
              <TouchableOpacity
                style={styles.reviewBtn}
                onPress={() => navigation.navigate('RatingsReview', { trainer: b.trainerObj })}
              >
                <Text style={styles.reviewBtnText}>⭐ Leave a Review</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal visible={cancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            {selectedBooking && (
              <>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Trainer</Text>
                  <Text style={styles.modalValue}>{selectedBooking.trainer}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Date</Text>
                  <Text style={styles.modalValue}>{selectedBooking.date}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Time</Text>
                  <Text style={styles.modalValue}>{selectedBooking.time}</Text>
                </View>
              </>
            )}
            <View style={styles.policyBox}>
              <Text style={styles.policyTitle}>Cancellation Policy</Text>
              <Text style={styles.policyText}>• Cancel 24+ hours before: Full refund</Text>
              <Text style={styles.policyText}>• Cancel within 24 hours: 50% refund</Text>
              <Text style={styles.policyText}>• No show: No refund</Text>
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalKeep} onPress={() => setCancelModal(false)}>
                <Text style={styles.modalKeepText}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={handleConfirmCancel}>
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
  cardActions: { gap: spacing.sm, padding: spacing.md, paddingTop: 0 },
  chatBtn: { padding: 10, borderRadius: radius.sm, backgroundColor: colors.gold, alignItems: 'center' },
  chatBtnText: { fontSize: 13, color: '#000', fontWeight: '700' },
  bottomActions: { flexDirection: 'row', gap: spacing.sm },
  rescheduleBtn: { flex: 1, padding: 8, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center' },
  rescheduleBtnText: { fontSize: 12, color: colors.text, fontWeight: '500' },
  cancelBtn: { flex: 1, padding: 8, borderRadius: radius.sm, borderWidth: 0.5, borderColor: colors.red, alignItems: 'center' },
  cancelBtnText: { fontSize: 12, color: colors.red, fontWeight: '500' },
  reviewBtn: { margin: spacing.md, marginTop: 0, padding: 10, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center', borderWidth: 0.5, borderColor: colors.gold },
  reviewBtnText: { fontSize: 13, color: colors.gold, fontWeight: '600' },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.lg },
  emptyText: { fontSize: 18, fontWeight: '600', color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 6, marginBottom: spacing.xl },
  emptyBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.dark2, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, borderTopWidth: 0.5, borderColor: colors.dark4 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.red, marginBottom: spacing.lg },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  modalLabel: { fontSize: 13, color: colors.textMuted },
  modalValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  policyBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, borderLeftWidth: 2, borderLeftColor: colors.gold },
  policyTitle: { fontSize: 12, fontWeight: '600', color: colors.gold, marginBottom: spacing.sm },
  policyText: { fontSize: 12, color: colors.textMuted, lineHeight: 20 },
  modalBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  modalKeep: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.gold, alignItems: 'center' },
  modalKeepText: { fontSize: 14, color: '#000', fontWeight: '700' },
  modalCancel: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: '#2a0000', alignItems: 'center', borderWidth: 0.5, borderColor: colors.red },
  modalCancelText: { fontSize: 14, color: colors.red, fontWeight: '700' },
});
