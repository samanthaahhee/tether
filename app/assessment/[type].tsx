import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { ASSESSMENT_DETAIL } from '../../src/constants/assessmentDetail';
import { QUIZ_META } from '../../src/constants/assessmentQuestions';

const TYPE_META: Record<string, { label: string; accentColor: string; description: string }> = {
  attachment: { label: 'Attachment style', accentColor: Colors.terracotta, description: 'How you relate to closeness and security in relationships' },
  love: { label: 'Love language', accentColor: Colors.gold, description: 'How you most naturally give and receive love' },
  conflict: { label: 'Conflict style', accentColor: Colors.sage, description: 'How you respond when things get tense' },
  window: { label: 'Window of tolerance', accentColor: Colors.blush, description: 'What happens in your body during conflict' },
  need: { label: 'Core emotional need', accentColor: Colors.sage, description: 'The unspoken need beneath most of your conflicts' },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text, color, icon }: { text: string; color: string; icon: string }) {
  return (
    <View style={s.bulletRow}>
      <Text style={[s.bulletIcon, { color }]}>{icon}</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

export default function AssessmentDetail() {
  const { type, value } = useLocalSearchParams<{ type: string; value: string }>();
  const [expanded, setExpanded] = useState<number | null>(0);

  const meta = TYPE_META[type];
  const detail = ASSESSMENT_DETAIL[type]?.[value];

  if (!meta || !detail) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={s.errorText}>Assessment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/learnings')} style={s.backBtn} activeOpacity={0.7}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[s.typeLabel, { color: meta.accentColor }]}>{meta.label.toUpperCase()}</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[s.hero, { borderColor: meta.accentColor + '40' }]}>
          <Text style={s.heroEmoji}>{detail.emoji}</Text>
          <Text style={s.heroLabel}>{detail.label}</Text>
          <Text style={s.heroSubtitle}>{detail.subtitle}</Text>
          <Text style={s.accuracyCopy}>Based on your quick onboarding assessment.</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/assessment/quiz/[type]', params: { type } })}
            activeOpacity={0.85}
            style={[s.fullAssessmentBtn, { backgroundColor: meta.accentColor }]}
          >
            <Text style={s.fullAssessmentBtnText}>Take the full assessment</Text>
          </TouchableOpacity>
        </View>

        {/* About — accordion paragraphs */}
        <Section title="About this style">
          <Text style={s.typeDesc}>{meta.description}</Text>
          {detail.about.map((para, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setExpanded(expanded === i ? null : i)}
              activeOpacity={0.85}
              style={[s.accordionRow, { borderColor: expanded === i ? meta.accentColor + '60' : Colors.sand }]}
            >
              <Text style={s.accordionPara} numberOfLines={expanded === i ? undefined : 3}>
                {para}
              </Text>
              {expanded !== i && (
                <Text style={[s.accordionMore, { color: meta.accentColor }]}>Read more</Text>
              )}
            </TouchableOpacity>
          ))}
        </Section>

        {/* In conflict */}
        <Section title="How this shows up in conflict">
          <View style={[s.inConflictCard, { borderLeftColor: meta.accentColor }]}>
            <Text style={s.inConflictText}>{detail.inConflict}</Text>
          </View>
        </Section>

        {/* Daily patterns */}
        <Section title="Day-to-day patterns you may recognise">
          {detail.dailyPatterns.map((p, i) => (
            <View key={i} style={s.patternRow}>
              <Text style={[s.patternNum, { color: meta.accentColor }]}>{i + 1}</Text>
              <Text style={s.patternText}>{p}</Text>
            </View>
          ))}
        </Section>

        {/* Strengths */}
        <Section title="Your strengths">
          {detail.strengths.map((str, i) => (
            <Bullet key={i} text={str} color={Colors.sage} icon="✦" />
          ))}
        </Section>

        {/* Growth edges */}
        <Section title="Growth edges">
          <Text style={s.growthIntro}>Framed as invitations, not criticisms.</Text>
          {detail.growthEdges.map((edge, i) => (
            <Bullet key={i} text={edge} color={meta.accentColor} icon="→" />
          ))}
        </Section>

        {/* Partner needs to know */}
        <View style={[s.partnerCard, { borderColor: meta.accentColor + '50' }]}>
          <Text style={[s.partnerCardLabel, { color: meta.accentColor }]}>WHAT YOUR PARTNER NEEDS TO KNOW</Text>
          <Text style={s.partnerCardText}>"{detail.partnerNeedsToKnow}"</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn: { paddingVertical: 4, paddingRight: 12 },
  backText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.midBrown },
  typeLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },
  errorText: { fontFamily: Fonts.body, color: Colors.midBrown },

  hero: { marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderRadius: Radius.xl, padding: 24, alignItems: 'center' },
  heroEmoji: { fontSize: 44, marginBottom: 10 },
  heroLabel: { fontFamily: Fonts.display, fontSize: 22, color: Colors.charcoal, marginBottom: 6, textAlign: 'center' },
  heroSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', marginBottom: 0 },
  accuracyCopy: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, textAlign: 'center', marginTop: 10, marginBottom: 14 },
  fullAssessmentBtn: { borderRadius: Radius.full, paddingVertical: 11, paddingHorizontal: 22, alignItems: 'center' },
  fullAssessmentBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },

  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 12 },
  typeDesc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 10 },

  accordionRow: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderRadius: Radius.lg, padding: 16, marginBottom: 8 },
  accordionPara: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
  accordionMore: { fontFamily: Fonts.bodyMedium, fontSize: 12, marginTop: 6 },

  inConflictCard: { backgroundColor: Colors.warmWhite, borderLeftWidth: 3, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16 },
  inConflictText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },

  patternRow: { flexDirection: 'row', gap: 12, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14, marginBottom: 8, alignItems: 'flex-start' },
  patternNum: { fontFamily: Fonts.display, fontSize: 18, width: 22, flexShrink: 0 },
  patternText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21, flex: 1 },

  bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  bulletIcon: { fontFamily: Fonts.bodyMedium, fontSize: 14, marginTop: 2, width: 16, flexShrink: 0 },
  bulletText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21, flex: 1 },

  growthIntro: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 10 },

  partnerCard: { marginHorizontal: 20, marginTop: 24, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderRadius: Radius.xl, padding: 20 },
  partnerCardLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, marginBottom: 10 },
  partnerCardText: { fontFamily: Fonts.displayItalic, fontSize: 15, color: Colors.charcoal, lineHeight: 24 },

});
