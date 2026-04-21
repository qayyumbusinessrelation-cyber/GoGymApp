import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const EXISTING_REVIEWS = [
  { id: '1', name: 'Aiman F.', rating: 5, date: '14 Apr 2026', text: 'Best trainer I have had. Very patient and result-driven. Lost 5kg in 6 weeks!' },
  { id: '2', name: 'Nurul H.', rating: 5, date: '2 Apr 2026', text: 'Super motivating. Comes to my house on time every session. Highly recommended.' },
  { id: '3', name: 'Kevin L.', rating: 4, date: '20 Mar 2026', text: 'Great knowledge on strength training. Pushes me to my limits in a good way.' },
];

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

function StarRow({ rating, onRate, size = 32 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => onRate && onRate(i)} disabled={!onRate}>
          <Text style={{ fontSize: size, color: i <= rating ? colors.gold : colors.dark4 }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RatingsReviewScreen({ route, navigation }) {
  const trainer = route?.params?.trainer || {
    name: 'Hafiz Rahman', spec: 'Weight Loss & Cardio', emoji: '🏋️', rating: '4.9', sessions: 120,
  };

  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const breakdown = [
    { stars: 5, count: 98 },
    { stars: 4, count: 18 },
    { stars: 3, count: 3 },
    { stars: 2, count: 1 },
    { stars: 1, count: 0 },
  ];
  const total = breakdown.reduce((a, b) => a + b.count, 0);
  const avgRating = 4.9;

  const handleSubmit = () => {
    if (userRating === 0) { Alert.alert('Please select a star rating.'); return; }
    if (!reviewText.trim()) { Alert.alert('Please write a short review.'); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Trainer hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{trainer.emoji}</Text>
          <Text style={styles.heroName}>{trainer.name}</Text>
          <Text style={styles.heroSpec}>{trainer.spec}</Text>
        </View>

        {/* Rating summary */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryLeft}>
            <Text style={styles.avgScore}>{avgRating}</Text>
            <StarRow rating={Math.round(avgRating)} size={18} />
            <Text style={styles.totalReviews}>{total} reviews</Text>
          </View>
          <View style={styles.summaryRight}>
            {breakdown.map(b => (
              <View key={b.stars} style={styles.barRow}>
                <Text style={styles.barLabel}>{b.stars}★</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${total > 0 ? (b.count / total) * 100 : 0}%` }]} />
                </View>
                <Text style={styles.barCount}>{b.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Write review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEAVE A REVIEW</Text>
          {!submitted ? (
            <View style={styles.writeBox}>
              <Text style={styles.ratePrompt}>How was your session?</Text>
              <StarRow rating={userRating} onRate={setUserRating} size={40} />
              {userRating > 0 && (
                <Text style={styles.ratingLabel}>{RATING_LABELS[userRating]}</Text>
              )}
              <TextInput
                style={styles.reviewInput}
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="Share your experience with this trainer..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={5}
              />
              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#000" />
                  : <Text style={styles.submitBtnText}>Submit Review</Text>
                }
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.thankBox}>
              <Text style={styles.thankEmoji}>🎉</Text>
              <Text style={styles.thankTitle}>Review submitted!</Text>
              <Text style={styles.thankSub}>Thank you for helping the GoGym community make better decisions.</Text>
              <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* All reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ALL REVIEWS</Text>
          {EXISTING_REVIEWS.map(r => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
                <StarRow rating={r.rating} size={13} />
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
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
  hero: { alignItems: 'center', paddingVertical: spacing.xl, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  heroEmoji: { fontSize: 48, marginBottom: spacing.sm },
  heroName: { fontSize: 20, fontWeight: '700', color: colors.text },
  heroSpec: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  summaryBox: { flexDirection: 'row', padding: spacing.xl, gap: spacing.xl, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  summaryLeft: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  avgScore: { fontSize: 48, fontWeight: '700', color: colors.gold, lineHeight: 52 },
  totalReviews: { fontSize: 12, color: colors.textMuted },
  summaryRight: { flex: 1, justifyContent: 'center', gap: 6 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barLabel: { fontSize: 11, color: colors.textMuted, width: 24 },
  barTrack: { flex: 1, height: 6, backgroundColor: colors.dark4, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.gold, borderRadius: 3 },
  barCount: { fontSize: 11, color: colors.textMuted, width: 24, textAlign: 'right' },
  section: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md },
  writeBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, borderWidth: 0.5, borderColor: colors.dark4, gap: spacing.md },
  ratePrompt: { fontSize: 16, fontWeight: '600', color: colors.text },
  ratingLabel: { fontSize: 14, color: colors.gold, fontWeight: '600' },
  reviewInput: { backgroundColor: colors.dark, borderRadius: radius.md, padding: spacing.md, color: colors.text, fontSize: 13, borderWidth: 0.5, borderColor: colors.dark4, height: 120, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
  thankBox: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4, gap: spacing.md },
  thankEmoji: { fontSize: 48 },
  thankTitle: { fontSize: 20, fontWeight: '700', color: colors.gold },
  thankSub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  doneBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xxl, paddingVertical: spacing.md },
  doneBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  reviewCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontSize: 16, fontWeight: '700', color: '#000' },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: '600', color: colors.text },
  reviewDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  reviewText: { fontSize: 13, color: colors.textMuted, lineHeight: 20 },
});
