import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { ChevronRight } from '../../src/components/Icon';
import { IconHeart, IconUser, IconCompass, IconSparkles, IconMoon } from '../../src/components/Icons';
import { useAppState } from '../../src/hooks/useAppState';
import { useAuth } from '../../src/hooks/useAuth';
import { router } from 'expo-router';
import {
  ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS,
  ATTACH_REVEALS, CONFLICT_REVEALS, LOVE_REVEALS, WINDOW_REVEALS,
} from '../../src/constants/data';

// Pale tints for subtle bottom gradient (matching Figma's very faint card tints)
const ACCENT_PALE: Record<string, string> = {
  '#f67700': '#fde8cc', // orange
  '#d2b100': '#faf3d0', // yellow
  '#bd57f2': '#f0dcfa', // purple
  '#4ea989': '#d8f5ea', // green
  '#96d35f': '#e8f7d6', // lime
  '#92a6f4': '#dce3fd', // blue/periwinkle
};

function PatternCard({ label, value, note, accentColor, assessmentType, assessmentValue, isIncomplete }: {
  label: string; value: string; note: string; accentColor: string;
  assessmentType?: string; assessmentValue?: string; isIncomplete?: boolean;
}) {
  const handlePress = () => {
    if (isIncomplete && assessmentType) {
      router.push({ pathname: '/assessment/quiz/[type]', params: { type: assessmentType } });
      return;
    }
    if (assessmentType && assessmentValue) {
      router.push({ pathname: '/assessment/[type]', params: { type: assessmentType, value: assessmentValue } });
    }
  };
  const pale = ACCENT_PALE[accentColor] || '#f0f0f0';
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={(assessmentType || isIncomplete) ? 0.75 : 1}>
      <LinearGradient
        colors={['#ffffff', '#ffffff', pale]}
        locations={[0, 0.6, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={pc.card}
      >
        <Text style={[pc.label, { color: accentColor }]}>{label}</Text>
        <Text style={pc.value}>{value}</Text>
        <Text style={pc.note}>{note}</Text>
        {(isIncomplete || assessmentType) && (
          <View style={pc.arrowBtn}>
            <Text style={{ fontSize: 18, color: '#211e28', marginLeft: 1 }}>→</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const pc = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, paddingHorizontal: 28, paddingVertical: 28, marginBottom: 12, overflow: 'hidden' },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', marginBottom: 8 },
  value: { fontFamily: Fonts.displayMedium, fontSize: 18, color: Colors.charcoal, marginBottom: 6 },
  note: { fontFamily: Fonts.body, fontSize: 14, color: '#80798c', lineHeight: 21 },
  arrowBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: '#dedde8', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginTop: 16 },
});


type Tab = 'you' | 'partner' | 'relationship';

const TABS: { key: Tab; label: string }[] = [
  { key: 'you', label: 'You' },
  { key: 'partner', label: "Partner" },
  { key: 'relationship', label: 'Together' },
];

export default function GrowthTab() {
  const { state } = useAppState();
  const { partnerProfile: pp, generateInvite } = useAuth();
  const { attachment, love, conflict, window: win, need } = state.profile;
  const { partnerObservations, relationshipPatterns } = state.learnings;
  const [activeTab, setActiveTab] = useState<Tab>('you');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    setInviting(true);
    try {
      const code = await generateInvite();
      const link = `tether://invite/${code}`;
      await Share.share({
        message: `Join me on Hey Otis, a relationship wellness app. Use my invite link to create your account:\n\n${link}\n\nOr enter code: ${code}`,
        title: 'Join me on Hey Otis',
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Growth</Text>
        <Text style={styles.subtitle}>Discover more about yourself & your partner.</Text>
      </View>

      {/* Tab Bar */}
      <View style={tb.bar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[tb.tab, activeTab === t.key && tb.tabActive]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.8}
          >
            <Text style={[tb.label, activeTab === t.key && tb.labelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Tab 1: You */}
        {activeTab === 'you' && (
          <>
            {/* ── SECTION A: Know yourself ── */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>Your tests results</Text>
            </View>

            <View style={styles.section}>
              <PatternCard
                label="Attachment style"
                value={ATTACHMENT_LABELS[attachment] || 'Not set'}
                note={ATTACH_REVEALS[attachment]?.body || 'Complete your profile to unlock attachment insights.'}
                accentColor="#f67700"
                assessmentType="attachment"
                assessmentValue={attachment}
                isIncomplete={!attachment}
              />
              <PatternCard
                label="Love language"
                value={LOVE_LABELS[love] || 'Not set'}
                note={LOVE_REVEALS[love]?.body || 'Understanding how you receive love explains many conflicts.'}
                accentColor="#d2b100"
                assessmentType="love"
                assessmentValue={love}
                isIncomplete={!love}
              />
              <PatternCard
                label="Conflict style"
                value={CONFLICT_LABELS[conflict] || 'Not set'}
                note={CONFLICT_REVEALS[conflict]?.body || 'Your natural response under pressure.'}
                accentColor="#bd57f2"
                assessmentType="conflict"
                assessmentValue={conflict}
                isIncomplete={!conflict}
              />
              <PatternCard
                label="Body in conflict"
                value={WINDOW_LABELS[win] || 'Not set'}
                note={WINDOW_REVEALS[win]?.body || 'How your body responds during conflict.'}
                accentColor="#4ea989"
                assessmentType="window"
                assessmentValue={win}
                isIncomplete={!win}
              />

              <PatternCard
                label="Core need"
                value={NEED_LABELS[need] || 'Not set'}
                note={need ? "This is the thread underneath most of your conflicts. The unspoken thing you most need your partner to understand." : "Understanding your core need helps explain what drives your conflicts."}
                accentColor="#92a6f4"
                assessmentType="need"
                assessmentValue={need}
                isIncomplete={!need}
              />
            </View>

          </>
        )}

        {/* Tab 2: Partner */}
        {activeTab === 'partner' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>Your partners profile</Text>
            </View>

            <View style={styles.section}>
              {pp ? (
                <>
                  <PatternCard
                    label="Attachment style"
                    value={ATTACHMENT_LABELS[pp.attachment] || 'Not set'}
                    note={ATTACH_REVEALS[pp.attachment]?.body || ''}
                    accentColor="#f67700"
                  />
                  <PatternCard
                    label="Love language"
                    value={LOVE_LABELS[pp.love] || 'Not set'}
                    note={LOVE_REVEALS[pp.love]?.body || ''}
                    accentColor="#d2b100"
                  />
                  <PatternCard
                    label="Conflict style"
                    value={CONFLICT_LABELS[pp.conflict] || 'Not set'}
                    note={CONFLICT_REVEALS[pp.conflict]?.body || ''}
                    accentColor="#bd57f2"
                  />
                  <PatternCard
                    label="Body in conflict"
                    value={WINDOW_LABELS[pp.window] || 'Not set'}
                    note={WINDOW_REVEALS[pp.window]?.body || ''}
                    accentColor="#4ea989"
                  />
                  {pp.need && (
                    <PatternCard
                      label="Core need"
                      value={NEED_LABELS[pp.need] || 'Not set'}
                      note="This is the thread underneath most of their conflicts. The unspoken thing they most need you to understand."
                      accentColor="#92a6f4"
                    />
                  )}
                </>
              ) : (
                <View style={pt.card}>
                  <IconSparkles size={24} color="#f67700" style={{ marginBottom: 12 }} />
                  <Text style={pt.title}>Invite your partner</Text>
                  <Text style={pt.body}>
                    Send your partner a link so they can create their own account. Their emotional profile will appear here automatically.
                  </Text>
                  <TouchableOpacity
                    style={pt.btn}
                    onPress={handleInvite}
                    activeOpacity={0.8}
                    disabled={inviting}
                  >
                    {inviting
                      ? <ActivityIndicator color="#001c14" />
                      : <Text style={pt.btnText}>Send invite link</Text>
                    }
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Partner observations */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>What Im learning about my partner</Text>
            </View>

            <View style={styles.section}>
              {partnerObservations.length > 0 ? (
                partnerObservations.map((obs, i) => (
                  <View key={i} style={pt.card}>
                    <Text style={[pc.label, { color: '#bd57f2' }]}>OBSERVATION</Text>
                    <Text style={{ fontFamily: Fonts.body, fontSize: 14, color: '#211e28', lineHeight: 21, textAlign: 'center' }}>{obs}</Text>
                  </View>
                ))
              ) : (
                <View style={pt.card}>
                  <IconMoon size={24} color="#f67700" style={{ marginBottom: 12 }} />
                  <Text style={pt.title}>Partner insights built over time</Text>
                  <Text style={pt.body}>
                    As you complete more sessions, we will help you understand your partner better.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Tab 3: Together */}
        {activeTab === 'relationship' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>You & Your Partner</Text>
            </View>

            <View style={styles.section}>
              {relationshipPatterns.length > 0 ? (
                relationshipPatterns.map((pattern, i) => (
                  <View key={i} style={pt.card}>
                    <Text style={[pc.label, { color: '#d2b100' }]}>PATTERN</Text>
                    <Text style={{ fontFamily: Fonts.body, fontSize: 14, color: '#211e28', lineHeight: 21, textAlign: 'center' }}>{pattern}</Text>
                  </View>
                ))
              ) : (
                <View style={pt.card}>
                  <IconSparkles size={24} color="#f67700" style={{ marginBottom: 12 }} />
                  <Text style={pt.title}>Patterns will emerge here</Text>
                  <Text style={pt.body}>
                    Complete a few sessions to start seeing relationship patterns. We will identify recurring themes across your conflicts.
                  </Text>
                  <TouchableOpacity
                    style={pt.btn}
                    onPress={handleInvite}
                    activeOpacity={0.8}
                    disabled={inviting}
                  >
                    {inviting
                      ? <ActivityIndicator color="#001c14" />
                      : <Text style={pt.btnText}>Send invite link</Text>
                    }
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const pt = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 12 },
  title: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 18, color: '#211e28', textAlign: 'center', marginBottom: 8 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', lineHeight: 21, textAlign: 'center', marginBottom: 16 },
  btn: { backgroundColor: '#96d35f', borderRadius: 9999, paddingHorizontal: 24, paddingVertical: 12 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#001c14' },
});

const tb = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 0,
    backgroundColor: '#eeebf4',
    borderWidth: 1,
    borderColor: '#dedde8',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#4a5a4d' },
  labelActive: { color: '#001c14' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingTop: 16, paddingBottom: 32 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, alignItems: 'center' },
  title: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 22, color: '#211e28', marginBottom: 4, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', textAlign: 'center' },
  sectionHeader: { paddingHorizontal: 16, paddingBottom: 16 },
  sectionHeaderTitle: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28' },
  sectionHeaderSub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 18, color: Colors.charcoal, marginBottom: 6 },
  sectionIntro: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 14 },
});
