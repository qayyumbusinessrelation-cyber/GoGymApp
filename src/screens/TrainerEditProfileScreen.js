import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

const SPECIALTIES = [
  'Weight Loss', 'Strength', 'Cardio', 'Yoga', 'Pilates',
  'Muay Thai', 'Calisthenics', 'HIIT', 'Mobility', 'Powerlifting',
  'Bodybuilding', 'Corporate Wellness', 'Senior Fitness', 'Pre/Post Natal',
];

const SESSION_TYPES = ['Home Visit', 'Gym Session', 'Outdoor / Park', 'Online / Virtual'];

const STATES = [
  'Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak',
  'Negeri Sembilan', 'Melaka', 'Pahang', 'Sabah', 'Sarawak',
  'Kedah', 'Kelantan', 'Terengganu', 'Perlis', 'Putrajaya',
];

export default function TrainerEditProfileScreen({ navigation }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    state: '',
    area: '',
    bio: '',
    specialties: [],
    sessionTypes: [],
    ratePerHour: '',
    travelRadius: '',
    experience: '',
    certName: '',
    certBody: '',
    profilePhoto: null,
    certPhoto: null,
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (data) {
      setForm(prev => ({
        ...prev,
        fullName: data.full_name || '',
        phone: data.phone || '',
        email: data.email || user.email || '',
      }));
    }
  };

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleSpecialty = (s) => setForm(prev => ({
    ...prev,
    specialties: prev.specialties.includes(s) ? prev.specialties.filter(x => x !== s) : [...prev.specialties, s],
  }));

  const toggleSessionType = (s) => setForm(prev => ({
    ...prev,
    sessionTypes: prev.sessionTypes.includes(s) ? prev.sessionTypes.filter(x => x !== s) : [...prev.sessionTypes, s],
  }));

  const pickImage = async (field) => {
    Alert.alert('Upload Photo', 'Choose a source', [
      { text: 'Camera', onPress: async () => {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) { Alert.alert('Camera permission required.'); return; }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: field === 'profilePhoto' ? [1,1] : [4,3], quality: 0.8 });
        if (!result.canceled) set(field, result.assets[0].uri);
      }},
      { text: 'Gallery', onPress: async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) { Alert.alert('Gallery permission required.'); return; }
        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: field === 'profilePhoto' ? [1,1] : [4,3], quality: 0.8 });
        if (!result.canceled) set(field, result.assets[0].uri);
      }},
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) { Alert.alert('Please enter your full name.'); return; }
    if (!form.phone.trim()) { Alert.alert('Please enter your phone number.'); return; }
    if (!form.bio.trim()) { Alert.alert('Please write a short bio.'); return; }
    if (form.specialties.length === 0) { Alert.alert('Please select at least one specialty.'); return; }
    if (!form.ratePerHour.trim()) { Alert.alert('Please enter your rate per hour.'); return; }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('users').update({
      full_name: form.fullName.trim(),
      phone: form.phone.trim(),
    }).eq('id', user.id);
    setSaving(false);
    Alert.alert('Profile Updated!', 'Your trainer profile has been saved successfully.', [
      { text: 'Done', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Edit Trainer Profile</Text>
          <Text style={styles.sub}>Update your public profile</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content} keyboardShouldPersistTaps="handled">

        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.profilePhotoWrap} onPress={() => pickImage('profilePhoto')}>
            {form.profilePhoto ? (
              <Image source={{ uri: form.profilePhoto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Text style={styles.photoPlaceholderEmoji}>📷</Text>
                <Text style={styles.photoPlaceholderText}>Tap to upload{'\n'}profile photo</Text>
              </View>
            )}
            <View style={styles.photoEditBadge}>
              <Text style={styles.photoEditText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>This is what clients see on your profile</Text>
        </View>

        {/* Personal Details */}
        <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>
        <Field label="Full name *" value={form.fullName} onChange={v => set('fullName', v)} placeholder="As per IC" />
        <Field label="Phone number *" value={form.phone} onChange={v => set('phone', v)} placeholder="+60 12-345 6789" keyboardType="phone-pad" />
        <Field label="Email address" value={form.email} onChange={v => set('email', v)} placeholder="you@email.com" keyboardType="email-address" />

        {/* Location */}
        <Text style={styles.sectionTitle}>LOCATION</Text>
        <Text style={styles.fieldLabel}>State</Text>
        <View style={styles.pillGrid}>
          {STATES.map(s => (
            <TouchableOpacity key={s} style={[styles.pill, form.state === s && styles.pillActive]} onPress={() => set('state', s === form.state ? '' : s)}>
              <Text style={[styles.pillText, form.state === s && styles.pillTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Field label="Area / Neighbourhood" value={form.area} onChange={v => set('area', v)} placeholder="e.g. Wangsa Maju, Cheras, Subang" />
        <Field label="Travel radius (km)" value={form.travelRadius} onChange={v => set('travelRadius', v)} placeholder="e.g. 15" keyboardType="numeric" />

        {/* Professional */}
        <Text style={styles.sectionTitle}>PROFESSIONAL DETAILS</Text>
        <Field label="Years of experience *" value={form.experience} onChange={v => set('experience', v)} placeholder="e.g. 5" keyboardType="numeric" />
        <Field label="Certification name *" value={form.certName} onChange={v => set('certName', v)} placeholder="e.g. ACE CPT, NASM, REPS Malaysia" />
        <Field label="Certifying body" value={form.certBody} onChange={v => set('certBody', v)} placeholder="e.g. ACE, NASM, ACSM" />

        {/* Certification Photo */}
        <Text style={styles.fieldLabel}>Certification document</Text>
        <TouchableOpacity style={styles.certUpload} onPress={() => pickImage('certPhoto')}>
          {form.certPhoto ? (
            <View style={styles.certUploaded}>
              <Image source={{ uri: form.certPhoto }} style={styles.certThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.certUploadedTitle}>✅ Document uploaded</Text>
                <Text style={styles.certUploadedSub}>Tap to replace</Text>
              </View>
            </View>
          ) : (
            <View style={styles.certPlaceholder}>
              <Text style={styles.photoPlaceholderEmoji}>📄</Text>
              <Text style={styles.photoPlaceholderText}>Upload certification photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Bio */}
        <Text style={styles.sectionTitle}>YOUR BIO</Text>
        <Text style={styles.fieldLabel}>Bio (visible to clients) *</Text>
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          value={form.bio}
          onChangeText={v => set('bio', v)}
          placeholder="Tell clients about your training philosophy, experience, and what makes you different. Be specific about results you've helped clients achieve..."
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <Text style={styles.charCount}>{form.bio.length} / 500 characters</Text>

        {/* Specialties */}
        <Text style={styles.sectionTitle}>SPECIALTIES</Text>
        <View style={styles.pillGrid}>
          {SPECIALTIES.map(s => (
            <TouchableOpacity key={s} style={[styles.pill, form.specialties.includes(s) && styles.pillActive]} onPress={() => toggleSpecialty(s)}>
              <Text style={[styles.pillText, form.specialties.includes(s) && styles.pillTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Session Types */}
        <Text style={styles.sectionTitle}>SESSION TYPES OFFERED</Text>
        <View style={styles.pillGrid}>
          {SESSION_TYPES.map(s => (
            <TouchableOpacity key={s} style={[styles.pill, form.sessionTypes.includes(s) && styles.pillActive]} onPress={() => toggleSessionType(s)}>
              <Text style={[styles.pillText, form.sessionTypes.includes(s) && styles.pillTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pricing */}
        <Text style={styles.sectionTitle}>PRICING</Text>
        <Field label="Rate per hour (RM) *" value={form.ratePerHour} onChange={v => set('ratePerHour', v)} placeholder="e.g. 80" keyboardType="numeric" />
        {form.ratePerHour ? (
          <View style={styles.rateBreakdown}>
            <Text style={styles.rateTitle}>Your earnings breakdown</Text>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Client pays</Text>
              <Text style={styles.rateValue}>RM {form.ratePerHour}/hr</Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>GoGym commission (9%)</Text>
              <Text style={styles.rateValueRed}>- RM {(parseFloat(form.ratePerHour) * 0.09).toFixed(2)}</Text>
            </View>
            <View style={[styles.rateRow, { borderTopWidth: 0.5, borderTopColor: colors.dark4, paddingTop: spacing.sm }]}>
              <Text style={styles.rateLabelBold}>You receive</Text>
              <Text style={styles.rateValueGold}>RM {(parseFloat(form.ratePerHour) * 0.91).toFixed(2)}/hr</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.saveBtnText}>Save Profile</Text>}
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
  photoSection: { alignItems: 'center', paddingVertical: spacing.xl },
  profilePhotoWrap: { width: 100, height: 100, borderRadius: 50, position: 'relative' },
  profilePhoto: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: colors.gold },
  profilePhotoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.dark3, borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderEmoji: { fontSize: 28 },
  photoPlaceholderText: { fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 4 },
  photoEditBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  photoEditText: { fontSize: 14 },
  photoHint: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md, marginTop: spacing.lg },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  input: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4, marginBottom: spacing.sm },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: '#000', fontWeight: '600' },
  certUpload: { backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden', marginBottom: spacing.sm },
  certPlaceholder: { alignItems: 'center', paddingVertical: spacing.lg },
  certUploaded: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  certThumb: { width: 56, height: 56, borderRadius: radius.sm },
  certUploadedTitle: { fontSize: 13, color: colors.green, fontWeight: '600' },
  certUploadedSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  charCount: { fontSize: 11, color: colors.textMuted, textAlign: 'right', marginBottom: spacing.sm },
  rateBreakdown: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.dark4, marginBottom: spacing.md },
  rateTitle: { fontSize: 12, fontWeight: '600', color: colors.gold, marginBottom: spacing.md },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rateLabel: { fontSize: 13, color: colors.textMuted },
  rateLabelBold: { fontSize: 13, fontWeight: '600', color: colors.text },
  rateValue: { fontSize: 13, color: colors.text },
  rateValueRed: { fontSize: 13, color: colors.red },
  rateValueGold: { fontSize: 15, fontWeight: '700', color: colors.gold },
  saveBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.lg },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
});
