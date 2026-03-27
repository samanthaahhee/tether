import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { useAppState } from '../../src/hooks/useAppState';
import {
  ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS,
  ATTACH_REVEALS, CONFLICT_REVEALS, LOVE_REVEALS, WINDOW_REVEALS,
} from '../../src/constants/data';

function PatternCard({ label, value, note, accentColor }: { label: string; value: string; note: string; accentColor: string }) {
  return (
    <View style={[pc.card, { borderTopColor: accentColor }]}>
      <Text style={[pc.label, { color: accentColor }]}>{label}</Text>
      <Text style={pc.value}>{value}</Text>
      <Text style={pc.note}>{note}</Text>
    </View>
  );
}

const pc = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, borderTopWidth: 3, padding: 15, marginBottom: 12 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 6 },
  value: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 },
  note: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 19 },
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

export default function LearningsTab() {
  const { state } = useAppState();
  const { attachment, love, conflict, window: win, need } = state.profile;
  const { reflections, partnerObservations, relationshipPatterns } = state.learnings;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Learnings</Text>
          <Text style={styles.subtitle}>What you are discovering about yourself, your partner, and your relationship.</Text>
        </View>

        {/* Section 1: About You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About you</Text>
          <Text style={styles.sectionIntro}>These are your emotional patterns — understanding them is the first step to changing them.</Text>

          <PatternCard
            label="Attachment style"
            value={ATTACHMENT_LABELS[attachment] || 'Not set'}
            note={ATTACH_REVEALS[attachment]?.body || 'Complete your profile to unlock attachment insights.'}
            accentColor={Colors.terracotta}
          />
          <PatternCard
            label="Love language"
            value={LOVE_LABELS[love] || 'Not set'}
            note={LOVE_REVEALS[love]?.body || 'Understanding how you receive love explains many conflicts.'}
            accentColor={Colors.gold}
          />
          <PatternCard
            label="Conflict style"
            value={CONFLICT_LABELS[conflict] || 'Not set'}
            note={CONFLICT_REVEALS[conflict]?.body || 'Your natural response under pressure.'}
            accentColor={Colors.sage}
          />
          <PatternCard
            label="Body in conflict"
            value={WINDOW_LABELS[win] || 'Not set'}
            note={WINDOW_REVEALS[win]?.body || 'How your body responds during conflict.'}
            accentColor={Colors.blush}
          />

          {need && (
            <View style={{ backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 15, marginBottom: 12 }}>
              <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: Colors.sage, marginBottom: 6 }}>Core need</Text>
              <Text style={{ fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 5 }}>{NEED_LABELS[need] || 'Not set'}</Text>
              <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 }}>
                This is the thread underneath most of your conflicts — the unspoken thing you most need your partner to understand.
              </Text>
            </View>
          )}
        </View>

        {/* Section 2: About Your Relationship */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About your relationship</Text>

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

        {/* Section 3: About Your Partner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What I am learning about my partner</Text>

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
              body="As you complete more sessions and share what you learn about your partner, Tether will help you understand them better."
            />
          )}
        </View>

        {/* Section 4: Reflections */}
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

      </ScrollView>
    </SafeAreaView>
  );
}

const rf = StyleSheet.create({
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12 },
  date: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.terracotta, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 },
  text: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
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
