import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, ActivityIndicator, Modal } from 'react-native';
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


type Tab = 'you' | 'partner';

// Removed the 'relationship'/Together tab. Without verified live data
// from a paired partner it could only ever show generic dynamics or
// dummy content — neither helps a real user. When the couple feature
// matures, reintroduce it conditionally on couple-paired state.
const TABS: { key: Tab; label: string }[] = [
  { key: 'you', label: 'You' },
  { key: 'partner', label: 'Partner' },
];

export default function GrowthTab() {
  const { state } = useAppState();
  const { partnerProfile: realPp, generateInvite } = useAuth();

  // No more dummy "Alex" fallback. If the user hasn't connected a
  // partner, pp is null and the Partner tab renders an empty/invite
  // state instead of fabricated content.
  const pp = realPp || null;
  const { attachment, love, conflict, window: win, need } = state.profile;
  // Use whatever the user has actually saved. Empty arrays render
  // empty state instead of seeded "Alex"/"Sam" placeholders.
  const partnerObservations = state.learnings.partnerObservations || [];
  const relationshipPatterns = state.learnings.relationshipPatterns || [];
  const [activeTab, setActiveTab] = useState<Tab>('you');
  const [inviting, setInviting] = useState(false);
  const [showPartnerSheet, setShowPartnerSheet] = useState(false);
  // showTogetherSheet removed along with the Together tab block.

  const userName = state.profile.name || 'You';
  const partnerName = pp?.name || 'Partner';

  // Compute relationship dynamics from both profiles
  const getRelationshipInsights = () => {
    if (!pp) return [];
    const userAtt = attachment; const partAtt = pp.attachment;
    const userLove = love; const partLove = pp.love;
    const userConflict = conflict; const partConflict = pp.conflict;
    const userWindow = win; const partWindow = pp.window;

    const attDynamic = (userAtt === 'anxious' && partAtt === 'avoidant') || (userAtt === 'avoidant' && partAtt === 'anxious')
      ? { title: 'Anxious and Avoidant trap', body: `${userName} reaches out for reassurance while ${partnerName} pulls back for space. The more one pursues, the more the other withdraws. This is the most common couple dynamic, and it\u2019s not anyone\u2019s fault.` }
      : { title: `${ATTACHMENT_LABELS[userAtt] || 'Your style'} meets ${ATTACHMENT_LABELS[partAtt] || 'their style'}`, body: `Understanding how your attachment styles interact helps you predict conflict patterns and respond with more awareness.` };

    const loveDynamic = userLove !== partLove
      ? { title: `${LOVE_LABELS[userLove] || 'Your language'} vs ${LOVE_LABELS[partLove] || 'their language'}`, body: `You\u2019re both expressing care \u2014 just in different languages. When you feel unloved, look at what they\u2019re doing. When they feel pressured, notice what you\u2019re saying.` }
      : { title: `Same love language`, body: `You both speak the same love language \u2014 ${LOVE_LABELS[userLove]}. This is a strength. The challenge is remembering to actively express it, not just assume the other knows.` };

    const conflictDynamic = (userConflict === 'criticise' && partConflict === 'stonewall') || (userConflict === 'defensive' && partConflict === 'stonewall')
      ? { title: 'Pursue-withdraw loop', body: `When things get heated, one of you pushes to resolve it now while the other goes silent. You\u2019re both trying to protect the relationship \u2014 just in opposite ways.` }
      : { title: `${CONFLICT_LABELS[userConflict] || 'Your style'} meets ${CONFLICT_LABELS[partConflict] || 'their style'}`, body: `Your conflict styles create a unique dynamic. Understanding this pattern helps you break the cycle before it escalates.` };

    const nervousDynamic = userWindow !== partWindow
      ? { title: 'Opposite stress responses', body: `Under stress, one of your bodies speeds up while the other shuts down. Neither response is wrong. The key is learning to pause before your nervous systems hijack the conversation.` }
      : { title: 'Similar stress responses', body: `You both respond to stress in similar ways. This can mean you escalate together or shut down together. Awareness of this shared pattern is the first step to breaking it.` };

    return [
      { label: 'ATTACHMENT DYNAMIC', color: '#f67700', ...attDynamic },
      { label: 'COMMUNICATION GAP', color: '#d2b100', ...loveDynamic },
      { label: 'CONFLICT CYCLE', color: '#bd57f2', ...conflictDynamic },
      { label: 'NERVOUS SYSTEM', color: '#4ea989', ...nervousDynamic },
      { label: 'GROWTH EDGE', color: '#92a6f4', title: 'The 20-minute rule', body: `When conflict starts, agree to a 20-minute pause. ${userName} gets the reassurance that the conversation will continue. ${partnerName} gets the space to regulate. Then come back \u2014 calmer, clearer, closer.` },
    ];
  };

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
        <Text style={styles.title}>Learnings</Text>
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
              <Text style={styles.sectionHeaderTitle}>{pp ? `${partnerName}\u2019s profile` : 'Your partner'}</Text>
            </View>

            <View style={styles.section}>
              {pp ? (
                <View style={sc.card}>
                  <View style={sc.avatarRow}>
                    <View style={[sc.avatar, { backgroundColor: pp?.avatar_color || '#92a6f4' }]}>
                      <Text style={sc.avatarText}>{partnerName.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={sc.name}>{partnerName}</Text>
                      <Text style={sc.sub}>Completed their profile</Text>
                    </View>
                  </View>
                  <View style={sc.statsRow}>
                    <View style={sc.statPill}>
                      <View style={[sc.statDot, { backgroundColor: '#f67700' }]} />
                      <Text style={sc.statText}>{ATTACHMENT_LABELS[pp.attachment] || 'Unknown'}</Text>
                    </View>
                    <View style={sc.statPill}>
                      <View style={[sc.statDot, { backgroundColor: '#d2b100' }]} />
                      <Text style={sc.statText}>{LOVE_LABELS[pp.love] || 'Unknown'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={sc.btn} onPress={() => setShowPartnerSheet(true)} activeOpacity={0.8}>
                    <Text style={sc.btnText}>Understand more</Text>
                    <Text style={{ fontSize: 16, color: '#211e28' }}>{'\u2192'}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={pt.card}>
                  <IconSparkles size={24} color="#f67700" style={{ marginBottom: 12 }} />
                  <Text style={pt.title}>Invite your partner</Text>
                  <Text style={pt.body}>
                    Send your partner a link so they can create their own account. Their emotional profile will appear here automatically.
                  </Text>
                  <TouchableOpacity style={pt.btn} onPress={handleInvite} activeOpacity={0.8} disabled={inviting}>
                    {inviting ? <ActivityIndicator color="#001c14" /> : <Text style={pt.btnText}>Send invite link</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Partner observations */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>What I{'\u2019'}m learning about {partnerName}</Text>
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
                    As you complete more sessions, we{'\u2019'}ll help you understand {partnerName} better.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* The Together tab block was removed in this iteration \u2014 there
            wasn't enough genuinely earned content for a paired couple
            yet, and the unpaired empty state was confusing. Couple
            dynamics will return as a dedicated surface once we have
            verified live data flowing from both sides. */}

      </ScrollView>

      {/* ── Partner Detail Sheet ── */}
      <Modal visible={showPartnerSheet} animationType="slide" transparent onRequestClose={() => setShowPartnerSheet(false)}>
        <View style={sh.overlay}>
          <TouchableOpacity style={{ flex: 0.15 }} activeOpacity={1} onPress={() => setShowPartnerSheet(false)} />
          <View style={sh.sheet}>
            <View style={sh.handle} />
            <View style={sh.header}>
              <Text style={sh.title}>{partnerName}{'\u2019'}s profile</Text>
              <TouchableOpacity onPress={() => setShowPartnerSheet(false)} activeOpacity={0.7}>
                <Text style={sh.close}>{'\u2715'}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {pp && (
                <>
                  <PatternCard label="Attachment style" value={ATTACHMENT_LABELS[pp.attachment] || 'Not set'} note={ATTACH_REVEALS[pp.attachment]?.body || ''} accentColor="#f67700" />
                  <PatternCard label="Love language" value={LOVE_LABELS[pp.love] || 'Not set'} note={LOVE_REVEALS[pp.love]?.body || ''} accentColor="#d2b100" />
                  <PatternCard label="Conflict style" value={CONFLICT_LABELS[pp.conflict] || 'Not set'} note={CONFLICT_REVEALS[pp.conflict]?.body || ''} accentColor="#bd57f2" />
                  <PatternCard label="Body in conflict" value={WINDOW_LABELS[pp.window] || 'Not set'} note={WINDOW_REVEALS[pp.window]?.body || ''} accentColor="#4ea989" />
                  {pp.need && <PatternCard label="Core need" value={NEED_LABELS[pp.need] || 'Not set'} note="The unspoken thing they most need you to understand." accentColor="#92a6f4" />}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Together detail sheet removed along with the Together tab. */}

    </SafeAreaView>
  );
}

// ── Summary Card styles ──
const sc = StyleSheet.create({
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 20, padding: 24, marginBottom: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#bcb8c3', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: '#ffffff' },
  heartBridge: { marginHorizontal: -4, zIndex: 1, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fdeaff', alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: Fonts.displaySemiBold, fontSize: 18, color: '#211e28' },
  sub: { fontFamily: Fonts.body, fontSize: 13, color: '#80798c', marginTop: 2 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f7f5fd', borderWidth: 1, borderColor: '#dedde8', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#211e28' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#96d35f', borderRadius: 999, paddingVertical: 14 },
  btnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: '#211e28' },
});

// ── Sheet styles ──
const sh = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { flex: 1, backgroundColor: '#f7f5fd', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 12 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#dedde8', alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 4 },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 20, color: '#211e28' },
  close: { fontSize: 20, color: '#80798c', padding: 4 },
});

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
