import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const PAYMENT_METHODS = [
  { id: 'duitnow', label: 'DuitNow QR', icon: '🏦', desc: 'Scan & pay instantly' },
  { id: 'fpx', label: 'FPX Online Banking', icon: '🔐', desc: 'Maybank, CIMB, RHB & more' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard' },
];

const BANKS = [
  { id: 'maybank', label: 'Maybank2u' },
  { id: 'cimb', label: 'CIMB Clicks' },
  { id: 'rhb', label: 'RHB Now' },
  { id: 'hongleong', label: 'Hong Leong' },
  { id: 'publicbank', label: 'Public Bank' },
  { id: 'ambank', label: 'AmBank' },
];

export default function PaymentScreen({ route, navigation }) {
  // Accept booking details from TrainerDetailScreen if passed
  const booking = route?.params?.booking || {
    trainerName: 'Hafiz Rahman',
    package: '4 Sessions',
    day: 'Mon',
    time: '10:00 AM',
    total: 228,
  };

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    if (!selectedMethod) {
      Alert.alert('Please select a payment method.');
      return;
    }
    if (selectedMethod === 'fpx' && !selectedBank) {
      Alert.alert('Please select your bank.');
      return;
    }

    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
    }, 2500);
  };

  if (paid) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Text style={styles.successEmoji}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSub}>Your session has been confirmed.</Text>

          <View style={styles.receiptBox}>
            <Row label="Trainer" value={booking.trainerName} />
            <Row label="Package" value={booking.package} />
            <Row label="Day" value={booking.day} />
            <Row label="Time" value={booking.time} />
            <View style={styles.divider} />
            <Row label="Amount Paid" value={`RM ${booking.total}`} gold />
          </View>

          <Text style={styles.successNote}>
            A confirmation will be sent to your registered email. Your trainer will contact you shortly.
          </Text>

          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      {/* Header */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Title */}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.sub}>Complete your booking payment</Text>
        </View>

        {/* Order summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
          <View style={styles.summaryBox}>
            <Row label="Trainer" value={booking.trainerName} />
            <Row label="Package" value={booking.package} />
            <Row label="Day" value={booking.day} />
            <Row label="Time" value={booking.time} />
            <View style={styles.divider} />
            <Row label="Total" value={`RM ${booking.total}`} gold />
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
          {PAYMENT_METHODS.map(method => {
            const isActive = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodRow, isActive && styles.methodRowActive]}
                onPress={() => { setSelectedMethod(method.id); setSelectedBank(null); }}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodLabel, isActive && styles.methodLabelActive]}>{method.label}</Text>
                  <Text style={styles.methodDesc}>{method.desc}</Text>
                </View>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FPX bank selector */}
        {selectedMethod === 'fpx' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT BANK</Text>
            <View style={styles.banksGrid}>
              {BANKS.map(bank => {
                const isActive = selectedBank === bank.id;
                return (
                  <TouchableOpacity
                    key={bank.id}
                    style={[styles.bankBtn, isActive && styles.bankBtnActive]}
                    onPress={() => setSelectedBank(bank.id)}
                  >
                    <Text style={[styles.bankText, isActive && styles.bankTextActive]}>{bank.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* DuitNow QR placeholder */}
        {selectedMethod === 'duitnow' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SCAN TO PAY</Text>
            <View style={styles.qrBox}>
              <Text style={styles.qrPlaceholder}>📱</Text>
              <Text style={styles.qrText}>DuitNow QR</Text>
              <Text style={styles.qrSub}>RM {booking.total}</Text>
              <Text style={styles.qrNote}>QR integration coming soon.{'\n'}Tap Pay Now to confirm your booking.</Text>
            </View>
          </View>
        )}

        {/* Card placeholder */}
        {selectedMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CARD DETAILS</Text>
            <View style={styles.cardBox}>
              <Text style={styles.cardNote}>💳 Secure card payment coming soon.{'\n'}Tap Pay Now to confirm your booking.</Text>
            </View>
          </View>
        )}

        {/* Security note */}
        <View style={styles.secureRow}>
          <Text style={styles.secureText}>🔒 Payments are secured and encrypted</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Pay button */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>RM {booking.total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnDisabled]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.payBtnText}>Pay Now</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Reusable row component for summary
function Row({ label, value, gold }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, gold && styles.summaryGold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backIcon: { fontSize: 20, color: colors.gold },
  backText: { fontSize: 14, color: colors.gold },

  titleWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, letterSpacing: 0.5 },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },

  section: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },

  // Summary
  summaryBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.dark4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { fontSize: 13, color: colors.textMuted },
  summaryValue: { fontSize: 13, color: colors.text, fontWeight: '500' },
  summaryGold: { color: colors.gold, fontSize: 16, fontWeight: '700' },
  divider: { height: 0.5, backgroundColor: colors.dark4, marginVertical: spacing.sm },

  // Methods
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4 },
  methodRowActive: { borderColor: colors.gold },
  methodIcon: { fontSize: 24 },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 14, color: colors.text, fontWeight: '500' },
  methodLabelActive: { color: colors.gold },
  methodDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.gold },

  // Banks
  banksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  bankBtn: { paddingHorizontal: spacing.lg, paddingVertical: 10, borderRadius: radius.sm, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4 },
  bankBtnActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  bankText: { fontSize: 13, color: colors.textMuted },
  bankTextActive: { color: '#000', fontWeight: '600' },

  // DuitNow QR
  qrBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  qrPlaceholder: { fontSize: 60, marginBottom: spacing.md },
  qrText: { fontSize: 16, fontWeight: '700', color: colors.gold },
  qrSub: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 4 },
  qrNote: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },

  // Card
  cardBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, borderWidth: 0.5, borderColor: colors.dark4, alignItems: 'center' },
  cardNote: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },

  // Secure
  secureRow: { alignItems: 'center', marginTop: spacing.xl },
  secureText: { fontSize: 12, color: colors.textMuted },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, backgroundColor: colors.dark2, borderTopWidth: 0.5, borderTopColor: colors.dark4, gap: spacing.md },
  footerInfo: { flex: 1 },
  footerLabel: { fontSize: 11, color: colors.textMuted },
  footerTotal: { fontSize: 20, fontWeight: '700', color: colors.gold },
  payBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, minWidth: 120, alignItems: 'center' },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },

  // Success
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.dark3, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.gold },
  successEmoji: { fontSize: 36 },
  successTitle: { fontSize: 24, fontWeight: '700', color: colors.gold, letterSpacing: 0.5 },
  successSub: { fontSize: 13, color: colors.textMuted, marginTop: 6, marginBottom: spacing.xl },
  receiptBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.dark4, width: '100%', marginBottom: spacing.xl },
  successNote: { fontSize: 12, color: colors.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: spacing.xl },
  doneBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md, width: '100%', alignItems: 'center' },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
});
