import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { TOOLS_CONTENT, REPAIR_ATTEMPTS } from '../../src/constants/data';

function BreathingExercise({ exercise }: { exercise: typeof TOOLS_CONTENT.breathing[0] }) {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const scale = useRef(new Animated.Value(0.5)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCycles = 4;

  useEffect(() => {
    if (!active) return;

    const durations = exercise.durations;
    const isInhale = stepIdx % (durations.length) === 0;
    const isExhale = durations.length === 3 ? stepIdx % 3 === 2 : stepIdx % 4 === 2;

    if (isInhale) {
      Animated.timing(scale, { toValue: 1, duration: durations[0] * 1000, useNativeDriver: true }).start();
    } else if (isExhale) {
      const exhaleIdx = durations.length === 3 ? 2 : 2;
      Animated.timing(scale, { toValue: 0.5, duration: durations[exhaleIdx] * 1000, useNativeDriver: true }).start();
    }

    const currentDuration = durations[stepIdx % durations.length];
    timerRef.current = setTimeout(() => {
      const nextStep = stepIdx + 1;
      if (nextStep % durations.length === 0) {
        const nextCycle = cycle + 1;
        if (nextCycle >= totalCycles) {
          setActive(false);
          setStepIdx(0);
          setCycle(0);
          scale.setValue(0.5);
          return;
        }
        setCycle(nextCycle);
      }
      setStepIdx(nextStep);
    }, currentDuration * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, stepIdx]);

  const stop = () => {
    setActive(false);
    setStepIdx(0);
    setCycle(0);
    scale.setValue(0.5);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const currentStepLabel = active ? exercise.steps[stepIdx % exercise.steps.length] : '';

  return (
    <View style={br.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Text style={{ fontSize: 20 }}>{exercise.emoji}</Text>
        <Text style={br.name}>{exercise.name}</Text>
      </View>
      <Text style={br.desc}>{exercise.desc}</Text>

      {active ? (
        <View style={br.activeArea}>
          <Animated.View style={[br.circle, { transform: [{ scale }] }]}>
            <Text style={br.circleText}>{currentStepLabel}</Text>
          </Animated.View>
          <Text style={br.cycleText}>Cycle {cycle + 1} of {totalCycles}</Text>
          <TouchableOpacity onPress={stop} style={br.stopBtn}>
            <Text style={br.stopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setActive(true)} style={br.startBtn} activeOpacity={0.8}>
          <Text style={br.startText}>Start exercise</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const br = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12 },
  name: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal },
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 14 },
  activeArea: { alignItems: 'center', paddingVertical: 16 },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.sagePale, borderWidth: 2, borderColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  circleText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.sage, textAlign: 'center', paddingHorizontal: 8 },
  cycleText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginBottom: 12 },
  stopBtn: { backgroundColor: Colors.sand, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 8 },
  stopText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.warmBrown },
  startBtn: { backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.md, paddingVertical: 10, alignItems: 'center' },
  startText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.sage },
});

function ExpandableCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={ex.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={ex.header} activeOpacity={0.8}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
        <Text style={ex.title}>{title}</Text>
        <Text style={ex.arrow}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {expanded && <View style={ex.body}>{children}</View>}
    </View>
  );
}

const ex = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, marginBottom: 12, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  title: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, flex: 1 },
  arrow: { fontFamily: Fonts.display, fontSize: 20, color: Colors.midBrown },
  body: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: Colors.creamDark, paddingTop: 12 },
});

const CAROUSEL_GAP = 12;
const CAROUSEL_PEEK = 28;
const CAROUSEL_LEFT = 20;

export default function ToolsTab() {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - CAROUSEL_LEFT - CAROUSEL_GAP - CAROUSEL_PEEK;
  const snapInterval = cardWidth + CAROUSEL_GAP;
  const [groundingIdx, setGroundingIdx] = useState(0);
  const [expandedGrounding, setExpandedGrounding] = useState<Record<string, boolean>>({});
  const toggleGrounding = (id: string) =>
    setExpandedGrounding(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Tools</Text>
          <Text style={styles.subtitle}>Accessible anytime — for difficult moments or daily practice.</Text>
        </View>

        {/* Breathing Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breathing exercises</Text>
          {TOOLS_CONTENT.breathing.map((b) => (
            <BreathingExercise key={b.id} exercise={b} />
          ))}
        </View>

        {/* Grounding Techniques - Carousel */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Grounding techniques</Text>
          <FlatList
            data={TOOLS_CONTENT.grounding}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapInterval}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingLeft: CAROUSEL_LEFT }}
            ItemSeparatorComponent={() => <View style={{ width: CAROUSEL_GAP }} />}
            keyExtractor={(g) => g.id}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / snapInterval);
              setGroundingIdx(idx);
            }}
            renderItem={({ item: g }) => {
              const expanded = expandedGrounding[g.id] ?? false;
              return (
                <View style={[cr.card, { width: cardWidth }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Text style={{ fontSize: 22 }}>{g.emoji}</Text>
                    <Text style={cr.name}>{g.name}</Text>
                  </View>
                  <Text style={gt.desc}>{g.desc}</Text>
                  {expanded && g.steps.map((step, i) => (
                    <View key={i} style={gt.stepRow}>
                      <View style={gt.stepDot} />
                      <Text style={gt.stepText}>{step}</Text>
                    </View>
                  ))}
                  <TouchableOpacity onPress={() => toggleGrounding(g.id)} style={cr.showMoreBtn} activeOpacity={0.7}>
                    <Text style={cr.showMoreText}>{expanded ? 'Show less' : 'Show steps'}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <View style={cr.dots}>
            {TOOLS_CONTENT.grounding.map((_, i) => (
              <View key={i} style={[cr.dot, i === groundingIdx && cr.dotActive]} />
            ))}
          </View>
        </View>

        {/* Phrase Bank */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phrase bank</Text>

          <ExpandableCard icon="🌿" title="Soft start-ups">
            <Text style={gt.desc}>Replace criticism with gentle openings. Say this, not that.</Text>
            {TOOLS_CONTENT.phrases.softStartups.map((p, i) => (
              <View key={i} style={pb.pair}>
                <View style={pb.badRow}>
                  <Text style={pb.badLabel}>Instead of:</Text>
                  <Text style={pb.badText}>{p.bad}</Text>
                </View>
                <View style={pb.goodRow}>
                  <Text style={pb.goodLabel}>Try:</Text>
                  <Text style={pb.goodText}>{p.good}</Text>
                </View>
              </View>
            ))}
          </ExpandableCard>

          <ExpandableCard icon="🚫" title="Words to avoid">
            <Text style={gt.desc}>These common phrases escalate conflict. Here is why and what to say instead.</Text>
            {TOOLS_CONTENT.phrases.wordsToAvoid.map((w, i) => (
              <View key={i} style={pb.avoidCard}>
                <Text style={pb.avoidWord}>{w.word}</Text>
                <Text style={pb.avoidWhy}>{w.why}</Text>
              </View>
            ))}
          </ExpandableCard>
        </View>

        {/* Quick Repair Attempts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick repair attempts</Text>
          <Text style={gt.desc}>Pre-written messages you can use during or after a conflict. Tap to view.</Text>
          <View style={ra.grid}>
            {REPAIR_ATTEMPTS.map((r) => (
              <RepairCard key={r.name} repair={r} />
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function RepairCard({ repair }: { repair: typeof REPAIR_ATTEMPTS[0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity style={ra.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
      <Text style={{ fontSize: 22, marginBottom: 6 }}>{repair.icon}</Text>
      <Text style={ra.name}>{repair.name}</Text>
      {expanded && <Text style={ra.msg}>{repair.msg}</Text>}
    </TouchableOpacity>
  );
}

const ra = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  card: { width: '47%', backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14, alignItems: 'center' },
  name: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.charcoal, textAlign: 'center' },
  msg: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown, lineHeight: 18, marginTop: 8, textAlign: 'center' },
});

const cr = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16 },
  name: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, flex: 1 },
  showMoreBtn: { marginTop: 12, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: Colors.creamDark, borderRadius: Radius.full },
  showMoreText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.warmBrown },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.sand },
  dotActive: { width: 18, backgroundColor: Colors.sage },
});

const gt = StyleSheet.create({
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.sage, marginTop: 4, flexShrink: 0 },
  stepText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 20, flex: 1 },
});

const pb = StyleSheet.create({
  pair: { marginBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.creamDark, paddingBottom: 16 },
  badRow: { marginBottom: 8 },
  badLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.blush, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  badText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19, fontStyle: 'italic' },
  goodRow: {},
  goodLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.sage, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  goodText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.charcoal, lineHeight: 19 },
  avoidCard: { backgroundColor: Colors.creamDark, borderRadius: Radius.md, padding: 12, marginBottom: 10 },
  avoidWord: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal, marginBottom: 4 },
  avoidWhy: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 6 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 12 },
});
