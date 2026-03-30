import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../../src/hooks/useAppState';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { DAILY_INSIGHTS, ModeKey } from '../../src/constants/data';
import { useState, useMemo } from 'react';
import { ChevronRight } from '../../src/components/Icon';
import { IconSettings, IconSparkles, IconWind, IconSearch, IconLeaf, IconHeart, IconMoodLow, IconMoodOkay, IconMoodGood, IconMoodGreat, IconMoodAmazing } from '../../src/components/Icons';

const JOURNEY_STEPS = [
  { mode: 'vent' as ModeKey, num: 'Step 1', name: 'Vent', icon: 'wind' as const, color: '#6E9B72', gradient: ['#E4F0E5', '#EFF7F0'] as [string, string], border: '#C8E0CA', desc: 'Speak or type freely in a completely private space. Your partner will never see this. Just let it out.', tag: 'Start here every time' },
  { mode: 'understand' as ModeKey, num: 'Step 2', name: 'Understand', icon: 'search' as const, color: '#8B6FC0', gradient: ['#F0ECF8', '#F6F3FC'] as [string, string], border: '#DCD0F0', desc: 'Gently explore what is really happening. What pattern is at play? What are you actually needing?', tag: 'When you are ready to reflect' },
  { mode: 'prepare' as ModeKey, num: 'Step 3', name: 'Prepare', icon: 'leaf' as const, color: '#5B78B5', gradient: ['#E8EEF8', '#F0F4FB'] as [string, string], border: '#C5D3EC', desc: 'Figure out what you want to say and how to say it fairly. Turn feelings into clear language.', tag: 'When you are ready to communicate' },
  { mode: 'bridge' as ModeKey, num: 'Step 4', name: 'Nurture', icon: 'heart' as const, color: '#A8B03A', gradient: ['#F5F6E2', '#F9FAF0'] as [string, string], border: '#E8ECB0', desc: 'A conversation guide to help you open well, stay grounded, and close with care.', tag: 'When you are ready to repair' },
];

const STEP_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  wind: IconWind,
  search: IconSearch,
  leaf: IconLeaf,
  heart: IconHeart,
};

const CAROUSEL_GAP = 12;
const CAROUSEL_PEEK = 28;
const CAROUSEL_LEFT = 20;


export default function HomeTab() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const insight = useMemo(() => DAILY_INSIGHTS[new Date().getDate() % DAILY_INSIGHTS.length], []);
  const h = new Date().getHours();
  const timeGreeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const name = state.profile.name || 'friend';

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId);
  const [journeyIdx, setJourneyIdx] = useState(0);

  const cardWidth = windowWidth - CAROUSEL_LEFT - CAROUSEL_GAP - CAROUSEL_PEEK;
  const snapInterval = cardWidth + CAROUSEL_GAP;

  const resolvedCount = state.sessions.filter((s) => s.status === 'resolved').length;
  const captures = state.learnings.emotionalCaptures;
  const reflections = state.learnings.reflections;
  const growthMoments = state.userMemory?.growthMoments ?? [];
  const hasJourneyData = state.sessions.length > 0 || captures.length > 0 || growthMoments.length > 0;

  const startSession = () => {
    if (!activeSession) {
      dispatch({ type: 'CREATE_SESSION' });
    }
    router.push('/(tabs)/sessions');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.greeting}>
          <View style={styles.greetingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greetingTime}>{timeGreeting}</Text>
              <Text style={styles.greetingTitle}>{timeGreeting}, {name}</Text>
              <Text style={styles.greetingSub}>Your feelings are welcome here.</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} style={styles.settingsBtn} activeOpacity={0.7}>
              <IconSettings size={22} color={Colors.midBrown} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Session CTA */}
        <TouchableOpacity style={styles.startCard} onPress={startSession} activeOpacity={0.88}>
          <View style={styles.startCardBlob} />
          <Text style={styles.startTag}>{activeSession ? 'CONTINUE SESSION' : 'START HERE'}</Text>
          <Text style={styles.startTitle}>{activeSession ? 'Continue your session' : 'Start a new session'}</Text>
          <Text style={styles.startBody}>{activeSession ? 'You have an active session. Pick up where you left off.' : 'Whatever is happening, start here. Tether guides you from raw emotion to resolution, one step at a time.'}</Text>
          <View style={styles.startBtn}>
            <Text style={styles.startBtnText}>{activeSession ? 'Continue' : 'Begin'}</Text>
            <ChevronRight size={10} color={Colors.white} style={{ marginLeft: 6, marginTop: 1 }} />
          </View>
        </TouchableOpacity>

        {/* Journey Carousel */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={styles.sectionHeading}>How Tether works</Text>
            <Text style={styles.sectionSub}>Four steps from raw emotion to resolution.</Text>
          </View>
          <FlatList
            data={JOURNEY_STEPS}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={snapInterval}
            snapToAlignment="start"
            decelerationRate="fast"
            contentContainerStyle={{ paddingLeft: CAROUSEL_LEFT }}
            ItemSeparatorComponent={() => <View style={{ width: CAROUSEL_GAP }} />}
            keyExtractor={(item) => item.mode}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / snapInterval);
              setJourneyIdx(idx);
            }}
            renderItem={({ item: step }) => {
              const StepIcon = STEP_ICONS[step.icon];
              return (
              <TouchableOpacity onPress={startSession} activeOpacity={0.8} style={{ width: cardWidth }}>
                <LinearGradient colors={step.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[jc.card, { borderColor: step.border }]}>
                  <View style={[jc.orb, { backgroundColor: 'rgba(255,255,255,0.7)', borderColor: step.border }]}>
                    {StepIcon && <StepIcon size={22} color={step.color} />}
                  </View>
                  <Text style={[jc.num, { color: step.color }]}>{step.num}</Text>
                  <Text style={jc.name}>{step.name}</Text>
                  <Text style={jc.desc}>{step.desc}</Text>
                  <View style={[jc.tag, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                    <Text style={[jc.tagText, { color: step.color }]}>{step.tag}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              );
            }}
          />
          <View style={jc.dots}>
            {JOURNEY_STEPS.map((_, i) => (
              <View key={i} style={[jc.dot, i === journeyIdx && jc.dotActive]} />
            ))}
          </View>
        </View>

        {/* Your Journey */}
        {hasJourneyData ? (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={styles.sectionHeading}>Your journey</Text>
            <Text style={[styles.sectionSub, { marginBottom: 16 }]}>How you have been feeling and growing across sessions.</Text>

            {/* Stats row */}
            <View style={st.row}>
              <View style={st.card}>
                <Text style={st.num}>{resolvedCount}</Text>
                <Text style={st.label}>Sessions{'\n'}completed</Text>
              </View>
              <View style={st.card}>
                <Text style={st.num}>{captures.length}</Text>
                <Text style={st.label}>Emotional{'\n'}check-ins</Text>
              </View>
              <View style={st.card}>
                <Text style={st.num}>{growthMoments.length}</Text>
                <Text style={st.label}>Growth{'\n'}moments</Text>
              </View>
            </View>

            {/* Emotional trajectory */}
            {captures.length > 0 && (
              <>
                <Text style={et.heading}>Emotional trajectory</Text>
                <Text style={et.sub}>How you felt after each session</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={et.scrollWrap} contentContainerStyle={et.scrollContent}>
                  {captures.slice(0, 16).map((c) => {
                    const SCORE_MOODS = [IconMoodLow, IconMoodOkay, IconMoodGood, IconMoodGreat, IconMoodAmazing];
                    const MoodIcon = SCORE_MOODS[c.score - 1] ?? IconMoodOkay;
                    const color = c.score >= 4 ? Colors.sage : c.score >= 3 ? Colors.amber : Colors.lightBrown;
                    const barH = Math.max(10, (c.score / 5) * 56);
                    const dateStr = new Date(c.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
                    return (
                      <View key={c.id} style={et.col}>
                        <View style={et.barWrap}>
                          <View style={[et.bar, { height: barH, backgroundColor: color }]} />
                        </View>
                        <MoodIcon size={20} />
                        <Text style={et.date}>{dateStr}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {/* Growth moments */}
            {growthMoments.length > 0 && (
              <View style={gm.card}>
                <Text style={gm.title}>Growth moments</Text>
                <Text style={gm.sub}>Noticed by Tether across your sessions</Text>
                {growthMoments.slice(0, 5).map((moment: string, i: number) => (
                  <View key={i} style={gm.item}>
                    <View style={gm.dot} />
                    <Text style={gm.text}>{moment}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Latest session reflection */}
            {reflections.length > 0 && (() => {
              const latest = reflections[reflections.length - 1];
              const dateStr = new Date(latest.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
              return (
                <>
                  <View style={rf.headingRow}>
                    <Text style={rf.heading}>Latest reflection</Text>
                    <TouchableOpacity onPress={() => router.push('/reflections')} style={rf.viewAll} activeOpacity={0.7}>
                      <Text style={rf.viewAllText}>View all</Text>
                      <ChevronRight size={9} color={Colors.midBrown} style={{ marginTop: 1 }} />
                    </TouchableOpacity>
                  </View>
                  <View style={rf.card}>
                    <Text style={rf.date}>{dateStr}</Text>
                    <Text style={rf.text} numberOfLines={3}>{latest.text}</Text>
                  </View>
                </>
              );
            })()}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View style={ph.card}>
              <Text style={ph.title}>Your journey starts here</Text>
              <Text style={ph.body}>Complete your first session to begin tracking how you feel as you move through each step. Over time you will see your patterns shift.</Text>
            </View>
          </View>
        )}

        {/* Daily quote */}
        <View style={qt.card}>
          <View style={qt.accent} />
          <View style={qt.eyebrow}>
            <IconSparkles size={14} color={Colors.mauve} />
            <Text style={qt.eyebrowText}>Today's reflection</Text>
          </View>
          <Text style={qt.quote}>{insight}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Journey carousel ──
const jc = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: Radius.lg, padding: 18, overflow: 'hidden', height: 200, justifyContent: 'space-between' },
  orb: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  num: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2 },
  name: { fontFamily: Fonts.display, fontSize: 20, color: Colors.charcoal, marginBottom: 6 },
  desc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 12 },
  tag: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  tagText: { fontFamily: Fonts.bodyMedium, fontSize: 10 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.sand },
  dotActive: { width: 18, backgroundColor: Colors.terracotta },
});

// ── Stats row ──
const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  card: { flex: 1, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14, alignItems: 'center' },
  num: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 2 },
  label: { fontFamily: Fonts.body, fontSize: 10, color: Colors.midBrown, textAlign: 'center', lineHeight: 14 },
});

// ── Emotional trajectory ──
const et = StyleSheet.create({
  heading: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 2 },
  sub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginBottom: 12 },
  scrollWrap: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, marginBottom: 20 },
  scrollContent: { paddingHorizontal: 12, paddingVertical: 14, gap: 4 },
  col: { width: 48, alignItems: 'center', gap: 4 },
  barWrap: { height: 56, justifyContent: 'flex-end' },
  bar: { width: 20, borderRadius: 10 },
  emoji: { fontSize: 16 },
  date: { fontFamily: Fonts.body, fontSize: 9, color: Colors.lightBrown },
});

// ── Growth moments ──
const gm = StyleSheet.create({
  card: { backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 16, marginBottom: 20 },
  title: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 2 },
  sub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.sage, marginTop: 6, flexShrink: 0 },
  text: { fontFamily: Fonts.body, fontSize: 13, color: Colors.charcoal, lineHeight: 19, flex: 1 },
});

// ── Session reflections ──
const rf = StyleSheet.create({
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  heading: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal },
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 10 },
  date: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.terracotta, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 },
  text: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown },
});

// ── Daily quote ──
const qt = StyleSheet.create({
  card: { marginHorizontal: 20, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 24, overflow: 'hidden' },
  accent: { position: 'absolute', top: 0, left: 0, width: 4, height: '100%', backgroundColor: Colors.mauve, borderTopLeftRadius: Radius.lg, borderBottomLeftRadius: Radius.lg },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  eyebrowText: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: Colors.mauve },
  quote: { fontFamily: Fonts.displayItalic, fontSize: 17, color: Colors.charcoal, lineHeight: 28 },
});

// ── Placeholder ──
const ph = StyleSheet.create({
  card: { backgroundColor: Colors.creamDark, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, alignItems: 'center' },
  title: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4, textAlign: 'center' },
  body: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, textAlign: 'center' },
});

// ── Base styles ──
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  greeting: { paddingHorizontal: 20, paddingTop: 24, marginBottom: 20 },
  greetingRow: { flexDirection: 'row', alignItems: 'flex-start' },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.creamDark, alignItems: 'center', justifyContent: 'center' },
  greetingTime: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.terracotta, marginBottom: 4 },
  greetingTitle: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, lineHeight: 32, marginBottom: 4 },
  greetingSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  startCard: { marginHorizontal: 20, marginBottom: 24, backgroundColor: Colors.terracotta, borderRadius: Radius.lg, padding: 20, overflow: 'hidden', ...Shadows.terracotta },
  startCardBlob: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' },
  startTag: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  startTitle: { fontFamily: Fonts.display, fontSize: 22, color: Colors.white, marginBottom: 8 },
  startBody: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 21, marginBottom: 16 },
  startBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: Radius.full, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' },
  startBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },
  sectionHeading: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 2 },
  sectionSub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown },
});
