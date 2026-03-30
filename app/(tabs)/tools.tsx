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

const BREATHING_THEMES: Record<string, { accent: string; cardGrad: [string, string]; bg: [string, string]; circle: [string, string, string]; text: string }> = {
  'box': { accent: Colors.sage, cardGrad: ['#E4F0E5', '#FDFBF7'], bg: ['#4A7A4E', '#2D4F30'], circle: ['#C8E0CA', '#9BBF9E', '#6E9B72'], text: '#E4F0E5' },
  '478': { accent: Colors.blue, cardGrad: ['#E8EEF8', '#FDFBF7'], bg: ['#3A5490', '#243660'], circle: ['#C5D3EC', '#8BA4D4', '#5B78B5'], text: '#E8EEF8' },
};

const GROUNDING_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  '54321': IconWind,
  'bodyscan': IconUser,
};

const GROUNDING_THEMES: Record<string, { accent: string; cardGrad: [string, string]; bg: [string, string, string]; text: string }> = {
  '54321': { accent: Colors.midBrown, cardGrad: [Colors.creamDark, Colors.warmWhite], bg: ['#3A3630', '#2A2520', '#201D18'], text: '#DDD9D0' },
  'bodyscan': { accent: Colors.midBrown, cardGrad: [Colors.creamDark, Colors.warmWhite], bg: ['#3A3630', '#2A2520', '#201D18'], text: '#DDD9D0' },
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
      <LinearGradient colors={bTheme.cardGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={br.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          {(() => { const I = BREATHING_ICONS[exercise.id]; return I ? <I size={20} color={bTheme.accent} /> : null; })()}
          <Text style={br.name}>{exercise.name}</Text>
        </View>
        <Text style={br.desc}>{exercise.desc}</Text>
        <TouchableOpacity onPress={() => setActive(true)} style={br.startBtn} activeOpacity={0.8}>
          <Text style={br.startText}>Start exercise</Text>
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
  card: { borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12, overflow: 'hidden' },
  name: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal },
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 14 },
  startBtn: { backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.full, paddingVertical: 12, alignItems: 'center' },
  startText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal },
  // Full screen
  fullScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  fullTitle: { fontFamily: Fonts.displayLight, fontSize: 28, color: '#E4F0E5', marginBottom: 4 },
  fullCycle: { fontFamily: Fonts.body, fontSize: 13, color: '#9BBF9E', marginBottom: 40 },
  circleWrap: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  circleOuter: { width: 200, height: 200 },
  circleGradient: { width: 200, height: 200, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  fullCircleText: { fontFamily: Fonts.display, fontSize: 20, color: '#FDFBF7', textAlign: 'center' },
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
      <LinearGradient colors={gTheme.cardGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={gr.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          {Icon && <Icon size={20} color={gTheme.accent} />}
          <Text style={gr.name}>{g.name}</Text>
        </View>
        <Text style={gr.desc}>{g.desc}</Text>
        <TouchableOpacity onPress={() => setActive(true)} style={gr.startBtn} activeOpacity={0.8}>
          <Text style={gr.startText}>Begin</Text>
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
  card: { borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12, overflow: 'hidden' },
  name: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal },
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 14 },
  startBtn: { backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.full, paddingVertical: 12, alignItems: 'center' },
  startText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal },
  fullScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  fullTitle: { fontFamily: Fonts.displayLight, fontSize: 28, marginBottom: 4, textAlign: 'center' },
  fullProgress: { fontFamily: Fonts.body, fontSize: 13, opacity: 0.6, marginBottom: 40, textAlign: 'center' },
  stepCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.xl, padding: 32, alignItems: 'center', width: '100%', marginBottom: 40 },
  stepNum: { fontFamily: Fonts.displayLight, fontSize: 48, color: 'rgba(255,255,255,0.3)', marginBottom: 12 },
  stepText: { fontFamily: Fonts.body, fontSize: 17, color: '#FDFBF7', textAlign: 'center', lineHeight: 26 },
  nextBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 100, paddingHorizontal: 40, paddingVertical: 14, marginBottom: 16 },
  nextText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: '#FDFBF7' },
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
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, marginBottom: 12, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16 },
  title: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, flex: 1 },
  arrow: { fontFamily: Fonts.display, fontSize: 20, color: Colors.midBrown },
  body: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: Colors.creamDark, paddingTop: 12 },
});

export default function ToolsTab() {

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Tools</Text>
          <Text style={styles.subtitle}>For difficult moments or daily practice. Always here.</Text>
        </View>

        {/* Breathing Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breathing exercises</Text>
          {TOOLS_CONTENT.breathing.map((b) => (
            <BreathingExercise key={b.id} exercise={b} />
          ))}
        </View>

        {/* Grounding Techniques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Grounding techniques</Text>
          {TOOLS_CONTENT.grounding.map((g) => {
            const gTheme = GROUNDING_THEMES[g.id] || GROUNDING_THEMES['54321'];
            const GIcon = GROUNDING_ICONS[g.id];
            return (
              <GroundingCard key={g.id} technique={g} theme={gTheme} Icon={GIcon} />
            );
          })}
        </View>

        {/* Phrase Bank */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phrase bank</Text>

          <ExpandableCard icon={<IconLeaf size={20} color={Colors.sage} />} title="Soft start-ups">
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

          <ExpandableCard icon={<IconX size={20} color={Colors.lightBrown} />} title="Words to avoid">
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
      {(() => { const I = REPAIR_ICONS[repair.name]; return I ? <I size={22} color={Colors.sage} /> : null; })()}
      <View style={{ height: 6 }} />
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

const gt = StyleSheet.create({
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 12 },
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
