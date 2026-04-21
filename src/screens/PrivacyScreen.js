import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const SECTIONS = [
  {
    id: '1',
    title: '1. Who We Are',
    content: `GoGym operates as a data controller under the Personal Data Protection Act 2010 (as amended by the Personal Data Protection Amendment Act 2024). We are responsible for the personal data we collect and process through the GoGym mobile application.\n\nContact our Data Protection Officer (DPO):\nEmail: privacy@gogym.my\nAddress: Kuala Lumpur, Malaysia`,
  },
  {
    id: '2',
    title: '2. Data We Collect',
    content: `We collect the following categories of personal data:\n\nFrom Clients:\n• Full name, email address, phone number\n• Payment information (processed securely via licensed gateways — not stored by GoGym)\n• Booking history and session records\n• Device information and app usage data\n• Health-related information voluntarily disclosed to Trainers\n\nFrom Trainers:\n• Full name, IC number, email address, phone number\n• State of residence and travel radius\n• Fitness certifications and professional credentials\n• Profile photo and bio\n• Bank account details for payout\n• Session history and ratings\n\nHealth-related information is classified as sensitive personal data under the PDPA 2024 and is handled with the highest level of protection.`,
  },
  {
    id: '3',
    title: '3. How We Use Your Data',
    content: `We use your personal data for the following purposes:\n\n• To create and manage your GoGym account\n• To facilitate bookings between Clients and Trainers\n• To process payments and issue payouts to Trainers\n• To verify Trainer credentials and certifications\n• To send booking confirmations, reminders, and receipts\n• To provide customer support\n• To improve our platform through usage analytics\n• To comply with Malaysian legal obligations\n• To send promotional communications (only with your explicit opt-in consent)\n\nWe will not use your data for any purpose beyond what is stated here without your consent.`,
  },
  {
    id: '4',
    title: '4. Legal Basis for Processing',
    content: `Under the PDPA 2024, we process your personal data on the following legal bases:\n\n• Contractual necessity: To provide the GoGym service you have agreed to use\n• Legal obligation: To comply with Malaysian law including CPETTR 2024 and the Gig Workers Act 2025\n• Legitimate interests: To operate, maintain, and improve the GoGym platform\n• Consent: For marketing communications and optional data uses — you may withdraw consent at any time`,
  },
  {
    id: '5',
    title: '5. Data Sharing',
    content: `We share your data only in the following circumstances:\n\n• Between Clients and Trainers: Name, contact details, and booking information are shared as necessary to facilitate sessions\n• Payment processors: Payment data is shared with licensed Malaysian payment gateway providers\n• Legal authorities: When required by Malaysian law, court order, or regulatory authority\n• Service providers: Cloud hosting and analytics providers bound by confidentiality agreements\n\nWe do not sell your personal data to third parties. We do not share your data with advertisers.`,
  },
  {
    id: '6',
    title: '6. Data Retention',
    content: `We retain your personal data for as long as your account is active, and for the following minimum periods after account closure:\n\n• Transaction and booking records: 7 years (as required for financial compliance)\n• Trainer certification records: 3 years (as required under CPETTR 2024)\n• General account data: 2 years after account closure\n\nAfter the retention period, data is securely deleted or anonymised.`,
  },
  {
    id: '7',
    title: '7. Your Rights',
    content: `Under the PDPA 2024, you have the following rights:\n\n• Right to access: Request a copy of your personal data held by us\n• Right to correction: Request correction of inaccurate or incomplete data\n• Right to withdraw consent: Withdraw consent for optional data processing at any time\n• Right to data portability: Request transfer of your data to another provider\n• Right to limit processing: Request that we restrict how we use your data\n• Right to be informed of data breaches: We will notify you within 72 hours of becoming aware of a breach affecting your data\n\nTo exercise any of these rights, contact us at: privacy@gogym.my`,
  },
  {
    id: '8',
    title: '8. Data Security',
    content: `We implement appropriate technical and organisational measures to protect your personal data, including:\n\n• Encryption of data in transit and at rest\n• Access controls limiting who can view your data\n• Regular security assessments\n• Data breach notification procedures as required under the PDPA 2024\n\nIn the event of a personal data breach that poses a risk to your rights, we will notify the Personal Data Protection Commissioner and affected users promptly in accordance with the PDPA 2024 Amendment.`,
  },
  {
    id: '9',
    title: '9. Sensitive Personal Data',
    content: `Health and fitness information you share with Trainers through GoGym is classified as sensitive personal data under the PDPA 2024. We require your explicit consent before collecting or processing such information.\n\nThis includes:\n• Medical conditions or injuries\n• Fitness goals related to health conditions\n• Any biometric data collected in future feature updates\n\nYou may withdraw consent for the processing of sensitive data at any time, though this may affect your ability to use certain features of the platform.`,
  },
  {
    id: '10',
    title: '10. Cookies & Analytics',
    content: `GoGym may use analytics tools to understand how users interact with the app. This data is aggregated and anonymised.\n\nWe do not use tracking cookies for advertising purposes. You may opt out of analytics data collection by contacting us at privacy@gogym.my.`,
  },
  {
    id: '11',
    title: '11. Changes to This Policy',
    content: `We may update this Privacy Policy to reflect changes in our practices or applicable law. We will notify you of material changes via in-app notification or email at least 14 days before changes take effect.\n\nWe recommend reviewing this policy periodically.`,
  },
  {
    id: '12',
    title: '12. Contact & Complaints',
    content: `For privacy-related enquiries or to exercise your rights:\n\nData Protection Officer\nEmail: privacy@gogym.my\nGoGym, Kuala Lumpur, Malaysia\n\nIf you believe your data has been mishandled, you may lodge a complaint with the Personal Data Protection Commissioner of Malaysia:\nWebsite: www.pdp.gov.my\nCall: 03-7456 3888\n\nLast updated: April 2026`,
  },
];

export default function PrivacyScreen({ navigation }) {
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded(expanded === id ? null : id);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.sub}>Effective date: April 2026</Text>
          <View style={styles.lawBadgeRow}>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>PDPA 2010</Text></View>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>PDPA Amendment 2024</Text></View>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>CPETTR 2024</Text></View>
          </View>
          <Text style={styles.legalNote}>
            GoGym is committed to protecting your personal data in accordance with the Personal Data Protection Act 2010 and its 2024 amendments, which came into force in stages throughout 2025.
          </Text>
        </View>

        {SECTIONS.map(s => (
          <TouchableOpacity key={s.id} style={styles.section} onPress={() => toggle(s.id)} activeOpacity={0.8}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.chevron}>{expanded === s.id ? '▲' : '▼'}</Text>
            </View>
            {expanded === s.id && (
              <Text style={styles.sectionContent}>{s.content}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>DPO Contact: privacy@gogym.my</Text>
          <Text style={styles.footerText}>PDPD Commissioner: www.pdp.gov.my</Text>
        </View>
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
  titleWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: spacing.md },
  lawBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  lawBadge: { backgroundColor: colors.dark3, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 4, borderWidth: 0.5, borderColor: colors.gold },
  lawBadgeText: { fontSize: 10, color: colors.gold, fontWeight: '600' },
  legalNote: { fontSize: 12, color: colors.textMuted, lineHeight: 18, backgroundColor: colors.dark3, padding: spacing.md, borderRadius: radius.md, borderLeftWidth: 2, borderLeftColor: colors.gold },
  section: { marginHorizontal: spacing.xl, marginBottom: spacing.sm, backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.text, flex: 1, marginRight: spacing.md },
  chevron: { fontSize: 12, color: colors.gold },
  sectionContent: { fontSize: 13, color: colors.textMuted, lineHeight: 22, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  footer: { marginHorizontal: spacing.xl, marginTop: spacing.xl, padding: spacing.lg, backgroundColor: colors.dark3, borderRadius: radius.md, gap: spacing.sm },
  footerText: { fontSize: 13, color: colors.gold },
});
