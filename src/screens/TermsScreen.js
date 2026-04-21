import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const SECTIONS = [
  {
    id: '1',
    title: '1. About GoGym',
    content: `GoGym is an online marketplace platform operated in Malaysia that connects clients with independent personal trainers ("Trainers"). GoGym acts solely as an intermediary platform and does not employ Trainers. All training services are provided directly by Trainers as independent service providers.\n\nThese Terms of Service ("Terms") govern your use of the GoGym mobile application and are legally binding under the laws of Malaysia, including the Consumer Protection Act 1999, the Consumer Protection (Electronic Trade Transaction) Regulations 2024 (CPETTR 2024), and the Contracts Act 1950.`,
  },
  {
    id: '2',
    title: '2. Acceptance of Terms',
    content: `By registering, accessing, or using the GoGym application, you confirm that you:\n\n• Are at least 18 years of age, or have parental/guardian consent if between 13–17 years old\n• Have read, understood, and agree to be bound by these Terms\n• Agree to comply with all applicable Malaysian laws and regulations\n\nIf you do not agree to these Terms, you must immediately cease use of the GoGym application.`,
  },
  {
    id: '3',
    title: '3. User Accounts',
    content: `3.1 Registration\nYou must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.\n\n3.2 Account Termination\nGoGym reserves the right to suspend or terminate accounts that:\n• Provide false or misleading information\n• Violate these Terms or any applicable law\n• Engage in fraudulent, abusive, or harmful conduct\n\n3.3 Trainer Verification\nAll Trainers must submit valid fitness certifications for verification before being listed on the platform. GoGym will review but does not guarantee the authenticity of submitted documents. Clients are encouraged to verify Trainer credentials independently.`,
  },
  {
    id: '4',
    title: '4. Booking & Payment',
    content: `4.1 Booking\nAll session bookings are confirmed only upon successful payment. Bookings are subject to Trainer availability and acceptance.\n\n4.2 Platform Commission\nGoGym charges Trainers a commission of 8–10% on each completed session. This commission is transparently disclosed to all Trainers prior to registration and deducted automatically from payments received.\n\n4.3 Trainer Monthly Subscription\nA monthly subscription fee of RM25 per Trainer will be introduced once GoGym reaches 100 active Trainers on the platform. Trainers will be given at least 30 days' notice before this fee takes effect. Rates will not be changed unilaterally in violation of the Gig Workers Act 2025.\n\n4.4 Payment Methods\nGoGym supports DuitNow, FPX Online Banking, and credit/debit card payments. All transactions are processed through licensed Malaysian payment gateways.\n\n4.5 Pricing Disclosure\nAll prices displayed on GoGym are inclusive of applicable fees. Payment methods and full pricing are disclosed in accordance with the CPETTR 2024.`,
  },
  {
    id: '5',
    title: '5. Cancellation & Refund Policy',
    content: `5.1 Cancellation by Client\n• More than 24 hours before session: Full refund to original payment method within 5–7 business days\n• Less than 24 hours before session: 50% refund; 50% paid to Trainer as compensation\n• No-show (client does not attend): No refund; full session fee paid to Trainer\n\n5.2 Cancellation by Trainer\n• Trainer cancels any session: Client receives full refund within 3–5 business days\n• Repeated cancellations by a Trainer may result in account suspension or removal from the platform\n• GoGym will notify the Client immediately upon Trainer cancellation\n\n5.3 Disputed Sessions\nIn the event of a dispute, GoGym will investigate and may issue full or partial refunds at its sole discretion. Decisions made by GoGym following investigation are final unless otherwise required by applicable law.\n\n5.4 Refund Processing\nRefunds will be returned to the original payment method used. GoGym is not liable for delays caused by banks or payment processors.`,
  },
  {
    id: '6',
    title: '6. Trainer Obligations',
    content: `By registering as a Trainer on GoGym, you agree to:\n\n• Maintain valid and current fitness certifications at all times\n• Provide services in a professional, safe, and ethical manner\n• Arrive punctually and fulfil all confirmed bookings\n• Notify GoGym and the Client promptly of any cancellation\n• Not conduct or solicit off-platform transactions with GoGym-sourced clients for the duration of your active GoGym membership\n• Comply with the Occupational Safety and Health Act 1994 when conducting sessions\n• Comply with the Gig Workers Act 2025, including maintaining a service agreement with GoGym that clearly states scope of work, payment terms, and obligations\n\nTrainers are independent contractors and are not employees, agents, or partners of GoGym. GoGym is not liable for any injury, loss, or damage arising from a Trainer's services.`,
  },
  {
    id: '7',
    title: '7. Client Obligations',
    content: `As a Client, you agree to:\n\n• Disclose any medical conditions, injuries, or health concerns to your Trainer before beginning any training programme\n• Acknowledge that physical training carries inherent risks, and that you participate voluntarily\n• Treat Trainers with respect and professionalism\n• Not engage Trainers sourced through GoGym for off-platform sessions during the period of your active bookings\n\nGoGym strongly recommends that you consult a qualified medical professional before beginning any new fitness programme, particularly if you have pre-existing health conditions.`,
  },
  {
    id: '8',
    title: '8. Liability & Disclaimer',
    content: `8.1 Platform Liability\nGoGym is a technology platform and intermediary. To the maximum extent permitted under Malaysian law, GoGym is not liable for:\n• Any injury, death, or property damage arising from training sessions\n• The conduct, qualifications, or actions of Trainers\n• Loss of data, revenue, or profits\n\n8.2 Trainer Liability\nTrainers are solely responsible for the quality, safety, and professionalism of their services. Clients acknowledge and accept this risk.\n\n8.3 Consumer Rights\nNothing in these Terms limits your rights as a consumer under the Consumer Protection Act 1999. If a service is not rendered as agreed, you may be entitled to a remedy under applicable Malaysian consumer protection law.`,
  },
  {
    id: '9',
    title: '9. Intellectual Property',
    content: `All content on the GoGym platform, including but not limited to the GoGym name, logo, design, text, and software, is the intellectual property of GoGym and is protected under Malaysian law.\n\nYou may not copy, reproduce, distribute, or create derivative works from any GoGym content without prior written consent.`,
  },
  {
    id: '10',
    title: '10. Governing Law & Disputes',
    content: `These Terms are governed by and construed in accordance with the laws of Malaysia.\n\nAny dispute arising from these Terms or your use of GoGym shall first be subject to good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to mediation or arbitration in Kuala Lumpur, Malaysia, in accordance with the Arbitration Act 2005.\n\nFor Trainer-related disputes, the three-tier resolution mechanism under the Gig Workers Act 2025 applies: internal grievance → mediation → Gig Workers Tribunal.`,
  },
  {
    id: '11',
    title: '11. Changes to Terms',
    content: `GoGym reserves the right to amend these Terms at any time. We will notify you of material changes via in-app notification or email at least 14 days before the changes take effect.\n\nContinued use of the GoGym application after changes take effect constitutes your acceptance of the revised Terms.`,
  },
  {
    id: '12',
    title: '12. Contact Us',
    content: `For any questions regarding these Terms, please contact us at:\n\nGoGym\nEmail: legal@gogym.my\nWebsite: www.gogym.my\nAddress: Kuala Lumpur, Malaysia\n\nLast updated: April 2026`,
  },
];

export default function TermsScreen({ navigation }) {
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
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.sub}>Effective date: April 2026</Text>
          <View style={styles.lawBadgeRow}>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>CPA 1999</Text></View>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>CPETTR 2024</Text></View>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>PDPA 2024</Text></View>
            <View style={styles.lawBadge}><Text style={styles.lawBadgeText}>Gig Workers Act 2025</Text></View>
          </View>
          <Text style={styles.legalNote}>
            These terms comply with Malaysian law including the Consumer Protection Act 1999, Consumer Protection (Electronic Trade Transaction) Regulations 2024, Personal Data Protection Act 2010 (as amended 2024), Contracts Act 1950, and the Gig Workers Act 2025.
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
          <Text style={styles.footerText}>For legal enquiries: legal@gogym.my</Text>
          <Text style={styles.footerNote}>GoGym is not a law firm. These terms were prepared based on applicable Malaysian legislation and should be reviewed by a qualified legal professional before commercial launch.</Text>
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
  footer: { marginHorizontal: spacing.xl, marginTop: spacing.xl, padding: spacing.lg, backgroundColor: colors.dark3, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4 },
  footerText: { fontSize: 13, color: colors.gold, marginBottom: spacing.sm },
  footerNote: { fontSize: 11, color: colors.textMuted, lineHeight: 18 },
});
