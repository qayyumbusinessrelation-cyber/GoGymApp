import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Modal, FlatList,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { STATES, getAreas, searchAreas } from '../data/LocationData';

const TRAINERS = [
  { id: '1', name: 'Hafiz Rahman', spec: 'Weight Loss & Cardio', loc: 'Wangsa Maju, Kuala Lumpur', state: 'Kuala Lumpur', area: 'Wangsa Maju', price: 'RM60/hr', rating: '4.9', sessions: 120, emoji: '🏋️', tags: ['Weight Loss', 'Cardio'], radius: 15 },
  { id: '2', name: 'Siti Norzah', spec: 'Yoga & Flexibility', loc: 'Seremban, Negeri Sembilan', state: 'Negeri Sembilan', area: 'Seremban', price: 'RM45/hr', rating: '4.8', sessions: 85, emoji: '🧘', tags: ['Yoga'], radius: 10 },
  { id: '3', name: 'Razif Amir', spec: 'Strength & Powerlifting', loc: 'Subang Jaya, Selangor', state: 'Selangor', area: 'Subang Jaya', price: 'RM75/hr', rating: '5.0', sessions: 200, emoji: '💪', tags: ['Strength'], radius: 20 },
  { id: '4', name: 'Amirah Lim', spec: 'Muay Thai & Fitness', loc: 'Johor Bahru City, Johor', state: 'Johor', area: 'Johor Bahru City', price: 'RM55/hr', rating: '4.7', sessions: 60, emoji: '🥊', tags: ['Muay Thai'], radius: 15 },
  { id: '5', name: 'Danial Ooi', spec: 'Calisthenics & Mobility', loc: 'Petaling Jaya, Selangor', state: 'Selangor', area: 'Petaling Jaya', price: 'RM50/hr', rating: '4.8', sessions: 95, emoji: '🤸', tags: ['Calisthenics'], radius: 12 },
];

const FILTERS = ['All', 'Weight Loss', 'Strength', 'Yoga', 'Cardio', 'Muay Thai'];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [locationModal, setLocationModal] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [areaResults, setAreaResults] = useState([]);

  const handleAreaSearch = (text) => {
    setAreaSearch(text);
    if (text.length >= 2) {
      setAreaResults(searchAreas(text));
    } else {
      setAreaResults([]);
    }
  };

  const selectArea = (item) => {
    setSelectedState(item.state);
    setSelectedArea(item.area);
    setAreaSearch(item.label);
    setAreaResults([]);
  };

  const clearLocation = () => {
    setSelectedState('');
    setSelectedArea('');
    setAreaSearch('');
    setAreaResults([]);
  };

  const filtered = TRAINERS.filter(t => {
    const matchFilter = activeFilter === 'All' || t.tags.includes(activeFilter);
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.spec.toLowerCase().includes(search.toLowerCase()) ||
      t.area.toLowerCase().includes(search.toLowerCase());
    const matchLocation = !selectedArea || t.area === selectedArea || t.state === selectedState;
    return matchFilter && matchSearch && matchLocation;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View>
            <Text style={styles.logo}><Text style={styles.logoGold}>Go</Text>Gym</Text>
            <Text style={styles.tagline}>Malaysia's PT Marketplace</Text>
          </View>
          <TouchableOpacity style={styles.locationBtn} onPress={() => setLocationModal(true)}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationBtnText} numberOfLines={1}>
              {selectedArea ? `${selectedArea}` : 'Nationwide'}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Become a PT banner */}
        <TouchableOpacity style={styles.ptBanner} onPress={() => navigation.navigate('BecomeTrainer')}>
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
            placeholder="Search trainers, specialties, areas..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Active location filter */}
        {selectedArea ? (
          <View style={styles.activeLocation}>
            <Text style={styles.activeLocationText}>📍 Showing trainers near {selectedArea}</Text>
            <TouchableOpacity onPress={clearLocation}>
              <Text style={styles.clearLocation}>Clear ✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Specialty Filters */}
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
        {!selectedArea && !search && (
          <>
            <Text style={styles.sectionTitle}>FEATURED TRAINERS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
              {TRAINERS.slice(0, 3).map(t => (
                <TouchableOpacity key={t.id} style={styles.featuredCard}
                  onPress={() => navigation.navigate('TrainerDetail', { trainer: t })}>
                  <View style={styles.featuredAvatar}><Text style={styles.avatarEmoji}>{t.emoji}</Text></View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.trainerName}>{t.name}</Text>
                    <Text style={styles.trainerSpec}>{t.spec}</Text>
                    <Text style={styles.trainerArea}>📍 {t.area}</Text>
                    <View style={styles.trainerMeta}>
                      <Text style={styles.trainerPrice}>{t.price}</Text>
                      <Text style={styles.trainerRating}>⭐ {t.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* All Trainers */}
        <Text style={styles.sectionTitle}>
          {selectedArea ? `TRAINERS NEAR ${selectedArea.toUpperCase()}` : 'ALL TRAINERS'} ({filtered.length})
        </Text>
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No trainers found</Text>
            <Text style={styles.emptySub}>Try a different area or specialty</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={clearLocation}>
              <Text style={styles.emptyBtnText}>Show All Trainers</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map(t => (
            <TouchableOpacity key={t.id} style={styles.listItem}
              onPress={() => navigation.navigate('TrainerDetail', { trainer: t })}>
              <View style={styles.listAvatar}><Text style={styles.avatarEmoji}>{t.emoji}</Text></View>
              <View style={styles.listInfo}>
                <Text style={styles.trainerName}>{t.name}</Text>
                <Text style={styles.trainerSpec}>{t.spec}</Text>
                <Text style={styles.trainerArea}>📍 {t.area}, {t.state} · 🚗 {t.radius}km radius</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}><Text style={styles.badgeGold}>{t.price}</Text></View>
                  <View style={styles.badge}><Text style={styles.badgeText}>⭐ {t.rating}</Text></View>
                  <View style={styles.badge}><Text style={styles.badgeText}>{t.sessions} sessions</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Location Modal */}
      <Modal visible={locationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Find Trainers Near You</Text>
              <TouchableOpacity onPress={() => setLocationModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Search by area or neighbourhood</Text>
            <View style={styles.areaSearchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.areaSearchInput}
                value={areaSearch}
                onChangeText={handleAreaSearch}
                placeholder="e.g. Wangsa Maju, Subang, Bangsar..."
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
              {areaSearch.length > 0 && (
                <TouchableOpacity onPress={() => { setAreaSearch(''); setAreaResults([]); }}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {areaResults.length > 0 && (
              <FlatList
                data={areaResults}
                keyExtractor={(item, index) => index.toString()}
                style={styles.areaList}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.areaItem} onPress={() => { selectArea(item); setLocationModal(false); }}>
                    <Text style={styles.areaItemIcon}>📍</Text>
                    <View>
                      <Text style={styles.areaItemArea}>{item.area}</Text>
                      <Text style={styles.areaItemState}>{item.state}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            {areaSearch.length === 0 && (
              <>
                <Text style={styles.modalLabel}>Or browse by state</Text>
                <ScrollView style={styles.stateList}>
                  {STATES.map(state => (
                    <TouchableOpacity
                      key={state}
                      style={[styles.stateItem, selectedState === state && styles.stateItemActive]}
                      onPress={() => {
                        setSelectedState(state);
                        setSelectedArea('');
                        setAreaSearch(state);
                        setAreaResults([]);
                        setLocationModal(false);
                      }}
                    >
                      <Text style={[styles.stateItemText, selectedState === state && styles.stateItemTextActive]}>{state}</Text>
                      {selectedState === state && <Text style={styles.stateCheck}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <TouchableOpacity style={styles.clearLocationBtn} onPress={() => { clearLocation(); setLocationModal(false); }}>
              <Text style={styles.clearLocationBtnText}>Show All Trainers Nationwide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  logo: { fontSize: 28, fontWeight: '700', color: colors.text, letterSpacing: 2 },
  logoGold: { color: colors.gold },
  tagline: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  locationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dark3, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 8, borderWidth: 0.5, borderColor: colors.gold, gap: 4, maxWidth: 160 },
  locationIcon: { fontSize: 14 },
  locationBtnText: { fontSize: 12, color: colors.gold, fontWeight: '500', flex: 1 },
  locationChevron: { fontSize: 10, color: colors.gold },
  ptBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.xl, marginBottom: spacing.md, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.gold },
  ptBannerLeft: { flex: 1 },
  ptBannerTitle: { fontSize: 14, fontWeight: '600', color: colors.gold },
  ptBannerSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  ptBannerArrow: { fontSize: 20, color: colors.gold, marginLeft: spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginHorizontal: spacing.xl, marginBottom: spacing.sm, borderWidth: 0.5, borderColor: colors.dark4 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  clearBtn: { fontSize: 14, color: colors.textMuted },
  activeLocation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: spacing.xl, marginBottom: spacing.sm, backgroundColor: 'rgba(201,168,76,0.1)', borderRadius: radius.md, padding: spacing.sm, borderWidth: 0.5, borderColor: colors.gold },
  activeLocationText: { fontSize: 12, color: colors.gold },
  clearLocation: { fontSize: 12, color: colors.textMuted },
  filterScroll: { paddingLeft: spacing.xl, marginBottom: spacing.lg },
  filterPill: { paddingHorizontal: spacing.lg, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm },
  filterPillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  filterText: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  filterTextActive: { color: '#000' },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  featuredScroll: { paddingLeft: spacing.xl, marginBottom: spacing.xl },
  featuredCard: { width: 190, backgroundColor: colors.dark3, borderRadius: radius.md, overflow: 'hidden', marginRight: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  featuredAvatar: { height: 100, backgroundColor: colors.dark4, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 40 },
  featuredInfo: { padding: spacing.md },
  trainerName: { fontSize: 14, fontWeight: '600', color: colors.text },
  trainerSpec: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  trainerArea: { fontSize: 11, color: colors.gold, marginTop: 2 },
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
  emptyWrap: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: spacing.xl },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.text },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: spacing.lg },
  emptyBtn: { backgroundColor: colors.gold, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  emptyBtnText: { fontSize: 13, fontWeight: '700', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: colors.dark2, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, maxHeight: '85%', borderTopWidth: 0.5, borderColor: colors.dark4 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.gold },
  modalClose: { fontSize: 18, color: colors.textMuted },
  modalLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  areaSearchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, borderWidth: 0.5, borderColor: colors.dark4, marginBottom: spacing.sm },
  areaSearchInput: { flex: 1, color: colors.text, fontSize: 14 },
  areaList: { maxHeight: 250 },
  areaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  areaItemIcon: { fontSize: 16 },
  areaItemArea: { fontSize: 14, fontWeight: '600', color: colors.text },
  areaItemState: { fontSize: 11, color: colors.textMuted },
  stateList: { maxHeight: 300 },
  stateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.dark4 },
  stateItemActive: { backgroundColor: 'rgba(201,168,76,0.1)' },
  stateItemText: { fontSize: 14, color: colors.text },
  stateItemTextActive: { color: colors.gold, fontWeight: '600' },
  stateCheck: { fontSize: 16, color: colors.gold },
  clearLocationBtn: { marginTop: spacing.lg, padding: spacing.md, borderRadius: radius.md, borderWidth: 0.5, borderColor: colors.dark4, alignItems: 'center' },
  clearLocationBtnText: { fontSize: 13, color: colors.textMuted },
});
