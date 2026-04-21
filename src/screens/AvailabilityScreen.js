import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
];

const INITIAL_AVAILABILITY = {
  Mon: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM'],
  Tue: ['9:00 AM', '10:00 AM'],
  Wed: ['2:00 PM', '3:00 PM', '4:00 PM'],
  Thu: [],
  Fri: ['9:00 AM', '5:00 PM', '6:00 PM'],
  Sat: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
  Sun: [],
};

const BOOKED_SLOTS = {
  Mon: ['10:00 AM'],
  Sat: ['9:00 AM'],
};

export default function AvailabilityScreen({ navigation }) {
  const [activeDay, setActiveDay] = useState('Mon');
  const [availability, setAvailability] = useState(INITIAL_AVAILABILITY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSlot = (slot) => {
    const booked = (BOOKED_SLOTS[activeDay] || []).includes(slot);
    if (booked) {
      Alert.alert('This slot is already booked by a client and cannot be removed.');
      return;
    }
    setAvailability(prev => {
      const current = prev[activeDay] || [];
      const updated = current.includes(slot)
        ? current.filter(s => s !== slot)
        : [...current, slot];
      return { ...prev, [activeDay]: updated };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(res => setTimeout(res, 1200));
    setSaving(false);
    setSaved(true);
    Alert.alert('Saved!', 'Your availability has been updated.');
  };

  const totalSlots = Object.values(availability).reduce((a, b) => a + b.length, 0);
  const bookedCount = Object.values(BOOKED_SLOTS).reduce((a, b) => a + b.length, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>My Availability</Text>
          <Text style={styles.sub}>Manage your bookable time slots</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalSlots}</Text>
          <Text style={styles.statLabel}>Open slots</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{bookedCount}</Text>
          <Text style={styles.statLabel}>Booked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{totalSlots - bookedCount}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* Day selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
        {DAYS.map(day => {
          const hasSlots = (availability[day] || []).length > 0;
          const hasBooking = (BOOKED_SLOTS[day] || []).length > 0;
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayPill, activeDay === day && styles.dayPillActive]}
              onPress={() => setActiveDay(day)}
            >
              <Text style={[styles.dayText, activeDay === day && styles.dayTextActive]}>{day}</Text>
              {hasBooking && <View style={styles.bookedDot} />}
              {hasSlots && !hasBooking && <View style={styles.availableDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.slotsScroll}>
        <View style={styles.slotsSection}>
          <Text style={styles.sectionTitle}>
            {activeDay.toUpperCase()} — TAP TO TOGGLE SLOTS
          </Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.green }]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.dark4 }]} />
              <Text style={styles.legendText}>Off</Text>
            </View>
          </View>

          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map(slot => {
              const isAvailable = (availability[activeDay] || []).includes(slot);
              const isBooked = (BOOKED_SLOTS[activeDay] || []).includes(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slot,
                    isBooked && styles.slotBooked,
                    isAvailable && !isBooked && styles.slotAvailable,
                  ]}
                  onPress={() => toggleSlot(slot)}
                >
                  <Text style={[
                    styles.slotText,
                    isBooked && styles.slotTextBooked,
                    isAvailable && !isBooked && styles.slotTextAvailable,
                  ]}>{slot}</Text>
                  {isBooked && <Text style={styles.slotBadge}>Booked</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Weekly overview */}
        <View style={styles.weekSection}>
          <Text style={styles.sectionTitle}>WEEKLY OVERVIEW</Text>
          {DAYS.map(day => {
            const slots = availability[day] || [];
            const booked = BOOKED_SLOTS[day] || [];
            return (
              <TouchableOpacity
                key={day}
                style={styles.weekRow}
                onPress={() => setActiveDay(day)}
              >
                <Text style={[styles.weekDay, activeDay === day && styles.weekDayActive]}>{day}</Text>
                <View style={styles.weekSlots}>
                  {slots.length === 0 ? (
                    <Text style={styles.weekEmpty}>No slots set</Text>
                  ) : (
                    slots.map(s => (
                      <View key={s} style={[styles.weekSlotPill, booked.includes(s) && styles.weekSlotPillBooked]}>
                        <Text style={[styles.weekSlotText, booked.includes(s) && styles.weekSlotTextBooked]}>{s}</Text>
                      </View>
                    ))
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.saveBtnText}>{saved ? 'Saved ✓' : 'Save Availability'}</Text>
          }
        </TouchableOpacity>
      </View>
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
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, marginBottom: spacing.lg },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statDivider: { width: 0.5, backgroundColor: colors.dark4 },
  statValue: { fontSize: 22, fontWeight: '700', color: colors.gold },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  dayScroll: { paddingLeft: spacing.xl, marginBottom: spacing.lg, flexGrow: 0 },
  dayPill: { paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm, alignItems: 'center', position: 'relative' },
  dayPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  dayText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  dayTextActive: { color: '#000' },
  bookedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green, position: 'absolute', top: 4, right: 4 },
  availableDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold, position: 'absolute', top: 4, right: 4 },
  slotsScroll: { flex: 1 },
  slotsSection: { paddingHorizontal: spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  legend: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textMuted },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: { paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.sm, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, minWidth: 90, alignItems: 'center' },
  slotAvailable: { backgroundColor: 'rgba(201,168,76,0.15)', borderColor: colors.gold },
  slotBooked: { backgroundColor: 'rgba(93,202,130,0.15)', borderColor: colors.green },
  slotText: { fontSize: 12, color: colors.textMuted },
  slotTextAvailable: { color: colors.gold, fontWeight: '600' },
  slotTextBooked: { color: colors.green, fontWeight: '600' },
  slotBadge: { fontSize: 9, color: colors.green, marginTop: 2 },
  weekSection: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  weekRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.dark4, gap: spacing.md },
  weekDay: { fontSize: 13, fontWeight: '600', color: colors.textMuted, width: 36, paddingTop: 4 },
  weekDayActive: { color: colors.gold },
  weekSlots: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  weekEmpty: { fontSize: 12, color: colors.dark4 },
  weekSlotPill: { backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.gold },
  weekSlotPillBooked: { backgroundColor: 'rgba(93,202,130,0.15)', borderColor: colors.green },
  weekSlotText: { fontSize: 10, color: colors.gold },
  weekSlotTextBooked: { color: colors.green },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.xl, backgroundColor: colors.dark2, borderTopWidth: 0.5, borderTopColor: colors.dark4 },
  saveBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
});
