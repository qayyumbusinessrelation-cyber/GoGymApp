import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Switch, Alert,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const STATS = [
  { label: 'Sessions', value: '13' },
  { label: 'Trainers', value: '3' },
  { label: 'This Month', value: '4' },
];

export default function ProfileScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);

  const MENU_ITEMS = [
    { id: 'edit', icon: '✏️', label: 'Edit Profile', action: () => Alert.alert('Coming Soon', 'Edit profile will be available soon.') },
    { id: 'payment', icon: '💳', label: 'Payment Methods', action: () => Alert.alert('Coming Soon', 'Saved payment methods coming soon.') },
    { id: 'notifications', icon: '🔔', label: 'Notifications', toggle: true },
    { id: 'language', icon: '🌐', label: 'Language', value: 'English' },
    { id: 'help', icon: '❓', label: 'Help & Support', action: () => navigation.navigate('Help') },
    { id: 'terms', icon: '📄', label: 'Terms of Service', action: () => navigation.navigate('Terms') },
    { id: 'privacy', icon: '🔒', label: 'Privacy Policy', action: () => navigation.navigate('Privacy') },
    { id: 'logout', icon: '🚪', label: 'Log Out', danger: true, action: () => Alert.alert('Log Out', 'Are you sure you want to log out?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log Out', style: 'destructive', onPress: () => Alert.alert('Logged out!') }]) },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>👤</Text>
            <TouchableOpacity style={styles.editAvatar}>
              <Text style={styles.editAvatarText}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Danish</Text>
          <Text style={styles.userEmail}>danish@gogym.my</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberText}>⭐ GoGym Member</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuRow, index < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
                onPress={item.action}
                activeOpacity={item.toggle ? 1 : 0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
                <View style={styles.menuRight}>
                  {item.toggle && (
                    <Switch
                      value={notifications}
                      onValueChange={setNotifications}
                      trackColor={{ false: colors.dark4, true: colors.gold }}
                      thumbColor={notifications ? '#000' : colors.textMuted}
                    />
                  )}
                  {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
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
  section: { paddingHorizontal: spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
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
});
