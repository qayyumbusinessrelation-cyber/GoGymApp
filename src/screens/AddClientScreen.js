import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

const GOALS = ['Weight Loss', 'Muscle Gain', 'Strength', 'Cardio', 'Yoga', 'Flexibility', 'HIIT', 'Rehabilitation', 'General Fitness', 'Sport Specific'];
const HEALTH_CONDITIONS = ['None', 'Hypertension', 'Diabetes', 'Heart Condition', 'Joint Issues', 'Back Pain', 'Asthma', 'Pregnancy', 'Post Surgery'];
const FITNESS_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function AddClientScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    fitnessLevel: 'Beginner',
    goals: [],
    healthConditions: [],
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleGoal = (g) => setForm(prev => ({
    ...prev,
    goals: prev.goals.includes(g) ? prev.goals.filter(x => x !== g) : [...prev.goals, g],
  }));

  const toggleHealth = (h) => setForm(prev => ({
    ...prev,
    healthConditions: prev.healthConditions.includes(h) ? prev.healthConditions.filter(x => x !== h) : [...prev.healthConditions, h],
  }));

  const handleSave = async () => {
    if (!form.fullName.trim()) { Alert.alert('Please enter client name.'); return; }
    if (!form.phone.trim()) { Alert.alert('Please enter client phone number.'); return; }
    setSaving(true);
    await new Promise(res => setTimeout(res, 1000));
    setSaving(false);
    Alert.alert(
      'Client Added!',
      `${form.fullName} has been added to your client list.`,
      [{ text: 'Done', onPress: () => navigation.goBack() }]
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
          <Text style={styles.title}>Add New Client</Text>
          <Text style={styles.sub}>Register client into your CRM</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} keyboardShouldPersistTaps="handled">

        <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
        <Field label="Full name *" value={form.fullName} onChange={v => set('fullName', v)} placeholder="Client full name" />
        <Field label="Phone number *" value={form.phone} onChange={v => set('phone', v)} placeholder="+60 12-345 6789" keyboardType="phone-pad" />
        <Field label="Email address" value={form.email} onChange={v => set('email', v)} placeholder="client@email.com" keyboardType="email-address" />
        <Field label="Age" value={form.age} onChange={v => set('age', v)} placeholder="e.g. 28" keyboardType="numeric" />

        <Text style={styles.sectionTitle}>BODY METRICS</Text>
        <View style={styles.inlineFields}>
          <View style={styles.inlineField}>
            <Field label="Weight (kg)" value={form.weight} onChange={v => set('weight', v)} placeholder="e.g. 75" keyboardType="numeric" />
          </View>
          <View style={styles.inlineField}>
            <Field label="Height (cm)" value={form.height} onChange={v => set('height', v)} placeholder="e.g. 170" keyboardType="numeric" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>FITNESS LEVEL</Text>
        <View style={styles.pillRow}>
          {FITNESS_LEVELS.map(l => (
            <TouchableOpacity key={l} style={[styles.pill, form.fitnessLevel === l && styles.pillActive]} onPress={() => set('fitnessLevel', l)}>
              <Text style={[styles.pillText, form.fitnessLevel === l && styles.pillTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>FITNESS GOALS</Text>
        <View style={styles.pillRow}>
          {GOALS.map(g => (
            <TouchableOpacity key={g} style={[styles.pill, form.goals.includes(g) && styles.pillActive]} onPress={() => toggleGoal(g)}>
              <Text style={[styles.pillText, form.goals.includes(g) && styles.pillTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>HEALTH CONDITIONS</Text>
        <Text style={styles.healthNote}>This information is confidential and only visible to you as their trainer.</Text>
        <View style={styles.pillRow}>
          {HEALTH_CONDITIONS.map(h => (
            <TouchableOpacity key={h} style={[styles.pill, form.healthConditions.includes(h) && styles.pillActiveRed]} onPress={() => toggleHealth(h)}>
              <Text style={[styles.pillText, form.healthConditions.includes(h) && styles.pillTextActiveRed]}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>TRAINER NOTES</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={form.notes}
          onChangeText={v => set('notes', v)}
          placeholder="Initial assessment notes, client background, special requirements..."
          placeholderTextColor={colors.textMuted}
          multiline
        />

        <View style={styles.inviteBox}>
          <Text style={styles.inviteTitle}>📱 Invite client to GoGym?</Text>
          <Text style={styles.inviteText}>Once saved, you can send your client an invite link so they can download the app and view their bookings and progress directly.</Text>
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>Send Invite Link via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>Save Client</Text>}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType }) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
      />
    </View>
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
  content: { flex: 1, paddingHorizontal: spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md, marginTop: spacing.lg },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  input: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4 },
  inlineFields: { flexDirection: 'row', gap: spacing.sm },
  inlineField: { flex: 1 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillActiveRed: { backgroundColor: 'rgba(245,122,122,0.15)', borderColor: colors.red },
  pillText: { fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: '#000', fontWeight: '600' },
  pillTextActiveRed: { color: colors.red, fontWeight: '600' },
  healthNote: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.md, fontStyle: 'italic' },
  inviteBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.gold, marginTop: spacing.lg },
  inviteTitle: { fontSize: 14, fontWeight: '600', color: colors.gold, marginBottom: spacing.sm },
  inviteText: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.md },
  inviteBtn: { backgroundColor: 'rgba(93,202,130,0.15)', borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: colors.green },
  inviteBtnText: { fontSize: 13, color: colors.green, fontWeight: '600' },
  saveBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
});
