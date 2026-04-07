import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { TOOLS_CONTENT, REPAIR_ATTEMPTS } from '../../src/constants/data';
import { IconWind, IconMoon, IconActivity, IconLeaf, IconHeart, IconCheck, IconUser, IconClock, IconX, IconVoice } from '../../src/components/Icons';

const BREATHING_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'box': IconActivity,
  '478': IconMoon,
};

const BREATHING_THEMES: Record<string, { accent: string; cardGrad: [string, string, string]; tag: string; bg: string; circleColor: string; titleColor: string; text: string }> = {
  'box': { accent: '#af30dc', cardGrad: ['#ffffff', '#ffffff', '#ece0f5'], tag: 'Calm your nerves', bg: '#fdeaff', circleColor: '#e8b0f8', titleColor: '#211e28', text: '#211e28' },
  '478': { accent: '#e96300', cardGrad: ['#ffffff', '#ffffff', '#f5e6d6'], tag: 'Prepare your nerves', bg: '#fff3e0', circleColor: '#f5d490', titleColor: '#211e28', text: '#211e28' },
};

const GROUNDING_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  '54321': IconWind,
  'bodyscan': IconUser,
};

const GROUNDING_THEMES: Record<string, { accent: string; cardGrad: [string, string, string]; tag: string; duration: string; bg: [string, string]; text: string }> = {
  '54321': { accent: '#211e28', cardGrad: ['#ffffff', '#ffffff', '#ddeee0'], tag: 'Quieten the noise', duration: '4 MINS', bg: ['#4ea989', '#ffffff'], text: '#211e28' },
  'bodyscan': { accent: '#211e28', cardGrad: ['#ffffff', '#ffffff', '#dde3f5'], tag: 'Release Tension', duration: '4 MINS', bg: ['#92a6f4', '#ffffff'], text: '#211e28' },
};

const REPAIR_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'Olive branch': IconLeaf,
  'Accountability': IconCheck,
  'Pause request': IconClock,
  'Soft start': IconVoice,
  'I hear you': IconUser,
  'Be together': IconHeart,
};

function BreathingExercise({ exercise }: { exercise: typeof TOOLS_CONTENT.breathing[0] }) {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [cycle, setCycle] = useState(0);
  const scale = useRef(new Animated.Value(0.65)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalCycles = 4;

  useEffect(() => {
    if (!active) return;

    const durations = exercise.durations;
    const isInhale = stepIdx % (durations.length) === 0;
    const isExhale = durations.length === 3 ? stepIdx % 3 === 2 : stepIdx % 4 === 2;

    if (isInhale) {
      Animated.timing(scale, { toValue: 1.25, duration: durations[0] * 1000, useNativeDriver: true }).start();
    } else if (isExhale) {
      const exhaleIdx = durations.length === 3 ? 2 : 2;
      Animated.timing(scale, { toValue: 0.65, duration: durations[exhaleIdx] * 1000, useNativeDriver: true }).start();
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
          scale.setValue(0.65);
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
    scale.setValue(0.65);
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
        <View style={[br.fullScreen, { backgroundColor: bTheme.bg }]}>
          {/* Header */}
          <View style={br.fullHeader}>
            <Text style={br.fullTitle}>{exercise.name}</Text>
            <Text style={br.fullCycle}>Cycle {cycle + 1} of {totalCycles}</Text>
          </View>

          {/* Circle + text */}
          <View style={br.circleWrap}>
            <Animated.View style={[br.circleOuter, { backgroundColor: bTheme.circleColor, transform: [{ scale }] }]} />
            <View style={br.circleTextWrap}>
              <Text style={br.fullCircleText}>{currentStepLabel}</Text>
            </View>
          </View>

          {/* End button */}
          <View style={br.fullFooter}>
            <TouchableOpacity onPress={stop} style={br.fullStopBtn} activeOpacity={0.8}>
              <Text style={br.fullStopText}>End exercise</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  // Full screen breathing — matching Figma exactly
  fullScreen: { flex: 1, alignItems: 'center', paddingTop: 120, paddingBottom: 60, paddingHorizontal: 16, gap: 80 },
  fullHeader: { alignItems: 'center', gap: 8 },
  fullTitle: { fontFamily: 'InstrumentSans_700Bold', fontSize: 22, color: '#211e28', textAlign: 'center' },
  fullCycle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#211e28' },
  circleWrap: { width: '100%', height: 390, alignItems: 'center', justifyContent: 'center' },
  circleOuter: { width: 390, height: 390, borderRadius: 195, position: 'absolute', opacity: 0.5 },
  circleTextWrap: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  fullCircleText: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', textAlign: 'center', lineHeight: 22 },
  fullFooter: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  fullStopBtn: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#dedde8', borderRadius: 9999, height: 44, alignItems: 'center', justifyContent: 'center', width: '100%' },
  fullStopText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#000000' },
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
        <LinearGradient
          colors={gTheme.bg}
          locations={[0, 0.35]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={gr.fullScreen}
        >
          {/* Title + Card centered */}
          <View style={gr.fullCenter}>
            <Text style={[gr.fullTitle, { color: gTheme.accent }]}>{g.name}</Text>
            <View style={gr.stepCard}>
              <Text style={gr.stepLabel}>STEP {currentStep + 1}</Text>
              <Text style={gr.stepText}>{g.steps[currentStep]}</Text>
            </View>
          </View>

          {/* Buttons at bottom */}
          <View style={gr.fullFooter}>
            <TouchableOpacity onPress={next} style={gr.nextBtn} activeOpacity={0.85}>
              <Text style={gr.nextText}>{currentStep < g.steps.length - 1 ? 'Next Step' : 'Done'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={close} style={gr.closeBtn} activeOpacity={0.7}>
              <Text style={gr.closeText}>End exercise</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
  fullScreen: { flex: 1, paddingHorizontal: 16, paddingBottom: 40 },
  fullCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 },
  fullTitle: { fontFamily: 'InstrumentSans_700Bold', fontSize: 22, textAlign: 'center', lineHeight: 29 },
  stepCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 10, alignItems: 'center', width: '100%', height: 383, justifyContent: 'center', shadowColor: '#001c14', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 32, elevation: 12 },
  stepLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#211e28', letterSpacing: 0.88, textTransform: 'uppercase' as const, marginBottom: 8 },
  stepText: { fontFamily: 'InstrumentSans_400Regular', fontSize: 26, color: '#211e28', textAlign: 'center', lineHeight: 33, letterSpacing: -0.5, paddingHorizontal: 16 },
  fullFooter: { width: '100%', alignItems: 'center' },
  nextBtn: { backgroundColor: '#96d35f', borderRadius: 9999, height: 44, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  nextText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#001c14' },
  closeBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  closeText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#000000' },
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
  card: { backgroundColor: '#fbf9ff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', flex: 1 },
  arrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: '#80798c' },
  body: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#dedde8', paddingTop: 16, gap: 8 },
});

export default function ToolsTab() {
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});
  const route = require('expo-router').useLocalSearchParams() as { scrollTo?: string };

  useEffect(() => {
    if (route.scrollTo && sectionPositions.current[route.scrollTo]) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: sectionPositions.current[route.scrollTo!], animated: true });
      }, 300);
    }
  }, [route.scrollTo]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Breathing Techniques */}
        <View style={styles.section} onLayout={(e) => { sectionPositions.current['breathing'] = e.nativeEvent.layout.y; }}>
          <Text style={styles.sectionTitle}>Breathing Techniques</Text>
          {TOOLS_CONTENT.breathing.map((b) => (
            <BreathingExercise key={b.id} exercise={b} />
          ))}
        </View>

        {/* Grounding Techniques */}
        <View style={styles.section} onLayout={(e) => { sectionPositions.current['grounding'] = e.nativeEvent.layout.y; }}>
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

          <ExpandableCard icon={<IconLeaf size={20} color="#4ea989" />} title="Soft start-ups">
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

          <ExpandableCard icon={<IconX size={20} color="#f90330" />} title="Words to avoid">
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
  avoidCardNew: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 12, padding: 14, marginBottom: 8 },
  avoidHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  avoidX: { fontSize: 14, color: '#f90330', fontWeight: '700' },
  avoidWordNew: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#f90330' },
  avoidWhyNew: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#211e28', lineHeight: 21 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9ff' },
  scroll: { flex: 1 },
  content: { paddingTop: 16, paddingBottom: 32 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', marginBottom: 8 },
});
