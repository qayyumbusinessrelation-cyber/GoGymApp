import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SESSIONS = [
  { id: '1', client: 'Aiman F.', time: '9:00 AM', type: 'Weight Loss', color: '#C9A84C', day: 22, month: 4, year: 2026 },
  { id: '2', client: 'Nurul H.', time: '11:00 AM', type: 'Yoga', color: '#5dca82', day: 22, month: 4, year: 2026 },
  { id: '3', client: 'Kevin L.', time: '3:00 PM', type: 'Strength', color: '#f57a7a', day: 23, month: 4, year: 2026 },
  { id: '4', client: 'Sarah M.', time: '10:00 AM', type: 'HIIT', color: '#C9A84C', day: 24, month: 4, year: 2026 },
  { id: '5', client: 'Aiman F.', time: '9:00 AM', type: 'Weight Loss', color: '#C9A84C', day: 25, month: 4, year: 2026 },
  { id: '6', client: 'Kevin L.', time: '2:00 PM', type: 'Strength', color: '#f57a7a', day: 26, month: 4, year: 2026 },
  { id: '7', client: 'Nurul H.', time: '9:00 AM', type: 'Yoga', color: '#5dca82', day: 28, month: 4, year: 2026 },
  { id: '8', client: 'Sarah M.', time: '11:00 AM', type: 'HIIT', color: '#C9A84C', day: 29, month: 4, year: 2026 },
];

const CLIENTS = ['All', 'Aiman F.', 'Nurul H.', 'Kevin L.', 'Sarah M.'];

function getDaysInMonth(month, year) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(month, year) { return new Date(year, month, 1).getDay(); }

export default function PTCalendarScreen({ navigation }) {
  const today = new Date();
  const [view, setView] = useState('weekly');
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedClient, setSelectedClient] = useState('All');

  const getWeekDays = () => {
    const start = new Date(currentYear, currentMonth, selectedDay);
    const dow = start.getDay();
    start.setDate(start.getDate() - dow);
    return Array(7).fill(null).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getSessionsForDay = (day, month, year) =>
    SESSIONS.filter(s => s.day === day && s.month === month && s.year === year &&
      (selectedClient === 'All' || s.client === selectedClient));

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const weekDays = getWeekDays();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const selectedDaySessions = getSessionsForDay(selectedDay, currentMonth + 1, currentYear);
  const totalThisMonth = SESSIONS.filter(s => s.month === currentMonth + 1 && s.year === currentYear).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>PT Calendar</Text>
          <Text style={styles.sub}>{totalThisMonth} sessions this month</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.toggleRow}>
        {['weekly', 'monthly'].map(v => (
          <TouchableOpacity key={v} style={[styles.toggleBtn, view === v && styles.toggleBtnActive]} onPress={() => setView(v)}>
            <Text style={[styles.toggleText, view === v && styles.toggleTextActive]}>{v === 'weekly' ? 'Weekly' : 'Monthly'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clientFilter}>
        {CLIENTS.map(c => (
          <TouchableOpacity key={c} style={[styles.clientPill, selectedClient === c && styles.clientPillActive]} onPress={() => setSelectedClient(c)}>
            <Text style={[styles.clientPillText, selectedClient === c && styles.clientPillTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* MONTHLY VIEW */}
        {view === 'monthly' && (
          <View style={styles.monthlyWrap}>
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={prevMonth} style={styles.monthNavBtn}><Text style={styles.monthNavIcon}>‹</Text></TouchableOpacity>
              <Text style={styles.monthTitle}>{MONTHS[currentMonth]} {currentYear}</Text>
              <TouchableOpacity onPress={nextMonth} style={styles.monthNavBtn}><Text style={styles.monthNavIcon}>›</Text></TouchableOpacity>
            </View>
            <View style={styles.dayLabels}>
              {DAYS_SHORT.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
            </View>
            <View style={styles.calGrid}>
              {Array(firstDay).fill(null).map((_, i) => <View key={`e${i}`} style={styles.calCell} />)}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const sessions = getSessionsForDay(day, currentMonth + 1, currentYear);
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                const isSelected = day === selectedDay;
                return (
                  <TouchableOpacity key={day} style={[styles.calCell, isSelected && styles.calCellSelected, isToday && !isSelected && styles.calCellToday]} onPress={() => setSelectedDay(day)}>
                    <Text style={[styles.calDayNum, isSelected && styles.calDayNumSelected, isToday && !isSelected && styles.calDayNumToday]}>{day}</Text>
                    <View style={styles.sessionDots}>
                      {sessions.slice(0, 3).map((s, idx) => (
                        <View key={idx} style={[styles.dot, { backgroundColor: s.color }]} />
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* WEEKLY VIEW */}
        {view === 'weekly' && (
          <View style={styles.weeklyWrap}>
            <View style={styles.weekRow}>
              {weekDays.map((d, i) => {
                const day = d.getDate();
                const month = d.getMonth() + 1;
                const year = d.getFullYear();
                const sessions = getSessionsForDay(day, month, year);
                const isToday = day === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                const isSelected = day === selectedDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                return (
                  <TouchableOpacity key={i} style={[styles.weekCell, isSelected && styles.weekCellSelected]}
                    onPress={() => { setSelectedDay(day); setCurrentMonth(d.getMonth()); setCurrentYear(d.getFullYear()); }}>
                    <Text style={[styles.weekDayName, isSelected && styles.weekDayNameSelected]}>{DAYS_SHORT[d.getDay()]}</Text>
                    <View style={[styles.weekDayNum, isToday && styles.weekDayNumToday, isSelected && styles.weekDayNumSelected]}>
                      <Text style={[styles.weekDayNumText, (isToday || isSelected) && styles.weekDayNumTextSelected]}>{day}</Text>
                    </View>
                    <View style={styles.sessionDots}>
                      {sessions.slice(0, 2).map((s, idx) => (
                        <View key={idx} style={[styles.dot, { backgroundColor: s.color }]} />
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Selected day sessions */}
        <View style={styles.daySessionsWrap}>
          <Text style={styles.sectionTitle}>
            {selectedDay} {MONTHS[currentMonth].substring(0,3).toUpperCase()} — SESSIONS
          </Text>
          {selectedDaySessions.length === 0 ? (
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayText}>No sessions scheduled</Text>
              <TouchableOpacity style={styles.addSessionBtn}>
                <Text style={styles.addSessionBtnText}>+ Add Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            selectedDaySessions.map(s => (
              <View key={s.id} style={[styles.sessionCard, { borderLeftColor: s.color }]}>
                <View style={styles.sessionCardLeft}>
                  <Text style={styles.sessionTime}>{s.time}</Text>
                  <Text style={styles.sessionClient}>{s.client}</Text>
                  <Text style={styles.sessionType}>{s.type}</Text>
                </View>
                <View style={styles.sessionCardActions}>
                  <TouchableOpacity style={styles.sessionActionBtn} onPress={() => navigation.navigate('ClientProgram', { clientName: s.client })}>
                    <Text style={styles.sessionActionText}>Program</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sessionActionBtn, styles.sessionActionBtnGold]}>
                    <Text style={styles.sessionActionTextGold}>Log Session</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Weekly summary stats */}
        <View style={styles.summaryWrap}>
          <Text style={styles.sectionTitle}>THIS WEEK</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{weekDays.reduce((a, d) => a + getSessionsForDay(d.getDate(), d.getMonth() + 1, d.getFullYear()).length, 0)}</Text>
              <Text style={styles.summaryLabel}>Sessions</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{new Set(weekDays.flatMap(d => getSessionsForDay(d.getDate(), d.getMonth() + 1, d.getFullYear()).map(s => s.client))).size}</Text>
              <Text style={styles.summaryLabel}>Clients</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryValue}>{weekDays.filter(d => getSessionsForDay(d.getDate(), d.getMonth() + 1, d.getFullYear()).length > 0).length}</Text>
              <Text style={styles.summaryLabel}>Active Days</Text>
            </View>
          </View>
        </View>

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
  toggleRow: { flexDirection: 'row', marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.gold },
  toggleText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  toggleTextActive: { color: '#000', fontWeight: '700' },
  clientFilter: { paddingLeft: spacing.xl, marginBottom: spacing.md, flexGrow: 0 },
  clientPill: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm },
  clientPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  clientPillText: { fontSize: 12, color: colors.textMuted },
  clientPillTextActive: { color: '#000', fontWeight: '600' },
  monthlyWrap: { paddingHorizontal: spacing.xl },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  monthNavBtn: { padding: spacing.sm },
  monthNavIcon: { fontSize: 24, color: colors.gold },
  monthTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  dayLabels: { flexDirection: 'row', marginBottom: spacing.sm },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCell: { width: '14.28%', aspectRatio: 0.9, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4, borderRadius: radius.sm },
  calCellSelected: { backgroundColor: colors.gold },
  calCellToday: { backgroundColor: colors.dark3 },
  calDayNum: { fontSize: 13, color: colors.text, fontWeight: '400' },
  calDayNumSelected: { color: '#000', fontWeight: '700' },
  calDayNumToday: { color: colors.gold, fontWeight: '700' },
  sessionDots: { flexDirection: 'row', gap: 2, marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  weeklyWrap: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  weekRow: { flexDirection: 'row', gap: 4 },
  weekCell: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  weekCellSelected: { borderColor: colors.gold },
  weekDayName: { fontSize: 10, color: colors.textMuted, marginBottom: 4 },
  weekDayNameSelected: { color: colors.gold },
  weekDayNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  weekDayNumToday: { backgroundColor: colors.dark4 },
  weekDayNumSelected: { backgroundColor: colors.gold },
  weekDayNumText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  weekDayNumTextSelected: { color: '#000', fontWeight: '700' },
  daySessionsWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  emptyDay: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  emptyDayText: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  addSessionBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  addSessionBtnText: { fontSize: 13, fontWeight: '700', color: '#000' },
  sessionCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, borderLeftWidth: 3, flexDirection: 'row', alignItems: 'center' },
  sessionCardLeft: { flex: 1 },
  sessionTime: { fontSize: 13, fontWeight: '700', color: colors.gold },
  sessionClient: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 2 },
  sessionType: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  sessionCardActions: { gap: spacing.sm },
  sessionActionBtn: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: colors.dark4, alignItems: 'center' },
  sessionActionBtnGold: { backgroundColor: 'rgba(201,168,76,0.15)', borderWidth: 0.5, borderColor: colors.gold },
  sessionActionText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },
  sessionActionTextGold: { fontSize: 11, color: colors.gold, fontWeight: '600' },
  summaryWrap: { paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  summaryRow: { flexDirection: 'row', backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4 },
  summaryBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  summaryValue: { fontSize: 22, fontWeight: '700', color: colors.gold },
  summaryLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
});
