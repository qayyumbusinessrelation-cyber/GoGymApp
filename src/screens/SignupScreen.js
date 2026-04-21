import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSignup = async () => {
    if (!form.fullName.trim()) { Alert.alert('Please enter your full name.'); return; }
    if (!form.email.trim()) { Alert.alert('Please enter your email.'); return; }
    if (!form.phone.trim()) { Alert.alert('Please enter your phone number.'); return; }
    if (form.password.length < 8) { Alert.alert('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { Alert.alert('Passwords do not match.'); return; }
    if (!agreed) { Alert.alert('Please agree to the Terms of Service and Privacy Policy.'); return; }

    setLoading(true);

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
    });

    if (error) {
      setLoading(false);
      Alert.alert('Signup failed', error.message);
      return;
    }

    // Insert into users table
    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: 'client',
    });

    setLoading(false);

    if (dbError) {
      Alert.alert('Error', 'Account created but profile setup failed. Please contact support.');
      return;
    }

    Alert.alert(
      'Account Created!',
      'Welcome to GoGym! Please check your email to verify your account, then sign in.',
      [{ text: 'Sign In', onPress: () => navigation.replace('Login') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.sub}>Join GoGym and find your perfect trainer</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={form.fullName}
              onChangeText={v => set('fullName', v)}
              placeholder="As per IC"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={v => set('email', v)}
              placeholder="you@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={v => set('phone', v)}
              placeholder="+60 12-345 6789"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                value={form.password}
                onChangeText={v => set('password', v)}
                placeholder="Minimum 8 characters"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={v => set('confirmPassword', v)}
              placeholder="Re-enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            {form.password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={[styles.strengthBar, { backgroundColor: form.password.length >= 8 ? colors.green : colors.red }]} />
                <View style={[styles.strengthBar, { backgroundColor: form.password.length >= 10 ? colors.green : colors.dark4 }]} />
                <View style={[styles.strengthBar, { backgroundColor: form.password.length >= 12 ? colors.green : colors.dark4 }]} />
                <Text style={styles.strengthText}>
                  {form.password.length < 8 ? 'Too short' : form.password.length < 10 ? 'Fair' : form.password.length < 12 ? 'Good' : 'Strong'}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.agreeRow} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.agreeText}>
                I agree to GoGym's{' '}
                <Text style={styles.agreeLink} onPress={() => navigation.navigate('Terms')}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.agreeLink} onPress={() => navigation.navigate('Privacy')}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signupBtn, loading && styles.btnDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.signupBtnText}>Create Account</Text>
              }
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkGold}>Sign in</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.lg },
  backIcon: { fontSize: 20, color: colors.gold },
  backText: { fontSize: 14, color: colors.gold },
  titleWrap: { marginBottom: spacing.xl },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  card: { backgroundColor: colors.dark3, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 0.5, borderColor: colors.dark4 },
  label: { fontSize: 12, fontWeight: '500', color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: colors.dark, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4 },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4 },
  passwordInput: { flex: 1, padding: spacing.md, color: colors.text, fontSize: 14 },
  eyeBtn: { paddingHorizontal: spacing.md },
  eyeIcon: { fontSize: 18 },
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthText: { fontSize: 11, color: colors.textMuted, minWidth: 50 },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.lg },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.dark4, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  checkmark: { fontSize: 13, color: '#000', fontWeight: '700' },
  agreeText: { flex: 1, fontSize: 13, color: colors.textMuted, lineHeight: 20 },
  agreeLink: { color: colors.gold, fontWeight: '500' },
  signupBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  signupBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
  loginLink: { alignItems: 'center', marginTop: spacing.xl },
  loginLinkText: { fontSize: 13, color: colors.textMuted },
  loginLinkGold: { color: colors.gold, fontWeight: '600' },
});
