import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
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
        <Text style={[pc.deepenLink, { color: accentColor }]}>Explore in depth →</Text>
      )}
    </TouchableOpacity>
  );
}

const pc = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, borderTopWidth: 3, padding: 15, marginBottom: 12 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 6 },
  value: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 },
  note: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19 },
  deepenLink: { fontFamily: Fonts.bodyMedium, fontSize: 12, marginTop: 10 },
});

function PlaceholderCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <View style={ph.card}>
      <Text style={{ fontSize: 22, marginBottom: 8 }}>{icon}</Text>
      <Text style={ph.title}>{title}</Text>
      <Text style={ph.body}>{body}</Text>
    </View>
  );
}

const ph = StyleSheet.create({
  card: { backgroundColor: Colors.creamDark, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12, alignItems: 'center' },
  title: { fontFamily: Fonts.display, fontSize: 15, color: Colors.charcoal, marginBottom: 4, textAlign: 'center' },
  body: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, textAlign: 'center' },
});

type Tab = 'you' | 'partner' | 'relationship';

const TABS: { key: Tab; label: string }[] = [
  { key: 'you', label: 'Your Learning' },
  { key: 'partner', label: "Partner's" },
  { key: 'relationship', label: 'Relationship' },
];

export default function LearningsTab() {
  const { state } = useAppState();
  const { partnerProfile: pp, generateInvite } = useAuth();
  const { attachment, love, conflict, window: win, need } = state.profile;
  const { reflections, partnerObservations, relationshipPatterns } = state.learnings;
  const [activeTab, setActiveTab] = useState<Tab>('you');
  const [inviting, setInviting] = useState(false);

  const handleInvite = async () => {
    setInviting(true);
    try {
      const code = await generateInvite();
      const link = `tether://invite/${code}`;
      await Share.share({
        message: `Join me on Tether — a relationship wellness app. Use my invite link to create your account:\n\n${link}\n\nOr enter code: ${code}`,
        title: 'Join me on Tether',
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      <View style={styles.header}>
        <Text style={styles.title}>Learnings</Text>
        <Text style={styles.subtitle}>What you are discovering about yourself, your partner, and your relationship.</Text>
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

        {/* Tab 1: Your Learning */}
        {activeTab === 'you' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About you</Text>
              <Text style={styles.sectionIntro}>These are your emotional patterns — understanding them is the first step to changing them.</Text>

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
                  <Text style={{ fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 }}>{NEED_LABELS[need] || 'Not set'}</Text>
                  <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 }}>
                    This is the thread underneath most of your conflicts — the unspoken thing you most need your partner to understand.
                  </Text>
                  <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.sage, marginTop: 10 }}>Explore in depth →</Text>
                </TouchableOpacity>
              )}
            </View>

            {state.learnings.emotionalCaptures.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emotional journey</Text>
                <Text style={styles.sectionIntro}>How you were feeling when you moved between session steps.</Text>
                <View style={ej.track}>
                  {state.learnings.emotionalCaptures.slice(0, 10).map((c, i) => {
                    const STEP_EMOJIS: Record<string, string[]> = {
                      vent: ['😌','😐','😟','😰','🔥'],
                      understand: ['🌫️','🌥️','⛅','🌤️','☀️'],
                      prepare: ['😰','😟','😐','🙂','😊'],
                      bridge: ['😔','😐','🙂','😊','🌿'],
                    };
                    const emoji = (STEP_EMOJIS[c.fromStep] ?? [])[c.score - 1] ?? '😐';
                    const date = new Date(c.date);
                    const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
                    const STEP_COLORS_MAP: Record<string,string> = { vent: Colors.terracotta, understand: Colors.gold, prepare: Colors.sage, bridge: Colors.sage };
                    const color = STEP_COLORS_MAP[c.fromStep] || Colors.midBrown;
                    return (
                      <View key={c.id} style={ej.item}>
                        <Text style={ej.emoji}>{emoji}</Text>
                        <View style={[ej.dot, { backgroundColor: color }]} />
                        <Text style={[ej.stepLabel, { color }]}>{c.fromStep}</Text>
                        <Text style={ej.date}>{dateStr}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reflections</Text>

              {reflections.length > 0 ? (
                reflections.map((r, i) => {
                  const date = new Date(r.date);
                  const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
                  return (
                    <View key={i} style={rf.card}>
                      <Text style={rf.date}>{dateStr}</Text>
                      <Text style={rf.text}>{r.text}</Text>
                    </View>
                  );
                })
              ) : (
                <PlaceholderCard
                  icon="🪞"
                  title="Your reflections will appear here"
                  body="After you complete your first session, Tether will generate an insight about what happened and what it reveals about you."
                />
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
                  <Text style={styles.sectionIntro}>Their emotional patterns — filled in by them on their own device.</Text>
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
                      <Text style={{ fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 }}>{NEED_LABELS[pp.need] || 'Not set'}</Text>
                      <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 }}>
                        This is the thread underneath most of their conflicts — the unspoken thing they most need you to understand.
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={pt.setupCard}>
                  <Text style={{ fontSize: 28, marginBottom: 12 }}>💞</Text>
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
                  icon="💭"
                  title="Partner insights build over time"
                  body="As you complete more sessions, Tether will help you understand your partner better."
                />
              )}
            </View>
          </>
        )}

        {/* Tab 3: Relationship Learning */}
        {activeTab === 'relationship' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About your relationship</Text>
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
                icon="🔮"
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
  setupTitle: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 },
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

const rf = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12 },
  date: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.terracotta, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 },
  text: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
});

const ej = StyleSheet.create({
  track: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 12, alignItems: 'center', gap: 4, minWidth: 64 },
  emoji: { fontSize: 22 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  stepLabel: { fontFamily: Fonts.bodyMedium, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
  date: { fontFamily: Fonts.body, fontSize: 10, color: Colors.lightBrown },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 6 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 6 },
  sectionIntro: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19, marginBottom: 14 },
});
