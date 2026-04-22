import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const TRAINERS = [
  { id: '1', name: 'Hafiz Rahman', spec: 'Weight Loss & Cardio', loc: 'Johor Bahru', price: 'RM60/hr', rating: '4.9', sessions: 120, emoji: '🏋️', tags: ['Weight Loss', 'Cardio'] },
  { id: '2', name: 'Siti Norzah', spec: 'Yoga & Flexibility', loc: 'Seremban', price: 'RM45/hr', rating: '4.8', sessions: 85, emoji: '🧘', tags: ['Yoga'] },
  { id: '3', name: 'Razif Amir', spec: 'Strength & Powerlifting', loc: 'Negeri Sembilan', price: 'RM75/hr', rating: '5.0', sessions: 200, emoji: '💪', tags: ['Strength'] },
  { id: '4', name: 'Amirah Lim', spec: 'Muay Thai & Fitness', loc: 'Johor Bahru', price: 'RM55/hr', rating: '4.7', sessions: 60, emoji: '🥊', tags: ['Muay Thai'] },
  { id: '5', name: 'Danial Ooi', spec: 'Calisthenics & Mobility', loc: 'Seremban', price: 'RM50/hr', rating: '4.8', sessions: 95, emoji: '🤸', tags: ['Calisthenics'] },
];

const FILTERS = ['All', 'Weight Loss', 'Strength', 'Yoga', 'Cardio', 'Muay Thai'];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = TRAINERS.filter(t => {
    const matchFilter = activeFilter === 'All' || t.tags.includes(activeFilter);
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.spec.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <Text style={styles.logo}><Text style={styles.logoGold}>Go</Text>Gym</Text>
        <Text style={styles.tagline}>Find your personal trainer today</Text>
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 Nationwide — Malaysia</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Become a PT banner */}
        <TouchableOpacity
          style={styles.ptBanner}
          onPress={() => navigation.navigate('BecomeTrainer')}
        >
          <View style={styles.ptBannerLeft}>
            <Text style={styles.ptBannerTitle}>Are you a personal trainer?</Text>
            <Text style={styles.ptBannerSub}>Join our network — free to start, no upfront fees</Text>
          </View>
          <Text style={styles.ptBannerArrow}>→</Text>
        </TouchableOpacity>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search trainers, specialties..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured */}
        <Text style={styles.sectionTitle}>FEATURED TRAINERS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
          {TRAINERS.slice(0, 3).map(t => (
            <TouchableOpacity key={t.id} style={styles.featuredCard}
              onPress={() => navigation.navigate('TrainerDetail', { trainer: t })}>
              <View style={styles.featuredAvatar}><Text style={styles.avatarEmoji}>{t.emoji}</Text></View>
              <View style={styles.featuredInfo}>
                <Text style={styles.trainerName}>{t.name}</Text>
                <Text style={styles.trainerSpec}>{t.spec}</Text>
                <View style={styles.trainerMeta}>
                  <Text style={styles.trainerPrice}>{t.price}</Text>
                  <Text style={styles.trainerRating}>⭐ {t.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Trainers */}
        <Text style={styles.sectionTitle}>ALL TRAINERS</Text>
        {filtered.map(t => (
          <TouchableOpacity key={t.id} style={styles.listItem}
            onPress={() => navigation.navigate('TrainerDetail', { trainer: t })}>
            <View style={styles.listAvatar}><Text style={styles.avatarEmoji}>{t.emoji}</Text></View>
            <View style={styles.listInfo}>
              <Text style={styles.trainerName}>{t.name}</Text>
              <Text style={styles.trainerSpec}>📍 {t.loc}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}><Text style={styles.badgeGold}>{t.price}</Text></View>
                <View style={styles.badge}><Text style={styles.badgeText}>⭐ {t.rating}</Text></View>
                <View style={styles.badge}><Text style={styles.badgeText}>{t.sessions} sessions</Text></View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { backgroundColor: colors.dark, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  logo: { fontFamily: 'System', fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: 2 },
  logoGold: { color: colors.gold },
  tagline: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  locationBadge: { flexDirection: 'row', alignSelf: 'flex-start', backgroundColor: colors.dark3, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 6, marginTop: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  locationText: { fontSize: 12, color: colors.gold },
  ptBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.xl, marginBottom: spacing.md, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.gold },
  ptBannerLeft: { flex: 1 },
  ptBannerTitle: { fontSize: 14, fontWeight: '600', color: colors.gold },
  ptBannerSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  ptBannerArrow: { fontSize: 20, color: colors.gold, marginLeft: spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginHorizontal: spacing.xl, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  searchIcon: { fontSize: 15, color: colors.textMuted },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  filterScroll: { paddingLeft: spacing.xl, marginBottom: spacing.lg },
  filterPill: { paddingHorizontal: spacing.lg, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm },
  filterPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterText: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  filterTextActive: { color: '#000' },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  featuredScroll: { paddingLeft: spacing.xl, marginBottom: spacing.xl },
  featuredCard: { width: 180, backgroundColor: colors.dark3, borderRadius: radius.md, overflow: 'hidden', marginRight: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  featuredAvatar: { height: 100, backgroundColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 40 },
  featuredInfo: { padding: spacing.md },
  trainerName: { fontSize: 14, fontWeight: '500', color: colors.text },
  trainerSpec: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  trainerMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  trainerPrice: { fontSize: 13, fontWeight: '500', color: colors.gold },
  trainerRating: { fontSize: 11, color: colors.textMuted },
  listItem: { flexDirection: 'row', gap: spacing.md, padding: spacing.xl, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  listAvatar: { width: 52, height: 52, borderRadius: 10, backgroundColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  listInfo: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  badge: { backgroundColor: colors.dark4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, color: colors.textMuted },
  badgeGold: { fontSize: 11, color: colors.gold },
});
