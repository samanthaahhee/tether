import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Fonts, Radius } from '../src/constants/theme';
import { IconX } from '../src/components/Icons';

const FRAMEWORKS = [
  {
    name: 'Gottman Method',
    tag: 'RELATIONSHIP RESEARCH',
    color: '#96d35f',
    summary:
      'Developed by Drs. John and Julie Gottman after 40+ years of research with thousands of couples. Their work identified specific behaviours that predict relationship success or failure with over 90% accuracy.',
    principles: [
      'The Four Horsemen: criticism, contempt, defensiveness, and stonewalling are the most destructive conflict behaviours.',
      'The 5:1 Ratio: stable relationships maintain at least five positive interactions for every negative one.',
      'Repair Attempts: the ability to de-escalate tension during conflict is the single strongest predictor of relationship stability.',
      'Love Maps: deeply knowing your partner\'s inner world, their worries, dreams, and history, builds lasting connection.',
      'Turning Toward: responding to your partner\'s small bids for attention builds trust over time.',
    ],
    howUsed:
      'Tether uses Gottman principles in session guidance, repair attempt suggestions, and conflict pattern identification. The four-step session flow (Vent, Understand, Prepare, Nurture) is informed by Gottman\'s approach to processing conflict constructively.',
  },
  {
    name: 'Emotionally Focused Therapy (EFT)',
    tag: 'ATTACHMENT SCIENCE',
    color: '#92a6f4',
    summary:
      'Created by Dr. Sue Johnson, EFT is grounded in attachment theory and the science of adult bonding. It views relationship distress as a natural response to perceived threats to our emotional connection.',
    principles: [
      'Attachment Needs: adults have legitimate needs for safety, comfort, and connection in romantic relationships.',
      'Negative Cycles: most recurring arguments are driven by underlying fears of abandonment or engulfment, not the surface issue.',
      'Primary Emotions: beneath anger and frustration lie softer emotions like fear, sadness, and longing that need to be expressed.',
      'Accessibility and Responsiveness: partners need to feel that the other is emotionally available and will respond when needed.',
      'Bonding Conversations: sharing vulnerable emotions creates new patterns of secure connection.',
    ],
    howUsed:
      'Tether\'s Understand step draws heavily on EFT, helping you move from surface complaints to underlying attachment needs. The language "beneath this, there may be a deeper fear of..." comes directly from EFT practice.',
  },
  {
    name: 'Non-Violent Communication (NVC)',
    tag: 'COMMUNICATION FRAMEWORK',
    color: '#f67700',
    summary:
      'Developed by Dr. Marshall Rosenberg, NVC provides a structured approach to expressing needs and making requests without blame or judgement. It transforms how we speak and listen in conflict.',
    principles: [
      'Observation vs Evaluation: describe what happened factually, without adding interpretation or judgement.',
      'Feelings: identify and name your emotions clearly, taking ownership of them rather than attributing them to others.',
      'Needs: connect your feelings to universal human needs rather than specific strategies or demands.',
      'Requests: make clear, specific, doable requests rather than vague complaints or demands.',
    ],
    howUsed:
      'Tether\'s Prepare step uses NVC structure to help you turn raw feelings into clear, fair language. The soft start-up suggestions and "words to avoid" in Tools are based on NVC principles.',
  },
  {
    name: 'Internal Family Systems (IFS)',
    tag: 'INNER AWARENESS',
    color: '#bd57f2',
    summary:
      'Developed by Dr. Richard Schwartz, IFS recognises that the mind naturally contains multiple "parts" or sub-personalities. In relationships, different parts can take over during conflict, leading to reactions that do not reflect our core self.',
    principles: [
      'Parts: we all have protective parts (managers, firefighters) and vulnerable parts (exiles) that carry pain from past experiences.',
      'Self-Energy: beneath all parts is a core Self characterised by calm, curiosity, compassion, and clarity.',
      'Protective Reactions: behaviours like withdrawal, people-pleasing, or aggression are parts trying to protect vulnerable feelings.',
      'Unburdening: when we acknowledge and understand our parts, they no longer need to act out in extreme ways.',
    ],
    howUsed:
      'Tether draws on IFS when helping you recognise that your conflict reactions are protective strategies, not character flaws. Understanding "which part of me is responding right now" creates space for more intentional choices.',
  },
  {
    name: 'Cognitive Behavioural Couples Therapy (CBCT)',
    tag: 'THOUGHT PATTERNS',
    color: '#e85d75',
    summary:
      'CBCT applies cognitive behavioural principles to relationships, focusing on how automatic thoughts and core beliefs about relationships shape our emotional reactions and behaviours during conflict.',
    principles: [
      'Automatic Thoughts: quick, often unconscious interpretations of your partner\'s behaviour that may not be accurate.',
      'Cognitive Distortions: patterns like mind-reading, catastrophising, and all-or-nothing thinking that fuel conflict.',
      'Behavioural Patterns: recognising that how we act in conflict reinforces or breaks negative cycles.',
      'Reframing: learning to generate alternative, more balanced interpretations of your partner\'s behaviour.',
    ],
    howUsed:
      'Tether uses CBCT principles when helping you examine whether your interpretation of a situation is the only possible reading. Questions like "what else could this mean?" and "is this a pattern or an isolated moment?" draw on this approach.',
  },
];

export default function FrameworksScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Therapeutic Frameworks</Text>
          <Text style={styles.subtitle}>The research and models behind Tether</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.7}>
          <IconX size={18} color={Colors.midBrown} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          Tether is built on established, evidence-based approaches to relationship wellness. Each framework contributes a different lens for understanding and improving how you connect with your partner.
        </Text>

        {FRAMEWORKS.map((fw, i) => (
          <View key={i} style={styles.card}>
            <Text style={[styles.tag, { color: fw.color }]}>{fw.tag}</Text>
            <Text style={styles.cardTitle}>{fw.name}</Text>
            <Text style={styles.cardSummary}>{fw.summary}</Text>

            <Text style={styles.subheading}>Key principles</Text>
            {fw.principles.map((p, j) => (
              <View key={j} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: fw.color }]} />
                <Text style={styles.bulletText}>{p}</Text>
              </View>
            ))}

            <View style={styles.usageBox}>
              <Text style={styles.usageLabel}>HOW TETHER USES THIS</Text>
              <Text style={styles.usageText}>{fw.howUsed}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 26, color: Colors.charcoal },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, marginTop: 4 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.creamDark, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  content: { paddingHorizontal: 20, paddingTop: 12 },
  intro: { fontFamily: Fonts.body, fontSize: 14, color: Colors.warmBrown, lineHeight: 22, marginBottom: 20 },
  card: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 20, marginBottom: 16 },
  tag: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  cardTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 20, color: Colors.charcoal, marginBottom: 8 },
  cardSummary: { fontFamily: Fonts.body, fontSize: 14, color: Colors.warmBrown, lineHeight: 21, marginBottom: 16 },
  subheading: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.charcoal, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  bulletText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 20 },
  usageBox: { backgroundColor: Colors.creamDark, borderRadius: Radius.md, padding: 14, marginTop: 12 },
  usageLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, color: Colors.midBrown, marginBottom: 6 },
  usageText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 20 },
});
