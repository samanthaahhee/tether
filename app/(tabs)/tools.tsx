import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { TOOLS_CONTENT, REPAIR_ATTEMPTS } from '../../src/constants/data';
import { IconWind, IconMoon, IconActivity, IconLeaf, IconHeart, IconCheck, IconUser, IconClock, IconX } from '../../src/components/Icons';

const BREATHING_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'box': IconActivity,
  '478': IconMoon,
};

const BREATHING_THEMES: Record<string, { accent: string; cardGrad: [string, string, string]; tag: string; bg: [string, string]; circle: [string, string, string]; text: string }> = {
  'box': { accent: '#af30dc', cardGrad: ['#ffffff', '#ffffff', '#ece0f5'], tag: 'Calm your nerves', bg: ['#679647', '#497032'], circle: ['#b8f37e', '#96d35f', '#81b756'], text: '#edf0e8' },
  '478': { accent: '#e96300', cardGrad: ['#ffffff', '#ffffff', '#f5e6d6'], tag: 'Prepare your nerves', bg: ['#9615b5', '#79028e'], circle: ['#ebb0ff', '#bd57f2', '#af30dc'], text: '#edf0e8' },
};

const GROUNDING_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  '54321': IconWind,
  'bodyscan': IconUser,
};

const GROUNDING_THEMES: Record<string, { accent: string; cardGrad: [string, string, string]; tag: string; duration: string; bg: [string, string, string]; text: string }> = {
  '54321': { accent: '#4ea989', cardGrad: ['#ffffff', '#ffffff', '#ddeee0'], tag: 'Quieten the noise', duration: '4 MINS', bg: ['#3A3630', '#2A2520', '#201D18'], text: '#DDD9D0' },
  'bodyscan': { accent: '#f67700', cardGrad: ['#ffffff', '#ffffff', '#dde3f5'], tag: 'Release Tension', duration: '4 MINS', bg: ['#3A3630', '#2A2520', '#201D18'], text: '#DDD9D0' },
};

const REPAIR_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'Olive branch': IconHeart,
  'Accountability': IconCheck,
  'Pause request': IconClock,
  'Soft start': IconLeaf,
  'I hear you': IconUser,
  'Be together': IconHeart,
};

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

  const bTheme = BREATHING_THEMES[exercise.id] || BREATHING_THEMES['box'];

  return (
    <>
      <LinearGradient
        colors={bTheme.cardGrad}
        locations={[0, 0.65, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={br.card}
      >
        {/* Top row: duration + tag badge */}
        <View style={br.topRow}>
          <Text style={br.duration}>2 MINS</Text>
          <View style={br.tagBadge}>
            <Text style={br.tagText}>{bTheme.tag}</Text>
          </View>
        </View>
        {/* Title */}
        <Text style={br.name}>{exercise.name}</Text>
        {/* Description */}
        <Text style={br.desc}>{exercise.desc}</Text>
        {/* Arrow button */}
        <TouchableOpacity onPress={() => setActive(true)} style={br.arrowBtn} activeOpacity={0.8}>
          <Text style={br.arrowText}>→</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal visible={active} animationType="fade" onRequestClose={stop}>
        <LinearGradient colors={bTheme.bg} style={br.fullScreen}>
          <Text style={[br.fullTitle, { color: bTheme.text }]}>{exercise.name}</Text>
          <Text style={[br.fullCycle, { color: bTheme.text, opacity: 0.6 }]}>Cycle {cycle + 1} of {totalCycles}</Text>

          <View style={br.circleWrap}>
            <Animated.View style={[br.circleOuter, { transform: [{ scale }] }]}>
              <LinearGradient
                colors={bTheme.circle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={br.circleGradient}
              >
                <Text style={br.fullCircleText}>{currentStepLabel}</Text>
              </LinearGradient>
            </Animated.View>
          </View>

          <TouchableOpacity onPress={stop} style={br.fullStopBtn} activeOpacity={0.8}>
            <Text style={br.fullStopText}>End exercise</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Modal>
    </>
  );
}

const br = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 28, marginBottom: 10, overflow: 'hidden', gap: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  duration: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#211e28', textTransform: 'uppercase', letterSpacing: 0.88 },
  tagBadge: { backgroundColor: '#e3e8fa', borderWidth: 1, borderColor: '#92a6f4', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#5877ee', letterSpacing: 0.055 },
  name: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28' },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', lineHeight: 21 },
  arrowBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#dedde8', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 18, color: '#211e28' },
  // Full screen
  fullScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  fullTitle: { fontFamily: Fonts.displayLight, fontSize: 28, color: '#edf0e8', marginBottom: 4 },
  fullCycle: { fontFamily: Fonts.body, fontSize: 13, color: '#96d35f', marginBottom: 40 },
  circleWrap: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  circleOuter: { width: 200, height: 200 },
  circleGradient: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  fullCircleText: { fontFamily: Fonts.display, fontSize: 20, color: '#edf0e8', textAlign: 'center' },
  fullStopBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 100, paddingHorizontal: 32, paddingVertical: 14 },
  fullStopText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#F0F1E6' },
});

function BreathingBackground({ colors }: { colors: [string, string, string] }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const translateY1 = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const translateY2 = anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.7, 0.4] });

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <Animated.View style={{ position: 'absolute', top: -60, left: -40, right: -40, bottom: -60, transform: [{ translateY: translateY1 }] }}>
        <LinearGradient colors={[colors[0], colors[2]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', top: -60, left: -40, right: -40, bottom: -60, opacity, transform: [{ translateY: translateY2 }] }}>
        <LinearGradient colors={[colors[2], colors[0]]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }} />
      </Animated.View>
    </View>
  );
}

function GroundingCard({ technique: g, theme: gTheme, Icon }: {
  technique: typeof TOOLS_CONTENT.grounding[0];
  theme: typeof GROUNDING_THEMES[string];
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
}) {
  const [active, setActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const close = () => { setActive(false); setCurrentStep(0); };
  const next = () => {
    if (currentStep < g.steps.length - 1) setCurrentStep(currentStep + 1);
    else close();
  };

  return (
    <>
      <LinearGradient colors={gTheme.cardGrad} locations={[0, 0.65, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={gr.card}>
        <View style={gr.topRow}>
          <Text style={gr.duration}>{gTheme.duration}</Text>
          <View style={gr.tagBadge}>
            <Text style={gr.tagText}>{gTheme.tag}</Text>
          </View>
        </View>
        <Text style={gr.name}>{g.name}</Text>
        <Text style={gr.desc}>{g.desc}</Text>
        <TouchableOpacity onPress={() => setActive(true)} style={gr.startBtn} activeOpacity={0.8}>
          <Text style={gr.startText}>→</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal visible={active} animationType="fade" onRequestClose={close}>
        <View style={gr.fullScreen}>
          <BreathingBackground colors={gTheme.bg} />

          <Text style={[gr.fullTitle, { color: gTheme.text }]}>{g.name}</Text>
          <Text style={[gr.fullProgress, { color: gTheme.text }]}>Step {currentStep + 1} of {g.steps.length}</Text>

          <View style={gr.stepCard}>
            <Text style={gr.stepNum}>{currentStep + 1}</Text>
            <Text style={gr.stepText}>{g.steps[currentStep]}</Text>
          </View>

          <TouchableOpacity onPress={next} style={gr.nextBtn} activeOpacity={0.85}>
            <Text style={gr.nextText}>{currentStep < g.steps.length - 1 ? 'Next step' : 'Done'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={close} style={gr.closeBtn} activeOpacity={0.7}>
            <Text style={[gr.closeText, { color: gTheme.text }]}>End exercise</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const gr = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, paddingHorizontal: 32, paddingVertical: 28, marginBottom: 10, overflow: 'hidden', gap: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  duration: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#211e28', textTransform: 'uppercase', letterSpacing: 0.88 },
  tagBadge: { backgroundColor: '#e3e8fa', borderWidth: 1, borderColor: '#92a6f4', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#5877ee', letterSpacing: 0.055 },
  name: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28' },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', lineHeight: 21 },
  startBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#dedde8', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  startText: { fontSize: 18, color: '#211e28' },
  fullScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  fullTitle: { fontFamily: Fonts.displayLight, fontSize: 28, marginBottom: 4, textAlign: 'center' },
  fullProgress: { fontFamily: Fonts.body, fontSize: 13, opacity: 0.6, marginBottom: 40, textAlign: 'center' },
  stepCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.xl, padding: 32, alignItems: 'center', width: '100%', marginBottom: 40 },
  stepNum: { fontFamily: Fonts.displayLight, fontSize: 48, color: 'rgba(255,255,255,0.3)', marginBottom: 12 },
  stepText: { fontFamily: Fonts.body, fontSize: 17, color: '#edf0e8', textAlign: 'center', lineHeight: 26 },
  nextBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 100, paddingHorizontal: 40, paddingVertical: 14, marginBottom: 16 },
  nextText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: '#edf0e8' },
  closeBtn: { paddingVertical: 8 },
  closeText: { fontFamily: Fonts.body, fontSize: 13, opacity: 0.6 },
});

function ExpandableCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={ex.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={ex.header} activeOpacity={0.8}>
        {icon}
        <Text style={ex.title}>{title}</Text>
        <Text style={ex.arrow}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      {expanded && <View style={ex.body}>{children}</View>}
    </View>
  );
}

const ex = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', flex: 1 },
  arrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: '#80798c' },
  body: { paddingHorizontal: 24, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#dedde8', paddingTop: 24, gap: 12 },
});

export default function ToolsTab() {

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Breathing Techniques */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Breathing Techniques</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          {TOOLS_CONTENT.breathing.map((b) => (
            <BreathingExercise key={b.id} exercise={b} />
          ))}
        </View>

        {/* Grounding Techniques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grounding Techniques</Text>
          {TOOLS_CONTENT.grounding.map((g) => {
            const gTheme = GROUNDING_THEMES[g.id] || GROUNDING_THEMES['54321'];
            const GIcon = GROUNDING_ICONS[g.id];
            return (
              <GroundingCard key={g.id} technique={g} theme={gTheme} Icon={GIcon} />
            );
          })}
        </View>

        {/* Speak with kindness */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speak with kindness</Text>

          <ExpandableCard icon={<IconLeaf size={20} color="#4ea989" />} title="Gratitude Practice">
            {TOOLS_CONTENT.phrases.softStartups.map((p, i) => (
              <View key={i} style={pb.pair}>
                <View style={pb.itemGroup}>
                  <Text style={pb.badLabel}>INSTEAD OF:</Text>
                  <Text style={pb.itemText}>{p.bad}</Text>
                </View>
                <View style={pb.itemGroup}>
                  <Text style={pb.goodLabel}>TRY:</Text>
                  <Text style={pb.itemText}>{p.good}</Text>
                </View>
                {i < TOOLS_CONTENT.phrases.softStartups.length - 1 && <View style={pb.separator} />}
              </View>
            ))}
          </ExpandableCard>

          <ExpandableCard icon={<IconHeart size={20} color="#bd57f2" />} title="Words to avoid">
            {TOOLS_CONTENT.phrases.wordsToAvoid.map((w, i) => (
              <View key={i} style={pb.avoidCardNew}>
                <View style={pb.avoidHeader}>
                  <Text style={pb.avoidX}>✕</Text>
                  <Text style={pb.avoidWordNew}>{w.word}</Text>
                </View>
                <Text style={pb.avoidWhyNew}>{w.why}</Text>
              </View>
            ))}
          </ExpandableCard>
        </View>

        {/* Quick Repair Attempts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Repair Attempts</Text>
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

const REPAIR_COLORS: Record<string, string> = {
  'Olive branch': '#4ea989',
  'Accountability': '#96d35f',
  'Pause request': '#4ea989',
  'Soft start': '#f67700',
  'I hear you': '#92a6f4',
  'Be together': '#bd57f2',
};

function RepairCard({ repair }: { repair: typeof REPAIR_ATTEMPTS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const I = REPAIR_ICONS[repair.name];
  const color = REPAIR_COLORS[repair.name] || '#4ea989';
  return (
    <TouchableOpacity style={ra.card} onPress={() => setExpanded(!expanded)} activeOpacity={0.8}>
      {I ? <I size={22} color={color} /> : null}
      <Text style={ra.name}>{repair.name}</Text>
      {expanded && <Text style={ra.msg}>{repair.msg}</Text>}
    </TouchableOpacity>
  );
}

const ra = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '47%', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 14, alignItems: 'center' },
  name: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', textAlign: 'center' },
  msg: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#80798c', lineHeight: 18, marginTop: 8, textAlign: 'center' },
});

const gt = StyleSheet.create({
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 12 },
});

const pb = StyleSheet.create({
  pair: { gap: 8, marginBottom: 12 },
  itemGroup: { gap: 4 },
  badLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#f67700', letterSpacing: 0.055, textTransform: 'uppercase' },
  goodLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#166534', letterSpacing: 0.055, textTransform: 'uppercase' },
  itemText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', lineHeight: 21 },
  separator: { height: 1, backgroundColor: '#dedde8', marginTop: 12 },
  avoidCard: { backgroundColor: '#eeebf4', borderRadius: 10, padding: 12, marginBottom: 10 },
  avoidWord: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#211e28', marginBottom: 4 },
  avoidWhy: { fontFamily: Fonts.body, fontSize: 13, color: '#80798c', lineHeight: 19 },
  avoidCardNew: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 16, marginBottom: 10 },
  avoidHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  avoidX: { fontSize: 14, color: '#f90330', fontWeight: '700' },
  avoidWordNew: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f90330' },
  avoidWhyNew: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', lineHeight: 21 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9ff' },
  scroll: { flex: 1 },
  content: { paddingTop: 16, paddingBottom: 32 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', marginBottom: 8 },
  viewAll: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c' },
});
