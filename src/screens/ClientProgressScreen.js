import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 140;

const PROGRESS_DATA = {
  'Bench Press': {
    sessions: [
      { date: '1 Apr', weight: 55, reps: 8, volume: 440 },
      { date: '7 Apr', weight: 57.5, reps: 8, volume: 460 },
      { date: '14 Apr', weight: 60, reps: 8, volume: 480 },
      { date: '17 Apr', weight: 60, reps: 9, volume: 540 },
      { date: '21 Apr', weight: 62.5, reps: 8, volume: 500 },
    ],
  },
  'Deadlift': {
    sessions: [
      { date: '2 Apr', weight: 70, reps: 5, volume: 350 },
      { date: '9 Apr', weight: 75, reps: 5, volume: 375 },
      { date: '16 Apr', weight: 80, reps: 5, volume: 400 },
      { date: '20 Apr', weight: 80, reps: 6, volume: 480 },
      { date: '22 Apr', weight: 85, reps: 5, volume: 425 },
    ],
  },
  'Squat': {
    sessions: [
      { date: '3 Apr', weight: 60, reps: 8, volume: 480 },
      { date: '10 Apr', weight: 65, reps: 8, volume: 520 },
      { date: '15 Apr', weight: 65, reps: 9, volume: 585 },
      { date: '19 Apr', weight: 70, reps: 8, volume: 560 },
      { date: '22 Apr', weight: 70, reps: 9, volume: 630 },
    ],
  },
};

const BODY_METRICS = [
  { date: '1 Apr', weight: 82, bodyFat: 22 },
  { date: '7 Apr', weight: 81.5, bodyFat: 21.5 },
  { date: '14 Apr', weight: 81, bodyFat: 21 },
  { date: '21 Apr', weight: 80.5, bodyFat: 20.5 },
  { date: '22 Apr', weight: 80, bodyFat: 20 },
];

const EXERCISES = Object.keys(PROGRESS_DATA);

function BarChart({ data, valueKey, color }) {
  const values = data.map(d => d[valueKey]);
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.9;
  const range = max - min || 1;

  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT, gap: 6 }}>
        {data.map((d, i) => {
          const barHeight = ((d[valueKey] - min) / range) * (CHART_HEIGHT - 30);
          const isLast = i === data.length - 1;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: CHART_HEIGHT }}>
              <Text style={{ fontSize: 9, color: isLast ? color : colors.textMuted, fontWeight: isLast ? '700' : '400', marginBottom: 2 }}>
                {d[valueKey]}
              </Text>
              <View style={{
                width: '100%',
                height: Math.max(barHeight, 4),
                backgroundColor: isLast ? color : `${color}55`,
                borderRadius: 4,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }} />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
        {data.map((d, i) => (
          <Text key={i} style={{ flex: 1, fontSize: 8, color: colors.textMuted, textAlign: 'center' }}>{d.date}</Text>
        ))}
      </View>
    </View>
  );
}

function TrendLine({ data, valueKey, color }) {
  const values = data.map(d => d[valueKey]);
  const max = Math.max(...values);
  const min = Math.min(...values) * 0.95;
  const range = max - min || 1;
  const segWidth = (CHART_WIDTH - 32) / (data.length - 1);

  return (
    <View style={{ width: '100%' }}>
      <View style={{ height: CHART_HEIGHT, position: 'relative' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <View key={i} style={{
            position: 'absolute',
            left: 0, right: 0,
            top: t * (CHART_HEIGHT - 20),
            height: 0.5,
            backgroundColor: colors.dark4,
          }} />
        ))}
        {/* Connecting lines */}
        {data.slice(0, -1).map((d, i) => {
          const x1 = i * segWidth;
          const y1 = (1 - (d[valueKey] - min) / range) * (CHART_HEIGHT - 20);
          const x2 = (i + 1) * segWidth;
          const y2 = (1 - (data[i + 1][valueKey] - min) / range) * (CHART_HEIGHT - 20);
          const dx = x2 - x1;
          const dy = y2 - y1;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={i} style={{
              position: 'absolute',
              left: x1,
              top: y1,
              width: length,
              height: 2,
              backgroundColor: color,
              opacity: 0.6,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: '0 0',
            }} />
          );
        })}
        {/* Dots and labels */}
        {data.map((d, i) => {
          const x = i * segWidth;
          const y = (1 - (d[valueKey] - min) / range) * (CHART_HEIGHT - 20);
          const isLast = i === data.length - 1;
          return (
            <View key={i} style={{ position: 'absolute', left: x - 5, top: y - 5 }}>
              <View style={{
                width: 10, height: 10, borderRadius: 5,
                backgroundColor: isLast ? color : colors.dark,
                borderWidth: 2, borderColor: color,
              }} />
              {isLast && (
                <Text style={{ position: 'absolute', top: -16, left: -8, fontSize: 9, color, fontWeight: '700', width: 40 }}>
                  {d[valueKey]}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {data.map((d, i) => (
          <Text key={i} style={{ width: segWidth, fontSize: 8, color: colors.textMuted, textAlign: 'center' }}>{d.date}</Text>
        ))}
      </View>
    </View>
  );
}

export default function ClientProgressScreen({ route, navigation }) {
  const clientName = route?.params?.clientName || 'Aiman F.';
  const [activeExercise, setActiveExercise] = useState(EXERCISES[0]);
  const [activeMetric, setActiveMetric] = useState('weight');
  const [activeTab, setActiveTab] = useState('strength');

  const exData = PROGRESS_DATA[activeExercise];
  const firstSession = exData.sessions[0];
  const lastSession = exData.sessions[exData.sessions.length - 1];
  const weightGain = (lastSession.weight - firstSession.weight).toFixed(1);
  const volumeGain = lastSession.volume - firstSession.volume;

  const firstBody = BODY_METRICS[0];
  const lastBody = BODY_METRICS[BODY_METRICS.length - 1];
  const bodyWeightLost = (firstBody.weight - lastBody.weight).toFixed(1);
  const fatLost = (firstBody.bodyFat - lastBody.bodyFat).toFixed(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{clientName}</Text>
          <Text style={styles.sub}>Performance Progress</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.tabRow}>
        {[['strength', 'Strength'], ['body', 'Body Metrics']].map(([key, label]) => (
          <TouchableOpacity key={key} style={[styles.tab, activeTab === key && styles.tabActive]} onPress={() => setActiveTab(key)}>
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {activeTab === 'strength' && (
          <View style={styles.tabContent}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Weight Lifted</Text>
                <Text style={styles.summaryValue}>+{weightGain}kg</Text>
                <Text style={styles.summaryNote}>since start</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Volume Gain</Text>
                <Text style={styles.summaryValue}>+{volumeGain}</Text>
                <Text style={styles.summaryNote}>total kg</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Sessions</Text>
                <Text style={styles.summaryValue}>{exData.sessions.length}</Text>
                <Text style={styles.summaryNote}>logged</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>SELECT EXERCISE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills}>
              {EXERCISES.map(ex => (
                <TouchableOpacity key={ex} style={[styles.pill, activeExercise === ex && styles.pillActive]} onPress={() => setActiveExercise(ex)}>
                  <Text style={[styles.pillText, activeExercise === ex && styles.pillTextActive]}>{ex}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.metricRow}>
              {[['weight', 'Weight (kg)'], ['volume', 'Volume']].map(([key, label]) => (
                <TouchableOpacity key={key} style={[styles.metricBtn, activeMetric === key && styles.metricBtnActive]} onPress={() => setActiveMetric(key)}>
                  <Text style={[styles.metricBtnText, activeMetric === key && styles.metricBtnTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>{activeExercise} — {activeMetric === 'weight' ? 'Weight (kg)' : 'Volume'}</Text>
              <BarChart data={exData.sessions} valueKey={activeMetric} color={colors.gold} />
            </View>

            <Text style={styles.sectionTitle}>PROGRESSION TREND</Text>
            <View style={styles.chartCard}>
              <TrendLine data={exData.sessions} valueKey={activeMetric} color={colors.gold} />
            </View>

            <Text style={styles.sectionTitle}>SESSION HISTORY</Text>
            <View style={styles.tableWrap}>
              <View style={styles.tableHeader}>
                {['Date', 'Weight', 'Reps', 'Volume'].map(h => (
                  <Text key={h} style={[styles.tableCell, styles.tableCellHeader]}>{h}</Text>
                ))}
              </View>
              {exData.sessions.map((s, i) => {
                const prev = exData.sessions[i - 1];
                const improved = prev && s.weight > prev.weight;
                return (
                  <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                    <Text style={styles.tableCell}>{s.date}</Text>
                    <Text style={[styles.tableCell, improved && styles.tableCellGreen]}>{s.weight}kg {improved ? '↑' : ''}</Text>
                    <Text style={styles.tableCell}>{s.reps}</Text>
                    <Text style={styles.tableCell}>{s.volume}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'body' && (
          <View style={styles.tabContent}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Weight Lost</Text>
                <Text style={[styles.summaryValue, { color: colors.green }]}>-{bodyWeightLost}kg</Text>
                <Text style={styles.summaryNote}>since start</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Body Fat</Text>
                <Text style={[styles.summaryValue, { color: colors.green }]}>-{fatLost}%</Text>
                <Text style={styles.summaryNote}>reduced</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Current</Text>
                <Text style={styles.summaryValue}>{lastBody.weight}kg</Text>
                <Text style={styles.summaryNote}>{lastBody.bodyFat}% fat</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>BODY WEIGHT TREND</Text>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Body Weight (kg)</Text>
              <TrendLine data={BODY_METRICS} valueKey="weight" color={colors.green} />
            </View>

            <Text style={styles.sectionTitle}>BODY FAT % TREND</Text>
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Body Fat %</Text>
              <TrendLine data={BODY_METRICS} valueKey="bodyFat" color="#f57a7a" />
            </View>

            <Text style={styles.sectionTitle}>MEASUREMENT HISTORY</Text>
            <View style={styles.tableWrap}>
              <View style={styles.tableHeader}>
                {['Date', 'Weight', 'Body Fat', 'Change'].map(h => (
                  <Text key={h} style={[styles.tableCell, styles.tableCellHeader]}>{h}</Text>
                ))}
              </View>
              {BODY_METRICS.map((m, i) => {
                const prev = BODY_METRICS[i - 1];
                const diff = prev ? (m.weight - prev.weight).toFixed(1) : '-';
                return (
                  <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                    <Text style={styles.tableCell}>{m.date}</Text>
                    <Text style={styles.tableCell}>{m.weight}kg</Text>
                    <Text style={styles.tableCell}>{m.bodyFat}%</Text>
                    <Text style={[styles.tableCell, parseFloat(diff) < 0 ? styles.tableCellGreen : styles.tableCellRed]}>
                      {diff !== '-' ? `${parseFloat(diff) > 0 ? '+' : ''}${diff}kg` : '-'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  backBtn: { width: 32 },
  backIcon: { fontSize: 22, color: colors.gold },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  tabRow: { flexDirection: 'row', marginHorizontal: spacing.xl, backgroundColor: colors.dark3, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.gold },
  tabText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#000', fontWeight: '700' },
  tabContent: { paddingHorizontal: spacing.xl },
  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  summaryCard: { flex: 1, backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  summaryLabel: { fontSize: 10, color: colors.textMuted, marginBottom: 4, textAlign: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '700', color: colors.gold },
  summaryNote: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 1.5, color: colors.textMuted, marginBottom: spacing.md, marginTop: spacing.md },
  pills: { marginBottom: spacing.md, flexGrow: 0 },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.dark3, borderWidth: 0.5, borderColor: colors.dark4, marginRight: spacing.sm },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontSize: 12, color: colors.textMuted },
  pillTextActive: { color: '#000', fontWeight: '600' },
  metricRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  metricBtn: { flex: 1, padding: 8, borderRadius: radius.sm, backgroundColor: colors.dark3, alignItems: 'center', borderWidth: 0.5, borderColor: colors.dark4 },
  metricBtnActive: { backgroundColor: 'rgba(201,168,76,0.15)', borderColor: colors.gold },
  metricBtnText: { fontSize: 12, color: colors.textMuted },
  metricBtnTextActive: { color: colors.gold, fontWeight: '600' },
  chartCard: { backgroundColor: colors.dark3, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 0.5, borderColor: colors.dark4 },
  chartTitle: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.md },
  tableWrap: { backgroundColor: colors.dark3, borderRadius: radius.md, overflow: 'hidden', borderWidth: 0.5, borderColor: colors.dark4, marginBottom: spacing.md },
  tableHeader: { flexDirection: 'row', backgroundColor: colors.dark4, padding: spacing.sm },
  tableRow: { flexDirection: 'row', padding: spacing.sm },
  tableRowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  tableCell: { flex: 1, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  tableCellHeader: { fontSize: 10, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.5 },
  tableCellGreen: { color: colors.green, fontWeight: '600' },
  tableCellRed: { color: colors.red },
});
