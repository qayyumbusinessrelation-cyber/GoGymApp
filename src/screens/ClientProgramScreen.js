import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Modal, Alert,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio', 'Full Body'];

const INITIAL_PROGRAM = {
  'Day 1': {
    muscleGroup: 'Chest',
    exercises: [
      { id: '1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', weight: '60kg', notes: 'Focus on full range of motion' },
      { id: '2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', weight: '20kg', notes: '' },
      { id: '3', name: 'Cable Flyes', sets: 3, reps: '12-15', weight: '15kg', notes: 'Squeeze at peak contraction' },
    ],
  },
  'Day 2': {
    muscleGroup: 'Back',
    exercises: [
      { id: '4', name: 'Deadlift', sets: 4, reps: '5-6', weight: '80kg', notes: 'Keep back straight' },
      { id: '5', name: 'Pull Ups', sets: 3, reps: '8-10', weight: 'Bodyweight', notes: '' },
      { id: '6', name: 'Seated Row', sets: 3, reps: '10-12', weight: '50kg', notes: '' },
    ],
  },
  'Day 3': {
    muscleGroup: 'Legs',
    exercises: [
      { id: '7', name: 'Barbell Squat', sets: 4, reps: '8-10', weight: '70kg', notes: 'Depth below parallel' },
      { id: '8', name: 'Leg Press', sets: 3, reps: '12-15', weight: '100kg', notes: '' },
      { id: '9', name: 'Romanian Deadlift', sets: 3, reps: '10-12', weight: '50kg', notes: 'Feel the hamstring stretch' },
    ],
  },
};

export default function ClientProgramScreen({ route, navigation }) {
  const clientName = route?.params?.clientName || 'Aiman F.';
  const [program, setProgram] = useState(INITIAL_PROGRAM);
  const [activeDay, setActiveDay] = useState('Day 1');
  const [editModal, setEditModal] = useState(false);
  const [editExercise, setEditExercise] = useState(null);
  const [addDayModal, setAddDayModal] = useState(false);
  const [newDayGroup, setNewDayGroup] = useState('Chest');

  const days = Object.keys(program);

  const handleEditExercise = (ex) => {
    setEditExercise({ ...ex });
    setEditModal(true);
  };

  const handleSaveExercise = () => {
    if (!editExercise.name.trim()) { Alert.alert('Please enter exercise name.'); return; }
    setProgram(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        exercises: prev[activeDay].exercises.map(e => e.id === editExercise.id ? editExercise : e),
      },
    }));
    setEditModal(false);
  };

  const handleAddExercise = () => {
    const newEx = {
      id: Date.now().toString(),
      name: 'New Exercise',
      sets: 3,
      reps: '10-12',
      weight: '',
      notes: '',
    };
    setProgram(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        exercises: [...prev[activeDay].exercises, newEx],
      },
    }));
    setEditExercise(newEx);
    setEditModal(true);
  };

  const handleDeleteExercise = (id) => {
    Alert.alert('Delete Exercise', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setProgram(prev => ({
          ...prev,
          [activeDay]: {
            ...prev[activeDay],
            exercises: prev[activeDay].exercises.filter(e => e.id !== id),
          },
        }));
      }},
    ]);
  };

  const handleAddDay = () => {
    const newDay = `Day ${days.length + 1}`;
    setProgram(prev => ({
      ...prev,
      [newDay]: { muscleGroup: newDayGroup, exercises: [] },
    }));
    setActiveDay(newDay);
    setAddDayModal(false);
  };

  const currentDay = program[activeDay];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{clientName}</Text>
          <Text style={styles.sub}>Training Program</Text>
        </View>
        <TouchableOpacity style={styles.progressBtn} onPress={() => navigation.navigate('ClientProgress', { clientName })}>
          <Text style={styles.progressBtnText}>📈</Text>
        </TouchableOpacity>
      </View>

      {/* Day tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabs}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayTab, activeDay === day && styles.dayTabActive]}
            onPress={() => setActiveDay(day)}
          >
            <Text style={[styles.dayTabText, activeDay === day && styles.dayTabTextActive]}>{day}</Text>
            <Text style={[styles.dayTabMuscle, activeDay === day && styles.dayTabMuscleActive]}>{program[day].muscleGroup}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addDayTab} onPress={() => setAddDayModal(true)}>
          <Text style={styles.addDayTabText}>+ Day</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>

        {/* Day header */}
        <View style={styles.dayHeader}>
          <View>
            <Text style={styles.dayTitle}>{activeDay}</Text>
            <Text style={styles.dayMuscle}>{currentDay.muscleGroup} Day</Text>
          </View>
          <View style={styles.dayStats}>
            <Text style={styles.dayStatsText}>{currentDay.exercises.length} exercises</Text>
            <Text style={styles.dayStatsText}>{currentDay.exercises.reduce((a, e) => a + e.sets, 0)} total sets</Text>
          </View>
        </View>

        {/* Exercises */}
        {currentDay.exercises.map((ex, index) => (
          <View key={ex.id} style={styles.exerciseCard}>
            <View style={styles.exerciseTop}>
              <View style={styles.exerciseNum}>
                <Text style={styles.exerciseNumText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.metaBadge}><Text style={styles.metaBadgeText}>{ex.sets} sets</Text></View>
                  <View style={styles.metaBadge}><Text style={styles.metaBadgeText}>{ex.reps} reps</Text></View>
                  {ex.weight && <View style={styles.metaBadgeGold}><Text style={styles.metaBadgeGoldText}>{ex.weight}</Text></View>}
                </View>
                {ex.notes ? <Text style={styles.exerciseNotes}>📝 {ex.notes}</Text> : null}
              </View>
              <View style={styles.exerciseActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEditExercise(ex)}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteExercise(ex.id)}>
                  <Text style={styles.deleteBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addExerciseBtn} onPress={handleAddExercise}>
          <Text style={styles.addExerciseBtnText}>+ Add Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logSessionBtn} onPress={() => navigation.navigate('SessionTracker', { clientName, day: activeDay, exercises: currentDay.exercises })}>
          <Text style={styles.logSessionBtnText}>▶ Start Session & Log Progress</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Exercise Modal */}
      {editExercise && (
        <Modal visible={editModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Edit Exercise</Text>
              <Text style={styles.fieldLabel}>Exercise name</Text>
              <TextInput style={styles.input} value={editExercise.name} onChangeText={v => setEditExercise(p => ({ ...p, name: v }))} placeholderTextColor={colors.textMuted} placeholder="e.g. Bench Press" />
              <View style={styles.inlineFields}>
                <View style={styles.inlineField}>
                  <Text style={styles.fieldLabel}>Sets</Text>
                  <TextInput style={styles.input} value={String(editExercise.sets)} onChangeText={v => setEditExercise(p => ({ ...p, sets: parseInt(v) || 0 }))} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
                </View>
                <View style={styles.inlineField}>
                  <Text style={styles.fieldLabel}>Reps</Text>
                  <TextInput style={styles.input} value={editExercise.reps} onChangeText={v => setEditExercise(p => ({ ...p, reps: v }))} placeholderTextColor={colors.textMuted} placeholder="8-10" />
                </View>
                <View style={styles.inlineField}>
                  <Text style={styles.fieldLabel}>Weight</Text>
                  <TextInput style={styles.input} value={editExercise.weight} onChangeText={v => setEditExercise(p => ({ ...p, weight: v }))} placeholderTextColor={colors.textMuted} placeholder="60kg" />
                </View>
              </View>
              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={editExercise.notes} onChangeText={v => setEditExercise(p => ({ ...p, notes: v }))} placeholderTextColor={colors.textMuted} placeholder="Coaching cues, technique notes..." multiline />
              <View style={styles.modalBtns}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setEditModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalConfirm} onPress={handleSaveExercise}>
                  <Text style={styles.modalConfirmText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Add Day Modal */}
      <Modal visible={addDayModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Training Day</Text>
            <Text style={styles.fieldLabel}>Muscle group focus</Text>
            <View style={styles.muscleGrid}>
              {MUSCLE_GROUPS.map(mg => (
                <TouchableOpacity key={mg} style={[styles.musclePill, newDayGroup === mg && styles.musclePillActive]} onPress={() => setNewDayGroup(mg)}>
                  <Text style={[styles.musclePillText, newDayGroup === mg && styles.musclePillTextActive]}>{mg}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setAddDayModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleAddDay}>
                <Text style={styles.modalConfirmText}>Add Day</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backBtn: { width: 32 },
  backIcon: { fontSize: 22, color: colors.gold },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  progressBtn: { width: 32, alignItems: 'flex-end' },
  progressBtnText: { fontSize: 22 },
  dayTabs: { paddingLeft: spacing.xl, marginBottom: spacing.md, flexGrow: 0 },
  dayTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm, alignItems: 'center', minWidth: 72 },
  dayTabActive: { borderColor: colors.gold, backgroundColor: 'rgba(201,168,76,0.1)' },
  dayTabText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  dayTabTextActive: { color: colors.gold },
  dayTabMuscle: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  dayTabMuscleActive: { color: colors.gold },
  addDayTab: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm, alignItems: 'center', justifyContent: 'center', minWidth: 60 },
  addDayTabText: { fontSize: 12, color: colors.textMuted },
  content: { flex: 1, paddingHorizontal: spacing.xl },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  dayTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  dayMuscle: { fontSize: 13, color: colors.gold, marginTop: 2 },
  dayStats: { alignItems: 'flex-end', gap: 2 },
  dayStatsText: { fontSize: 11, color: colors.textMuted },
  exerciseCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4 },
  exerciseTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  exerciseNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  exerciseNumText: { fontSize: 13, fontWeight: '700', color: '#000' },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  exerciseMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaBadge: { backgroundColor: colors.dark4, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  metaBadgeText: { fontSize: 11, color: colors.textMuted },
  metaBadgeGold: { backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 0.5, borderColor: colors.gold },
  metaBadgeGoldText: { fontSize: 11, color: colors.gold, fontWeight: '600' },
  exerciseNotes: { fontSize: 11, color: colors.textMuted, marginTop: 6, fontStyle: 'italic' },
  exerciseActions: { gap: spacing.sm },
  editBtn: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: colors.dark4 },
  editBtnText: { fontSize: 11, color: colors.textMuted },
  deleteBtn: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: '#2a0000' },
  deleteBtnText: { fontSize: 11, color: colors.red },
  addExerciseBtn: { borderWidth: 1, borderColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm, borderStyle: 'dashed' },
  addExerciseBtnText: { fontSize: 14, color: colors.gold, fontWeight: '600' },
  logSessionBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  logSessionBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.dark2, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, borderTopWidth: 0.5, borderColor: colors.dark4 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.gold, marginBottom: spacing.lg },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4 },
  inlineFields: { flexDirection: 'row', gap: spacing.sm },
  inlineField: { flex: 1 },
  muscleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  musclePill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  musclePillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  musclePillText: { fontSize: 12, color: colors.textMuted },
  musclePillTextActive: { color: '#000', fontWeight: '600' },
  modalBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  modalCancel: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dark3, alignItems: 'center' },
  modalCancelText: { fontSize: 14, color: colors.textMuted },
  modalConfirm: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.gold, alignItems: 'center' },
  modalConfirmText: { fontSize: 14, color: '#000', fontWeight: '700' },
});
