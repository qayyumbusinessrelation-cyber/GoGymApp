import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '../theme/colors';

const SPECIALTIES = [
  'Weight Loss', 'Strength', 'Cardio', 'Yoga', 'Pilates',
  'Muay Thai', 'Calisthenics', 'HIIT', 'Mobility', 'Powerlifting',
  'Bodybuilding', 'Corporate Wellness', 'Senior Fitness', 'Pre/Post Natal',
];

const STATES = [
  'Kuala Lumpur', 'Selangor', 'Johor', 'Penang', 'Perak',
  'Negeri Sembilan', 'Melaka', 'Pahang', 'Sabah', 'Sarawak',
  'Kedah', 'Kelantan', 'Terengganu', 'Perlis', 'Putrajaya',
];

const STEPS = ['Personal', 'Professional', 'Pricing', 'Review'];

export default function BecomeTrainerScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    state: '',
    bio: '',
    specialties: [],
    certName: '',
    certBody: '',
    experience: '',
    ratePerHour: '',
    travelRadius: '',
    homeVisit: true,
    gymSession: false,
    outdoor: false,
    profilePhoto: null,
    certPhoto: null,
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleSpec = (spec) => {
    setForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter(s => s !== spec)
        : [...prev.specialties, spec],
    }));
  };

  const toggleState = (state) => set('state', state === form.state ? '' : state);

  const pickImage = async (field) => {
    Alert.alert(
      'Upload Photo',
      'Choose a source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const perm = await ImagePicker.requestCameraPermissionsAsync();
            if (!perm.granted) { Alert.alert('Camera permission is required.'); return; }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: field === 'profilePhoto' ? [1, 1] : [4, 3],
              quality: 0.8,
            });
            if (!result.canceled) set(field, result.assets[0].uri);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) { Alert.alert('Gallery permission is required.'); return; }
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: field === 'profilePhoto' ? [1, 1] : [4, 3],
              quality: 0.8,
            });
            if (!result.canceled) set(field, result.assets[0].uri);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.fullName.trim()) { Alert.alert('Please enter your full name.'); return false; }
      if (!form.phone.trim()) { Alert.alert('Please enter your phone number.'); return false; }
      if (!form.email.trim()) { Alert.alert('Please enter your email.'); return false; }
      if (!form.state) { Alert.alert('Please select your state.'); return false; }
    }
    if (step === 1) {
      if (form.specialties.length === 0) { Alert.alert('Please select at least one specialty.'); return false; }
      if (!form.certName.trim()) { Alert.alert('Please enter your certification name.'); return false; }
      if (!form.experience.trim()) { Alert.alert('Please enter your years of experience.'); return false; }
      if (!form.bio.trim()) { Alert.alert('Please write a short bio.'); return false; }
      if (!form.certPhoto) { Alert.alert('Please upload your certification document.'); return false; }
    }
    if (step === 2) {
      if (!form.ratePerHour.trim()) { Alert.alert('Please enter your rate per hour.'); return false; }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const back = () => setStep(s => s - 1);

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Application Submitted!',
        'Thank you for applying to join GoGym. Our team will review your profile and certifications within 2-3 business days. We will contact you via email once approved.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step === 0 ? navigation.goBack() : back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Become a PT</Text>
          <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* STEP 0 — Personal */}
        {step === 0 && (
          <View style={styles.stepWrap}>
            <Text style={styles.stepTitle}>Personal details</Text>
            <Text style={styles.stepSub}>Tell us a bit about yourself</Text>

            {/* Profile photo */}
            <Text style={styles.fieldLabel}>Profile photo</Text>
            <TouchableOpacity style={styles.photoUpload} onPress={() => pickImage('profilePhoto')}>
              {form.profilePhoto ? (
                <Image source={{ uri: form.profilePhoto }} style={styles.profilePhotoPreview} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoIcon}>📷</Text>
                  <Text style={styles.photoText}>Tap to upload photo</Text>
                  <Text style={styles.photoSub}>Camera or gallery</Text>
                </View>
              )}
            </TouchableOpacity>
            {form.profilePhoto && (
              <TouchableOpacity onPress={() => pickImage('profilePhoto')}>
                <Text style={styles.changePhoto}>Change photo</Text>
              </TouchableOpacity>
            )}

            <Field label="Full name" value={form.fullName} onChange={v => set('fullName', v)} placeholder="As per IC" />
            <Field label="Phone number" value={form.phone} onChange={v => set('phone', v)} placeholder="+60 12-345 6789" keyboardType="phone-pad" />
            <Field label="Email address" value={form.email} onChange={v => set('email', v)} placeholder="you@email.com" keyboardType="email-address" />

            <Text style={styles.fieldLabel}>State</Text>
            <View style={styles.pillGrid}>
              {STATES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.pill, form.state === s && styles.pillActive]}
                  onPress={() => toggleState(s)}
                >
                  <Text style={[styles.pillText, form.state === s && styles.pillTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 1 — Professional */}
        {step === 1 && (
          <View style={styles.stepWrap}>
            <Text style={styles.stepTitle}>Professional background</Text>
            <Text style={styles.stepSub}>Your qualifications and expertise</Text>

            <Text style={styles.fieldLabel}>Specialties (select all that apply)</Text>
            <View style={styles.pillGrid}>
              {SPECIALTIES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.pill, form.specialties.includes(s) && styles.pillActive]}
                  onPress={() => toggleSpec(s)}
                >
                  <Text style={[styles.pillText, form.specialties.includes(s) && styles.pillTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Field label="Certification name" value={form.certName} onChange={v => set('certName', v)} placeholder="e.g. ACE CPT, NASM, REPS Malaysia" />
            <Field label="Certifying body" value={form.certBody} onChange={v => set('certBody', v)} placeholder="e.g. ACE, NASM, ACSM" />
            <Field label="Years of experience" value={form.experience} onChange={v => set('experience', v)} placeholder="e.g. 3" keyboardType="numeric" />

            <Text style={styles.fieldLabel}>Short bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.bio}
              onChangeText={v => set('bio', v)}
              placeholder="Tell potential clients about your training style and approach..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
            />

            {/* Cert upload */}
            <Text style={styles.fieldLabel}>Certification document</Text>
            <TouchableOpacity style={styles.certUpload} onPress={() => pickImage('certPhoto')}>
              {form.certPhoto ? (
                <View style={styles.certUploaded}>
                  <Image source={{ uri: form.certPhoto }} style={styles.certPreview} />
                  <View style={styles.certUploadedInfo}>
                    <Text style={styles.certUploadedTitle}>Document uploaded</Text>
                    <Text style={styles.certUploadedSub}>Tap to change</Text>
                  </View>
                  <Text style={styles.certCheck}>✓</Text>
                </View>
              ) : (
                <View style={styles.certPlaceholder}>
                  <Text style={styles.photoIcon}>📄</Text>
                  <Text style={styles.photoText}>Upload certification</Text>
                  <Text style={styles.photoSub}>Photo of your certificate or card</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2 — Pricing */}
        {step === 2 && (
          <View style={styles.stepWrap}>
            <Text style={styles.stepTitle}>Pricing & availability</Text>
            <Text style={styles.stepSub}>Set your rates and session types</Text>

            <Field label="Rate per hour (RM)" value={form.ratePerHour} onChange={v => set('ratePerHour', v)} placeholder="e.g. 80" keyboardType="numeric" />
            <Field label="Travel radius (km)" value={form.travelRadius} onChange={v => set('travelRadius', v)} placeholder="e.g. 15" keyboardType="numeric" />

            <Text style={styles.fieldLabel}>Session types offered</Text>
            <View style={styles.checkGroup}>
              <CheckRow label="Home visit" value={form.homeVisit} onToggle={() => set('homeVisit', !form.homeVisit)} />
              <CheckRow label="Gym session" value={form.gymSession} onToggle={() => set('gymSession', !form.gymSession)} />
              <CheckRow label="Outdoor / park" value={form.outdoor} onToggle={() => set('outdoor', !form.outdoor)} />
            </View>

            <View style={styles.commBox}>
              <Text style={styles.commTitle}>GoGym commission</Text>
              <Text style={styles.commText}>GoGym deducts 8-10% from each completed session. No upfront fees and no monthly subscription until we reach 100 trainers.</Text>
              <Text style={styles.commExample}>
                Example: RM {form.ratePerHour || '80'}/hr — you receive RM {Math.round((parseInt(form.ratePerHour) || 80) * 0.91)} after 9% commission
              </Text>
            </View>
          </View>
        )}

        {/* STEP 3 — Review */}
        {step === 3 && (
          <View style={styles.stepWrap}>
            <Text style={styles.stepTitle}>Review your application</Text>
            <Text style={styles.stepSub}>Check everything before submitting</Text>

            {form.profilePhoto && (
              <View style={styles.reviewPhotoWrap}>
                <Image source={{ uri: form.profilePhoto }} style={styles.reviewPhoto} />
                <Text style={styles.reviewPhotoName}>{form.fullName}</Text>
              </View>
            )}

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSection}>Personal</Text>
              <ReviewRow label="Name" value={form.fullName} />
              <ReviewRow label="Phone" value={form.phone} />
              <ReviewRow label="Email" value={form.email} />
              <ReviewRow label="State" value={form.state} />
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSection}>Professional</Text>
              <ReviewRow label="Specialties" value={form.specialties.join(', ')} />
              <ReviewRow label="Certification" value={form.certName} />
              <ReviewRow label="Experience" value={`${form.experience} years`} />
              <ReviewRow label="Certificate" value={form.certPhoto ? 'Uploaded' : 'Not uploaded'} />
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewSection}>Pricing</Text>
              <ReviewRow label="Rate" value={`RM ${form.ratePerHour}/hr`} />
              <ReviewRow label="Travel radius" value={`${form.travelRadius} km`} />
              <ReviewRow label="Session types" value={[form.homeVisit && 'Home', form.gymSession && 'Gym', form.outdoor && 'Outdoor'].filter(Boolean).join(', ')} />
            </View>

            <View style={styles.termsBox}>
              <Text style={styles.termsText}>
                By submitting, you agree to GoGym Terms of Service and confirm that all information provided is accurate. False information will result in permanent removal from the platform.
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
        {step < 3 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextBtnText}>Continue →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.nextBtn, submitting && styles.nextBtnDisabled]} onPress={submit} disabled={submitting}>
            {submitting
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.nextBtnText}>Submit Application</Text>
            }
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function Field({ label, value, onChange, placeholder, keyboardType }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
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

function CheckRow({ label, value, onToggle }) {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onToggle}>
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function ReviewRow({ label, value }) {
  return (
    <View style={styles.reviewRow}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: colors.gold },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  stepLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  progressBar: { height: 2, backgroundColor: colors.dark4, marginHorizontal: spacing.xl, borderRadius: 1 },
  progressFill: { height: 2, backgroundColor: colors.gold, borderRadius: 1 },
  scroll: { flex: 1 },
  stepWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  stepTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  stepSub: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xl },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4 },
  textArea: { height: 120, textAlignVertical: 'top' },
  pillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  pillTextActive: { color: '#000' },
  photoUpload: { backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden', marginBottom: spacing.sm },
  photoPlaceholder: { alignItems: 'center', paddingVertical: spacing.xl },
  photoIcon: { fontSize: 32, marginBottom: spacing.sm },
  photoText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  photoSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  profilePhotoPreview: { width: '100%', height: 200, resizeMode: 'cover' },
  changePhoto: { fontSize: 12, color: colors.gold, textAlign: 'center', marginBottom: spacing.md },
  certUpload: { backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden', marginBottom: spacing.sm },
  certPlaceholder: { alignItems: 'center', paddingVertical: spacing.lg },
  certUploaded: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  certPreview: { width: 60, height: 60, borderRadius: radius.sm, resizeMode: 'cover' },
  certUploadedInfo: { flex: 1 },
  certUploadedTitle: { fontSize: 14, color: colors.green, fontWeight: '500' },
  certUploadedSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  certCheck: { fontSize: 20, color: colors.green },
  checkGroup: { gap: spacing.sm, marginTop: spacing.sm },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  checkmark: { fontSize: 13, color: '#000', fontWeight: '700' },
  checkLabel: { fontSize: 14, color: colors.text },
  commBox: { marginTop: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderLeftWidth: 2, borderLeftColor: colors.gold },
  commTitle: { fontSize: 13, fontWeight: '600', color: colors.gold, marginBottom: spacing.sm },
  commText: { fontSize: 12, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.sm },
  commExample: { fontSize: 12, color: colors.green, fontWeight: '500' },
  reviewPhotoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  reviewPhoto: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: colors.gold },
  reviewPhotoName: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  reviewCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.dark4, marginBottom: spacing.md },
  reviewSection: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.gold, marginBottom: spacing.md },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  reviewLabel: { fontSize: 12, color: colors.textMuted },
  reviewValue: { fontSize: 12, color: colors.text, fontWeight: '500', flex: 1, textAlign: 'right', marginLeft: spacing.md },
  termsBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  termsText: { fontSize: 11, color: colors.textMuted, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.xl, backgroundColor: colors.dark2, borderTopWidth: 0.5, borderTopColor: colors.dark4 },
  nextBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
});
