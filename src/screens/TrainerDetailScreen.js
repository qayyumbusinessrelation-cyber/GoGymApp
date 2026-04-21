import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Modal, Alert,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const REVIEWS = [
  { id: '1', name: 'Aiman F.', rating: 5, text: 'Best trainer I have had. Very patient and result-driven. Lost 5kg in 6 weeks!' },
  { id: '2', name: 'Nurul H.', rating: 5, text: 'Super motivating. Comes to my house on time every session. Highly recommended.' },
  { id: '3', name: 'Kevin L.', rating: 4, text: 'Great knowledge on strength training. Pushes me to my limits in a good way.' },
];

const PACKAGES = [
  { id: '1', label: 'Single Session', sessions: 1, discount: 0 },
  { id: '2', label: '4 Sessions', sessions: 4, discount: 5 },
  { id: '3', label: '8 Sessions', sessions: 8, discount: 10 },
  { id: '4', label: '12 Sessions', sessions: 12, discount: 15 },
];

export default function TrainerDetailScreen({ route, navigation }) {
  const { trainer } = route.params;
  const priceNum = parseInt(trainer.price.replace(/[^0-9]/g, ''));

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const finalPrice = Math.round(priceNum * selectedPkg.sessions * (1 - selectedPkg.discount / 100));

  const handleBook = () => {
    if (!selectedDay || !selectedSlot) {
      Alert.alert('Please select a day and time slot before booking.');
      return;
    }
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('Payment', {
      booking: {
        trainerName: trainer.name,
        package: selectedPkg.label,
        day: selectedDay,
        time: selectedSlot,
        total: finalPrice,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>{trainer.emoji}</Text>
          </View>
          <Text style={styles.trainerName}>{trainer.name}</Text>
          <Text style={styles.trainerSpec}>{trainer.spec}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>📍 {trainer.loc}</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>⭐ {trainer.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{trainer.sessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{trainer.price}</Text>
              <Text style={styles.statLabel}>Per Hour</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SPECIALTIES</Text>
          <View style={styles.tagRow}>
            {trainer.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <Text style={styles.aboutText}>
            {trainer.name} is a certified personal trainer based in {trainer.loc} specialising in {trainer.spec.toLowerCase()}.
            With {trainer.sessions}+ completed sessions and a {trainer.rating} star rating, they bring results-driven
            training directly to your home or preferred location. No gym membership needed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT PACKAGE</Text>
          {PACKAGES.map(pkg => {
            const pkgPrice = Math.round(priceNum * pkg.sessions * (1 - pkg.discount / 100));
            const isActive = selectedPkg.id === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[styles.pkgRow, isActive && styles.pkgRowActive]}
                onPress={() => setSelectedPkg(pkg)}
              >
                <View style={styles.pkgLeft}>
                  <Text style={[styles.pkgLabel, isActive && styles.pkgLabelActive]}>{pkg.label}</Text>
                  {pkg.discount > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{pkg.discount}% OFF</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.pkgPrice, isActive && styles.pkgPriceActive]}>RM {pkgPrice}</Text>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT DAY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DAYS.map(day => (
              <TouchableOpacity
                key={day}
                style={[styles.dayPill, selectedDay === day && styles.dayPillActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT TIME</Text>
          <View style={styles.slotsGrid}>
            {SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotBtn, selectedSlot === slot && styles.slotBtnActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REVIEWS</Text>
          {REVIEWS.map(r => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Text style={styles.reviewStars}>{'⭐'.repeat(r.rating)}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>{selectedPkg.label}</Text>
          <Text style={styles.footerPrice}>RM {finalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Trainer</Text>
              <Text style={styles.modalValue}>{trainer.name}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Day</Text>
              <Text style={styles.modalValue}>{selectedDay}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Time</Text>
              <Text style={styles.modalValue}>{selectedSlot}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Package</Text>
              <Text style={styles.modalValue}>{selectedPkg.label}</Text>
            </View>
            <View style={[styles.modalRow, styles.modalRowTotal]}>
              <Text style={styles.modalLabelBold}>Total</Text>
              <Text style={styles.modalTotal}>RM {finalPrice}</Text>
            </View>
            <Text style={styles.modalNote}>
              Payment will be collected via DuitNow or FPX on the next screen.
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleConfirm}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
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
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backIcon: { fontSize: 20, color: colors.gold },
  backText: { fontSize: 14, color: colors.gold },
  hero: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.xl, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  avatarWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.dark3, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.gold, marginBottom: spacing.md },
  avatarEmoji: { fontSize: 50 },
  trainerName: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: 0.5 },
  trainerSpec: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  locationRow: { marginTop: spacing.sm },
  locationText: { fontSize: 12, color: colors.gold },
  statsRow: { flexDirection: 'row', marginTop: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden', alignSelf: 'stretch', marginHorizontal: spacing.xl },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 0.5, backgroundColor: colors.dark4 },
  section: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: { backgroundColor: colors.dark3, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, borderWidth: 0.5, borderColor: colors.gold },
  tagText: { fontSize: 12, color: colors.gold, fontWeight: '500' },
  aboutText: { fontSize: 13, color: colors.textMuted, lineHeight: 22 },
  pkgRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4 },
  pkgRowActive: { borderColor: colors.gold },
  pkgLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pkgLabel: { fontSize: 14, color: colors.text },
  pkgLabelActive: { color: colors.gold, fontWeight: '600' },
  pkgPrice: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginRight: spacing.md },
  pkgPriceActive: { color: colors.gold },
  discountBadge: { backgroundColor: colors.greenBg, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  discountText: { fontSize: 10, color: colors.green, fontWeight: '600' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold },
  dayPill: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm },
  dayPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  dayText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  dayTextActive: { color: '#000' },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slotBtn: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.sm, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  slotBtnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  slotText: { fontSize: 13, color: colors.textMuted },
  slotTextActive: { color: '#000', fontWeight: '600' },
  reviewCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  reviewName: { fontSize: 13, fontWeight: '600', color: colors.text },
  reviewStars: { fontSize: 11 },
  reviewText: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, backgroundColor: colors.dark2, borderTopWidth: 0.5, borderTopColor: colors.dark4, gap: spacing.md },
  footerInfo: { flex: 1 },
  footerLabel: { fontSize: 11, color: colors.textMuted },
  footerPrice: { fontSize: 20, fontWeight: '700', color: colors.gold },
  bookBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  bookBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.dark2, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, borderTopWidth: 0.5, borderColor: colors.dark4 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.gold, marginBottom: spacing.xl, letterSpacing: 1 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  modalRowTotal: { borderBottomWidth: 0, marginTop: spacing.sm },
  modalLabel: { fontSize: 13, color: colors.textMuted },
  modalLabelBold: { fontSize: 14, fontWeight: '600', color: colors.text },
  modalValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  modalTotal: { fontSize: 20, fontWeight: '700', color: colors.gold },
  modalNote: { fontSize: 12, color: colors.textMuted, marginTop: spacing.lg, lineHeight: 18 },
  modalBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  modalCancel: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dark3, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  modalCancelText: { fontSize: 14, color: colors.textMuted, fontWeight: '500' },
  modalConfirm: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.gold, alignItems: 'center' },
  modalConfirmText: { fontSize: 14, color: '#000', fontWeight: '700' },
});
