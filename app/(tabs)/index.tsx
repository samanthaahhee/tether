import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions, TextInput, Image, Modal, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../../src/hooks/useAppState';
import { useAuth } from '../../src/hooks/useAuth';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { ModeKey } from '../../src/constants/data';
import { useState, useRef, useEffect } from 'react';
import { IconSettings, IconWind, IconSearch, IconLeaf, IconHeart, IconVoice, IconX } from '../../src/components/Icons';
import { ChevronLeft, ChevronRight } from '../../src/components/Icon';

// ── Figma: "Your Guide" carousel cards ──────────────────────────────────────
const JOURNEY_STEPS = [
  { mode: 'vent' as ModeKey, num: 'STEP 1', name: 'Vent', icon: 'wind' as const, color: '#4ea989', gradient: ['#ffffff', '#ffffff', '#d8f5ea'] as [string, string, string],
    desc: 'Let it all out in a safe, private space. Your partner will never see what you share here.',
    detail: 'Putting emotions into words reduces their intensity. When you express yourself without fear of judgment, your mind shifts from reacting to reflecting. This step is not about solving anything. It is about giving yourself permission to feel what you feel, fully and honestly, before moving forward.',
  },
  { mode: 'understand' as ModeKey, num: 'STEP 2', name: 'Understand', icon: 'heart' as const, color: '#92a6f4', gradient: ['#ffffff', '#ffffff', '#dce3fd'] as [string, string, string],
    desc: 'Explore what is really going on beneath the surface. Identify patterns, fears, and unmet needs.',
    detail: 'Most arguments are not about what they seem. Beneath every conflict is usually an unmet need: to feel safe, valued, or connected. This step helps you move past the surface trigger and identify what is really going on. When you understand the real need, you stop fighting about small things and start addressing what actually matters.',
  },
  { mode: 'prepare' as ModeKey, num: 'STEP 3', name: 'Prepare', icon: 'leaf' as const, color: '#f67700', gradient: ['#ffffff', '#ffffff', '#fde8cc'] as [string, string, string],
    desc: 'Turn your feelings into clear, fair language your partner can hear. Plan what you want to say.',
    detail: 'How you start a conversation usually determines how it ends. A harsh opening leads to defensiveness. This step helps you frame what you want to say using observations, feelings, needs, and requests. The goal is not to win. It is to be heard. When your partner does not feel attacked, they can actually listen.',
  },
  { mode: 'bridge' as ModeKey, num: 'STEP 4', name: 'Nurture', icon: 'heart' as const, color: '#bd57f2', gradient: ['#ffffff', '#ffffff', '#f0dcfa'] as [string, string, string],
    desc: 'A conversation guide to help you open well, stay grounded, and close with care.',
    detail: 'The conversation itself is the repair. Small moments of reaching out during conflict matter more than grand gestures. This step gives you a structured guide: how to open softly, what to say if things get heated, how to stay connected to your need, and how to close with gratitude. Even if you do not resolve everything, showing up with intention builds trust over time.',
  },
];

const STEP_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  wind: IconWind,
  search: IconSearch,
  leaf: IconLeaf,
  heart: IconHeart,
};

// ── Quick-access tag chips ──────────────────────────────────────────────────
const TAGS = [
  { label: 'Grounding Techniques', route: '/(tabs)/tools', scrollTo: 'grounding' },
  { label: 'Breathing exercises', route: '/(tabs)/tools', scrollTo: 'breathing' },
  { label: 'Affirmations', route: null, scrollTo: null },
];

// ── Affirmations data ────────────────────────────────────────────────────────
const AFFIRMATIONS = [
  {
    category: 'GROWTH',
    title: 'My potential is limitless.',
    body: 'I am constantly evolving and learning. I welcome new opportunities with an open heart, knowing that my future is shaped by my positive actions today.',
    gradient: ['#ffffff', '#ffffff', '#dce3fd'] as [string, string, string],
  },
  {
    category: 'YOUR SELF-WORTH',
    title: 'I am enough.',
    body: 'I release the need for perfection and embrace my inherent value. I do not need to do more or be more to deserve respect, love, and success.',
    gradient: ['#ffffff', '#ffffff', '#f3e6fb'] as [string, string, string],
  },
  {
    category: 'RESILIENCE',
    title: 'I have the power to overcome any challenge.',
    body: 'Every difficulty I face is an opportunity to grow stronger. I trust my ability to navigate tough times with grace and emerge more capable than before.',
    gradient: ['#ffffff', '#ffffff', '#d8f5ea'] as [string, string, string],
  },
  {
    category: 'SELF-COMPASSION',
    title: 'I deserve kindness from myself.',
    body: 'I treat myself with the same compassion I would offer a dear friend. My mistakes do not define me. They are part of my journey toward becoming who I am meant to be.',
    gradient: ['#ffffff', '#ffffff', '#fde8cc'] as [string, string, string],
  },
  {
    category: 'CONNECTION',
    title: 'I am worthy of deep love.',
    body: 'I open my heart to give and receive love fully. My vulnerability is not weakness. It is the bridge that connects me to the people who matter most.',
    gradient: ['#ffffff', '#ffffff', '#f3e6fb'] as [string, string, string],
  },
];

function AffirmationsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const switchCard = (newIdx: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setIdx(newIdx);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const prev = () => switchCard(idx > 0 ? idx - 1 : AFFIRMATIONS.length - 1);
  const next = () => switchCard(idx < AFFIRMATIONS.length - 1 ? idx + 1 : 0);

  const aff = AFFIRMATIONS[idx];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={af.overlay}>
        <Animated.View style={[af.cardWrap, { opacity: fadeAnim }]}>
          {/* Close button */}
          <TouchableOpacity style={af.closeX} onPress={onClose} activeOpacity={0.7}>
            <IconX size={18} color="#80798c" />
          </TouchableOpacity>

          <LinearGradient colors={aff.gradient} locations={[0, 0.65, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={af.card}>
            <View style={af.textBlock}>
              <Text style={af.category}>{aff.category}</Text>
              <Text style={af.title}>{aff.title}</Text>
              <Text style={af.body}>{aff.body}</Text>
            </View>
            <Image source={require('../../assets/mascot-prepare.png')} style={af.mascot} resizeMode="contain" />
          </LinearGradient>
        </Animated.View>

        {/* Navigation */}
        <View style={af.nav}>
          <TouchableOpacity style={af.navArrow} onPress={prev} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, color: '#211e28' }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={af.feelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={af.feelBtnText}>Thank You</Text>
          </TouchableOpacity>
          <TouchableOpacity style={af.navArrow} onPress={next} activeOpacity={0.8}>
            <Text style={{ fontSize: 18, color: '#211e28' }}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
          <Text style={af.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const af = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  cardWrap: { width: '100%', maxWidth: 340 },
  closeX: { position: 'absolute', top: 10, right: 10, zIndex: 10, padding: 8 },
  card: { borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, paddingHorizontal: 28, paddingVertical: 42, gap: 28, overflow: 'hidden', minHeight: 420, ...Shadows.sm },
  textBlock: { gap: 8 },
  category: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#211e28', letterSpacing: 0.88, textTransform: 'uppercase' as const },
  title: { fontFamily: 'InstrumentSans_700Bold', fontSize: 18, color: '#211e28', lineHeight: 24 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', lineHeight: 21 },
  mascot: { width: 100, height: 120, alignSelf: 'center' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 21 },
  navArrow: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#dedde8', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  feelBtn: { backgroundColor: '#f7f5fd', borderWidth: 1.5, borderColor: '#dedde8', borderRadius: 9999, height: 44, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  feelBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#000000' },
  closeText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#ffffff', marginTop: 21 },
});

function LearnMoreDrawer({ initialStep, visible, onClose }: { initialStep: typeof JOURNEY_STEPS[0] | null; visible: boolean; onClose: () => void }) {
  const listRef = useRef<FlatList>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (visible && initialStep) {
      const idx = JOURNEY_STEPS.findIndex(s => s.mode === initialStep.mode);
      setCurrentIdx(idx);
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: idx, animated: false });
      }, 100);
    }
  }, [visible, initialStep]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={lm.overlay}>
        <TouchableOpacity style={{ flex: 0.2 }} activeOpacity={1} onPress={onClose} />
        <View style={lm.drawer}>
          {/* Close X button */}
          <TouchableOpacity style={lm.closeX} onPress={onClose} activeOpacity={0.7}>
            <IconX size={20} color="#80798c" />
          </TouchableOpacity>

          {/* Horizontal paging FlatList */}
          <FlatList
            ref={listRef}
            data={JOURNEY_STEPS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.mode}
            style={lm.scroll}
            getItemLayout={(_, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setCurrentIdx(idx);
            }}
            renderItem={({ item: step }) => {
              const StepIcon = STEP_ICONS[step.icon];
              return (
                <ScrollView
                  style={{ width: screenWidth }}
                  contentContainerStyle={lm.content}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled
                >
                  <View style={[lm.iconWrap, { backgroundColor: step.color + '18' }]}>
                    {StepIcon && <StepIcon size={32} color={step.color} />}
                  </View>
                  <Text style={lm.stepLabel}>{step.num}</Text>
                  <Text style={lm.title}>{step.name}</Text>
                  <Text style={lm.desc}>{step.desc}</Text>
                  <View style={lm.divider} />
                  <Text style={lm.bodyHeading}>Why this matters</Text>
                  <Text style={lm.body}>{step.detail}</Text>
                </ScrollView>
              );
            }}
          />

          {/* Page dots */}
          <View style={lm.dots}>
            {JOURNEY_STEPS.map((_, i) => (
              <View key={i} style={[lm.dot, i === currentIdx && lm.dotActive]} />
            ))}
          </View>

          {/* Action button */}
          <View style={lm.footer}>
            <TouchableOpacity style={lm.actionBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={lm.actionBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const lm = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: { flex: 0.8, backgroundColor: '#fbf9ff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32 },
  closeX: { position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 4 },
  scroll: { flex: 1, marginTop: 48 },
  content: { paddingHorizontal: 28, paddingBottom: 32, alignItems: 'center' },
  iconWrap: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  stepLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#80798c', letterSpacing: 0.88, textTransform: 'uppercase' as const, marginBottom: 6 },
  title: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 26, color: '#211e28', marginBottom: 12, textAlign: 'center' },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#211e28', lineHeight: 24, textAlign: 'center', marginBottom: 24 },
  divider: { width: 40, height: 2, backgroundColor: '#dedde8', borderRadius: 1, marginBottom: 24 },
  bodyHeading: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28', marginBottom: 12, textAlign: 'center' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#80798c', lineHeight: 24, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#dedde8' },
  dotActive: { width: 18, backgroundColor: '#96d35f' },
  footer: { paddingHorizontal: 28, paddingTop: 4, paddingBottom: 8 },
  actionBtn: { backgroundColor: '#96d35f', borderRadius: 9999, height: 48, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#001c14' },
});

const CAROUSEL_GAP = 12;
const CAROUSEL_LEFT = 16;
const CARD_WIDTH = 294;

/**
 * Subtle pulsing skeleton block. Used during initial home-tab load so the
 * UI feels structured rather than blank-with-spinner while AppState
 * hydrates and the Supabase profile fetch resolves.
 */
function SkeletonBlock({ width, height, radius = 8 }: { width: number | string; height: number; radius?: number }) {
  const opacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.95, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius: radius,
        backgroundColor: '#e8e6f0',
        opacity,
      }}
    />
  );
}

export default function HomeTab() {
  const { state, dispatch } = useAppState();
  const { loading: authLoading } = useAuth();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  // The user's first name from local state (synced from Supabase via
  // useAuth.fetchUserData). Falls back to empty string when not yet set
  // — the JSX below renders just "HELLO" (no trailing space) in that case.
  // Earlier this fell back to 'Sam' which is the founder's name and showed
  // confusingly to brand-new users.
  const name = state.profile.name?.trim() || '';

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId);
  const [journeyIdx, setJourneyIdx] = useState(0);
  const [showAffirmations, setShowAffirmations] = useState(false);
  const [learnMoreStep, setLearnMoreStep] = useState<typeof JOURNEY_STEPS[0] | null>(null);
  const [feelingText, setFeelingText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const snapInterval = CARD_WIDTH + CAROUSEL_GAP;

  // Fade in animation when content is ready
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (state.loaded && !authLoading) {
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [state.loaded, authLoading]);

  const openCount = state.sessions.filter((s) => s.status === 'active').length;
  const resolvedCount = state.sessions.filter((s) => s.status === 'resolved').length;
  const captures = state.learnings.emotionalCaptures;

  const startSession = (initialMessage?: string) => {
    if (initialMessage?.trim()) {
      (global as any).__tether_initial_feeling = initialMessage.trim();
    }
    dispatch({ type: 'CREATE_SESSION' });
    router.replace('/(tabs)/sessions');
  };

  if (!state.loaded || authLoading) {
    // Skeleton placeholder while local state hydrates + Supabase profile
    // resolves. A spinner alone left the home screen feeling broken on
    // first launch — this gives a sense of structure (greeting, hero
    // card, journey carousel) so the user understands content is on the
    // way. Pulse animation is handled by SkeletonBlock.
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.scrollContent}>
          {/* Top bar (cog placeholder) */}
          <View style={s.topBar}>
            <View style={{ flex: 1 }} />
            <SkeletonBlock width={36} height={36} radius={18} />
          </View>
          {/* Greeting */}
          <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
            <SkeletonBlock width={180} height={26} radius={6} />
            <View style={{ height: 8 }} />
            <SkeletonBlock width={240} height={14} radius={4} />
          </View>
          {/* Hero card */}
          <View style={{ paddingHorizontal: 20, marginTop: 28 }}>
            <SkeletonBlock width={'100%'} height={140} radius={20} />
          </View>
          {/* Journey carousel cards */}
          <View style={{ paddingLeft: 20, marginTop: 28, flexDirection: 'row', gap: 12 }}>
            <SkeletonBlock width={CARD_WIDTH} height={180} radius={16} />
            <SkeletonBlock width={CARD_WIDTH * 0.6} height={180} radius={16} />
          </View>
          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 24 }}>
            <SkeletonBlock width={'48%'} height={72} radius={12} />
            <SkeletonBlock width={'48%'} height={72} radius={12} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeIn }}>
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Settings gear (top-right) ── */}
        <View style={s.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')} style={s.settingsBtn} activeOpacity={0.7}>
            <IconSettings size={24} color="#80798c" />
          </TouchableOpacity>
        </View>

        {/* ── Hero Card ── */}
        <View style={s.heroCardWrap}>
          <View style={s.heroCard}>
            {/* Label */}
            <View style={s.heroTextBlock}>
              <Text style={s.helloLabel}>{name ? `HELLO ${name.toUpperCase()}` : 'HELLO'}</Text>
              <Text style={s.heroTitle}>What do you need in this moment?</Text>

              {/* Tag chips */}
              <View style={s.tagsRow}>
                {TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag.label}
                    style={s.tag}
                    onPress={() => {
                      if (tag.label === 'Affirmations') {
                        setShowAffirmations(true);
                      } else if (tag.route && tag.scrollTo) {
                        router.push({ pathname: tag.route as any, params: { scrollTo: tag.scrollTo } });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={s.tagText}>{tag.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Mascot */}
            <View style={s.mascotWrap}>
              <Image source={require('../../assets/mascot-prepare.png')} style={s.mascot} resizeMode="contain" />
            </View>

            {/* Start session button */}
            <TouchableOpacity style={s.startBtn} onPress={() => startSession()} activeOpacity={0.85}>
              <Text style={s.startBtnText}>Start a new session</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Your Guide ── */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
            <Text style={s.sectionTitle}>Your Guide</Text>
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
                <View style={{ width: CARD_WIDTH }}>
                  <LinearGradient
                    colors={step.gradient}
                    locations={[0, 0.6, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={jc.card}
                  >
                    <View>
                      <Text style={jc.stepLabel}>{step.num}</Text>
                      <View style={jc.nameRow}>
                        <Text style={jc.name}>{step.name}</Text>
                        {StepIcon && <StepIcon size={24} color="#211e28" />}
                      </View>
                      <Text style={jc.desc}>{step.desc}</Text>
                    </View>
                    <TouchableOpacity style={jc.ctaBtn} onPress={() => setLearnMoreStep(step)} activeOpacity={0.85}>
                      <Text style={jc.ctaBtnText}>Learn more</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              );
            }}
          />
        </View>

        {/* ── Your Journey ── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={s.sectionTitle}>Your Journey</Text>
          <View style={st.row}>
            <View style={st.card}>
              <View style={st.iconRow}>
                <IconLeaf size={24} color="#4ea989" />
                <Text style={st.num}>{openCount}</Text>
              </View>
              <Text style={st.label}>Open Sessions</Text>
            </View>
            <View style={st.card}>
              <View style={st.iconRow}>
                <IconSearch size={24} color="#f67700" />
                <Text style={st.num}>{resolvedCount}</Text>
              </View>
              <Text style={st.label}>Completed Sessions</Text>
            </View>
          </View>
        </View>

      </ScrollView>
      </Animated.View>
      <AffirmationsModal visible={showAffirmations} onClose={() => setShowAffirmations(false)} />
      <LearnMoreDrawer initialStep={learnMoreStep} visible={!!learnMoreStep} onClose={() => setLearnMoreStep(null)} />
    </SafeAreaView>
  );
}

// ── Journey carousel cards ──
const jc = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#dedde8',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 28,
    minHeight: 241,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  stepLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.88,
    color: '#211e28',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontFamily: 'InstrumentSans_700Bold',
    fontSize: 18,
    color: '#211e28',
    lineHeight: 24,
  },
  desc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#80798c',
    lineHeight: 21,
  },
  ctaBtn: {
    backgroundColor: '#96d35f',
    borderRadius: 9999,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#001c14',
  },
});

// ── Stats row ──
const st = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dedde8',
    borderRadius: 16,
    padding: 24,
    ...Shadows.xs,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  num: {
    fontFamily: 'InstrumentSans_600SemiBold',
    fontSize: 32,
    color: '#211e28',
    letterSpacing: -0.32,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#80798c',
    letterSpacing: 0.036,
    lineHeight: 17,
  },
});

// ── Base styles ──
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f5fd' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  settingsBtn: {
    padding: 10,
  },

  // Hero card
  heroCardWrap: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dedde8',
    borderRadius: 20,
    padding: 24,
    minHeight: 380,
    justifyContent: 'space-between',
    ...Shadows.xs,
  },
  heroTextBlock: {
    alignItems: 'center',
    gap: 8,
  },
  helloLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#211e28',
    textAlign: 'center',
    letterSpacing: 0.036,
    lineHeight: 17,
  },
  heroTitle: {
    fontFamily: 'InstrumentSans_400Regular',
    fontSize: 32,
    color: '#211e28',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.32,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#dedde8',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#211e28',
    lineHeight: 21,
  },

  // Mascot — centered between tags and input
  mascotWrap: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  mascot: {
    width: 130,
    height: 150,
  },

  // Start session button
  startBtn: {
    backgroundColor: '#96d35f',
    borderRadius: 9999,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#001c14',
  },

  // Section
  sectionTitle: {
    fontFamily: 'InstrumentSans_600SemiBold',
    fontSize: 16,
    color: '#211e28',
    lineHeight: 22,
  },
});
