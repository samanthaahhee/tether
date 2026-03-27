import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { useAppState } from '../../src/hooks/useAppState';
import { ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS, ATTACH_REVEALS, CONFLICT_REVEALS, LOVE_REVEALS, WINDOW_REVEALS } from '../../src/constants/data';

const MODE_COLORS: Record<string, string> = {
  vent: Colors.terracotta,
  understand: Colors.gold,
  prepare: Colors.sage,
  nurture: Colors.blush,
};

function GrowthBar({ pct }: { pct: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: pct, duration: 900, useNativeDriver: false }).start();
  }, []);
  return (
    <View style={gb.track}>
      <Animated.View style={[gb.fill, { width: anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
    </View>
  );
}

const gb = StyleSheet.create({
  track: { height: 6, backgroundColor: Colors.sand, borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: Colors.sage, borderRadius: 3 },
});

function PatternCard({ label, value, note, accentColor }: { label: string; value: string; note: string; accentColor: string }) {
  return (
    <View style={[pc.card, { borderTopColor: accentColor }]}>
      <Text style={[pc.label, { color: accentColor }]}>{label}</Text>
      <Text style={pc.value}>{value}</Text>
      <Text style={pc.note}>{note}</Text>
    </View>
  );
}

const pc = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, borderTopWidth: 3, padding: 15, marginBottom: 12 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 6 },
  value: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 },
  note: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19 },
});

export default function JournalTab() {
  const { state } = useAppState();
  const { attachment, love, conflict, window: win, need } = state.profile;
  const log = state.sessionLog;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Pattern Journal</Text>
          <Text style={styles.subtitle}>Your emotional growth and relationship insights over time</Text>
        </View>

        <View style={styles.section}>
          <PatternCard
            label="Attachment style"
            value={ATTACHMENT_LABELS[attachment] || 'Not set'}
            note={ATTACH_REVEALS[attachment]?.body || 'Complete your profile to unlock attachment insights.'}
            accentColor={Colors.terracotta}
          />
          <PatternCard
            label="Love language"
            value={LOVE_LABELS[love] || 'Not set'}
            note={LOVE_REVEALS[love]?.body || 'Understanding how you receive love explains many conflicts.'}
            accentColor={Colors.gold}
          />
          <PatternCard
            label="Conflict style"
            value={CONFLICT_LABELS[conflict] || 'Not set'}
            note={CONFLICT_REVEALS[conflict]?.body || 'Your natural response under pressure.'}
            accentColor={Colors.sage}
          />
          <PatternCard
            label="Body in conflict"
            value={WINDOW_LABELS[win] || 'Not set'}
            note={WINDOW_REVEALS[win]?.body || 'How your body responds during conflict.'}
            accentColor={Colors.blush}
          />

          {need && (
            <View style={{ backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 15, marginBottom: 12 }}>
              <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: Colors.sage, marginBottom: 6 }}>Core need</Text>
              <Text style={{ fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 }}>{NEED_LABELS[need] || 'Not set'}</Text>
              <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 }}>
                This is the thread underneath most of your conflicts — the unspoken thing you most need your partner to understand.
              </Text>
            </View>
          )}

          <View style={[pc.card, { borderTopColor: Colors.sage }]}>
            <Text style={[pc.label, { color: Colors.sage }]}>Growth this month</Text>
            <Text style={pc.value}>Regulation speed</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown }}>Processing time</Text>
              <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.sage }}>Improving</Text>
            </View>
            <GrowthBar pct={68} />
            <Text style={[pc.note, { marginTop: 8 }]}>Each session builds emotional resilience.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session history</Text>
          {[
            { mode: 'understand', title: 'Understood the pursuer-withdrawer cycle', note: 'Reaching out more during conflict is attachment, not manipulation.', date: 'Today' },
            { mode: 'vent', title: 'Expressed frustration about feeling unheard', note: 'Underlying need: to feel my emotional experience matters.', date: 'Yesterday' },
            { mode: 'prepare', title: 'Built a bridge message about dinner conflict', note: 'Used full NVC framework — all four parts present.', date: '3 days ago' },
          ].map((e, i) => (
            <View key={i} style={styles.logEntry}>
              <View style={[styles.logDot, { backgroundColor: MODE_COLORS[e.mode] || Colors.midBrown }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logTitle}>{e.title}</Text>
                <Text style={styles.logNote}>{e.note}</Text>
                <Text style={styles.logDate}>{e.date}</Text>
              </View>
            </View>
          ))}
          {log.map((e, i) => (
            <View key={'live-' + i} style={styles.logEntry}>
              <View style={[styles.logDot, { backgroundColor: MODE_COLORS[e.mode] || Colors.midBrown }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logTitle}>{e.mode.charAt(0).toUpperCase() + e.mode.slice(1)} session</Text>
                <Text style={styles.logNote}>{e.text}</Text>
                <Text style={styles.logDate}>{e.date}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 6 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 14 },
  logEntry: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  logDot: { width: 9, height: 9, borderRadius: 5, marginTop: 5, flexShrink: 0 },
  logTitle: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal, marginBottom: 3 },
  logNote: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, lineHeight: 17 },
  logDate: { fontFamily: Fonts.body, fontSize: 11, color: Colors.lightBrown, marginTop: 3 },
});
