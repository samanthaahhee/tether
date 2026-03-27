import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState, Message, Session } from '../../src/hooks/useAppState';
import { useClaude } from '../../src/hooks/useClaude';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { MODE_CONFIG, ModeKey, SESSION_STEPS, CRISIS_WORDS } from '../../src/constants/data';
import { Button } from '../../src/components/UI';

function MicIcon() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 10, height: 16, borderRadius: 5, backgroundColor: Colors.sage, marginBottom: 2 }} />
      <View style={{ width: 16, height: 8, borderRadius: 8, borderWidth: 2, borderColor: Colors.sage, borderTopWidth: 0, backgroundColor: 'transparent' }} />
      <View style={{ width: 2, height: 4, backgroundColor: Colors.sage }} />
    </View>
  );
}

const STEP_COLORS: Record<ModeKey, string> = {
  vent: Colors.terracotta,
  understand: Colors.gold,
  prepare: Colors.sage,
  bridge: Colors.sage,
};

const WELCOMES: Record<ModeKey, (name: string) => string> = {
  vent: (name) => 'Hello' + (name ? ', ' + name : '') + '. This is your private space — your partner will never see or hear anything you share here. You can type or use the microphone to speak freely. There are no wrong words. What is weighing on you right now?',
  understand: () => 'When you are ready, let us look gently at what has been happening. Often the surface argument is pointing to something deeper — a fear, a need, a longing to feel close. What would you like to explore?',
  prepare: () => 'Let us build something useful together. Whether you want to write a message to your partner, prepare for a difficult conversation, or find a way to repair — what would be most helpful?',
  bridge: () => 'You have done incredible work getting here. Now let us compose a message to your partner using what you have discovered about your feelings and needs.',
};

const MIN_MESSAGES_TO_ADVANCE = 3;

function TypingIndicator() {
  const [dot, setDot] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 3), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={ti.wrap}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[ti.dot, { opacity: dot === i ? 1 : 0.3 }]} />
      ))}
    </View>
  );
}

const ti = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 4, alignItems: 'center', padding: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.sandDark },
});

function StepProgressBar({ session }: { session: Session }) {
  return (
    <View style={sp.container}>
      {SESSION_STEPS.map((step, i) => {
        const cfg = MODE_CONFIG[step];
        const isCompleted = session.unlockedSteps.includes(step) && step !== session.currentStep;
        const isCurrent = step === session.currentStep;
        const isLocked = !session.unlockedSteps.includes(step);
        const color = STEP_COLORS[step];

        return (
          <React.Fragment key={step}>
            {i > 0 && (
              <View style={[sp.line, { backgroundColor: isLocked ? Colors.sand : color, opacity: isLocked ? 0.4 : 0.6 }]} />
            )}
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View style={[
                sp.node,
                isCompleted && { backgroundColor: color, borderColor: color },
                isCurrent && { backgroundColor: cfg.paleBg, borderColor: color, borderWidth: 2.5 },
                isLocked && { backgroundColor: Colors.creamDark, borderColor: Colors.sand },
              ]}>
                <Text style={{ fontSize: 14, opacity: isLocked ? 0.35 : 1 }}>{cfg.emoji}</Text>
              </View>
              <Text style={[sp.label, isCurrent && { color, fontFamily: Fonts.bodyMedium }, isLocked && { opacity: 0.4 }]}>
                {cfg.label}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const sp = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: Colors.warmWhite, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  node: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.sand, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, height: 2, marginHorizontal: 2, borderRadius: 1, marginBottom: 18 },
  label: { fontFamily: Fonts.body, fontSize: 9, color: Colors.midBrown, textTransform: 'uppercase', letterSpacing: 0.4 },
});

function NvcCompose({ session, dispatch: d }: { session: Session; dispatch: any }) {
  const draft = session.nvcDraft || { obs: '', feel: '', need: '', request: '' };
  const update = (field: string, val: string) => {
    d({ type: 'SET_NVC_DRAFT', sessionId: session.id, draft: { ...draft, [field]: val } });
  };

  const sendBridge = () => {
    if (!draft.obs && !draft.feel) {
      Alert.alert('Please add at least an observation and a feeling');
      return;
    }
    const parts: string[] = [];
    if (draft.obs) parts.push('When ' + (draft.obs.toLowerCase().startsWith('when') ? draft.obs.slice(5) : draft.obs));
    if (draft.feel) parts.push('I felt ' + draft.feel);
    if (draft.need) parts.push('because I need ' + draft.need);
    if (draft.request) parts.push(draft.request);
    const msg = parts.join('. ') + '.';

    d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step: 'bridge', message: { role: 'user', text: '📩 Message sent:\n\n' + msg, id: Date.now().toString() } });
    d({ type: 'SET_NVC_DRAFT', sessionId: session.id, draft: { obs: '', feel: '', need: '', request: '' } });
  };

  const fields = [
    { key: 'obs', label: 'Observation — what happened?', placeholder: 'A specific event without judgment...', multiline: true },
    { key: 'feel', label: 'Feeling', placeholder: 'e.g. hurt, scared, lonely...', multiline: false },
    { key: 'need', label: 'Need', placeholder: 'e.g. reassurance, connection...', multiline: false },
    { key: 'request', label: 'Request — one specific ask', placeholder: 'e.g. could we talk for 15 min tonight?', multiline: false },
  ];

  return (
    <View style={nvc.card}>
      <Text style={nvc.title}>Compose your message</Text>
      <Text style={nvc.sub}>Observation — Feeling — Need — Request</Text>
      {fields.map((f) => (
        <View key={f.key} style={{ marginBottom: 12 }}>
          <Text style={nvc.fieldLabel}>{f.label}</Text>
          <TextInput
            value={(draft as any)[f.key]}
            onChangeText={(v) => update(f.key, v)}
            placeholder={f.placeholder}
            placeholderTextColor={Colors.lightBrown}
            style={[nvc.fieldInput, f.multiline && { minHeight: 64, textAlignVertical: 'top' }]}
            multiline={f.multiline}
          />
        </View>
      ))}
      <Button label="Send message" onPress={sendBridge} variant="primary" fullWidth />
    </View>
  );
}

const nvc = StyleSheet.create({
  card: { margin: 16, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 16 },
  title: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4 },
  sub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginBottom: 16 },
  fieldLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.warmBrown, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: { backgroundColor: Colors.cream, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 10, fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal },
});

function SessionListView({ sessions, dispatch: d, onOpenSession, onStartNew }: { sessions: Session[]; dispatch: any; onOpenSession: (id: string) => void; onStartNew: () => void }) {

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20, paddingBottom: 12 }}>
          <Text style={styles.headerTitle}>Sessions</Text>
          <Text style={styles.headerSub}>Each session guides you from emotion to resolution.</Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity style={sl.startBtn} onPress={onStartNew} activeOpacity={0.88}>
            <View style={sl.startBlob} />
            <Text style={sl.startTag}>NEW SESSION</Text>
            <Text style={sl.startTitle}>Start a new session</Text>
            <Text style={sl.startBody}>Whatever is happening — begin here. Tether will guide you from venting to resolution, step by step.</Text>
            <View style={sl.startCta}>
              <Text style={sl.startCtaText}>Begin →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {sessions.filter((s) => s.status === 'active').length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
            <Text style={styles.sectionLabel}>ACTIVE SESSIONS</Text>
            {sessions.filter((s) => s.status === 'active').map((s) => {
              const firstMsg = s.messages.vent?.[1]?.text?.slice(0, 80) || 'Session in progress...';
              const stepsCompleted = s.unlockedSteps.length;
              const date = new Date(s.startDate);
              const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
              const currentStepCfg = MODE_CONFIG[s.currentStep];
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[sl.sessionCard, { borderColor: Colors.terracottaLight, borderWidth: 1.5 }]}
                  onPress={() => onOpenSession(s.id)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={sl.sessionDate}>{dateStr}</Text>
                    <View style={sl.statusBadge}>
                      <Text style={sl.statusText}>Active — {currentStepCfg.label}</Text>
                    </View>
                  </View>
                  {s.name ? <Text style={{ fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4 }}>{s.name}</Text> : null}
                  <Text style={sl.sessionPreview} numberOfLines={2}>{firstMsg}</Text>
                  <View style={sl.stepDots}>
                    {SESSION_STEPS.map((step) => (
                      <View key={step} style={[sl.stepDot, s.unlockedSteps.includes(step) && { backgroundColor: STEP_COLORS[step] }]} />
                    ))}
                    <Text style={sl.stepCount}>{stepsCompleted}/{SESSION_STEPS.length} steps</Text>
                  </View>
                  <View style={{ marginTop: 10, backgroundColor: Colors.terracottaPale, borderRadius: Radius.full, paddingVertical: 8, alignItems: 'center' }}>
                    <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.terracotta }}>Continue session →</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {sessions.filter((s) => s.status === 'resolved').length > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.sectionLabel}>PAST SESSIONS</Text>
            {sessions.filter((s) => s.status === 'resolved').map((s) => {
              const firstMsg = s.messages.vent?.[1]?.text?.slice(0, 80) || 'No messages recorded';
              const stepsCompleted = s.unlockedSteps.length;
              const date = new Date(s.startDate);
              const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
              return (
                <TouchableOpacity
                  key={s.id}
                  style={sl.sessionCard}
                  onPress={() => onOpenSession(s.id)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={sl.sessionDate}>{dateStr}</Text>
                    <View style={[sl.statusBadge, { backgroundColor: Colors.sagePale, borderColor: Colors.sageLight }]}>
                      <Text style={[sl.statusText, { color: Colors.sage }]}>Resolved</Text>
                    </View>
                  </View>
                  {s.name ? <Text style={{ fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4 }}>{s.name}</Text> : null}
                  <Text style={sl.sessionPreview} numberOfLines={2}>{firstMsg}</Text>
                  <View style={sl.stepDots}>
                    {SESSION_STEPS.map((step) => (
                      <View key={step} style={[sl.stepDot, s.unlockedSteps.includes(step) && { backgroundColor: STEP_COLORS[step] }]} />
                    ))}
                    <Text style={sl.stepCount}>{stepsCompleted}/{SESSION_STEPS.length} steps</Text>
                  </View>
                  {s.reflection && (
                    <Text style={{ fontFamily: Fonts.body, fontSize: 12, color: Colors.sage, marginTop: 8, fontStyle: 'italic' }} numberOfLines={2}>
                      {s.reflection}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sl = StyleSheet.create({
  startBtn: { backgroundColor: Colors.terracotta, borderRadius: Radius.lg, padding: 20, overflow: 'hidden', ...Shadows.terracotta },
  startBlob: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' },
  startTag: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  startTitle: { fontFamily: Fonts.display, fontSize: 22, color: Colors.white, marginBottom: 8 },
  startBody: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.88)', lineHeight: 21, marginBottom: 16 },
  startCta: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderRadius: Radius.full, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start' },
  startCtaText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },
  sessionCard: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 12 },
  sessionDate: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown },
  statusBadge: { backgroundColor: Colors.terracottaPale, borderWidth: 1, borderColor: Colors.terracottaLight, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.terracotta, textTransform: 'uppercase', letterSpacing: 0.4 },
  sessionPreview: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown, lineHeight: 19, marginBottom: 10 },
  stepDots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.sand },
  stepCount: { fontFamily: Fonts.body, fontSize: 11, color: Colors.lightBrown, marginLeft: 4 },
});

function ActiveSessionView({ session, state, dispatch: d, onBack }: { session: Session; state: any; dispatch: any; onBack: () => void }) {
  const [input, setInput] = useState('');
  const [showNvc, setShowNvc] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(session.name);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const flatRef = useRef<FlatList>(null);
  const step = session.currentStep;
  const cfg = MODE_CONFIG[step];
  const messages = session.messages[step] || [];

  const { send, loading, floodingDetected } = useClaude({
    systemPrompt: cfg.systemPrompt,
    userProfile: {
      name: state.profile.name,
      attachment: state.profile.attachment,
      love: state.profile.love,
      conflict: state.profile.conflict,
      window: state.profile.window,
      need: state.profile.need,
    },
  });

  const userMsgCount = useMemo(() => messages.filter((m) => m.role === 'user').length, [messages]);
  const canAdvance = userMsgCount >= MIN_MESSAGES_TO_ADVANCE && SESSION_STEPS.indexOf(step) < SESSION_STEPS.length - 1;
  const isBridgeStep = step === 'bridge';
  const bridgeMessageSent = isBridgeStep && messages.some((m) => m.text.startsWith('📩'));

  useEffect(() => {
    if (messages.length === 0) {
      const welcome = WELCOMES[step](state.profile.name);
      d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step, message: { role: 'ai', text: welcome, id: Date.now().toString() } });
    }
  }, [step]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const lower = text.toLowerCase();
    const isCrisis = CRISIS_WORDS.some((w) => lower.includes(w));
    if (isCrisis) {
      Alert.alert(
        'You are not alone',
        'It sounds like you may be going through something serious. Please reach out:\n\nLifeline SA: 0800 567 567\nSA DSD: 116',
        [{ text: 'I am okay, continue', style: 'cancel' }]
      );
    }

    const userMsg: Message = { role: 'user', text, id: Date.now().toString() };
    d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step, message: userMsg });

    const history = messages.map((m) => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.text,
    }));
    const reply = await send(text, history);
    d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step, message: { role: 'ai', text: reply, id: (Date.now() + 1).toString() } });
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Alert.alert('Not supported', 'Voice input is not supported in this browser. Please type your message instead.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = input;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
          setInput(finalTranscript);
        } else {
          interim += transcript;
          setInput(finalTranscript + (finalTranscript ? ' ' : '') + interim);
        }
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const advanceStep = () => {
    d({ type: 'ADVANCE_STEP', sessionId: session.id });
  };

  const resolveSession = () => {
    const reflection = generateReflection(session, state.profile);
    d({ type: 'RESOLVE_SESSION', sessionId: session.id, reflection });
    d({ type: 'ADD_REFLECTION', reflection: { sessionId: session.id, text: reflection, date: new Date().toISOString() } });
    onBack();
  };

  const goBack = onBack;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 4 }}>
          <TouchableOpacity onPress={goBack} style={{ padding: 8 }}>
            <Text style={{ fontFamily: Fonts.body, fontSize: 14, color: Colors.terracotta }}>← Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {editingName ? (
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                onBlur={() => { d({ type: 'RENAME_SESSION', sessionId: session.id, name: nameInput }); setEditingName(false); }}
                onSubmitEditing={() => { d({ type: 'RENAME_SESSION', sessionId: session.id, name: nameInput }); setEditingName(false); }}
                autoFocus
                placeholder="Name this session..."
                placeholderTextColor={Colors.lightBrown}
                style={{ fontFamily: Fonts.display, fontSize: 15, color: Colors.charcoal, textAlign: 'center', paddingVertical: 4, minWidth: 150 }}
              />
            ) : (
              <TouchableOpacity onPress={() => { setNameInput(session.name); setEditingName(true); }}>
                <Text style={{ fontFamily: Fonts.display, fontSize: 15, color: session.name ? Colors.charcoal : Colors.lightBrown }}>
                  {session.name || 'Tap to name session'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{ width: 60 }} />
        </View>

        <StepProgressBar session={session} />

        <View style={[styles.modeBanner, { backgroundColor: cfg.paleBg, borderBottomColor: cfg.borderColor }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerStep, { color: cfg.color }]}>{cfg.stepLabel}</Text>
            <Text style={styles.bannerTitle}>{cfg.stepTitle}</Text>
            <Text style={styles.bannerDesc}>{cfg.stepDesc}</Text>
          </View>
        </View>

        {floodingDetected && step === 'vent' && (
          <View style={styles.floodBanner}>
            <Text style={styles.floodText}>💛 You seem very activated. A short pause can help.</Text>
          </View>
        )}

        {isBridgeStep && !showNvc && (
          <TouchableOpacity
            style={{ margin: 12, backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.md, padding: 12, alignItems: 'center' }}
            onPress={() => setShowNvc(true)}
          >
            <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.sage }}>Open message composer</Text>
          </TouchableOpacity>
        )}

        {isBridgeStep && showNvc && <NvcCompose session={session} dispatch={d} />}

        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser]}>
              <View style={[styles.msgAvatar, item.role === 'user' && styles.msgAvatarUser]}>
                <Text style={{ fontSize: 13 }}>{item.role === 'ai' ? '🌿' : (state.profile.name?.[0] || '?')}</Text>
              </View>
              <View style={[styles.msgBubble, item.role === 'user' && styles.msgBubbleUser]}>
                <Text style={[styles.msgText, item.role === 'user' && { color: Colors.white }]}>{item.text}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={loading ? (
            <View style={styles.msgRow}>
              <View style={styles.msgAvatar}><Text style={{ fontSize: 13 }}>🌿</Text></View>
              <View style={styles.msgBubble}><TypingIndicator /></View>
            </View>
          ) : null}
        />

        {canAdvance && (
          <TouchableOpacity style={styles.advanceBanner} onPress={advanceStep} activeOpacity={0.85}>
            <Text style={styles.advanceText}>Ready for the next step? Move to {MODE_CONFIG[SESSION_STEPS[SESSION_STEPS.indexOf(step) + 1]].label} →</Text>
          </TouchableOpacity>
        )}

        {bridgeMessageSent && (
          <TouchableOpacity style={styles.resolveBanner} onPress={resolveSession} activeOpacity={0.85}>
            <Text style={styles.resolveText}>Mark session as resolved ✓</Text>
          </TouchableOpacity>
        )}

        {session.status !== 'resolved' && (
          <>
            <View style={styles.qaWrap}>
              {cfg.quickActions.map((qa) => (
                <TouchableOpacity key={qa} onPress={() => setInput(qa)} style={styles.qaPill}>
                  <Text style={styles.qaText}>{qa}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputArea}>
              {isRecording && (
                <View style={styles.recordingBanner}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Listening — speak freely, your partner will never hear this</Text>
                </View>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder={step === 'vent' ? "Type or tap the mic to speak freely..." : "Share what is on your heart..."}
                  placeholderTextColor={Colors.lightBrown}
                  style={styles.input}
                  multiline
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={toggleRecording}
                  style={[styles.micBtn, isRecording && { backgroundColor: Colors.terracotta }]}
                  activeOpacity={0.8}
                >
                  {isRecording
                    ? <View style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: Colors.white }} />
                    : <MicIcon />
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={sendMessage}
                  disabled={loading || !input.trim()}
                  style={[styles.sendBtn, { backgroundColor: loading || !input.trim() ? Colors.sand : Colors.terracotta }]}
                  activeOpacity={0.8}
                >
                  {loading
                    ? <ActivityIndicator color={Colors.white} size="small" />
                    : <Text style={{ color: Colors.white, fontSize: 18, fontFamily: Fonts.bodyMedium }}>↑</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function generateReflection(session: Session, profile: any): string {
  const ventMsgs = session.messages.vent?.filter((m) => m.role === 'user').map((m) => m.text).join(' ') || '';
  const attachLabel = profile.attachment || 'unknown';
  const needLabel = profile.need || 'unspoken';
  const stepsUsed = session.unlockedSteps.length;

  return `In this session, you moved through ${stepsUsed} steps of your journey. ` +
    `Your ${attachLabel} attachment pattern was likely activated — ` +
    `the core need underneath was to feel ${needLabel}. ` +
    `You processed your emotions, explored what was really happening, and took action toward repair. ` +
    `This is meaningful growth — each session like this builds emotional resilience and deepens your understanding of yourself in relationship.`;
}

export default function SessionsTab() {
  const { state, dispatch } = useAppState();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const viewingSession = viewingId ? state.sessions.find((s) => s.id === viewingId) : null;

  const openSession = (id: string) => setViewingId(id);
  const closeSession = () => setViewingId(null);

  const promptNewSession = () => {
    setNewSessionName('');
    setShowNamePrompt(true);
  };

  const confirmNewSession = () => {
    dispatch({ type: 'CREATE_SESSION' });
    setShowNamePrompt(false);
  };

  // After CREATE_SESSION, the newest session is at index 0
  // Watch for new sessions and auto-open them, then set the name
  const latestSessionId = state.sessions[0]?.id;
  const prevLatestRef = useRef(latestSessionId);
  useEffect(() => {
    if (latestSessionId && latestSessionId !== prevLatestRef.current) {
      if (newSessionName.trim()) {
        dispatch({ type: 'RENAME_SESSION', sessionId: latestSessionId, name: newSessionName.trim() });
      }
      setViewingId(latestSessionId);
      setNewSessionName('');
    }
    prevLatestRef.current = latestSessionId;
  }, [latestSessionId]);

  if (showNamePrompt) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
          <Text style={{ fontFamily: Fonts.display, fontSize: 24, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 }}>
            Name your session
          </Text>
          <Text style={{ fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
            Give this session a name so you can find it later. Or skip to start right away.
          </Text>
          <TextInput
            value={newSessionName}
            onChangeText={setNewSessionName}
            placeholder="e.g. The dinner argument, Feeling distant..."
            placeholderTextColor={Colors.lightBrown}
            autoFocus
            style={{
              backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand,
              borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 14,
              fontFamily: Fonts.body, fontSize: 16, color: Colors.charcoal, marginBottom: 20,
            }}
          />
          <TouchableOpacity
            style={{ backgroundColor: Colors.terracotta, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginBottom: 12, ...Shadows.terracotta }}
            onPress={confirmNewSession}
            activeOpacity={0.85}
          >
            <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white }}>
              {newSessionName.trim() ? 'Start session' : 'Skip and start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowNamePrompt(false)} style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (viewingSession) {
    return <ActiveSessionView session={viewingSession} state={state} dispatch={dispatch} onBack={closeSession} />;
  }

  return <SessionListView sessions={state.sessions} dispatch={dispatch} onOpenSession={openSession} onStartNew={promptNewSession} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  headerTitle: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 6 },
  headerSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  sectionLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 14 },
  modeBanner: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  bannerStep: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2 },
  bannerTitle: { fontFamily: Fonts.display, fontSize: 15, color: Colors.charcoal, marginBottom: 2 },
  bannerDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown },
  floodBanner: { backgroundColor: Colors.terracottaPale, borderBottomWidth: 1, borderBottomColor: Colors.terracottaLight, padding: 10, paddingHorizontal: 16 },
  floodText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown },
  msgList: { paddingHorizontal: 16, paddingVertical: 14, gap: 12, flexGrow: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '88%' },
  msgRowUser: { flexDirection: 'row-reverse', alignSelf: 'flex-end', maxWidth: '88%' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.terracottaPale, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgAvatarUser: { backgroundColor: Colors.sagePale },
  msgBubble: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: 16, borderBottomLeftRadius: 4, padding: 12, maxWidth: '85%' },
  msgBubbleUser: { backgroundColor: Colors.terracotta, borderWidth: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 4 },
  msgText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21 },
  qaWrap: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 6, paddingTop: 6, gap: 6, flexWrap: 'wrap' },
  qaPill: { backgroundColor: Colors.cream, borderWidth: 1, borderColor: Colors.sandDark, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  qaText: { fontFamily: Fonts.body, fontSize: 11, color: Colors.warmBrown },
  inputArea: { backgroundColor: Colors.warmWhite, borderTopWidth: 1, borderTopColor: Colors.sand, padding: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, backgroundColor: Colors.cream, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal, maxHeight: 110, minHeight: 44 },
  micBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight },
  recordingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, paddingBottom: 8 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E25555' },
  recordingText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown, flex: 1 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', ...Shadows.terracotta },
  advanceBanner: { backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, marginHorizontal: 12, marginVertical: 6, borderRadius: Radius.md, padding: 12, alignItems: 'center' },
  advanceText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.sage },
  resolveBanner: { backgroundColor: Colors.sage, marginHorizontal: 12, marginVertical: 6, borderRadius: Radius.md, padding: 14, alignItems: 'center', ...Shadows.sm },
  resolveText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
});
