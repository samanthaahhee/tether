import { ScrollView, View, Text, TouchableOpacity, FlatList, StyleSheet, useWindowDimensions, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../../src/hooks/useAppState';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { ModeKey } from '../../src/constants/data';
import { useState } from 'react';
import { IconSettings, IconWind, IconSearch, IconLeaf, IconHeart, IconVoice } from '../../src/components/Icons';

// ── Figma: "Your Guide" carousel cards ──────────────────────────────────────
const JOURNEY_STEPS = [
  { mode: 'vent' as ModeKey, num: 'STEP 1', name: 'Vent', icon: 'wind' as const, color: '#4ea989', gradient: ['#ffffff', '#ffffff', '#d8f5ea'] as [string, string, string], desc: 'Speak or type freely in a completely private space. Your partner will never see this.' },
  { mode: 'understand' as ModeKey, num: 'STEP 2', name: 'Understand', icon: 'heart' as const, color: '#92a6f4', gradient: ['#ffffff', '#ffffff', '#dce3fd'] as [string, string, string], desc: 'Speak or type freely in a completely private space. Your partner will never see this.' },
  { mode: 'prepare' as ModeKey, num: 'STEP 3', name: 'Prepare', icon: 'leaf' as const, color: '#f67700', gradient: ['#ffffff', '#ffffff', '#fde8cc'] as [string, string, string], desc: 'Speak or type freely in a completely private space. Your partner will never see this.' },
  { mode: 'bridge' as ModeKey, num: 'STEP 4', name: 'Nurture', icon: 'heart' as const, color: '#bd57f2', gradient: ['#ffffff', '#ffffff', '#f0dcfa'] as [string, string, string], desc: 'Speak or type freely in a completely private space. Your partner will never see this.' },
];

const STEP_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  wind: IconWind,
  search: IconSearch,
  leaf: IconLeaf,
  heart: IconHeart,
};

// ── Quick-access tag chips ──────────────────────────────────────────────────
const TAGS = [
  { label: 'Grounding Techniques', route: '/(tabs)/tools' },
  { label: 'Breathing exercises', route: '/(tabs)/tools' },
  { label: 'Affirmation', route: '/(tabs)/tools' },
];

const CAROUSEL_GAP = 12;
const CAROUSEL_LEFT = 16;
const CARD_WIDTH = 294;

export default function HomeTab() {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const name = state.profile.name || 'Sam';

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId);
  const [journeyIdx, setJourneyIdx] = useState(0);

  const snapInterval = CARD_WIDTH + CAROUSEL_GAP;

  const resolvedCount = state.sessions.filter((s) => s.status === 'resolved').length;
  const captures = state.learnings.emotionalCaptures;

  const startSession = () => {
    if (!activeSession) {
      dispatch({ type: 'CREATE_SESSION' });
    }
    router.push('/(tabs)/sessions');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
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
              <Text style={s.helloLabel}>HELLO {name.toUpperCase()}</Text>
              <Text style={s.heroTitle}>What do you need in this moment?</Text>

              {/* Tag chips */}
              <View style={s.tagsRow}>
                {TAGS.map((tag) => (
                  <TouchableOpacity key={tag.label} style={s.tag} onPress={() => router.push(tag.route as any)} activeOpacity={0.7}>
                    <Text style={s.tagText}>{tag.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Mascot */}
            <View style={s.mascotWrap}>
              <Image source={require('../../assets/mascot-prepare.png')} style={s.mascot} resizeMode="contain" />
            </View>

            {/* Input bar — overlaps mascot */}
            <View style={s.inputBar}>
              <Text style={s.inputPlaceholder}>Share how you're feeling</Text>
              <TouchableOpacity style={s.micBtn} onPress={startSession} activeOpacity={0.8}>
                <IconVoice size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
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
                <TouchableOpacity onPress={startSession} activeOpacity={0.85} style={{ width: CARD_WIDTH }}>
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
                    <View style={jc.ctaBtn}>
                      <Text style={jc.ctaBtnText}>Default</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
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
                <Text style={st.num}>{resolvedCount}</Text>
              </View>
              <Text style={st.label}>Total Sessions</Text>
            </View>
            <View style={st.card}>
              <View style={st.iconRow}>
                <IconSearch size={24} color="#f67700" />
                <Text style={st.num}>{captures.length}</Text>
              </View>
              <Text style={st.label}>Total Sessions</Text>
            </View>
          </View>
        </View>

      </ScrollView>
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
    height: 241,
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

  // Input bar
  inputBar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dedde8',
    borderRadius: 9999,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 0,
  },
  inputPlaceholder: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#80798c',
    letterSpacing: 0.026,
  },
  micBtn: {
    backgroundColor: '#96d35f',
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section
  sectionTitle: {
    fontFamily: 'InstrumentSans_600SemiBold',
    fontSize: 16,
    color: '#211e28',
    lineHeight: 22,
  },
});
