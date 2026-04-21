import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) { Alert.alert('Please enter your email.'); return; }
    if (!password.trim()) { Alert.alert('Please enter your password.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      navigation.replace('Main');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>💪</Text>
            </View>
            <Text style={styles.logo}><Text style={styles.logoGold}>Go</Text>Gym</Text>
            <Text style={styles.tagline}>Malaysia's PT Marketplace</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSub}>Sign in to your account</Text>

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.loginBtnText}>Sign In</Text>
              }
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.signupBtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupBtnText}>Create an Account</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.trainerLink}
            onPress={() => navigation.navigate('BecomeTrainer')}
          >
            <Text style={styles.trainerLinkText}>Are you a trainer? Join our network →</Text>
          </TouchableOpacity>

          <Text style={styles.legalNote}>
            By signing in you agree to our Terms of Service and Privacy Policy.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.dark3, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.gold, marginBottom: spacing.md },
  logoEmoji: { fontSize: 36 },
  logo: { fontSize: 32, fontWeight: '700', color: colors.text, letterSpacing: 3 },
  logoGold: { color: colors.gold },
  tagline: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  card: { backgroundColor: colors.dark3, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 0.5, borderColor: colors.dark4 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  cardSub: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.xl },
  label: { fontSize: 12, fontWeight: '500', color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: colors.dark, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4 },
  passwordWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4 },
  passwordInput: { flex: 1, padding: spacing.md, color: colors.text, fontSize: 14 },
  eyeBtn: { paddingHorizontal: spacing.md },
  eyeIcon: { fontSize: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: spacing.sm, marginBottom: spacing.lg },
  forgotText: { fontSize: 13, color: colors.gold },
  loginBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg },
  btnDisabled: { opacity: 0.6 },
  loginBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  divider: { flex: 1, height: 0.5, backgroundColor: colors.dark4 },
  dividerText: { fontSize: 12, color: colors.textMuted },
  signupBtn: { borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.gold },
  signupBtnText: { fontSize: 15, fontWeight: '600', color: colors.gold },
  trainerLink: { alignItems: 'center', marginTop: spacing.xl },
  trainerLinkText: { fontSize: 13, color: colors.textMuted },
  legalNote: { fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});
