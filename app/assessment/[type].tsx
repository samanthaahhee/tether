import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { ASSESSMENT_DETAIL } from '../../src/constants/assessmentDetail';
import { QUIZ_META } from '../../src/constants/assessmentQuestions';
import { ChevronLeft, ChevronDown } from '../../src/components/Icon';
import { IconHeart, IconSparkles, IconWind, IconActivity, IconLeaf } from '../../src/components/Icons';

const TYPE_META: Record<string, { label: string; accentColor: string; description: string; Icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  attachment: { label: 'Attachment style', accentColor: Colors.sage, description: 'How you relate to closeness and security in relationships', Icon: IconHeart },
  love: { label: 'Love language', accentColor: Colors.mauve, description: 'How you most naturally give and receive love', Icon: IconSparkles },
  conflict: { label: 'Conflict style', accentColor: Colors.blue, description: 'How you respond when things get tense', Icon: IconWind },
  window: { label: 'Window of tolerance', accentColor: Colors.amber, description: 'What happens in your body during conflict', Icon: IconActivity },
  need: { label: 'Core emotional need', accentColor: Colors.sage, description: 'The unspoken need beneath most of your conflicts', Icon: IconLeaf },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text, color }: { text: string; color: string }) {
  return (
    <View style={s.bulletRow}>
      <View style={[s.bulletDot, { backgroundColor: color }]} />
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
          <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={s.backText}>Back</Text>
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
          <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={[s.typeLabel, { color: meta.accentColor }]}>{meta.label.toUpperCase()}</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[s.hero, { borderColor: meta.accentColor + '40' }]}>
          <View style={[s.heroIconWrap, { backgroundColor: meta.accentColor + '18' }]}>
            <meta.Icon size={28} color={meta.accentColor} />
          </View>
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
                <View style={s.accordionMoreRow}>
                  <Text style={[s.accordionMore, { color: meta.accentColor }]}>Read more</Text>
                  <ChevronDown size={9} color={meta.accentColor} style={{ marginLeft: 4, marginTop: 3 }} />
                </View>
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
            <Bullet key={i} text={str} color={Colors.sage} />
          ))}
        </Section>

        {/* Growth edges */}
        <Section title="Growth edges">
          <Text style={s.growthIntro}>Framed as invitations, not criticisms.</Text>
          {detail.growthEdges.map((edge, i) => (
            <Bullet key={i} text={edge} color={meta.accentColor} />
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
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingRight: 12 },
  backText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.midBrown },
  typeLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },
  errorText: { fontFamily: Fonts.body, color: Colors.midBrown },

  hero: { marginHorizontal: 20, marginBottom: 8, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderRadius: Radius.xl, padding: 24, alignItems: 'center' },
  heroIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroLabel: { fontFamily: Fonts.displayLight, fontSize: 24, color: Colors.charcoal, marginBottom: 6, textAlign: 'center' },
  heroSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', marginBottom: 0 },
  accuracyCopy: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, textAlign: 'center', marginTop: 10, marginBottom: 14 },
  fullAssessmentBtn: { borderRadius: Radius.full, paddingVertical: 11, paddingHorizontal: 22, alignItems: 'center' },
  fullAssessmentBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },

  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 12 },
  typeDesc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 10 },

  accordionRow: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderRadius: Radius.lg, padding: 16, marginBottom: 8 },
  accordionPara: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
  accordionMoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  accordionMore: { fontFamily: Fonts.bodyMedium, fontSize: 12 },

  inConflictCard: { backgroundColor: Colors.warmWhite, borderLeftWidth: 3, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16 },
  inConflictText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },

  patternRow: { flexDirection: 'row', gap: 12, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14, marginBottom: 8, alignItems: 'flex-start' },
  patternNum: { fontFamily: Fonts.display, fontSize: 16, width: 22, flexShrink: 0 },
  patternText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21, flex: 1 },

  bulletRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, flexShrink: 0 },
  bulletText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21, flex: 1 },

  growthIntro: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 10 },

  partnerCard: { marginHorizontal: 20, marginTop: 24, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderRadius: Radius.xl, padding: 20 },
  partnerCardLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, marginBottom: 10 },
  partnerCardText: { fontFamily: Fonts.displayItalic, fontSize: 15, color: Colors.charcoal, lineHeight: 24 },

});
