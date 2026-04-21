import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert, Linking,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const FAQS = [
  {
    category: 'Booking',
    emoji: '📅',
    items: [
      { q: 'How do I book a trainer?', a: 'Browse trainers on the Home screen, tap on one you like, select your package, day and time slot, then tap Book Now. Review your booking summary and confirm to proceed to payment.' },
      { q: 'Can I book multiple sessions at once?', a: 'Yes! On the Trainer Detail screen, select a package of 4, 8, or 12 sessions. You will save up to 15% compared to single session pricing.' },
      { q: 'What happens after I book?', a: 'Once your payment is confirmed, your booking is locked in. Your trainer will receive a notification and will contact you to confirm the location details before your first session.' },
      { q: 'How do I view my upcoming bookings?', a: 'Tap the Bookings tab at the bottom of the screen. Your upcoming sessions are shown under the Upcoming tab, and past sessions under the Past tab.' },
    ],
  },
  {
    category: 'Cancellation & Refunds',
    emoji: '💰',
    items: [
      { q: 'What is GoGym cancellation policy?', a: 'If you cancel more than 24 hours before your session, you receive a full refund. If you cancel less than 24 hours before, you receive a 50% refund. If you do not show up, no refund is issued.' },
      { q: 'My trainer cancelled — what happens?', a: 'If a Trainer cancels, you receive a full refund automatically. GoGym will notify you immediately and you can rebook with the same or a different trainer.' },
      { q: 'How long does a refund take?', a: 'Refunds are processed within 3–7 business days depending on your bank or card issuer. GoGym will send you a confirmation email once the refund is initiated.' },
      { q: 'I have a dispute about a session. What do I do?', a: 'Contact GoGym Support via the Help screen or email us at support@gogym.my. We will investigate and respond within 2 business days. Refund decisions are made after review.' },
    ],
  },
  {
    category: 'Payments',
    emoji: '💳',
    items: [
      { q: 'What payment methods are accepted?', a: 'GoGym accepts DuitNow QR, FPX Online Banking (Maybank, CIMB, RHB, Hong Leong, Public Bank, AmBank), and Visa/Mastercard credit and debit cards.' },
      { q: 'Is my payment information safe?', a: 'Yes. GoGym does not store your card or bank details. All payments are processed through licensed Malaysian payment gateways that comply with PCI DSS security standards.' },
      { q: 'Can I get a receipt for my payment?', a: 'Yes. A payment confirmation and receipt is sent to your registered email address after every successful transaction. You can also view your booking history in the Bookings tab.' },
    ],
  },
  {
    category: 'Trainers',
    emoji: '💪',
    items: [
      { q: 'Are GoGym trainers verified?', a: 'All trainers submit their fitness certifications during registration. GoGym reviews these documents before approving any trainer listing. However, we recommend you also check a trainer\'s reviews and rating before booking.' },
      { q: 'Can I request a specific trainer?', a: 'Yes — simply tap on any trainer from the Home screen to view their full profile, availability, and book directly with them.' },
      { q: 'What if I am not happy with my trainer?', a: 'After your session, you can leave an honest rating and review. If you have a serious concern, contact GoGym Support and we will look into it.' },
      { q: 'Can trainers come to my home?', a: 'Most GoGym trainers offer home visits. Check the trainer\'s profile for the session types they offer — home visit, gym, or outdoor.' },
    ],
  },
  {
    category: 'Account',
    emoji: '👤',
    items: [
      { q: 'How do I update my profile?', a: 'Go to the Profile tab and tap Edit Profile to update your name, email, or phone number.' },
      { q: 'I forgot my password. What do I do?', a: 'On the login screen, tap Forgot Password and enter your registered email. A reset link will be sent to you within a few minutes.' },
      { q: 'How do I delete my account?', a: 'To request account deletion, email us at support@gogym.my with your registered email address. We will process your request within 7 business days. Note that transaction records are retained for legal compliance purposes.' },
    ],
  },
  {
    category: 'For Trainers',
    emoji: '🏋️',
    items: [
      { q: 'How do I join GoGym as a trainer?', a: 'Tap the "Are you a personal trainer?" banner on the Home screen and complete the 4-step registration. Submit your certification documents for verification. Approval takes 2–3 business days.' },
      { q: 'How does GoGym commission work?', a: 'GoGym charges 8–10% commission on each completed session. This is automatically deducted from client payments before your payout. There are no upfront fees.' },
      { q: 'When does the monthly subscription start?', a: 'The RM25/month subscription fee will only begin once GoGym reaches 100 active trainers on the platform. You will be given at least 30 days notice before it takes effect.' },
      { q: 'How do I receive my payments?', a: 'Payouts are transferred to your registered bank account within 3–5 business days after a session is completed and confirmed.' },
    ],
  },
];

const CONTACT_OPTIONS = [
  { icon: '✉️', label: 'Email Support', sub: 'support@gogym.my', action: () => Linking.openURL('mailto:support@gogym.my') },
  { icon: '💬', label: 'WhatsApp Us', sub: '+60 12-000 0000', action: () => Linking.openURL('whatsapp://send?phone=60120000000') },
  { icon: '🌐', label: 'Visit our website', sub: 'www.gogym.my', action: () => Linking.openURL('https://www.gogym.my') },
];

export default function HelpScreen({ navigation }) {
  const [expanded, setExpanded] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Booking');
  const [search, setSearch] = useState('');

  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const activeSection = FAQS.find(f => f.category === activeCategory);
  const filteredItems = search.trim()
    ? FAQS.flatMap(f => f.items).filter(item =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
      )
    : activeSection?.items || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.sub}>We are here to help</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search for help..."
            placeholderTextColor={colors.textMuted}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Contact options */}
        {!search && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTACT US</Text>
            {CONTACT_OPTIONS.map((opt, i) => (
              <TouchableOpacity key={i} style={styles.contactCard} onPress={opt.action}>
                <Text style={styles.contactIcon}>{opt.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{opt.label}</Text>
                  <Text style={styles.contactSub}>{opt.sub}</Text>
                </View>
                <Text style={styles.contactArrow}>→</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.responseTime}>
              <Text style={styles.responseTimeText}>⏱ Average response time: under 2 business days</Text>
            </View>
          </View>
        )}

        {/* Category tabs */}
        {!search && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {FAQS.map(f => (
                <TouchableOpacity
                  key={f.category}
                  style={[styles.catPill, activeCategory === f.category && styles.catPillActive]}
                  onPress={() => { setActiveCategory(f.category); setExpanded(null); }}
                >
                  <Text style={styles.catEmoji}>{f.emoji}</Text>
                  <Text style={[styles.catText, activeCategory === f.category && styles.catTextActive]}>{f.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* FAQ items */}
        <View style={styles.faqList}>
          {search && filteredItems.length === 0 && (
            <View style={styles.emptySearch}>
              <Text style={styles.emptyEmoji}>🤔</Text>
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySub}>Try different keywords or contact our support team directly</Text>
            </View>
          )}
          {filteredItems.map((item, index) => {
            const key = `${activeCategory}-${index}`;
            return (
              <TouchableOpacity
                key={key}
                style={styles.faqCard}
                onPress={() => toggle(key)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQ}>{item.q}</Text>
                  <Text style={styles.chevron}>{expanded === key ? '▲' : '▼'}</Text>
                </View>
                {expanded === key && (
                  <Text style={styles.faqA}>{item.a}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Still need help */}
        {!search && (
          <View style={styles.stillNeedHelp}>
            <Text style={styles.stillTitle}>Still need help?</Text>
            <Text style={styles.stillSub}>Our support team is available Monday–Friday, 9am–6pm</Text>
            <TouchableOpacity
              style={styles.emailBtn}
              onPress={() => Linking.openURL('mailto:support@gogym.my')}
            >
              <Text style={styles.emailBtnText}>Email Us</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backIcon: { fontSize: 20, color: colors.gold },
  backText: { fontSize: 14, color: colors.gold },
  titleWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginHorizontal: spacing.xl, marginBottom: spacing.lg, borderWidth: 0.5, borderColor: colors.dark4 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  clearBtn: { fontSize: 14, color: colors.textMuted },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  contactCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, gap: spacing.md },
  contactIcon: { fontSize: 24 },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  contactSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  contactArrow: { fontSize: 18, color: colors.gold },
  responseTime: { marginTop: spacing.sm, padding: spacing.md, backgroundColor: colors.dark3, borderRadius: radius.md, borderLeftWidth: 2, borderLeftColor: colors.gold },
  responseTimeText: { fontSize: 12, color: colors.textMuted },
  catScroll: { marginBottom: spacing.sm },
  catPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm },
  catPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  catEmoji: { fontSize: 14 },
  catText: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  catTextActive: { color: '#000' },
  faqList: { paddingHorizontal: spacing.xl },
  faqCard: { backgroundColor: colors.dark3, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: spacing.lg, gap: spacing.md },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 20 },
  chevron: { fontSize: 12, color: colors.gold, marginTop: 2 },
  faqA: { fontSize: 13, color: colors.textMuted, lineHeight: 22, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  emptySearch: { alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.xl },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  stillNeedHelp: { margin: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  stillTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 6 },
  stillSub: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 18 },
  emailBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  emailBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
});
