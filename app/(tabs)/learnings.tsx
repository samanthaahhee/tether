import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { ChevronRight } from '../../src/components/Icon';
import { IconHeart, IconUser, IconCompass } from '../../src/components/Icons';
import { useAppState } from '../../src/hooks/useAppState';
import { useAuth } from '../../src/hooks/useAuth';
import { router } from 'expo-router';
import {
  ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS,
  ATTACH_REVEALS, CONFLICT_REVEALS, LOVE_REVEALS, WINDOW_REVEALS,
} from '../../src/constants/data';

function PatternCard({ label, value, note, accentColor, assessmentType, assessmentValue }: {
  label: string; value: string; note: string; accentColor: string;
  assessmentType?: string; assessmentValue?: string;
}) {
  const handlePress = () => {
    if (assessmentType && assessmentValue) {
      router.push({ pathname: '/assessment/[type]', params: { type: assessmentType, value: assessmentValue } });
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={assessmentType ? 0.75 : 1} style={[pc.card, { borderTopColor: accentColor }]}>
      <Text style={[pc.label, { color: accentColor }]}>{label}</Text>
      <Text style={pc.value}>{value}</Text>
      <Text style={pc.note}>{note}</Text>
      {assessmentType && (
        <View style={pc.deepenRow}>
          <Text style={[pc.deepenLink, { color: accentColor }]}>Explore in depth</Text>
          <ChevronRight size={9} color={accentColor} style={{ marginTop: 2 }} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const pc = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, borderTopWidth: 3, padding: 15, marginBottom: 12 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 6 },
  value: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 5 },
  note: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19 },
  deepenRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  deepenLink: { fontFamily: Fonts.bodyMedium, fontSize: 12 },
});

function PlaceholderCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <View style={ph.card}>
      <View style={{ marginBottom: 8 }}>{icon}</View>
      <Text style={ph.title}>{title}</Text>
      <Text style={ph.body}>{body}</Text>
    </View>
  );
}

const ph = StyleSheet.create({
  card: { backgroundColor: Colors.creamDark, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12, alignItems: 'center' },
  title: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4, textAlign: 'center' },
  body: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, textAlign: 'center' },
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
        message: `Join me on Tether, a relationship wellness app. Use my invite link to create your account:\n\n${link}\n\nOr enter code: ${code}`,
        title: 'Join me on Tether',
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      <View style={styles.header}>
        <Text style={styles.title}>Growth</Text>
        <Text style={styles.subtitle}>Who you are, how you've been feeling, and how far you've come.</Text>
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
              <Text style={styles.sectionHeaderTitle}>Know yourself</Text>
              <Text style={styles.sectionHeaderSub}>Your emotional blueprint. Tap any card to go deeper.</Text>
            </View>

            <View style={styles.section}>
              <PatternCard
                label="Attachment style"
                value={ATTACHMENT_LABELS[attachment] || 'Not set'}
                note={ATTACH_REVEALS[attachment]?.body || 'Complete your profile to unlock attachment insights.'}
                accentColor={Colors.terracotta}
                assessmentType={attachment ? 'attachment' : undefined}
                assessmentValue={attachment}
              />
              <PatternCard
                label="Love language"
                value={LOVE_LABELS[love] || 'Not set'}
                note={LOVE_REVEALS[love]?.body || 'Understanding how you receive love explains many conflicts.'}
                accentColor={Colors.gold}
                assessmentType={love ? 'love' : undefined}
                assessmentValue={love}
              />
              <PatternCard
                label="Conflict style"
                value={CONFLICT_LABELS[conflict] || 'Not set'}
                note={CONFLICT_REVEALS[conflict]?.body || 'Your natural response under pressure.'}
                accentColor={Colors.sage}
                assessmentType={conflict ? 'conflict' : undefined}
                assessmentValue={conflict}
              />
              <PatternCard
                label="Body in conflict"
                value={WINDOW_LABELS[win] || 'Not set'}
                note={WINDOW_REVEALS[win]?.body || 'How your body responds during conflict.'}
                accentColor={Colors.blush}
                assessmentType={win ? 'window' : undefined}
                assessmentValue={win}
              />

              {need && (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/assessment/[type]', params: { type: 'need', value: need } })}
                  activeOpacity={0.75}
                  style={{ backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 15, marginBottom: 12 }}
                >
                  <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: Colors.sage, marginBottom: 6 }}>Core need</Text>
                  <Text style={{ fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 5 }}>{NEED_LABELS[need] || 'Not set'}</Text>
                  <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 }}>
                    This is the thread underneath most of your conflicts. The unspoken thing you most need your partner to understand.
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                    <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.sage }}>Explore in depth</Text>
                    <ChevronRight size={9} color={Colors.sage} style={{ marginTop: 1 }} />
                  </View>
                </TouchableOpacity>
              )}
            </View>

          </>
        )}

        {/* Tab 2: Partner's Learning */}
        {activeTab === 'partner' && (
          <>
            {/* Partner profile cards */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {pp?.name ? `${pp.name}'s profile` : 'Partner profile'}
              </Text>

              {pp ? (
                <>
                  <Text style={styles.sectionIntro}>Their emotional patterns, filled in by them on their own device.</Text>
                  <PatternCard
                    label="Attachment style"
                    value={ATTACHMENT_LABELS[pp.attachment] || 'Not set'}
                    note={ATTACH_REVEALS[pp.attachment]?.body || ''}
                    accentColor={Colors.terracotta}
                  />
                  <PatternCard
                    label="Love language"
                    value={LOVE_LABELS[pp.love] || 'Not set'}
                    note={LOVE_REVEALS[pp.love]?.body || ''}
                    accentColor={Colors.gold}
                  />
                  <PatternCard
                    label="Conflict style"
                    value={CONFLICT_LABELS[pp.conflict] || 'Not set'}
                    note={CONFLICT_REVEALS[pp.conflict]?.body || ''}
                    accentColor={Colors.sage}
                  />
                  <PatternCard
                    label="Body in conflict"
                    value={WINDOW_LABELS[pp.window] || 'Not set'}
                    note={WINDOW_REVEALS[pp.window]?.body || ''}
                    accentColor={Colors.blush}
                  />
                  {pp.need && (
                    <View style={{ backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 15, marginBottom: 12 }}>
                      <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: Colors.sage, marginBottom: 6 }}>Core need</Text>
                      <Text style={{ fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 5 }}>{NEED_LABELS[pp.need] || 'Not set'}</Text>
                      <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 }}>
                        This is the thread underneath most of their conflicts. The unspoken thing they most need you to understand.
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={pt.setupCard}>
                  <IconHeart size={28} color={Colors.mauve} style={{ marginBottom: 12 }} />
                  <Text style={pt.setupTitle}>Invite your partner</Text>
                  <Text style={pt.setupBody}>
                    Send your partner a link so they can create their own Tether account. Once they join, their emotional profile will appear here automatically.
                  </Text>
                  <TouchableOpacity
                    style={pt.setupBtn}
                    onPress={handleInvite}
                    activeOpacity={0.8}
                    disabled={inviting}
                  >
                    {inviting
                      ? <ActivityIndicator color={Colors.white} />
                      : <Text style={pt.setupBtnText}>Send invite link</Text>
                    }
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Partner observations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What I am learning about my partner</Text>
              <Text style={styles.sectionIntro}>Observations that emerge through your sessions.</Text>

              {partnerObservations.length > 0 ? (
                partnerObservations.map((obs, i) => (
                  <View key={i} style={[pc.card, { borderTopColor: Colors.blush }]}>
                    <Text style={[pc.label, { color: Colors.blush }]}>OBSERVATION</Text>
                    <Text style={pc.note}>{obs}</Text>
                  </View>
                ))
              ) : (
                <PlaceholderCard
                  icon={<IconUser size={22} color={Colors.lightBrown} />}
                  title="Partner insights build over time"
                  body="As you complete more sessions, Tether will help you understand your partner better."
                />
              )}
            </View>
          </>
        )}

        {/* Tab 3: Together */}
        {activeTab === 'relationship' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You & your partner</Text>
            <Text style={styles.sectionIntro}>Recurring themes and patterns identified across your sessions together.</Text>

            {relationshipPatterns.length > 0 ? (
              relationshipPatterns.map((pattern, i) => (
                <View key={i} style={[pc.card, { borderTopColor: Colors.gold }]}>
                  <Text style={[pc.label, { color: Colors.gold }]}>PATTERN</Text>
                  <Text style={pc.note}>{pattern}</Text>
                </View>
              ))
            ) : (
              <PlaceholderCard
                icon={<IconCompass size={22} color={Colors.lightBrown} />}
                title="Patterns will emerge here"
                body="Complete a few sessions to start seeing relationship patterns. Tether will identify recurring themes across your conflicts."
              />
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const pt = StyleSheet.create({
  setupCard: { backgroundColor: Colors.creamDark, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 20, alignItems: 'center', marginBottom: 12 },
  setupTitle: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 },
  setupBody: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 20, textAlign: 'center', marginBottom: 16 },
  setupBtn: { backgroundColor: Colors.blush, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
  setupBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },
  editBtn: { borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 9, alignSelf: 'flex-start', marginBottom: 4 },
  editText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown },
});

const tb = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: Colors.creamDark,
    borderRadius: Radius.full,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.warmWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown },
  labelActive: { color: Colors.charcoal },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 6 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  sectionHeader: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, borderTopWidth: 1, borderTopColor: Colors.sand, marginTop: 8 },
  sectionHeaderTitle: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 4 },
  sectionHeaderSub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 6 },
  sectionIntro: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 14 },
});
