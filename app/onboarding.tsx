import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, Linking,
  Modal, FlatList, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/hooks/useAppState';
import { useAuth } from '../src/hooks/useAuth';
import { Colors, Fonts, Radius } from '../src/constants/theme';
import {
  ATTACH_REVEALS, CONFLICT_REVEALS, WINDOW_REVEALS, LOVE_REVEALS,
  ATTACH_INSIGHTS, ATTACHMENT_LABELS, CONFLICT_LABELS, LOVE_LABELS,
  WINDOW_LABELS, NEED_LABELS,
} from '../src/constants/data';
import { Button, InsightReveal } from '../src/components/UI';
import { enableTracking, track } from '../src/lib/posthog';
import { COUNTRIES } from '../src/constants/countries';
import {
  IconWind, IconMoon, IconSearch, IconLeaf, IconCheck, IconActivity,
  IconShield, IconHeart, IconFlame, IconUser, IconClock, IconSparkles,
  IconLock,
} from '../src/components/Icons';

const TOTAL_STEPS = 9;

// Phase-based progress weighting. The flow has three phases:
//   1. Intro (steps 1-3): name + demographics + situation — 30% of bar
//   2. Pattern questions (steps 4-8): the five core dimensions — 60% of bar
//   3. Summary (step 9): 100%
// Linear step/9 was punishing on step 1 (11%) and didn't match the
// "Step X/5" tags users see on the pattern-question section.
const PROGRESS_BY_STEP: Record<number, number> = {
  1: 10,
  2: 20,
  3: 30,
  4: 42,
  5: 54,
  6: 66,
  7: 78,
  8: 90,
  9: 100,
};

interface OptionData {
  value: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  desc: string;
}

const CONTEXT_OPTIONS: OptionData[] = [
  { value: 'conflict', icon: IconWind, title: 'We are going through a rough patch', desc: 'Arguments feel frequent or intense. Something feels stuck and we cannot break the cycle.' },
  { value: 'disconnect', icon: IconMoon, title: 'We have grown distant', desc: 'There is no big blow-up. Just a quiet drift. We are more like housemates than partners.' },
  { value: 'specific', icon: IconSearch, title: 'There is one specific issue', desc: 'Something happened, or keeps happening, that I need to work through and understand better.' },
  { value: 'proactive', icon: IconLeaf, title: 'Things are okay and I want to grow', desc: 'We are doing reasonably well but I want to build stronger communication before problems arise.' },
];

const ATTACH_OPTIONS: OptionData[] = [
  { value: 'secure', icon: IconCheck, title: 'They are probably just busy', desc: 'I feel fine. I trust they will respond when they can. I do not feel unsettled.' },
  { value: 'anxious', icon: IconActivity, title: 'Have I done something wrong?', desc: 'I notice myself checking my phone. I might send a follow-up or feel low-level anxiety until I hear back.' },
  { value: 'avoidant', icon: IconMoon, title: 'I actually appreciate the space', desc: 'I do not feel bothered. I might even feel relieved to have time to myself.' },
  { value: 'disorganised', icon: IconActivity, title: 'It depends: sometimes fine, sometimes I spiral', desc: 'My reaction shifts. Sometimes I am okay; other times a small silence can feel like something is seriously wrong.' },
];

const CONFLICT_OPTIONS: OptionData[] = [
  { value: 'criticise', icon: IconWind, title: 'Keep talking: say everything I am feeling', desc: 'I want to be heard. The more dismissed I feel, the louder or more intense I might get.' },
  { value: 'defensive', icon: IconShield, title: 'Explain my side and counter what they are saying', desc: 'I feel the need to be understood and to correct what feels unfair. I build my case.' },
  { value: 'stonewall', icon: IconMoon, title: 'Go quiet and withdraw until I have calmed down', desc: 'I shut down. I need to process alone. I cannot think clearly when emotions are high.' },
  { value: 'peacekeep', icon: IconHeart, title: 'Apologise or change the subject to stop the tension', desc: 'I will do almost anything to lower the temperature, even if it means swallowing what I feel.' },
];

const WINDOW_OPTIONS: OptionData[] = [
  { value: 'hyper', icon: IconFlame, title: 'I heat up: heart races, voice rises, I feel flooded', desc: 'My body surges. I feel like I need to say everything immediately or the moment will pass.' },
  { value: 'hypo', icon: IconMoon, title: 'I shut down: I go blank, numb, cannot find words', desc: 'My mind empties. I freeze up, feel distant, or go very quiet.' },
  { value: 'mixed', icon: IconActivity, title: 'It depends on the situation', desc: 'Sometimes I boil over, sometimes I go quiet. The same argument can produce very different reactions.' },
  { value: 'regulated', icon: IconCheck, title: 'I stay mostly regulated and can keep thinking clearly', desc: 'I feel uncomfortable but I do not lose the thread. I can listen without completely flooding.' },
];

const LOVE_OPTIONS: OptionData[] = [
  { value: 'words', icon: IconHeart, title: 'Them saying: I love you, we are okay', desc: 'Hearing the words out loud. Being told explicitly that they still care.' },
  { value: 'acts', icon: IconLeaf, title: 'Them doing something helpful without being asked', desc: 'Making dinner, sorting something I was stressed about. Action speaks louder than words.' },
  { value: 'touch', icon: IconUser, title: 'A proper hug that lasts longer than usual', desc: 'Physical closeness. I need to feel their body near mine. That is when the tension breaks.' },
  { value: 'time', icon: IconClock, title: 'Sitting together with their full attention', desc: 'Phones away, just us. Even if we do not talk about what happened, presence is everything.' },
  { value: 'gifts', icon: IconSparkles, title: 'A small gesture that shows they thought of me', desc: 'A note, something they picked up, a playlist. It is about knowing I was in their mind.' },
];

const NEED_OPTIONS: OptionData[] = [
  { value: 'seen', icon: IconSearch, title: 'I need to feel seen and understood', desc: 'I do not need fixing. I need to know my feelings make sense and that they genuinely get it.' },
  { value: 'safe', icon: IconShield, title: 'I need to feel safe and secure', desc: 'I need to know we are not going to fall apart. Stability and reassurance that we are still okay.' },
  { value: 'respected', icon: IconLeaf, title: 'I need to feel respected and valued', desc: 'My perspective matters, my efforts are noticed, I am not taken for granted.' },
  { value: 'space', icon: IconWind, title: 'I need space to process without pressure', desc: 'I cannot think when someone is pushing for resolution. I need to come to things in my own time.' },
];

function OptionCard({ option, selected, onPress }: { option: OptionData; selected: boolean; onPress: () => void }) {
  // Icons were removed from the design — keeping option.icon in the type
  // for backward-compat but no longer rendering it.
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.optCard, selected && styles.optCardSelected]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.optTitle, selected && { color: Colors.sageDark }]}>{option.title}</Text>
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

// Bump this when the Terms or Privacy Policy receive a material change —
// users with an older terms_version will be re-prompted to accept.
// Keep in sync with the Effective date on heyotis.app/terms + /privacy.
const TERMS_VERSION = '2026-05-11';

/**
 * One row in the consent gate. Tappable label + sub-label, with a left
 * checkbox indicator. Designed for clarity: each row is its own
 * affirmative tick rather than one big "I agree to everything" box.
 */
function ConsentRow({
  checked,
  onToggle,
  label,
  sub,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  sub: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.consentRow, checked && styles.consentRowChecked]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.consentCheckbox, checked && styles.consentCheckboxChecked]}>
        {checked && <Text style={styles.consentCheckMark}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.consentRowLabel}>{label}</Text>
        <Text style={styles.consentRowSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Onboarding() {
  const { dispatch } = useAppState();
  const { syncProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [together, setTogether] = useState('');

  // Step 2 — optional demographics. Each field can be left empty; the
  // whole step can be advanced without selecting anything. Captured for
  // aggregate audience insight and inclusive-language tailoring.
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [hasKids, setHasKids] = useState('');
  const [acquisitionSource, setAcquisitionSource] = useState('');

  // Country picker modal state. The free-text input was replaced with
  // a tappable field that opens a searchable list — users can't
  // reliably remember a canonical spelling ("USA" vs "United States"
  // vs "U.S.A.") so we normalise via a fixed list.
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');
  const filteredCountries = useMemo(() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [countryQuery]);

  const TOGETHER_OPTIONS = [
    'Less than 6 months',
    '6 months to 1 year',
    '1 to 3 years',
    '3 to 5 years',
    '5 to 10 years',
    '10+ years',
  ];

  const GENDER_OPTIONS = ['Woman', 'Man', 'Non-binary', 'Other', 'Prefer not to say'];
  const RELATIONSHIP_STATUS_OPTIONS = ['Dating', 'Engaged', 'Married', 'Cohabiting', 'Long-distance'];
  const HAS_KIDS_OPTIONS = ['No', 'Yes, they live with us', 'Yes, they don’t live with us'];
  const ACQUISITION_OPTIONS = ['App Store', 'Friend', 'Instagram', 'TikTok', 'Reddit', 'Podcast', 'Other'];
  const [picks, setPicks] = useState<Record<string, string>>({});
  const scrollRef = useRef<ScrollView>(null);

  // Consent gate. Three required confirmations before the user can
  // proceed to step 1 (name + age). Acceptance is timestamped and
  // synced to profiles.terms_accepted_at + .terms_version so we have
  // explicit evidence of consent for legal / App Review purposes.
  const [consented, setConsented] = useState(false);
  const [agreedAdult, setAgreedAdult] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedNotTherapy, setAgreedNotTherapy] = useState(false);
  const canConsent = agreedAdult && agreedTerms && agreedNotTherapy;

  // Track which step the user is on, once consent has been granted.
  // The step-name map keeps the analytics event human-readable in
  // PostHog without having to maintain a lookup elsewhere.
  useEffect(() => {
    if (!consented) return;
    const stepNames: Record<number, string> = {
      1: 'name_age_together',
      2: 'demographics',
      3: 'context',
      4: 'attachment',
      5: 'conflict',
      6: 'window',
      7: 'love',
      8: 'need',
      9: 'summary',
    };
    track('onboarding_step_viewed', { step, step_name: stepNames[step] });
  }, [step, consented]);

  const pick = (key: string, value: string) => {
    setPicks((p) => ({ ...p, [key]: value }));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
  };

  // Age must be a real integer between 18 (consent gate's hard requirement)
  // and 120 (sanity bound; nobody onboarding to a relationship app is older
  // and any value above this is almost certainly a typo).
  const ageNum = parseInt(age.trim(), 10);
  const isValidAge = !Number.isNaN(ageNum) && ageNum >= 18 && ageNum <= 120;
  const ageError = age.trim().length > 0 && !isValidAge
    ? 'Please enter an age between 18 and 120.'
    : '';

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0 && isValidAge && together.length > 0;
    if (step === 2) return true; // Demographics step — all fields optional
    if (step === 3) return !!picks.context;
    if (step === 4) return !!picks.attach;
    if (step === 5) return !!picks.conflict;
    if (step === 6) return !!picks.window;
    if (step === 7) return !!picks.love;
    if (step === 8) return !!picks.need;
    return true;
  };

  const next = async () => {
    if (!canProceed()) return;
    if (step === 9) {
      const profilePayload = {
        name: name.trim(),
        age: age.trim(),
        together_for: together,
        // Optional demographics — empty strings persist as nulls in the
        // upsert via Supabase (the columns are nullable).
        gender,
        country: country.trim(),
        relationship_status: relationshipStatus,
        has_kids: hasKids,
        acquisition_source: acquisitionSource,
        attachment: picks.attach || 'secure',
        conflict: picks.conflict || 'defensive',
        love: picks.love || 'words',
        window: picks.window || 'regulated',
        need: picks.need || 'seen',
        context: picks.context || 'conflict',
        onboarded: true,
        avatar_color: '#B8D8CA',
      };
      dispatch({ type: 'SET_PROFILE', payload: profilePayload });
      // Sync to Supabase
      await syncProfile(profilePayload);
      track('onboarding_completed', {
        attachment: profilePayload.attachment,
        conflict: profilePayload.conflict,
        love: profilePayload.love,
        window: profilePayload.window,
        need: profilePayload.need,
        context: profilePayload.context,
        // Demographics are user-level traits, captured here as event
        // props for funnel analysis (not stored on the person profile).
        gender: profilePayload.gender,
        country: profilePayload.country,
        relationship_status: profilePayload.relationship_status,
        has_kids: profilePayload.has_kids,
        acquisition_source: profilePayload.acquisition_source,
        together_for: profilePayload.together_for,
      });
      router.replace('/(tabs)');
      return;
    }
    setStep((s) => s + 1);
    setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
  };

  const rc = {
    attach: { bg: Colors.sagePale, border: Colors.sageLight, label: Colors.sage },
    conflict: { bg: Colors.bluePale, border: Colors.blueLight, label: Colors.blue },
    window: { bg: Colors.amberPale, border: Colors.amberLight, label: Colors.amber },
    love: { bg: Colors.mauvePale, border: Colors.mauveLight, label: Colors.mauve },
  };

  // ── Consent gate ──────────────────────────────────────────────────
  // Shown before any other onboarding screen. Three required tick boxes
  // — age, terms acceptance, not-a-therapist understanding. Tapping
  // Continue records the timestamp + terms version on the user's profile
  // and unlocks the question flow.
  if (!consented) {
    const handleAccept = async () => {
      if (!canConsent) return;
      await syncProfile({
        // The Supabase profile column is snake_case; the local TS
        // interface accepts the same string keys via Partial<>.
        terms_accepted_at: new Date().toISOString(),
        terms_version: TERMS_VERSION,
      } as any);
      // User has accepted terms — opt into analytics. Until this point
      // PostHog has been opted-out and any track() calls are no-ops.
      enableTracking();
      track('consent_accepted', { terms_version: TERMS_VERSION });
      setConsented(true);
    };
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.consentScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.consentTag}>BEFORE WE BEGIN</Text>
          <Text style={styles.consentH}>A few things to know.</Text>
          <Text style={styles.consentSub}>
            Hey Otis is a private wellness tool. To keep you safe and to keep us honest about what
            this app can and can&apos;t do, please confirm the following before we go further.
          </Text>

          <ConsentRow
            checked={agreedAdult}
            onToggle={() => setAgreedAdult((v) => !v)}
            label="I am 18 or older."
            sub="Hey Otis is built for adults in long-term romantic relationships."
          />
          <ConsentRow
            checked={agreedNotTherapy}
            onToggle={() => setAgreedNotTherapy((v) => !v)}
            label="I understand Hey Otis is not therapy or a crisis service."
            sub="It&apos;s a guide for everyday relationship moments. For therapy, medical advice, or a mental-health crisis, I will reach out to a qualified professional or a crisis helpline."
          />
          <ConsentRow
            checked={agreedTerms}
            onToggle={() => setAgreedTerms((v) => !v)}
            label="I&apos;ve read and accept the Terms and Privacy Policy."
            sub={
              <Text>
                Read them here:{' '}
                <Text
                  style={styles.consentLink}
                  onPress={() => Linking.openURL('https://heyotis.app/terms')}
                >
                  Terms of Service
                </Text>
                {' '}·{' '}
                <Text
                  style={styles.consentLink}
                  onPress={() => Linking.openURL('https://heyotis.app/privacy')}
                >
                  Privacy Policy
                </Text>
              </Text>
            }
          />

          <View style={styles.consentFooter}>
            <Button
              label="Continue"
              onPress={handleAccept}
              disabled={!canConsent}
            />
            <Text style={styles.consentFinePrint}>
              Tapping Continue records your consent. You can revoke it any time by deleting your
              account in Settings.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          {/* Header now has only the progress bar and Skip link.
              Back navigation lives below the Continue button as a
              text link for steps 2+. */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: (PROGRESS_BY_STEP[step] ?? (step / TOTAL_STEPS) * 100) + '%' as any }]} />
          </View>
          <TouchableOpacity
            onPress={() => {
              // Confirm before skipping. Skipping marks the user as
              // onboarded with whatever they've filled so far (often
              // mostly blanks) so the AI personalisation won't have
              // real signal until they retake onboarding from Settings.
              Alert.alert(
                'Skip onboarding?',
                "We'll set up Hey Otis with what you've shared so far. You can finish the rest any time from Settings → Retake onboarding.",
                [
                  { text: 'Keep going', style: 'cancel' },
                  {
                    text: 'Skip for now',
                    style: 'destructive',
                    onPress: async () => {
                      const skipPayload = {
                        name: name.trim() || '',
                        gender,
                        country: country.trim(),
                        relationship_status: relationshipStatus,
                        has_kids: hasKids,
                        acquisition_source: acquisitionSource,
                        attachment: picks.attach || '',
                        conflict: picks.conflict || '',
                        love: picks.love || '',
                        window: picks.window || '',
                        need: picks.need || '',
                        context: picks.context || '',
                        onboarded: true,
                      };
                      dispatch({ type: 'SET_PROFILE', payload: skipPayload });
                      await syncProfile(skipPayload);
                      track('onboarding_skipped', { last_step: step });
                      router.replace('/(tabs)');
                    },
                  },
                ],
              );
            }}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {step === 1 && (
            <View style={styles.stepWrap}>
              {/* Step 1 has no step-number tag, matching Step 2; the
                  numbered "Step X/5" tags begin at the pattern-question
                  section (steps 4-8). */}
              <Text style={styles.stepH}>Let us start with you</Text>
              <Text style={styles.stepSub}>This takes about 4 minutes. Your answers help Hey Otis understand how you experience relationships so every session feels made for you.</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Your first name" placeholderTextColor={Colors.lightBrown} selectionColor="#96d35f" cursorColor="#96d35f" style={styles.nameInput} autoFocus returnKeyType="next" />
              {/* Removed onSubmitEditing={next} on the age field — pressing
                  Done on the keyboard was auto-advancing to step 2 before
                  the user had a chance to read or change it. They must now
                  explicitly tap Continue. */}
              <TextInput value={age} onChangeText={setAge} placeholder="Your age" placeholderTextColor={Colors.lightBrown} selectionColor="#96d35f" cursorColor="#96d35f" style={styles.nameInput} keyboardType="number-pad" returnKeyType="done" maxLength={3} />
              {ageError ? <Text style={styles.fieldError}>{ageError}</Text> : null}

              <Text style={styles.fieldLabel}>How long have you been in a relationship?</Text>
              <View style={styles.chipWrap}>
                {TOGETHER_OPTIONS.map((opt) => {
                  const selected = together === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setTogether(opt)}
                      activeOpacity={0.85}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.hintBox}>
                <IconLock size={16} color={Colors.midBrown} />
                <Text style={styles.hintText}>Everything you share here stays private. Hey Otis never shows your answers to your partner.</Text>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepH}>Help us understand who Hey Otis is for</Text>

              <Text style={styles.fieldLabel}>How do you describe your gender?</Text>
              <View style={styles.chipWrap}>
                {GENDER_OPTIONS.map((opt) => {
                  const selected = gender === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setGender(selected ? '' : opt)}
                      activeOpacity={0.85}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.fieldLabel}>Where are you based?</Text>
              <TouchableOpacity
                onPress={() => {
                  setCountryQuery('');
                  setCountryPickerOpen(true);
                }}
                activeOpacity={0.85}
                style={styles.nameInput}
                accessibilityRole="button"
                accessibilityLabel="Select country"
              >
                <Text style={country ? styles.countryValue : styles.countryPlaceholder}>
                  {country || 'Choose your country'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.fieldLabel}>How would you describe your relationship?</Text>
              <View style={styles.chipWrap}>
                {RELATIONSHIP_STATUS_OPTIONS.map((opt) => {
                  const selected = relationshipStatus === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setRelationshipStatus(selected ? '' : opt)}
                      activeOpacity={0.85}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.fieldLabel}>Do you have children?</Text>
              <View style={styles.chipWrap}>
                {HAS_KIDS_OPTIONS.map((opt) => {
                  const selected = hasKids === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setHasKids(selected ? '' : opt)}
                      activeOpacity={0.85}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.fieldLabel}>How did you hear about Hey Otis?</Text>
              <View style={styles.chipWrap}>
                {ACQUISITION_OPTIONS.map((opt) => {
                  const selected = acquisitionSource === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setAcquisitionSource(selected ? '' : opt)}
                      activeOpacity={0.85}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.hintBox}>
                <IconLock size={16} color={Colors.midBrown} />
                <Text style={styles.hintText}>Used for aggregate insight only. Never shown to your partner, never sold.</Text>
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Your situation</Text>
              <Text style={styles.stepH}>What is bringing you here?</Text>
              <Text style={styles.stepSub}>No right answer. This just helps Hey Otis understand where you are starting from.</Text>
              {CONTEXT_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.context === o.value} onPress={() => pick('context', o.value)} />)}
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 1/5  |  How you connect</Text>
              <Text style={styles.stepH}>Your partner has not replied to your messages for a few hours. What goes through your mind?</Text>
              {ATTACH_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.attach === o.value} onPress={() => pick('attach', o.value)} />)}
              {picks.attach && ATTACH_REVEALS[picks.attach] && (
                <InsightReveal label="What this means for you" title={ATTACH_REVEALS[picks.attach].title} body={ATTACH_REVEALS[picks.attach].body} bg={rc.attach.bg} borderColor={rc.attach.border} labelColor={rc.attach.label} />
              )}
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 2/5  |  During conflict</Text>
              <Text style={styles.stepH}>You and your partner are in the middle of a tense argument. What do you feel the strongest urge to do?</Text>
              {CONFLICT_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.conflict === o.value} onPress={() => pick('conflict', o.value)} />)}
              {picks.conflict && CONFLICT_REVEALS[picks.conflict] && (
                <InsightReveal label="What this means for you" title={CONFLICT_REVEALS[picks.conflict].title} body={CONFLICT_REVEALS[picks.conflict].body} bg={rc.conflict.bg} borderColor={rc.conflict.border} labelColor={rc.conflict.label} />
              )}
            </View>
          )}

          {step === 6 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 3/5  |  Your body in conflict</Text>
              <Text style={styles.stepH}>When an argument escalates, what happens in your body first?</Text>
              {WINDOW_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.window === o.value} onPress={() => pick('window', o.value)} />)}
              {picks.window && WINDOW_REVEALS[picks.window] && (
                <InsightReveal label="What this means for you" title={WINDOW_REVEALS[picks.window].title} body={WINDOW_REVEALS[picks.window].body} bg={rc.window.bg} borderColor={rc.window.border} labelColor={rc.window.label} />
              )}
            </View>
          )}

          {step === 7 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 4/5  |  How you feel loved</Text>
              <Text style={styles.stepH}>After a difficult few days, what would make you feel most reconnected to your partner?</Text>
              {LOVE_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.love === o.value} onPress={() => pick('love', o.value)} />)}
              {picks.love && LOVE_REVEALS[picks.love] && (
                <InsightReveal label="What this means for you" title={LOVE_REVEALS[picks.love].title} body={LOVE_REVEALS[picks.love].body} bg={rc.love.bg} borderColor={rc.love.border} labelColor={rc.love.label} />
              )}
            </View>
          )}

          {step === 8 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTag}>Step 5/5  |  What you most need</Text>
              <Text style={styles.stepH}>When you are hurting in a relationship, which feels most true?</Text>
              {NEED_OPTIONS.map((o) => <OptionCard key={o.value} option={o} selected={picks.need === o.value} onPress={() => pick('need', o.value)} />)}
            </View>
          )}

          {step === 9 && (
            <View style={styles.stepWrap}>
              <Text style={[styles.stepTag, { textAlign: 'center' }]}>Your profile is ready</Text>
              <Text style={[styles.stepH, { textAlign: 'center' }]}>Welcome, {name}</Text>
              <Text style={[styles.stepSub, { textAlign: 'center' }]}>Here is what Hey Otis has learned about you.</Text>
              <View style={styles.summaryGrid}>
                {[
                  { label: 'Attachment', value: ATTACHMENT_LABELS[picks.attach] || '' },
                  { label: 'Under conflict', value: CONFLICT_LABELS[picks.conflict] || '' },
                  { label: 'Love language', value: LOVE_LABELS[picks.love] || '' },
                  { label: 'Body in conflict', value: WINDOW_LABELS[picks.window] || '' },
                  { label: 'Core need', value: NEED_LABELS[picks.need] || '' },
                  { label: 'Here because', value: { conflict: 'Rough patch', disconnect: 'Reconnecting', specific: 'Specific issue', proactive: 'Growing' }[picks.context] || '' },
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
                  {ATTACH_INSIGHTS[picks.attach] || ''} Your core need is to feel {picks.need || 'seen'}. This is the thread underneath most of your conflicts. Hey Otis will help you name it and communicate it.
                </Text>
              </View>

              <View style={styles.deeperPrompt}>
                <Text style={styles.deeperPromptLabel}>Want a sharper picture?</Text>
                <Text style={styles.deeperPromptBody}>
                  These quick answers give Otis a starting point. One question per dimension is a sketch, not a full portrait. When you&apos;re ready, take the full assessments in <Text style={styles.deeperPromptHi}>Learnings</Text> for a deeper, more accurate read on your attachment style, conflict pattern, love language, and how you respond under stress.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Button label={step === 9 ? 'Enter Hey Otis' : 'Continue'} onPress={next} disabled={!canProceed()} />
            {step > 1 && (
              <TouchableOpacity
                onPress={() => {
                  setStep((s) => Math.max(1, s - 1));
                  setTimeout(() => scrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
                }}
                style={styles.backLink}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.backLinkText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country picker modal. Full-screen searchable list — lighter
          than pulling in a picker library and keeps the look consistent
          with the rest of onboarding. */}
      <Modal
        visible={countryPickerOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setCountryPickerOpen(false)}
      >
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.countryModalHeader}>
            <Text style={styles.countryModalTitle}>Choose your country</Text>
            <TouchableOpacity onPress={() => setCountryPickerOpen(false)} hitSlop={8}>
              <Text style={styles.countryModalClose}>Close</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            value={countryQuery}
            onChangeText={setCountryQuery}
            placeholder="Search countries"
            placeholderTextColor={Colors.lightBrown}
            selectionColor="#96d35f"
            cursorColor="#96d35f"
            style={styles.countrySearch}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setCountry(item);
                  setCountryPickerOpen(false);
                }}
                style={styles.countryRow}
                activeOpacity={0.7}
              >
                <Text style={styles.countryRowText}>{item}</Text>
                {country === item && <Text style={styles.countryRowCheck}>✓</Text>}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.countryEmpty}>
                <Text style={styles.countryEmptyText}>No countries match “{countryQuery}”.</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Design tokens for this screen ────────────────────────────────
  // Padding scale: 4 / 8 / 12 / 16 / 20 / 24 / 32
  // Type scale: 12 (caption) / 13 (small) / 14 (body) / 15 (body+) /
  //             16 (input) / 17 (lead) / 22 (h2) / 28 (h1)
  // Horizontal padding is 24 throughout (consent gate already uses 24).
  // Vertical rhythm: stepWrap gap 16 + field marginBottom 4 = 20 between
  // logical groups, 16 within a group.
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingVertical: 16 },
  backLink: { alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 20, marginTop: 8 },
  backLinkText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.charcoal },
  countryPlaceholder: { fontFamily: Fonts.body, fontSize: 16, color: Colors.lightBrown },
  countryValue: { fontFamily: Fonts.body, fontSize: 16, color: Colors.charcoal },
  countryModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 },
  countryModalTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 20, color: Colors.charcoal },
  countryModalClose: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.sageDark },
  countrySearch: { marginHorizontal: 24, marginTop: 8, marginBottom: 16, padding: 16, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  countryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  countryRowText: { fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  countryRowCheck: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.sageDark },
  countryEmpty: { paddingHorizontal: 24, paddingVertical: 32 },
  countryEmptyText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  progressTrack: { flex: 1, height: 4, backgroundColor: Colors.sand, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.sage, borderRadius: 2 },
  // Skip is a destructive-leaning utility — slightly larger than the
  // earlier 13pt so it can be tapped without precision and so the size
  // matches the back link visually.
  skipText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  scroll: { paddingBottom: 40 },
  // Step content: 24px horizontal padding to match the consent gate
  // and country modal. Vertical gap is 16 so headers, fields, and
  // option cards have a consistent rhythm.
  stepWrap: { paddingHorizontal: 24, paddingTop: 16, gap: 16 },
  // Step tag bumped from 11 → 12 (Apple HIG min for body) and
  // letter-spaced a touch more for the all-caps treatment.
  stepTag: { fontFamily: Fonts.bodyMedium, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: Colors.charcoal },
  // H1 bumped 26 → 28 to match consent gate's H1 and pull more
  // visual weight on these top-of-screen lines.
  stepH: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, lineHeight: 34 },
  // Subtitle uses warmBrown (#3a3630) for stronger contrast than
  // the previous midBrown (#80798c). 15px reads more comfortably
  // than 14 on a phone, line-height 22 keeps it breathable.
  stepSub: { fontFamily: Fonts.body, fontSize: 15, color: Colors.warmBrown, lineHeight: 22 },
  // Inputs: padding 16 vertical = 48pt total height — comfortably
  // above the 44pt accessibility minimum.
  nameInput: { width: '100%', paddingVertical: 16, paddingHorizontal: 16, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, fontFamily: Fonts.body, fontSize: 16, color: Colors.charcoal },
  hintBox: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.md, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 8 },

  // Field label: 13 → 13 (same), but spacing simplified. The stepWrap
  // gap handles top spacing now, so no marginTop needed.
  fieldLabel: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown, marginBottom: 8, marginTop: 4 },
  fieldError: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: -8, marginBottom: 4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  // Chips: paddingVertical bumped 9 → 12 to bring touch target to
  // ~44pt (12 + 12 + 14px line-height of fontSize 14 ≈ 38pt visual,
  // but TouchableOpacity adds hitSlop-free buffer). Font 13 → 14 for
  // a touch more comfort, especially on the "Prefer not to say" pills.
  chip: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white },
  chipSelected: { borderColor: Colors.sage, backgroundColor: Colors.sagePale },
  chipText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal },
  chipTextSelected: { fontFamily: Fonts.bodyMedium, color: Colors.sageDeep },
  hintText: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.charcoal, lineHeight: 20 },
  // OptionCard: padding 14 → 16, gap 12 → 14, white background by
  // default so the selected state (white + sage border + check) is
  // more obviously the same surface with stronger affordance.
  optCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16 },
  optCardSelected: { borderColor: Colors.sage, borderWidth: 2 },
  // Option title 14 → 15 for hierarchy gain over chip text.
  optTitle: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.charcoal, marginBottom: 4, lineHeight: 20 },
  // Option description: 12 → 13, midBrown → warmBrown (#3a3630) so
  // contrast passes WCAG AA on cream / white backgrounds.
  optDesc: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19 },
  optCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  // Summary pills: bumped from 47% width to 48% with a tighter gap
  // so they look like a proper 2-column grid. Padding 12 → 14.
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, rowGap: 8 },
  summaryPill: { width: '48%', backgroundColor: Colors.creamDark, borderRadius: Radius.md, padding: 14 },
  pillLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 4 },
  pillValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal },
  // Insight card on the summary screen — white bg + sage left accent.
  // Label bumped from 10 → 12 (HIG minimum) and body 13 → 14 for
  // consistency with the rest of the screen's body type.
  finalInsight: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: Colors.sand, borderLeftWidth: 4, borderLeftColor: Colors.sage, borderRadius: Radius.lg, padding: 16, marginTop: 8 },
  finalInsightLabel: { fontFamily: Fonts.bodyMedium, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.sageDark, marginBottom: 8 },
  finalInsightBody: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
  // Soft callout encouraging full assessments post-onboarding.
  deeperPrompt: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16 },
  deeperPromptLabel: { fontFamily: Fonts.bodyMedium, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 8 },
  deeperPromptBody: { fontFamily: Fonts.body, fontSize: 14, color: Colors.warmBrown, lineHeight: 22 },
  deeperPromptHi: { fontFamily: Fonts.bodyMedium, color: Colors.sageDark },
  // Consent gate — paddingTop bumped 24 → 32 for breathing room
  // before the BEFORE WE BEGIN tag. Tag and h1 sizes already match
  // the rest of the flow's tokens; tweaked sub size up to 15 for
  // readability parity with stepSub.
  consentScroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
  consentTag: { fontFamily: Fonts.bodyMedium, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: Colors.sage, marginBottom: 12 },
  consentH: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, lineHeight: 34, marginBottom: 12 },
  consentSub: { fontFamily: Fonts.body, fontSize: 15, color: Colors.warmBrown, lineHeight: 22, marginBottom: 28 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, padding: 16, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.lg, marginBottom: 12 },
  consentRowChecked: { borderColor: Colors.sage, backgroundColor: '#ffffff' },
  consentCheckbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.sand, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  consentCheckboxChecked: { borderColor: Colors.sage, backgroundColor: Colors.sage },
  consentCheckMark: { color: '#ffffff', fontSize: 14, fontFamily: Fonts.bodyMedium, lineHeight: 16 },
  consentRowLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.charcoal, marginBottom: 4, lineHeight: 20 },
  consentRowSub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 20 },
  consentLink: { color: Colors.sageDark, textDecorationLine: 'underline' },
  consentFooter: { marginTop: 24 },
  consentFinePrint: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, lineHeight: 18, textAlign: 'center', marginTop: 16 },
  // Footer: 24 horizontal to match stepWrap; extra bottom padding so
  // the Back link doesn't sit flush against the safe-area edge.
  footer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
});
