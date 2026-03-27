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
  ATTACH_INSIGHTS, ATTACHMENT_LABELS, CONFLICT_LABELS, LOVE_LABELS,
  WINDOW_LABELS, NEED_LABELS,
} from '../src/constants/data';
import { Button, InsightReveal } from '../src/components/UI';

const TOTAL_STEPS = 8;

interface OptionData {
  value: string;
  emoji: string;
  title: string;
  desc: string;
}

const CONTEXT_OPTIONS: OptionData[] = [
  { value: 'conflict', emoji: '🌊', title: 'We are going through a rough patch', desc: 'Arguments feel frequent or intense. Something feels stuck and we cannot break the cycle.' },
  { value: 'disconnect', emoji: '🌫️', title: 'We have grown distant', desc: 'There is no big blow-up — just a quiet drift. We are more like housemates than partners.' },
  { value: 'specific', emoji: '🔍', title: 'There is one specific issue', desc: 'Something happened — or keeps happening — that I need to work through and understand better.' },
  { value: 'proactive', emoji: '🌱', title: 'Things are okay — I want to grow', desc: 'We are doing reasonably well but I want to build stronger communication before problems arise.' },
];

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
        <Text style={[styles.optTitle, selected && { color: Colors.terracotta }]}>{option.title}</Text>
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

export default function Onboarding() {
  const { dispatch } = useAppState();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [picks, setPicks] = useState<Record<string, string>>({});
  const scrollRef = useRef<ScrollView>(null);

  const pick = (key: string, value: string) => {
    setPicks((p) => ({ ...p, [key]: value }));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return !!picks.context;
    if (step === 3) return !!picks.attach;
    if (step === 4) return !!picks.conflict;
    if (step === 5) return !!picks.window;
    if (step === 6) return !!picks.love;
    if (step === 7) return !!picks.need;
    return true;
  };

  const next = () => {
    if (!canProceed()) return;
    if (step === 8) {
      dispatch({
        type: 'SET_PROFILE',
        payload: {
          name: name.trim(),
          attachment: picks.attach || 'secure',
          conflict: picks.conflict || 'defensive',
          love: picks.love || 'words',
          window: picks.window || 'regulated',
          need: picks.need || 'seen',
          context: picks.context || 'conflict',
          onboarded: true,
        },
      });
      router.replace('/(tabs)');
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
        <View style={styles.header}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: ((step / TOTAL_STEPS) * 100) + '%' }]} />
          </View>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {step === 1 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 1 of 8</Text>
              <Text style={styles.stepH}>Let us start with you</Text>
              <Text style={styles.stepSub}>This takes about 4 minutes. Your answers help Tether understand how you experience relationships so every session feels made for you.</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Your first name" placeholderTextColor={Colors.lightBrown} style={styles.nameInput} autoFocus returnKeyType="done" onSubmitEditing={next} />
              <View style={styles.hintBox}>
                <Text style={styles.hintIcon}>🔒</Text>
                <Text style={styles.hintText}>Everything you share here stays private. Tether never shows your answers to your partner.</Text>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 2 of 8 — Your situation</Text>
              <Text style={styles.stepH}>What is bringing you here?</Text>
              <Text style={styles.stepSub}>No right answer — just helps Tether understand where you are starting from.</Text>
              {CONTEXT_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.context === o.value} onPress={() => pick('context', o.value)} />)}
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 3 of 8 — How you connect</Text>
              <Text style={styles.stepH}>Your partner has not replied to your messages for a few hours. What goes through your mind?</Text>
              <Text style={styles.stepSub}>Pick the response that feels most honestly true — even if you wish it were not.</Text>
              {ATTACH_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.attach === o.value} onPress={() => pick('attach', o.value)} />)}
              {picks.attach && ATTACH_REVEALS[picks.attach] && (
                <InsightReveal label="What this means for you" title={ATTACH_REVEALS[picks.attach].title} body={ATTACH_REVEALS[picks.attach].body} bg={rc.attach.bg} borderColor={rc.attach.border} labelColor={rc.attach.label} />
              )}
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 4 of 8 — During conflict</Text>
              <Text style={styles.stepH}>You and your partner are in the middle of a tense argument. What do you feel the strongest urge to do?</Text>
              <Text style={styles.stepSub}>Your gut instinct — not what you think you should do.</Text>
              {CONFLICT_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.conflict === o.value} onPress={() => pick('conflict', o.value)} />)}
              {picks.conflict && CONFLICT_REVEALS[picks.conflict] && (
                <InsightReveal label="What this means for you" title={CONFLICT_REVEALS[picks.conflict].title} body={CONFLICT_REVEALS[picks.conflict].body} bg={rc.conflict.bg} borderColor={rc.conflict.border} labelColor={rc.conflict.label} />
              )}
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 5 of 8 — Your body in conflict</Text>
              <Text style={styles.stepH}>When an argument escalates, what happens in your body first?</Text>
              <Text style={styles.stepSub}>This helps Tether know when to suggest a pause and what kind of support you need.</Text>
              {WINDOW_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.window === o.value} onPress={() => pick('window', o.value)} />)}
              {picks.window && WINDOW_REVEALS[picks.window] && (
                <InsightReveal label="What this means for you" title={WINDOW_REVEALS[picks.window].title} body={WINDOW_REVEALS[picks.window].body} bg={rc.window.bg} borderColor={rc.window.border} labelColor={rc.window.label} />
              )}
            </View>
          )}

          {step === 6 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 6 of 8 — How you feel loved</Text>
              <Text style={styles.stepH}>After a difficult few days, what would make you feel most reconnected to your partner?</Text>
              <Text style={styles.stepSub}>Imagine the thing that would genuinely shift how you feel.</Text>
              {LOVE_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.love === o.value} onPress={() => pick('love', o.value)} />)}
              {picks.love && LOVE_REVEALS[picks.love] && (
                <InsightReveal label="What this means for you" title={LOVE_REVEALS[picks.love].title} body={LOVE_REVEALS[picks.love].body} bg={rc.love.bg} borderColor={rc.love.border} labelColor={rc.love.label} />
              )}
            </View>
          )}

          {step === 7 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 7 of 8 — What you most need</Text>
              <Text style={styles.stepH}>When you are hurting in a relationship, which feels most true?</Text>
              <Text style={styles.stepSub}>This helps Tether understand what is beneath your conflicts — the need that is usually unspoken.</Text>
              {NEED_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.need === o.value} onPress={() => pick('need', o.value)} />)}
            </View>
          )}

          {step === 8 && (
            <View style={styles.stepWrap}>
              <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>🌿</Text>
              <Text style={styles.stepTag}>Your profile is ready</Text>
              <Text style={[styles.stepH, { textAlign: 'center' }]}>Welcome, {name}</Text>
              <Text style={[styles.stepSub, { textAlign: 'center' }]}>Here is what Tether has learned about you.</Text>
              <View style={styles.summaryGrid}>
                {[
                  { label: 'Attachment', value: ATTACHMENT_LABELS[picks.attach] || '—' },
                  { label: 'Under conflict', value: CONFLICT_LABELS[picks.conflict] || '—' },
                  { label: 'Love language', value: LOVE_LABELS[picks.love] || '—' },
                  { label: 'Body in conflict', value: WINDOW_LABELS[picks.window] || '—' },
                  { label: 'Core need', value: NEED_LABELS[picks.need] || '—' },
                  { label: 'Here because', value: { conflict: 'Rough patch', disconnect: 'Reconnecting', specific: 'Specific issue', proactive: 'Growing' }[picks.context] || '—' },
                ].map((item) => (
                  <View key={item.label} style={styles.summaryPill}>
                    <Text style={styles.pillLabel}>{item.label}</Text>
                    <Text style={styles.pillValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.finalInsight}>
                <Text style={styles.finalInsightLabel}>Your personalised insight</Text>
                <Text style={styles.finalInsightBody}>
                  {ATTACH_INSIGHTS[picks.attach] || ''} Your core need — to feel {picks.need || 'seen'} — is the thread underneath most of your conflicts. Tether will help you name it and communicate it.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Button label={step === 8 ? 'Enter Tether' : 'Continue'} onPress={next} disabled={!canProceed()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.warmWhite },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  progressTrack: { flex: 1, height: 4, backgroundColor: Colors.sand, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.terracotta, borderRadius: 2 },
  skipText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown },
  scroll: { paddingBottom: 40 },
  stepWrap: { paddingHorizontal: 20, paddingTop: 12, gap: 10 },
  stepTag: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.terracotta },
  stepH: { fontFamily: Fonts.display, fontSize: 24, color: Colors.charcoal, lineHeight: 32, marginBottom: 2 },
  stepSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, lineHeight: 21, marginBottom: 8 },
  nameInput: { width: '100%', padding: 16, borderRadius: Radius.md, borderWidth: 2, borderColor: Colors.sand, backgroundColor: Colors.cream, fontFamily: Fonts.body, fontSize: 16, color: Colors.charcoal, marginBottom: 4 },
  hintBox: { backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.sm, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 8 },
  hintIcon: { fontSize: 16, marginTop: 1 },
  hintText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 },
  optCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: Colors.cream, borderWidth: 2, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14 },
  optCardSelected: { borderColor: Colors.terracotta, backgroundColor: Colors.terracottaPale },
  optEmoji: { fontSize: 22, marginTop: 2 },
  optTitle: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal, marginBottom: 3 },
  optDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, lineHeight: 18 },
  optCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.terracotta, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summaryPill: { width: '47%', backgroundColor: Colors.creamDark, borderRadius: Radius.sm, padding: 12 },
  pillLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 3 },
  pillValue: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal },
  finalInsight: { backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 16 },
  finalInsightLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: Colors.sage, marginBottom: 6 },
  finalInsightBody: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
});
