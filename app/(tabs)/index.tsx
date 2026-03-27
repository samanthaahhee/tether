import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../../src/hooks/useAppState';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { DAILY_INSIGHTS, ModeKey } from '../../src/constants/data';
import { useMemo } from 'react';

const JOURNEY_STEPS = [
  { mode: 'vent' as ModeKey, num: 'Step 1', name: 'Vent', emoji: '🌊', color: Colors.terracotta, paleBg: Colors.terracottaPale, border: Colors.terracottaLight, desc: 'Say what is on your heart without filters. Feel heard before trying to understand anything.', tag: 'Start here every time' },
  { mode: 'understand' as ModeKey, num: 'Step 2', name: 'Understand', emoji: '🔍', color: Colors.gold, paleBg: Colors.goldPale, border: '#D4B46A', desc: 'Gently explore what is really happening. What pattern is at play? What are you actually needing?', tag: 'When you are ready to reflect' },
  { mode: 'prepare' as ModeKey, num: 'Step 3', name: 'Prepare', emoji: '🌿', color: Colors.sage, paleBg: Colors.sagePale, border: Colors.sageLight, desc: 'Build a script, craft a bridge message, or plan your next conversation. Turn insight into action.', tag: 'When you are ready to communicate' },
  { mode: 'nurture' as ModeKey, num: 'Ongoing', name: 'Nurture', emoji: '💛', color: Colors.blush, paleBg: Colors.blushPale, border: Colors.blush, desc: 'When things are relatively good — invest in your bond. Small daily acts build a resilient relationship.', tag: 'Use when things are okay' },
];

export default function HomeTab() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const insight = useMemo(() => DAILY_INSIGHTS[new Date().getDate() % DAILY_INSIGHTS.length], []);
  const h = new Date().getHours();
  const timeGreeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = state.profile.name || 'friend';

  const goToMode = (mode: ModeKey) => {
    dispatch({ type: 'SET_MODE', mode });
    router.push('/(tabs)/chat');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.greeting}>
          <Text style={styles.greetingTime}>{timeGreeting}</Text>
          <Text style={styles.greetingTitle}>{timeGreeting}, {name}</Text>
          <Text style={styles.greetingSub}>Your feelings are welcome here.</Text>
        </View>

        <TouchableOpacity style={styles.startCard} onPress={() => goToMode('vent')} activeOpacity={0.88}>
          <View style={styles.startCardBlob} />
          <Text style={styles.startTag}>Start here</Text>
          <Text style={styles.startTitle}>Begin by venting</Text>
          <Text style={styles.startBody}>Whatever is happening — say it out loud. This is a private, judgment-free space. You do not need to find the right words. Just begin.</Text>
          <View style={styles.startBtn}>
            <Text style={styles.startBtnText}>Open Vent space →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOUR JOURNEY — FOLLOW THESE STEPS</Text>
          {JOURNEY_STEPS.map((step, i) => (
            <TouchableOpacity key={step.mode} onPress={() => goToMode(step.mode)} activeOpacity={0.8} style={styles.journeyRow}>
              <View style={styles.journeyLeft}>
                <View style={[styles.journeyOrb, { backgroundColor: step.paleBg, borderColor: step.border }]}>
                  <Text style={{ fontSize: 18 }}>{step.emoji}</Text>
                </View>
                {i < JOURNEY_STEPS.length - 1 && (
                  <View style={[styles.journeyLine, { backgroundColor: step.border }]} />
                )}
              </View>
              <View style={styles.journeyBody}>
                <Text style={[styles.journeyNum, { color: step.color }]}>{step.num}</Text>
                <Text style={styles.journeyName}>{step.name}</Text>
                <Text style={styles.journeyDesc}>{step.desc}</Text>
                <View style={[styles.journeyTag, { backgroundColor: step.paleBg }]}>
                  <Text style={[styles.journeyTagText, { color: step.color }]}>{step.tag}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.insightCard}>
          <Text style={{ fontSize: 18, marginTop: 2 }}>✨</Text>
          <Text style={styles.insightText}>
            <Text style={{ fontFamily: Fonts.bodyMedium, color: Colors.charcoal }}>Today: </Text>
            {insight}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  greeting: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 20 },
  greetingTime: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.terracotta, marginBottom: 4 },
  greetingTitle: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, lineHeight: 32, marginBottom: 4 },
  greetingSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  startCard: { marginHorizontal: 20, marginBottom: 24, backgroundColor: Colors.terracotta, borderRadius: Radius.lg, padding: 20, overflow: 'hidden', ...Shadows.terracotta },
  startCardBlob: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' },
  startTag: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  startTitle: { fontFamily: Fonts.display, fontSize: 22, color: Colors.white, marginBottom: 8 },
  startBody: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 21, marginBottom: 16 },
  startBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: Radius.full, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start' },
  startBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 16 },
  journeyRow: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 0 },
  journeyLeft: { width: 44, alignItems: 'center', marginRight: 14 },
  journeyOrb: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  journeyLine: { width: 2, flex: 1, marginVertical: 4, opacity: 0.5, minHeight: 16 },
  journeyBody: { flex: 1, paddingBottom: 20 },
  journeyNum: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2 },
  journeyName: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 4 },
  journeyDesc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 8 },
  journeyTag: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  journeyTagText: { fontFamily: Fonts.bodyMedium, fontSize: 11 },
  insightCard: { marginHorizontal: 20, backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 16, flexDirection: 'row', gap: 12 },
  insightText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 20 },
});
