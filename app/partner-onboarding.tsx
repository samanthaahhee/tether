import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/hooks/useAppState';
import { Colors, Fonts, Radius } from '../src/constants/theme';
import {
  ATTACH_REVEALS, CONFLICT_REVEALS, WINDOW_REVEALS, LOVE_REVEALS,
  ATTACHMENT_LABELS, CONFLICT_LABELS, LOVE_LABELS, WINDOW_LABELS, NEED_LABELS,
} from '../src/constants/data';
import { Button, InsightReveal } from '../src/components/UI';

const TOTAL_STEPS = 8; // handoff + name + 5 questions + summary

interface OptionData {
  value: string;
  emoji: string;
  title: string;
  desc: string;
}

const ATTACH_OPTIONS: OptionData[] = [
  { value: 'secure', emoji: '😌', title: 'They are probably just busy', desc: 'I feel fine. I trust they will respond when they can. I do not feel unsettled.' },
  { value: 'anxious', emoji: '😰', title: 'Have I done something wrong?', desc: 'I notice myself checking my phone. I might send a follow-up or feel low-level anxiety until I hear back.' },
  { value: 'avoidant', emoji: '😶', title: 'I actually appreciate the space', desc: 'I do not feel bothered. I might even feel relieved to have time to myself.' },
  { value: 'disorganised', emoji: '🌀', title: 'It depends — sometimes fine, sometimes I spiral', desc: 'My reaction shifts. Sometimes okay; other times a small silence can feel like something is seriously wrong.' },
];

const CONFLICT_OPTIONS: OptionData[] = [
  { value: 'criticise', emoji: '🗣️', title: 'Keep talking — say everything I am feeling', desc: 'I want to be heard. The more dismissed I feel, the louder or more intense I might get.' },
  { value: 'defensive', emoji: '🛡️', title: 'Explain my side and counter what they are saying', desc: 'I feel the need to be understood and to correct what feels unfair. I build my case.' },
  { value: 'stonewall', emoji: '🧊', title: 'Go quiet and withdraw until I have calmed down', desc: 'I shut down. I need to process alone — I cannot think clearly when emotions are high.' },
  { value: 'peacekeep', emoji: '🕊️', title: 'Apologise or change subject to stop the tension', desc: 'I will do almost anything to lower the temperature, even if it means swallowing what I feel.' },
];

const WINDOW_OPTIONS: OptionData[] = [
  { value: 'hyper', emoji: '🔥', title: 'I heat up — heart races, voice rises, I feel flooded', desc: 'My body surges. I feel like I need to say everything immediately or the moment will pass.' },
  { value: 'hypo', emoji: '🧊', title: 'I shut down — I go blank, numb, cannot find words', desc: 'My mind empties. I freeze up, feel distant, or dissociate slightly.' },
  { value: 'mixed', emoji: '🌀', title: 'Both — it depends on the situation', desc: 'Sometimes I boil over, sometimes I go quiet. The same argument can produce very different reactions.' },
  { value: 'regulated', emoji: '😌', title: 'I stay mostly regulated — I can keep thinking clearly', desc: 'I feel uncomfortable but I do not lose the thread. I can listen without completely flooding.' },
];

const LOVE_OPTIONS: OptionData[] = [
  { value: 'words', emoji: '💬', title: 'Them saying I love you — we are okay', desc: 'Hearing the words out loud. Being told explicitly that they still care.' },
  { value: 'acts', emoji: '🛠️', title: 'Them doing something helpful without being asked', desc: 'Making dinner, sorting something I was stressed about — action speaks louder than words.' },
  { value: 'touch', emoji: '🤝', title: 'A proper hug that lasts longer than usual', desc: 'Physical closeness. I need to feel their body near mine — that is when the tension breaks.' },
  { value: 'time', emoji: '⏳', title: 'Sitting together with their full attention', desc: 'Phones away, just us. Even if we do not talk about what happened — presence is everything.' },
  { value: 'gifts', emoji: '🎁', title: 'A small gesture that shows they thought of me', desc: 'A note, something they picked up, a playlist. It is about knowing I was in their mind.' },
];

const NEED_OPTIONS: OptionData[] = [
  { value: 'seen', emoji: '👁️', title: 'I need to feel seen and understood', desc: 'I do not need fixing — I need to know my feelings make sense and that they genuinely get it.' },
  { value: 'safe', emoji: '🛡️', title: 'I need to feel safe and secure', desc: 'I need to know we are not going to fall apart. Stability and reassurance that we are still okay.' },
  { value: 'respected', emoji: '🌿', title: 'I need to feel respected and valued', desc: 'My perspective matters, my efforts are noticed, I am not taken for granted.' },
  { value: 'space', emoji: '🌬️', title: 'I need space to process without pressure', desc: 'I cannot think when someone is pushing for resolution. I need to come to things in my own time.' },
];

function OptionCard({ option, selected, onPress }: { option: OptionData; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.optCard, selected && styles.optCardSelected]}>
      <Text style={styles.optEmoji}>{option.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.optTitle, selected && { color: Colors.blush }]}>{option.title}</Text>
        <Text style={styles.optDesc}>{option.desc}</Text>
      </View>
      {selected && (
        <View style={styles.optCheck}>
          <Text style={{ color: Colors.white, fontSize: 10, fontFamily: Fonts.bodyMedium }}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function PartnerOnboarding() {
  const { dispatch } = useAppState();
  const [step, setStep] = useState(0); // 0 = handoff screen
  const [name, setName] = useState('');
  const [picks, setPicks] = useState<Record<string, string>>({});
  const scrollRef = useRef<ScrollView>(null);

  const pick = (key: string, value: string) => {
    setPicks((p) => ({ ...p, [key]: value }));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return !!picks.attach;
    if (step === 3) return !!picks.conflict;
    if (step === 4) return !!picks.window;
    if (step === 5) return !!picks.love;
    if (step === 6) return !!picks.need;
    return true;
  };

  const next = () => {
    if (step > 0 && !canProceed()) return;
    if (step === TOTAL_STEPS - 1) {
      dispatch({
        type: 'SET_PARTNER_PROFILE',
        payload: {
          name: name.trim(),
          attachment: picks.attach,
          conflict: picks.conflict,
          love: picks.love,
          window: picks.window,
          need: picks.need,
        },
      });
      router.back();
      return;
    }
    setStep((s) => s + 1);
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
  };

  const rc = {
    attach: { bg: Colors.terracottaPale, border: Colors.terracottaLight, label: Colors.terracotta },
    conflict: { bg: Colors.goldPale, border: '#D4B46A', label: Colors.gold },
    window: { bg: Colors.blushPale, border: Colors.blush, label: Colors.blush },
    love: { bg: Colors.sagePale, border: Colors.sageLight, label: Colors.sage },
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header — hidden on handoff screen */}
        {step > 0 && (
          <View style={styles.header}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: ((step / (TOTAL_STEPS - 1)) * 100) + '%' }]} />
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.skipText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Step 0: Handoff screen */}
          {step === 0 && (
            <View style={styles.handoff}>
              <Text style={{ fontSize: 56, textAlign: 'center', marginBottom: 20 }}>🤝</Text>
              <Text style={styles.handoffTitle}>Hand the phone to your partner</Text>
              <Text style={styles.handoffSub}>
                This takes about 3 minutes. Your partner will answer a few questions about themselves — their honest instincts, not what they think they should say.
              </Text>
              <View style={styles.handoffHint}>
                <Text style={styles.hintIcon}>🔒</Text>
                <Text style={styles.hintText}>Their answers are saved only on this device and are never shared outside the app.</Text>
              </View>
              <View style={styles.handoffHint}>
                <Text style={styles.hintIcon}>✏️</Text>
                <Text style={styles.hintText}>You can update or redo this profile anytime from Settings.</Text>
              </View>
              <View style={styles.footer}>
                <Button label="Start partner profile" onPress={next} />
                <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 1 of 6</Text>
              <Text style={styles.stepH}>Let us start with you</Text>
              <Text style={styles.stepSub}>Your partner is filling this in — answer honestly. This helps your partner understand how you experience your relationship.</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your first name"
                placeholderTextColor={Colors.lightBrown}
                style={styles.nameInput}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={next}
              />
            </View>
          )}

          {/* Step 2: Attachment */}
          {step === 2 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 2 of 6 — How you connect</Text>
              <Text style={styles.stepH}>Your partner has not replied to your messages for a few hours. What goes through your mind?</Text>
              <Text style={styles.stepSub}>Pick the response that feels most honestly true — even if you wish it were not.</Text>
              {ATTACH_OPTIONS.map((o) => (
                <OptionCard key={o.value} option={o} selected={picks.attach === o.value} onPress={() => pick('attach', o.value)} />
              ))}
              {picks.attach && ATTACH_REVEALS[picks.attach] && (
                <InsightReveal label="What this means for you" title={ATTACH_REVEALS[picks.attach].title} body={ATTACH_REVEALS[picks.attach].body} bg={rc.attach.bg} borderColor={rc.attach.border} labelColor={rc.attach.label} />
              )}
            </View>
          )}

          {/* Step 3: Conflict style */}
          {step === 3 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 3 of 6 — During conflict</Text>
              <Text style={styles.stepH}>You and your partner are in the middle of a tense argument. What do you feel the strongest urge to do?</Text>
              <Text style={styles.stepSub}>Your gut instinct — not what you think you should do.</Text>
              {CONFLICT_OPTIONS.map((o) => (
                <OptionCard key={o.value} option={o} selected={picks.conflict === o.value} onPress={() => pick('conflict', o.value)} />
              ))}
              {picks.conflict && CONFLICT_REVEALS[picks.conflict] && (
                <InsightReveal label="What this means for you" title={CONFLICT_REVEALS[picks.conflict].title} body={CONFLICT_REVEALS[picks.conflict].body} bg={rc.conflict.bg} borderColor={rc.conflict.border} labelColor={rc.conflict.label} />
              )}
            </View>
          )}

          {/* Step 4: Window of tolerance */}
          {step === 4 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 4 of 6 — Your body in conflict</Text>
              <Text style={styles.stepH}>When an argument escalates, what happens in your body first?</Text>
              <Text style={styles.stepSub}>This helps your partner understand when you need a pause and what kind of support helps most.</Text>
              {WINDOW_OPTIONS.map((o) => (
                <OptionCard key={o.value} option={o} selected={picks.window === o.value} onPress={() => pick('window', o.value)} />
              ))}
              {picks.window && WINDOW_REVEALS[picks.window] && (
                <InsightReveal label="What this means for you" title={WINDOW_REVEALS[picks.window].title} body={WINDOW_REVEALS[picks.window].body} bg={rc.window.bg} borderColor={rc.window.border} labelColor={rc.window.label} />
              )}
            </View>
          )}

          {/* Step 5: Love language */}
          {step === 5 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 5 of 6 — How you feel loved</Text>
              <Text style={styles.stepH}>After a difficult few days, what would make you feel most reconnected to your partner?</Text>
              <Text style={styles.stepSub}>Imagine the thing that would genuinely shift how you feel.</Text>
              {LOVE_OPTIONS.map((o) => (
                <OptionCard key={o.value} option={o} selected={picks.love === o.value} onPress={() => pick('love', o.value)} />
              ))}
              {picks.love && LOVE_REVEALS[picks.love] && (
                <InsightReveal label="What this means for you" title={LOVE_REVEALS[picks.love].title} body={LOVE_REVEALS[picks.love].body} bg={rc.love.bg} borderColor={rc.love.border} labelColor={rc.love.label} />
              )}
            </View>
          )}

          {/* Step 6: Core need */}
          {step === 6 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 6 of 6 — What you most need</Text>
              <Text style={styles.stepH}>When you are hurting in a relationship, which feels most true?</Text>
              <Text style={styles.stepSub}>The need that is usually unspoken — the thing beneath the conflict.</Text>
              {NEED_OPTIONS.map((o) => (
                <OptionCard key={o.value} option={o} selected={picks.need === o.value} onPress={() => pick('need', o.value)} />
              ))}
            </View>
          )}

          {/* Step 7: Summary */}
          {step === 7 && (
            <View style={styles.stepWrap}>
              <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🌿</Text>
              <Text style={styles.stepTag}>Profile complete</Text>
              <Text style={[styles.stepH, { textAlign: 'center' }]}>Thank you, {name}</Text>
              <Text style={[styles.stepSub, { textAlign: 'center' }]}>
                Your partner can now see your emotional patterns in the app — to understand you better, not to judge you.
              </Text>
              <View style={styles.summaryGrid}>
                {[
                  { label: 'Attachment', value: ATTACHMENT_LABELS[picks.attach] || '—' },
                  { label: 'Under conflict', value: CONFLICT_LABELS[picks.conflict] || '—' },
                  { label: 'Love language', value: LOVE_LABELS[picks.love] || '—' },
                  { label: 'Body in conflict', value: WINDOW_LABELS[picks.window] || '—' },
                  { label: 'Core need', value: NEED_LABELS[picks.need] || '—' },
                ].map((item) => (
                  <View key={item.label} style={styles.summaryPill}>
                    <Text style={styles.pillLabel}>{item.label}</Text>
                    <Text style={styles.pillValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {step > 0 && (
            <View style={styles.footer}>
              <Button label={step === TOTAL_STEPS - 1 ? 'Save and hand back' : 'Continue'} onPress={next} disabled={step < 7 && !canProceed()} />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.warmWhite },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 4, backgroundColor: Colors.sand, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.blush, borderRadius: 2 },
  skipText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown },
  scroll: { paddingBottom: 40 },
  handoff: { flex: 1, paddingHorizontal: 20, paddingTop: 48, gap: 16 },
  handoffTitle: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, textAlign: 'center', lineHeight: 34 },
  handoffSub: { fontFamily: Fonts.body, fontSize: 15, color: Colors.midBrown, lineHeight: 23, textAlign: 'center', marginBottom: 8 },
  handoffHint: { backgroundColor: Colors.creamDark, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.md, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  stepWrap: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  stepTag: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.blush },
  stepH: { fontFamily: Fonts.display, fontSize: 24, color: Colors.charcoal, lineHeight: 32, marginBottom: 2 },
  stepSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, lineHeight: 21, marginBottom: 8 },
  nameInput: { width: '100%', padding: 16, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.sand, backgroundColor: Colors.cream, fontFamily: Fonts.body, fontSize: 16, color: Colors.charcoal, marginBottom: 4 },
  hintIcon: { fontSize: 16, marginTop: 1 },
  hintText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 },
  optCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.cream, borderWidth: 2, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14 },
  optCardSelected: { borderColor: Colors.blush, backgroundColor: Colors.blushPale },
  optEmoji: { fontSize: 22, marginTop: 2 },
  optTitle: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal, marginBottom: 3 },
  optDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, lineHeight: 18 },
  optCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summaryPill: { width: '47%', backgroundColor: Colors.creamDark, borderRadius: Radius.sm, padding: 12 },
  pillLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 3 },
  pillValue: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal },
  footer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  cancelBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
});
