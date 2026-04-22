import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const PREV_SESSION = {
  'Barbell Bench Press': [
    { set: 1, reps: 8, weight: '60kg' },
    { set: 2, reps: 8, weight: '60kg' },
    { set: 3, reps: 7, weight: '60kg' },
    { set: 4, reps: 7, weight: '60kg' },
  ],
  'Incline Dumbbell Press': [
    { set: 1, reps: 10, weight: '20kg' },
    { set: 2, reps: 10, weight: '20kg' },
    { set: 3, reps: 9, weight: '20kg' },
  ],
  'Cable Flyes': [
    { set: 1, reps: 12, weight: '15kg' },
    { set: 2, reps: 12, weight: '15kg' },
    { set: 3, reps: 11, weight: '15kg' },
  ],
};

export default function SessionTrackerScreen({ route, navigation }) {
  const clientName = route?.params?.clientName || 'Aiman F.';
  const day = route?.params?.day || 'Day 1';
  const exercises = route?.params?.exercises || [
    { id: '1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight: '60kg', notes: '' },
    { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '20kg', notes: '' },
    { id: '3', name: 'Cable Flyes', sets: 3, reps: '12-15', weight: '15kg', notes: '' },
  ];

  const initLogs = () => {
    const logs = {};
    exercises.forEach(ex => {
      logs[ex.id] = Array(ex.sets).fill(null).map((_, i) => ({
        set: i + 1,
        reps: '',
        weight: ex.weight || '',
        done: false,
      }));
    });
    return logs;
  };

  const [logs, setLogs] = useState(initLogs);
  const [sessionNotes, setSessionNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const updateLog = (exId, setIdx, field, value) => {
    setLogs(prev => ({
      ...prev,
      [exId]: prev[exId].map((s, i) => i === setIdx ? { ...s, [field]: value } : s),
    }));
  };

  const toggleSetDone = (exId, setIdx) => {
    setLogs(prev => ({
      ...prev,
      [exId]: prev[exId].map((s, i) => i === setIdx ? { ...s, done: !s.done } : s),
    }));
  };

  const completedSets = Object.values(logs).flat().filter(s => s.done).length;
  const totalSets = Object.values(logs).flat().length;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  const handleSaveSession = () => {
    Alert.alert(
      'Session Saved!',
      `Great work! ${completedSets}/${totalSets} sets completed for ${clientName}.`,
      [{ text: 'Done', onPress: () => { setSaved(true); navigation.goBack(); } }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{clientName} — {day}</Text>
          <Text style={styles.sub}>Session Tracker</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedSets}/{totalSets} sets</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>

        {exercises.map(ex => {
          const prev = PREV_SESSION[ex.name];
          const exLogs = logs[ex.id] || [];

          return (
            <View key={ex.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseTarget}>{ex.sets} × {ex.reps} @ {ex.weight}</Text>
              </View>

              {/* Previous session reference */}
              {prev && (
                <View style={styles.prevWrap}>
                  <Text style={styles.prevLabel}>LAST SESSION</Text>
                  <View style={styles.prevRow}>
                    {prev.map((p, i) => (
                      <View key={i} style={styles.prevBadge}>
                        <Text style={styles.prevBadgeText}>S{p.set}: {p.reps}r @ {p.weight}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Set logging */}
              <View style={styles.setHeader}>
                <Text style={styles.setCol}>SET</Text>
                <Text style={styles.setCol}>WEIGHT</Text>
                <Text style={styles.setCol}>REPS</Text>
                <Text style={[styles.setCol, { width: 40 }]}>✓</Text>
              </View>

              {exLogs.map((s, idx) => (
                <View key={idx} style={[styles.setRow, s.done && styles.setRowDone]}>
                  <Text style={styles.setNum}>{s.set}</Text>
                  <TextInput
                    style={styles.setInput}
                    value={s.weight}
                    onChangeText={v => updateLog(ex.id, idx, 'weight', v)}
                    placeholder={ex.weight}
                    placeholderTextColor={colors.textMuted}
                  />
                  <TextInput
                    style={styles.setInput}
                    value={s.reps}
                    onChangeText={v => updateLog(ex.id, idx, 'reps', v)}
                    placeholder={ex.reps.split('-')[0]}
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={[styles.checkBtn, s.done && styles.checkBtnDone]}
                    onPress={() => toggleSetDone(ex.id, idx)}
                  >
                    <Text style={styles.checkBtnText}>{s.done ? '✓' : ''}</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {ex.notes ? <Text style={styles.exerciseNotes}>📝 {ex.notes}</Text> : null}
            </View>
          );
        })}

        {/* Session notes */}
        <View style={styles.notesWrap}>
          <Text style={styles.sectionTitle}>SESSION NOTES</Text>
          <TextInput
            style={styles.notesInput}
            value={sessionNotes}
            onChangeText={setSessionNotes}
            placeholder="How did the session go? Client energy, form improvements, areas to work on..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveSession}>
          <Text style={styles.saveBtnText}>Save Session Log</Text>
        </TouchableOpacity>

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
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  progressWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  progressBar: { flex: 1, height: 6, backgroundColor: colors.dark3, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: colors.gold, borderRadius: 3 },
  progressText: { fontSize: 12, color: colors.gold, fontWeight: '600', minWidth: 60 },
  content: { flex: 1, paddingHorizontal: spacing.xl },
  exerciseCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  exerciseHeader: { marginBottom: spacing.sm },
  exerciseName: { fontSize: 15, fontWeight: '700', color: colors.text },
  exerciseTarget: { fontSize: 11, color: colors.gold, marginTop: 2 },
  prevWrap: { backgroundColor: colors.dark4, borderRadius: radius.sm, padding: spacing.sm, marginBottom: spacing.sm },
  prevLabel: { fontSize: 9, color: colors.textMuted, letterSpacing: 1.5, marginBottom: 4 },
  prevRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  prevBadge: { backgroundColor: colors.dark3, borderRadius: radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  prevBadgeText: { fontSize: 10, color: colors.textMuted },
  setHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, paddingHorizontal: 4 },
  setCol: { flex: 1, fontSize: 9, color: colors.textMuted, letterSpacing: 1, fontWeight: '600' },
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, backgroundColor: colors.dark, borderRadius: radius.sm, padding: spacing.sm, gap: spacing.sm },
  setRowDone: { backgroundColor: 'rgba(93,202,130,0.08)', borderWidth: 0.5, borderColor: colors.green },
  setNum: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.textMuted },
  setInput: { flex: 1, backgroundColor: colors.dark3, borderRadius: radius.sm, padding: spacing.sm, color: colors.text, fontSize: 13, textAlign: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  checkBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  checkBtnDone: { backgroundColor: colors.green, borderColor: colors.green },
  checkBtnText: { fontSize: 14, color: '#000', fontWeight: '700' },
  exerciseNotes: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm, fontStyle: 'italic' },
  notesWrap: { marginTop: spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  notesInput: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 13, borderWidth: 0.5, borderColor: colors.dark4, height: 100, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
});
