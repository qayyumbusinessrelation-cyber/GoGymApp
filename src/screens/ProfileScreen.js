import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Switch, Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { supabase } from '../lib/supabase';

const STATS = [
  { label: 'Sessions', value: '13' },
  { label: 'Trainers', value: '3' },
  { label: 'This Month', value: '4' },
];

export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [userRole, setUserRole] = useState('trainer');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email);
    const { data } = await supabase.from('users').select('full_name, phone, role').eq('id', user.id).single();
    if (data) {
      setUserName(data.full_name || '');
      setUserRole(data.role || 'client');
      setEditForm({ fullName: data.full_name || '', phone: data.phone || '' });
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) { Alert.alert('Please enter your name.'); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('users').update({ full_name: editForm.fullName.trim(), phone: editForm.phone.trim() }).eq('id', user.id);
    setSaving(false);
    setUserName(editForm.fullName.trim());
    setEditModalVisible(false);
    Alert.alert('Profile updated!');
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await supabase.auth.signOut();
        navigation.replace('Login');
      }},
    ]);
  };

  const CLIENT_MENU = [
    { id: 'edit', icon: '✏️', label: 'Edit Profile', action: () => setEditModalVisible(true) },
    { id: 'payment', icon: '💳', label: 'Payment Methods', action: () => Alert.alert('Coming Soon', 'Saved payment methods coming soon.') },
    { id: 'notifications', icon: '🔔', label: 'Notifications', toggle: true },
    { id: 'language', icon: '🌐', label: 'Language', value: 'English', action: () => Alert.alert('Coming Soon', 'Bahasa Malaysia and Chinese support coming soon.') },
    { id: 'help', icon: '❓', label: 'Help & Support', action: () => navigation.navigate('Help') },
    { id: 'terms', icon: '📄', label: 'Terms of Service', action: () => navigation.navigate('Terms') },
    { id: 'privacy', icon: '🔒', label: 'Privacy Policy', action: () => navigation.navigate('Privacy') },
    { id: 'logout', icon: '🚪', label: 'Log Out', danger: true, action: handleLogout },
  ];

  const PT_SUITE = [
    { id: 'calendar', icon: '📅', label: 'PT Calendar', sub: 'View & manage sessions', action: () => navigation.navigate('PTCalendar') },
    { id: 'program', icon: '📋', label: 'Client Programs', sub: 'Build training programs', action: () => navigation.navigate('ClientProgram', { clientName: 'Aiman F.' }) },
    { id: 'tracker', icon: '💪', label: 'Session Tracker', sub: 'Log sets, reps & weights', action: () => navigation.navigate('SessionTracker', {}) },
    { id: 'progress', icon: '📈', label: 'Client Progress', sub: 'View performance graphs', action: () => navigation.navigate('ClientProgress', { clientName: 'Aiman F.' }) },
    { id: 'earnings', icon: '💰', label: 'My Earnings', sub: 'Payouts & commission', action: () => navigation.navigate('TrainerEarnings') },
    { id: 'availability', icon: '🗓️', label: 'Availability', sub: 'Manage time slots', action: () => navigation.navigate('Availability') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.title}>Profile</Text></View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>👤</Text>
            <TouchableOpacity style={styles.editAvatar} onPress={() => setEditModalVisible(true)}>
              <Text style={styles.editAvatarText}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userName || 'GoGym User'}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>{userRole === 'trainer' ? '🏋️ GoGym Trainer' : '⭐ GoGym Member'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={s.label} style={[styles.statBox, i < STATS.length - 1 && styles.statBorder]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* PT Suite — trainer only */}
        {userRole === 'trainer' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PT SUITE</Text>
            <View style={styles.ptGrid}>
              {PT_SUITE.map(item => (
                <TouchableOpacity key={item.id} style={styles.ptCard} onPress={item.action}>
                  <Text style={styles.ptIcon}>{item.icon}</Text>
                  <Text style={styles.ptLabel}>{item.label}</Text>
                  <Text style={styles.ptSub}>{item.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.menuCard}>
            {CLIENT_MENU.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuRow, index < CLIENT_MENU.length - 1 && styles.menuRowBorder]}
                onPress={item.action}
                activeOpacity={item.toggle ? 1 : 0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
                <View style={styles.menuRight}>
                  {item.toggle && (
                    <Switch value={notifications} onValueChange={setNotifications}
                      trackColor={{ false: colors.dark4, true: colors.gold }}
                      thumbColor={notifications ? '#000' : colors.textMuted} />
                  )}
                  {item.value && !item.toggle && <Text style={styles.menuValue}>{item.value}</Text>}
                  {!item.toggle && !item.danger && <Text style={styles.menuChevron}>›</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GoGym v1.0.0</Text>
          <Text style={styles.footerText}>Made with 💪 in Malaysia</Text>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.fieldLabel}>Full name</Text>
            <TextInput style={styles.input} value={editForm.fullName} onChangeText={v => setEditForm(p => ({ ...p, fullName: v }))} placeholder="Your full name" placeholderTextColor={colors.textMuted} />
            <Text style={styles.fieldLabel}>Phone number</Text>
            <TextInput style={styles.input} value={editForm.phone} onChangeText={v => setEditForm(p => ({ ...p, phone: v }))} placeholder="+60 12-345 6789" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalConfirm, saving && { opacity: 0.6 }]} onPress={handleSaveProfile} disabled={saving}>
                {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.modalConfirmText}>Save</Text>}
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
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, letterSpacing: 0.5 },
  profileCard: { alignItems: 'center', paddingBottom: spacing.xl, borderBottomWidth: 0.5, borderBottomColor: colors.dark4, marginHorizontal: spacing.xl },
  avatarWrap: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.dark3, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.gold, marginBottom: spacing.md, position: 'relative' },
  avatarEmoji: { fontSize: 44 },
  editAvatar: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  editAvatarText: { fontSize: 12 },
  userName: { fontSize: 20, fontWeight: '700', color: colors.text },
  userEmail: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  memberBadge: { marginTop: spacing.md, backgroundColor: colors.dark3, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, borderWidth: 0.5, borderColor: colors.gold },
  memberText: { fontSize: 12, color: colors.gold, fontWeight: '500' },
  statsRow: { flexDirection: 'row', marginHorizontal: spacing.xl, marginVertical: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statBorder: { borderRightWidth: 0.5, borderRightColor: colors.dark4 },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.gold },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  ptGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  ptCard: { width: '48%', backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  ptIcon: { fontSize: 24, marginBottom: spacing.sm },
  ptLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  ptSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  menuCard: { backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  menuRowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  menuIcon: { fontSize: 18, width: 28, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: 14, color: colors.text },
  menuLabelDanger: { color: colors.red },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  menuValue: { fontSize: 13, color: colors.textMuted },
  menuChevron: { fontSize: 20, color: colors.textMuted },
  footer: { alignItems: 'center', paddingTop: spacing.xl, gap: 4 },
  footerText: { fontSize: 12, color: colors.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.dark2, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, borderTopWidth: 0.5, borderColor: colors.dark4 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.gold, marginBottom: spacing.xl },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  input: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 14, borderWidth: 0.5, borderColor: colors.dark4 },
  modalBtns: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  modalCancel: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.dark3, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  modalCancelText: { fontSize: 14, color: colors.textMuted },
  modalConfirm: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.gold, alignItems: 'center' },
  modalConfirmText: { fontSize: 14, color: '#000', fontWeight: '700' },
});
