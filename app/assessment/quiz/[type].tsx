import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Fonts, Radius } from '../../../src/constants/theme';
import {
  ASSESSMENT_QUESTIONS, QUIZ_META, scoreAssessment, Question,
} from '../../../src/constants/assessmentQuestions';
import { ASSESSMENT_DETAIL } from '../../../src/constants/assessmentDetail';
import { ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS } from '../../../src/constants/data';
import { useAuth } from '../../../src/hooks/useAuth';
import { useAppState } from '../../../src/hooks/useAppState';
import { ChevronLeft } from '../../../src/components/Icon';
import { IconHeart, IconSparkles, IconWind, IconActivity, IconLeaf } from '../../../src/components/Icons';

const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  attachment: IconHeart,
  love: IconSparkles,
  conflict: IconWind,
  window: IconActivity,
  need: IconLeaf,
};

const RESULT_LABEL_MAP: Record<string, Record<string, string>> = {
  attachment: ATTACHMENT_LABELS,
  love: LOVE_LABELS,
  conflict: CONFLICT_LABELS,
  window: WINDOW_LABELS,
  need: NEED_LABELS,
};

const PROFILE_KEY_MAP: Record<string, string> = {
  attachment: 'attachment',
  love: 'love',
  conflict: 'conflict',
  window: 'window',
  need: 'need',
};

const LIKERT_LABELS = ['Not at all like me', 'Not really', 'Sometimes', 'Mostly like me', 'Very much like me'];

export default function AssessmentQuiz() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { syncProfile, profile } = useAuth();
  const { dispatch } = useAppState();

  const questions: Question[] = ASSESSMENT_QUESTIONS[type] ?? [];
  const meta = QUIZ_META[type];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number | string>>({});
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof scoreAssessment> | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  if (!meta || questions.length === 0) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={s.empty}>Assessment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const accentColor = meta.accentColor;
  const current = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  const animateTransition = (cb: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    });
  };

  // Selecting an option no longer auto-advances. Users explicitly tap
  // Next — which lets them re-read the question, change their answer,
  // and pace themselves. Auto-advance was disorienting in usability
  // testing, especially for the first question of each section.
  const selectLikert = (value: number) => {
    setResponses({ ...responses, [current.id]: value });
  };

  const selectChoice = (dimension: string) => {
    setResponses({ ...responses, [current.id]: dimension });
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      animateTransition(() => setCurrentIndex(i => i + 1));
    } else {
      const scored = scoreAssessment(type, responses);
      setResult(scored);
      setPhase('result');
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      animateTransition(() => setCurrentIndex(i => i - 1));
    } else {
      // From question 1, "Back" returns to the assessment summary page
      // (the detail/landing screen for this assessment type) rather than
      // wherever the user came from. This gives a predictable mental model:
      // the quiz is a sub-flow of a specific assessment, and back means
      // "out of the quiz, into the overview."
      router.replace({ pathname: '/assessment/[type]', params: { type } });
    }
  };

  const saveResult = async () => {
    if (!result) return;
    setSaving(true);
    const profileKey = PROFILE_KEY_MAP[type];
    const update = { [profileKey]: result.primary };
    dispatch({ type: 'SET_PROFILE', payload: update });
    dispatch({ type: 'COMPLETE_FULL_ASSESSMENT', assessmentType: type });
    await syncProfile(update);
    setSaving(false);

    // CRITICAL — if the user reached the assessment quiz before completing
    // basic onboarding (their profile.onboarded is still false), routing
    // them to /assessment/[type] will trip RouteGuard, which sees
    // !profile.onboarded and forcibly redirects to /intro. The user
    // experiences this as "completing the assessment took me to the
    // beginning of onboarding."
    //
    // We can't mark the user onboarded here — they haven't filled in name,
    // context, or the other dimensions, and skipping that would harm the
    // product's understanding of them. Instead we route them BACK INTO the
    // 8-question onboarding so they finish setup before seeing the
    // assessment detail screen.
    if (profile && !profile.onboarded) {
      router.replace('/onboarding');
      return;
    }

    // Navigate to the detail page for the new result
    router.replace({ pathname: '/assessment/[type]', params: { type, value: result.primary } });
  };

  // ── Intro screen ──
  if (phase === 'intro') {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.introTopBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={s.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.introContent}>
          <View style={[s.introHero, { borderColor: accentColor + '40' }]}>
            <View style={[s.introIconWrap, { backgroundColor: accentColor + '18' }]}>
              {(() => { const I = TYPE_ICONS[type]; return I ? <I size={28} color={accentColor} /> : null; })()}
            </View>
            <Text style={s.introTitle}>{meta.title}</Text>
            <Text style={s.introSub}>{meta.subtitle}</Text>
          </View>
          <View style={s.introMeta}>
            <View style={s.introMetaItem}>
              <Text style={[s.introMetaNum, { color: accentColor }]}>{meta.questionCount}</Text>
              <Text style={s.introMetaLabel}>questions</Text>
            </View>
            <View style={s.introMetaDivider} />
            <View style={s.introMetaItem}>
              <Text style={[s.introMetaNum, { color: accentColor }]}>{meta.estimatedMins}</Text>
              <Text style={s.introMetaLabel}>minutes</Text>
            </View>
            <View style={s.introMetaDivider} />
            <View style={s.introMetaItem}>
              <Text style={[s.introMetaNum, { color: accentColor }]}>100%</Text>
              <Text style={s.introMetaLabel}>private</Text>
            </View>
          </View>
          <View style={[s.introTips, { backgroundColor: accentColor + '12', borderColor: accentColor + '30' }]}>
            <Text style={[s.introTipTitle, { color: accentColor }]}>For the most accurate results</Text>
            <Text style={s.introTip}>• Answer based on how you actually behave, not how you'd like to</Text>
            <Text style={s.introTip}>• Go with your gut. Your first instinct is usually most honest.</Text>
            <Text style={s.introTip}>• There are no right or wrong answers</Text>
          </View>
          <TouchableOpacity style={s.startBtn} onPress={() => setPhase('quiz')} activeOpacity={0.85}>
            <Text style={s.startBtnText}>Start assessment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Result screen ──
  if (phase === 'result' && result) {
    const detail = ASSESSMENT_DETAIL[type]?.[result.primary];
    const labelMap = RESULT_LABEL_MAP[type] ?? {};
    const primaryLabel = labelMap[result.primary] ?? result.primary;
    const secondaryLabel = result.secondary ? labelMap[result.secondary] : null;
    const topDimensions = Object.entries(result.scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, type === 'love' ? 3 : 4);

    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView contentContainerStyle={s.resultContent}>
          <View style={[s.resultHero, { borderColor: accentColor + '50' }]}>
            <View style={[s.resultIconWrap, { backgroundColor: accentColor + '18' }]}>
              {(() => { const I = TYPE_ICONS[type]; return I ? <I size={28} color={accentColor} /> : null; })()}
            </View>
            <Text style={[s.resultBadge, { color: accentColor, backgroundColor: accentColor + '18' }]}>
              {result.confidence === 'high' ? 'Clear result' : result.confidence === 'medium' ? 'Moderate result' : 'Mixed result. Consider retaking.'}
            </Text>
            <Text style={s.resultTitle}>{primaryLabel}</Text>
            <Text style={s.resultSubtitle}>{detail?.subtitle}</Text>
            {secondaryLabel && (
              <Text style={s.resultSecondary}>Also strong: <Text style={{ color: accentColor }}>{secondaryLabel}</Text></Text>
            )}
          </View>

          {/* Score bars */}
          <View style={s.scoreSection}>
            <Text style={s.scoreSectionTitle}>Your breakdown</Text>
            {topDimensions.map(([dim, score]) => (
              <View key={dim} style={s.scoreRow}>
                <Text style={s.scoreDimLabel}>{labelMap[dim] ?? dim}</Text>
                <View style={s.scoreBarBg}>
                  <View style={[s.scoreBarFill, { width: `${score}%`, backgroundColor: accentColor }]} />
                </View>
                <Text style={[s.scoreNum, { color: accentColor }]}>{Math.round(score)}%</Text>
              </View>
            ))}
          </View>

          {/* Snippet from detail */}
          {detail && (
            <View style={[s.snippetCard, { borderLeftColor: accentColor }]}>
              <Text style={[s.snippetLabel, { color: accentColor }]}>WHAT THIS MEANS</Text>
              <Text style={s.snippetText}>{detail.about[0]}</Text>
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity
            style={[s.saveBtn, saving && { opacity: 0.6 }]}
            onPress={saveResult}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Text style={s.saveBtnText}>{saving ? 'Saving…' : 'Save to my profile'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={s.discardBtn} activeOpacity={0.7}>
            <Text style={s.discardText}>Discard result</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Quiz screen ──
  const answered = responses[current.id];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} style={s.backBtn} activeOpacity={0.7}>
          <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={s.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={s.headerMeta}>{currentIndex + 1} / {questions.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
      </View>

      <ScrollView contentContainerStyle={s.quizContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Question */}
          <View style={s.questionWrap}>
            <Text style={[s.questionType, { color: accentColor }]}>{meta.title.toUpperCase()}</Text>
            <Text style={s.questionText}>{current.text}</Text>
          </View>

          {/* Likert options */}
          {current.kind === 'likert' && (
            <View style={s.likertWrap}>
              <View style={s.likertRow}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => selectLikert(val)}
                    activeOpacity={0.8}
                    style={[
                      s.likertDot,
                      { borderColor: accentColor },
                      answered === val && { backgroundColor: accentColor },
                    ]}
                  >
                    <Text style={[s.likertNum, answered === val && { color: Colors.white }]}>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={s.likertLabels}>
                <Text style={s.likertLabel}>{LIKERT_LABELS[0]}</Text>
                <Text style={s.likertLabel}>{LIKERT_LABELS[4]}</Text>
              </View>
            </View>
          )}

          {/* Choice options */}
          {current.kind === 'choice' && (
            <View style={s.choiceWrap}>
              {current.options.map((opt, i) => {
                const isSelected = answered === opt.dimension;
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => selectChoice(opt.dimension)}
                    activeOpacity={0.8}
                    style={[
                      s.choiceCard,
                      isSelected && { borderColor: accentColor, backgroundColor: accentColor + '12' },
                    ]}
                  >
                    <View style={[s.choiceRadio, { borderColor: isSelected ? accentColor : Colors.sand }, isSelected && { backgroundColor: accentColor }]}>
                      {isSelected && <View style={s.choiceRadioInner} />}
                    </View>
                    <Text style={[s.choiceText, isSelected && { color: Colors.charcoal }]}>{opt.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

        </Animated.View>
      </ScrollView>

      {/* Bottom nav: Back + Next pinned below the question. Selecting
          no longer auto-advances, so we need an explicit Next button. */}
      <View style={s.quizNav}>
        <TouchableOpacity
          onPress={goBack}
          style={s.quizNavSecondary}
          activeOpacity={0.8}
          accessibilityLabel="Previous question"
        >
          <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
          <Text style={s.quizNavSecondaryText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goNext}
          disabled={answered === undefined}
          style={[
            s.quizNavPrimary,
            { backgroundColor: accentColor },
            answered === undefined && { opacity: 0.4 },
          ]}
          activeOpacity={0.8}
          accessibilityLabel={currentIndex < questions.length - 1 ? 'Next question' : 'See result'}
        >
          <Text style={s.quizNavPrimaryText}>
            {currentIndex < questions.length - 1 ? 'Next' : 'See result'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingRight: 12 },
  backText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.midBrown },
  empty: { fontFamily: Fonts.body, color: Colors.midBrown },

  // Intro
  introTopBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  introContent: { padding: 24, paddingBottom: 48 },
  introHero: { backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderRadius: Radius.xl, padding: 28, alignItems: 'center', marginBottom: 20 },
  introIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  introTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 22, color: Colors.charcoal, marginBottom: 8, textAlign: 'center' },
  introSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21 },
  introMeta: { flexDirection: 'row', backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 20, alignItems: 'center' },
  introMetaItem: { flex: 1, alignItems: 'center' },
  introMetaNum: { fontFamily: Fonts.displaySemiBold, fontSize: 22, marginBottom: 2 },
  introMetaLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.midBrown },
  introMetaDivider: { width: 1, height: 32, backgroundColor: Colors.sand },
  introTips: { borderWidth: 1, borderRadius: Radius.lg, padding: 16, marginBottom: 24 },
  introTipTitle: { fontFamily: Fonts.bodyMedium, fontSize: 12, marginBottom: 8, letterSpacing: 0.4 },
  introTip: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 21, marginBottom: 4 },
  startBtn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center' },
  startBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },

  // Quiz
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerMeta: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown },
  progressTrack: { height: 3, backgroundColor: Colors.sand, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 2 },
  quizContent: { padding: 20, paddingBottom: 48 },
  questionWrap: { marginBottom: 28 },
  questionType: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 1, marginBottom: 10 },
  questionText: { fontFamily: Fonts.displaySemiBold, fontSize: 20, color: Colors.charcoal, lineHeight: 30 },

  // Likert
  likertWrap: { alignItems: 'center' },
  likertRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  likertDot: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.warmWhite },
  likertNum: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.midBrown },
  likertLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 4 },
  likertLabel: { fontFamily: Fonts.body, fontSize: 11, color: Colors.midBrown, maxWidth: '45%', textAlign: 'center' },

  // Choice
  choiceWrap: { gap: 10 },
  choiceCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14 },
  choiceRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  choiceRadioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  choiceText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21, flex: 1 },

  // Result
  resultContent: { padding: 24, paddingBottom: 48 },
  resultHero: { backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderRadius: Radius.xl, padding: 24, alignItems: 'center', marginBottom: 20 },
  resultIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  resultBadge: { fontFamily: Fonts.bodyMedium, fontSize: 11, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 12 },
  resultTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 22, color: Colors.charcoal, marginBottom: 6, textAlign: 'center' },
  resultSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21 },
  resultSecondary: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginTop: 10 },
  scoreSection: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.xl, padding: 20, marginBottom: 16 },
  scoreSectionTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 16, color: Colors.charcoal, marginBottom: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  scoreDimLabel: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.charcoal, width: 110, flexShrink: 0 },
  scoreBarBg: { flex: 1, height: 8, backgroundColor: Colors.sand, borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scoreNum: { fontFamily: Fonts.bodyMedium, fontSize: 12, width: 36, textAlign: 'right', flexShrink: 0 },
  snippetCard: { backgroundColor: Colors.warmWhite, borderLeftWidth: 3, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 24 },
  snippetLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, marginBottom: 8 },
  snippetText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.charcoal, lineHeight: 21 },
  saveBtn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  saveBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  // Quiz bottom nav (Back / Next)
  quizNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: Colors.creamDark, backgroundColor: Colors.cream },
  quizNavSecondary: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 14 },
  quizNavSecondaryText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.midBrown },
  quizNavPrimary: { flexShrink: 1, paddingVertical: 14, paddingHorizontal: 28, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', minWidth: 140 },
  quizNavPrimaryText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  discardBtn: { alignItems: 'center', paddingVertical: 8 },
  discardText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown },
});
