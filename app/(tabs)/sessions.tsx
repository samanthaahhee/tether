import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Modal, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
let ExpoSpeechRecognitionModule: any = null;
try {
  const speech = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = speech.ExpoSpeechRecognitionModule;
} catch {
  // Native module not available (e.g. Expo Go)
}
import { useAppState, Message, Session } from '../../src/hooks/useAppState';
import { useClaude } from '../../src/hooks/useClaude';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { MODE_CONFIG, ModeKey, SESSION_STEPS, CRISIS_WORDS, REPAIR_ATTEMPTS } from '../../src/constants/data';
import { Button } from '../../src/components/UI';
import { ChevronLeft } from '../../src/components/Icon';
import { IconLeaf, IconWind, IconSearch, IconHeart, IconX, IconBookmark, IconMoodLow, IconMoodOkay, IconMoodGood, IconMoodGreat, IconMoodAmazing } from '../../src/components/Icons';

const STEP_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  wind: IconWind,
  search: IconSearch,
  leaf: IconLeaf,
  heart: IconHeart,
};

function MicIcon() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 10, height: 16, borderRadius: 5, backgroundColor: Colors.sage, marginBottom: 2 }} />
      <View style={{ width: 16, height: 8, borderRadius: 8, borderWidth: 2, borderColor: Colors.sage, borderTopWidth: 0, backgroundColor: 'transparent' }} />
      <View style={{ width: 2, height: 4, backgroundColor: Colors.sage }} />
    </View>
  );
}

// Full color theme per step — drives every UI element in the session
const STEP_THEME: Record<ModeKey, {
  color: string;       // primary text/icon color (dark)
  mid: string;         // medium shade for borders, outlines
  light: string;       // light shade for subtle backgrounds
  pale: string;        // palest shade for full-screen bg
  gradient: [string, string, string]; // gradient stops
}> = {
  vent: {
    color: '#6E9B72',    // sage-dark
    mid: '#9BBF9E',      // sage-400
    light: '#C8E0CA',    // sage-light
    pale: '#E4F0E5',     // sage-pale
    gradient: ['#E4F0E5', '#EFF7F0', '#FDFBF7'],
  },
  understand: {
    color: '#8B6FC0',    // mauve-dark
    mid: '#B49EDE',      // mauve-400
    light: '#DCD0F0',    // mauve-light
    pale: '#F0ECF8',     // mauve-pale
    gradient: ['#F0ECF8', '#F6F3FC', '#FDFBF7'],
  },
  prepare: {
    color: '#5B78B5',    // blue-dark
    mid: '#8BA4D4',      // blue-400
    light: '#C5D3EC',    // blue-light
    pale: '#E8EEF8',     // blue-pale
    gradient: ['#E8EEF8', '#F0F4FB', '#FDFBF7'],
  },
  bridge: {
    color: '#A8B03A',    // amber-dark
    mid: '#D2D965',      // amber-400
    light: '#E8ECB0',    // amber-light
    pale: '#F5F6E2',     // amber-pale
    gradient: ['#F5F6E2', '#F9FAF0', '#FDFBF7'],
  },
};

// Keep flat lookups for the progress bar
const STEP_COLORS: Record<ModeKey, string> = {
  vent: '#6E9B72',
  understand: '#8B6FC0',
  prepare: '#5B78B5',
  bridge: '#A8B03A',
};

const WELCOMES: Record<ModeKey, (name: string) => string> = {
  vent: (name) => 'Hello' + (name ? ', ' + name : '') + '. This is your private space. Your partner will never see or hear anything you share here. You can type or use the microphone to speak freely. There are no wrong words. What is weighing on you right now?',
  understand: () => 'When you are ready, let us look gently at what has been happening. Often the surface argument points to something deeper: a fear, a need, a longing to feel close. What would you like to explore?',
  prepare: () => 'Now that you understand what is really going on, let us figure out what you want to say. I will help you turn your feelings into clear, fair language your partner can actually hear. What do you want them to understand?',
  bridge: () => 'You are ready. Below is your conversation guide: four tools to help you open well, stay grounded, and close with care. Take a moment to read through them before you begin.',
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

function StepProgressBar({ session, activeTheme, onGoToStep }: { session: Session; activeTheme: typeof STEP_THEME[ModeKey]; onGoToStep: (step: ModeKey) => void }) {
  return (
    <View style={[sp.container, { borderBottomColor: activeTheme.light }]}>
      {SESSION_STEPS.map((step, i) => {
        const isCompleted = session.unlockedSteps.includes(step) && step !== session.currentStep;
        const isCurrent = step === session.currentStep;
        const isLocked = !session.unlockedSteps.includes(step);
        const isTappable = !isLocked && !isCurrent;

        return (
          <React.Fragment key={step}>
            {i > 0 && (
              <View style={[sp.line, {
                backgroundColor: isLocked ? activeTheme.light : isCompleted ? activeTheme.color : activeTheme.mid,
                opacity: isLocked ? 0.5 : 1,
              }]} />
            )}
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 4 }}
              activeOpacity={isTappable ? 0.6 : 1}
              onPress={() => isTappable && onGoToStep(step)}
              disabled={isLocked}
            >
              <View style={[
                sp.node,
                isCompleted && { backgroundColor: activeTheme.color, borderColor: activeTheme.color },
                isCurrent && { backgroundColor: 'transparent', borderColor: activeTheme.color, borderWidth: 2.5 },
                isLocked && { backgroundColor: 'transparent', borderColor: activeTheme.light },
              ]}>
                <Text style={[sp.nodeNum, {
                  color: isCompleted ? Colors.white : isCurrent ? activeTheme.color : activeTheme.light,
                  opacity: isLocked ? 0.6 : 1,
                  fontFamily: isCurrent ? Fonts.bodyMedium : Fonts.body,
                }]}>{i + 1}</Text>
              </View>
              <Text style={[sp.label, {
                color: isCurrent ? activeTheme.color : isCompleted ? activeTheme.color : activeTheme.light,
                fontFamily: isCurrent ? Fonts.bodyMedium : Fonts.body,
                opacity: isLocked ? 0.6 : 1,
              }]}>
                {MODE_CONFIG[step].label}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const sp = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 8, paddingBottom: 14, paddingHorizontal: 16 },
  node: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.sand, alignItems: 'center', justifyContent: 'center' },
  nodeNum: { fontSize: 14 },
  line: { flex: 1, height: 2, marginHorizontal: 2, borderRadius: 1, marginBottom: 18 },
  label: { fontFamily: Fonts.body, fontSize: 9, color: Colors.midBrown, textTransform: 'uppercase', letterSpacing: 0.4 },
});

const REMINDER_OPTIONS = ['Tonight', 'Tomorrow morning', 'This weekend'];

function NurtureCard({ session, dispatch: d, profile, onResolved }: {
  session: Session; dispatch: any; profile: any; onResolved: () => void;
}) {
  const [conversationDone, setConversationDone] = useState(false);
  const [reminderSet, setReminderSet] = useState<string | null>(null);

  const draft = session.nvcDraft || { obs: '', feel: '', need: '', request: '' };

  const obsClean = draft.obs ? (draft.obs.toLowerCase().startsWith('when') ? draft.obs.slice(5).trim() : draft.obs) : '';
  const openingLine = obsClean && draft.feel
    ? `"When ${obsClean}, I felt ${draft.feel}. Can we talk about it?"`
    : '"There is something I have been wanting to share with you. Is now a good time?"';

  const repair = REPAIR_ATTEMPTS[2]; // pause request — most universally useful

  return (
    <View style={nr.container}>
      <Text style={nr.heading}>Before you talk, read this</Text>
      <Text style={nr.sub}>Four tools to help you open well, stay grounded, and close with care. Take a moment with each one.</Text>

      <View style={nr.guideCard}>
        <Text style={nr.guideNum}>1</Text>
        <View style={{ flex: 1 }}>
          <Text style={nr.guideTitle}>Your opening line</Text>
          <Text style={nr.guideBody}>{openingLine}</Text>
          <Text style={nr.guideTip}>Soft start: name the situation, not the person.</Text>
        </View>
      </View>

      <View style={nr.guideCard}>
        <Text style={nr.guideNum}>2</Text>
        <View style={{ flex: 1 }}>
          <Text style={nr.guideTitle}>If things get heated</Text>
          <Text style={nr.guideBody}>"{repair.msg}"</Text>
          <Text style={nr.guideTip}>A pause is not abandonment. Name it clearly.</Text>
        </View>
      </View>

      <View style={nr.guideCard}>
        <Text style={nr.guideNum}>3</Text>
        <View style={{ flex: 1 }}>
          <Text style={nr.guideTitle}>What you need from this conversation</Text>
          <Text style={nr.guideBody}>
            {draft.need
              ? `You need ${draft.need}. Keep returning to this if the conversation drifts.`
              : 'Revisit your Understand step to name what you most need your partner to hear.'}
          </Text>
          <Text style={nr.guideTip}>Your need is the anchor. Stay connected to it.</Text>
        </View>
      </View>

      <View style={nr.guideCard}>
        <Text style={nr.guideNum}>4</Text>
        <View style={{ flex: 1 }}>
          <Text style={nr.guideTitle}>How to close well</Text>
          <Text style={nr.guideBody}>"Thank you for staying in this with me. It means a lot."</Text>
          <Text style={nr.guideTip}>End with gratitude, even if you did not resolve everything. The conversation itself is the repair.</Text>
        </View>
      </View>

      {!reminderSet ? (
        <>
          <Text style={nr.reminderHeading}>Set a reminder</Text>
          <View style={nr.reminderRow}>
            {REMINDER_OPTIONS.map((opt) => (
              <TouchableOpacity key={opt} style={nr.reminderChip} onPress={() => setReminderSet(opt)} activeOpacity={0.8}>
                <Text style={nr.reminderChipText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={nr.reminderSet}>
          <Text style={nr.reminderSetText}>Reminder set for {reminderSet}</Text>
          <TouchableOpacity onPress={() => setReminderSet(null)} activeOpacity={0.7}>
            <Text style={nr.reminderChange}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      {!conversationDone ? (
        <TouchableOpacity style={nr.primaryBtn} onPress={() => setConversationDone(true)} activeOpacity={0.85}>
          <Text style={nr.primaryBtnText}>I have had the conversation</Text>
        </TouchableOpacity>
      ) : (
        <View style={nr.sentRow}>
          <Text style={nr.sentConfirm}>Well done. That took courage.</Text>
          <TouchableOpacity style={nr.resolveBtn} onPress={onResolved} activeOpacity={0.85}>
            <Text style={nr.resolveBtnText}>Complete this session</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const nr = StyleSheet.create({
  container: { flex: 1, margin: 16, padding: 20 },
  heading: { fontFamily: Fonts.display, fontSize: 18, color: Colors.charcoal, marginBottom: 4 },
  sub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 20 },

  // Guide cards
  guideCard: { flexDirection: 'row', gap: 12, backgroundColor: '#FDFBF7', borderWidth: 1, borderColor: '#E8ECB0', borderRadius: Radius.md, padding: 14, marginBottom: 10, alignItems: 'flex-start' },
  guideNum: { fontFamily: Fonts.display, fontSize: 18, color: '#A8B03A', width: 22, flexShrink: 0 },
  guideTitle: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal, marginBottom: 6 },
  guideBody: { fontFamily: Fonts.displayItalic, fontSize: 13, color: Colors.charcoal, lineHeight: 20, marginBottom: 6 },
  guideTip: { fontFamily: Fonts.body, fontSize: 11, color: Colors.midBrown, lineHeight: 16 },

  reminderHeading: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.warmBrown, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 },
  reminderRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  reminderChip: { backgroundColor: '#F5F6E2', borderWidth: 1, borderColor: '#E8ECB0', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 },
  reminderChipText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#A8B03A' },
  reminderSet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F5F6E2', borderWidth: 1, borderColor: '#E8ECB0', borderRadius: Radius.md, padding: 12, marginBottom: 16 },
  reminderSetText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal },
  reminderChange: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown },

  // Shared
  primaryBtn: { backgroundColor: '#A8B03A', borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  primaryBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  sentRow: { marginTop: 4, gap: 10 },
  sentConfirm: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#A8B03A', textAlign: 'center', paddingVertical: 4 },
  resolveBtn: { backgroundColor: Colors.charcoal, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center' },
  resolveBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
});

const PAST_SESSIONS_PREVIEW = 3;

function SessionMenu({ sessionId, status, dispatch: d }: { sessionId: string; status: string; dispatch: any }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(!open)} style={sm.trigger} activeOpacity={0.6} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <View style={sm.dot} />
        <View style={sm.dot} />
        <View style={sm.dot} />
      </TouchableOpacity>
      {open && (
        <View style={sm.menu}>
          {status !== 'archived' && (
            <TouchableOpacity style={sm.menuItem} onPress={() => { setOpen(false); d({ type: 'ARCHIVE_SESSION', sessionId }); }} activeOpacity={0.7}>
              <IconBookmark size={14} color={Colors.midBrown} />
              <Text style={sm.menuText}>Archive</Text>
            </TouchableOpacity>
          )}
          {status === 'archived' && (
            <TouchableOpacity style={sm.menuItem} onPress={() => { setOpen(false); d({ type: 'UNARCHIVE_SESSION', sessionId }); }} activeOpacity={0.7}>
              <IconBookmark size={14} color={Colors.midBrown} />
              <Text style={sm.menuText}>Unarchive</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={sm.menuItem} onPress={() => {
            setOpen(false);
            Alert.alert('Delete session', 'This will permanently remove this session and its data.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => d({ type: 'DELETE_SESSION', sessionId }) },
            ]);
          }} activeOpacity={0.7}>
            <IconX size={14} color={Colors.errorText} />
            <Text style={[sm.menuText, { color: Colors.errorText }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const sm = StyleSheet.create({
  trigger: { flexDirection: 'row', gap: 3, padding: 6 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.lightBrown },
  menu: { position: 'absolute', top: 32, right: 0, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.md, paddingVertical: 4, minWidth: 140, zIndex: 100, ...Shadows.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10 },
  menuText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal },
});

type SessionFilter = 'active' | 'resolved' | 'archived';

function SessionListView({ sessions, dispatch: d, onOpenSession, onStartNew }: { sessions: Session[]; dispatch: any; onOpenSession: (id: string) => void; onStartNew: () => void }) {
  const [showAllPast, setShowAllPast] = useState(false);
  const [filter, setFilter] = useState<SessionFilter>('active');

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const resolvedSessions = sessions.filter((s) => s.status === 'resolved');
  const archivedSessions = sessions.filter((s) => s.status === 'archived');
  const hasSessions = sessions.length > 0;

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
            <Text style={sl.startBody}>Whatever is happening, start here. Tether guides you from raw emotion to resolution, one step at a time.</Text>
            <View style={sl.startCta}>
              <Text style={sl.startCtaText}>Begin →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Filter toggles */}
        {hasSessions && (
          <View style={sf.bar}>
            {([['active', 'Active', activeSessions.length], ['resolved', 'Resolved', resolvedSessions.length], ['archived', 'Archived', archivedSessions.length]] as const).map(([key, label, count]) => (
              count > 0 && (
                <TouchableOpacity key={key} style={[sf.tab, filter === key && sf.tabActive]} onPress={() => setFilter(key)} activeOpacity={0.7}>
                  <Text style={[sf.tabText, filter === key && sf.tabTextActive]}>{label} ({count})</Text>
                </TouchableOpacity>
              )
            ))}
          </View>
        )}

        {/* Active sessions */}
        {filter === 'active' && activeSessions.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
            {activeSessions.map((s) => {
              const firstMsg = s.messages.vent?.[1]?.text?.slice(0, 80) || 'Session in progress...';
              const stepsCompleted = s.unlockedSteps.length;
              const date = new Date(s.startDate);
              const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
              const currentStepCfg = MODE_CONFIG[s.currentStep];
              const stepTheme = STEP_THEME[s.currentStep];
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[sl.sessionCard, { borderColor: Colors.sand, borderWidth: 1 }]}
                  onPress={() => onOpenSession(s.id)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={sl.sessionDate}>{dateStr}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[sl.statusBadge, { backgroundColor: stepTheme.pale, borderColor: stepTheme.light }]}>
                        <Text style={[sl.statusText, { color: stepTheme.color }]}>Active: {currentStepCfg.label}</Text>
                      </View>
                      <SessionMenu sessionId={s.id} status={s.status} dispatch={d} />
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
                  <View style={{ marginTop: 10, backgroundColor: Colors.creamDark, borderRadius: Radius.full, paddingVertical: 8, alignItems: 'center' }}>
                    <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown }}>Continue session →</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {filter === 'resolved' && resolvedSessions.length > 0 && (() => {
          const visible = showAllPast ? resolvedSessions : resolvedSessions.slice(0, PAST_SESSIONS_PREVIEW);
          const hidden = resolvedSessions.length - PAST_SESSIONS_PREVIEW;
          return (
            <View style={{ paddingHorizontal: 20 }}>
              {visible.map((s) => {
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
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[sl.statusBadge, { backgroundColor: Colors.sagePale, borderColor: Colors.sageLight }]}>
                          <Text style={[sl.statusText, { color: Colors.sage }]}>Resolved</Text>
                        </View>
                        <SessionMenu sessionId={s.id} status={s.status} dispatch={d} />
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
              {!showAllPast && hidden > 0 && (
                <TouchableOpacity onPress={() => setShowAllPast(true)} style={sl.showMoreBtn} activeOpacity={0.7}>
                  <Text style={sl.showMoreText}>Show {hidden} more past session{hidden !== 1 ? 's' : ''}</Text>
                </TouchableOpacity>
              )}
              {showAllPast && resolvedSessions.length > PAST_SESSIONS_PREVIEW && (
                <TouchableOpacity onPress={() => setShowAllPast(false)} style={sl.showMoreBtn} activeOpacity={0.7}>
                  <Text style={sl.showMoreText}>Show less</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })()}

        {/* Archived sessions */}
        {filter === 'archived' && archivedSessions.length > 0 && (
          <View style={{ paddingHorizontal: 20 }}>
            {archivedSessions.map((s) => {
              const firstMsg = s.messages.vent?.[1]?.text?.slice(0, 80) || 'No messages recorded';
              const date = new Date(s.startDate);
              const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[sl.sessionCard, { opacity: 0.7 }]}
                  onPress={() => onOpenSession(s.id)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={sl.sessionDate}>{dateStr}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[sl.statusBadge, { backgroundColor: Colors.stone50, borderColor: Colors.stone200 }]}>
                        <Text style={[sl.statusText, { color: Colors.lightBrown }]}>Archived</Text>
                      </View>
                      <SessionMenu sessionId={s.id} status={s.status} dispatch={d} />
                    </View>
                  </View>
                  {s.name ? <Text style={{ fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal, marginBottom: 4 }}>{s.name}</Text> : null}
                  <Text style={sl.sessionPreview} numberOfLines={2}>{firstMsg}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sf = StyleSheet.create({
  bar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand },
  tabActive: { backgroundColor: Colors.sagePale, borderColor: Colors.sageLight },
  tabText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.lightBrown },
  tabTextActive: { color: Colors.sageDark },
});

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
  showMoreBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4, marginBottom: 8 },
  showMoreText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown },
});

const SESSION_CAPTURE = {
  question: 'How are you feeling after this session?',
  options: [
    { Icon: IconMoodLow, label: 'Still hard', score: 1 },
    { Icon: IconMoodOkay, label: 'Same', score: 2 },
    { Icon: IconMoodGood, label: 'A bit better', score: 3 },
    { Icon: IconMoodGreat, label: 'Better', score: 4 },
    { Icon: IconMoodAmazing, label: 'Settled', score: 5 },
  ],
};

function ActiveSessionView({ session, state, dispatch: d, onBack }: { session: Session; state: any; dispatch: any; onBack: () => void }) {
  const [input, setInput] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(session?.name || '');
  const [showCapture, setShowCapture] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const transcriptRef = useRef('');
  const flatRef = useRef<FlatList>(null);
  const step = session.currentStep;
  const cfg = MODE_CONFIG[step];
  const theme = STEP_THEME[step];
  const messages = session.messages[step] || [];

  const { send, summarise, generateMemoryUpdate, generateCheckIn, loading, floodingDetected } = useClaude({
    systemPrompt: cfg.systemPrompt,
    userProfile: {
      name: state.profile.name,
      attachment: state.profile.attachment,
      love: state.profile.love,
      conflict: state.profile.conflict,
      window: state.profile.window,
      need: state.profile.need,
    },
    userMemory: state.userMemory,
  });

  const userMsgCount = useMemo(() => messages.filter((m) => m.role === 'user').length, [messages]);
  const canAdvance = userMsgCount >= MIN_MESSAGES_TO_ADVANCE && SESSION_STEPS.indexOf(step) < SESSION_STEPS.length - 1;
  const isBridgeStep = step === 'bridge';

  useEffect(() => {
    if (messages.length === 0) {
      // For vent step with existing memory, generate a personalised check-in first
      if (step === 'vent' && state.userMemory) {
        const lastSession = state.sessions.find((s: Session) => s.status === 'resolved' && s.summary);
        generateCheckIn(state.userMemory, lastSession?.summary).then((checkIn) => {
          const opening = checkIn
            ? checkIn + '\n\n' + WELCOMES[step](state.profile.name)
            : WELCOMES[step](state.profile.name);
          d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step, message: { role: 'ai', text: opening, id: Date.now().toString() } });
        });
      } else {
        const welcome = WELCOMES[step](state.profile.name);
        d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step, message: { role: 'ai', text: welcome, id: Date.now().toString() } });
      }
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
    const reply = await send(text, history, session.summary);
    d({ type: 'ADD_SESSION_MESSAGE', sessionId: session.id, step, message: { role: 'ai', text: reply, id: (Date.now() + 1).toString() } });

    // Update rolling summary in the background — fire and forget, non-blocking
    const updatedHistory = [...history, { role: 'user' as const, content: text }, { role: 'assistant' as const, content: reply }];
    summarise(updatedHistory, session.summary).then((newSummary) => {
      if (newSummary) d({ type: 'UPDATE_SESSION_SUMMARY', sessionId: session.id, summary: newSummary });
    });
  };

  // Check speech recognition availability and subscribe to events
  useEffect(() => {
    if (!ExpoSpeechRecognitionModule) return;
    ExpoSpeechRecognitionModule.getStateAsync().then(() => setSpeechAvailable(true)).catch(() => setSpeechAvailable(false));

    const subs = [
      ExpoSpeechRecognitionModule.addListener('result', (event: any) => {
        const transcript = event.results?.[0]?.transcript || '';
        if (transcript) {
          const base = transcriptRef.current;
          setInput(base + (base ? ' ' : '') + transcript);
          if (event.isFinal) {
            transcriptRef.current = base + (base ? ' ' : '') + transcript;
          }
        }
      }),
      ExpoSpeechRecognitionModule.addListener('end', () => setIsRecording(false)),
      ExpoSpeechRecognitionModule.addListener('error', () => setIsRecording(false)),
    ];
    return () => subs.forEach((s: any) => s?.remove());
  }, []);

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }

    if (!speechAvailable) {
      Alert.alert('Not available', 'Voice input is not available on this device.');
      return;
    }

    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      Alert.alert('Permission needed', 'Tether needs microphone access for voice input.');
      return;
    }

    transcriptRef.current = input;
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: true,
    });
    setIsRecording(true);
  }, [isRecording, speechAvailable, input]);

  const advanceStep = () => {
    d({ type: 'ADVANCE_STEP', sessionId: session.id });
  };

  const resolveSession = () => {
    setShowCapture(true);
  };

  const commitResolve = (score?: number) => {
    setShowCapture(false);
    if (score !== undefined) {
      d({
        type: 'ADD_EMOTIONAL_CAPTURE',
        capture: {
          id: Date.now().toString(),
          sessionId: session.id,
          date: new Date().toISOString(),
          fromStep: step,
          score,
        },
      });
    }

    const reflection = generateReflection(session, state.profile);
    d({ type: 'RESOLVE_SESSION', sessionId: session.id, reflection });
    d({ type: 'ADD_REFLECTION', reflection: { sessionId: session.id, text: reflection, date: new Date().toISOString() } });

    // Update cross-session memory in background — fire and forget
    if (session.summary) {
      generateMemoryUpdate(session.summary, state.userMemory).then((memory) => {
        if (memory) d({ type: 'UPDATE_USER_MEMORY', memory });
      });
    }

    onBack();
  };

  const goBack = onBack;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cream }}>
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>

        <View style={[styles.sessionHeader, { borderBottomColor: Colors.sand }]}>
          {/* Nav row */}
          <View style={styles.sessionHeaderNav}>
            <TouchableOpacity onPress={goBack} style={styles.sessionBackBtn} activeOpacity={0.7}>
              <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
              <Text style={styles.sessionBackText}>Back</Text>
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
                  style={styles.sessionNameInput}
                />
              ) : (
                <TouchableOpacity onPress={() => { setNameInput(session.name); setEditingName(true); }} activeOpacity={0.7}>
                  <Text style={styles.sessionNameText} numberOfLines={1}>
                    {session.name || 'Tap to name'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{ minWidth: 56 }} />
          </View>

          {/* Step identity */}
          <View style={styles.sessionStepIdentity}>
            {(() => { const I = STEP_ICON_MAP[cfg.emoji]; return I ? <I size={24} color={theme.color} /> : null; })()}
            <Text style={styles.sessionStepName}>{cfg.label}</Text>
          </View>

          {/* Progress nodes */}
          <StepProgressBar session={session} activeTheme={theme} onGoToStep={(s) => d({ type: 'GO_TO_STEP', sessionId: session.id, step: s })} />
        </View>

        {floodingDetected && step === 'vent' && (
          <View style={[styles.floodBanner, { backgroundColor: theme.pale, borderBottomColor: theme.light }]}>
            <Text style={[styles.floodText, { color: theme.color }]}>You seem very activated. A short pause can help.</Text>
          </View>
        )}

        {isBridgeStep ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <NurtureCard session={session} dispatch={d} profile={state.profile} onResolved={resolveSession} />
          </ScrollView>
        ) : (
          <FlatList
            ref={flatRef}
            data={messages}
            keyExtractor={(m) => m.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.msgList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser]}>
                <View style={[styles.msgAvatar, item.role === 'user' && { backgroundColor: theme.light }]}>
                  {item.role === 'ai' ? <IconLeaf size={14} color={theme.color} /> : <Text style={{ fontSize: 13, color: theme.color }}>{state.profile.name?.[0] || '?'}</Text>}
                </View>
                <View style={[styles.msgBubble, item.role === 'user' && { backgroundColor: theme.pale, borderWidth: 1, borderColor: theme.light, borderBottomLeftRadius: 16, borderBottomRightRadius: 4 }]}>
                  <Text style={[styles.msgText, item.role === 'user' && { color: Colors.charcoal }]}>{item.text}</Text>
                </View>
              </View>
            )}
            ListFooterComponent={loading ? (
              <View style={styles.msgRow}>
                <View style={styles.msgAvatar}><IconLeaf size={14} color={theme.color} /></View>
                <View style={styles.msgBubble}><TypingIndicator /></View>
              </View>
            ) : null}
          />
        )}

        {canAdvance && (
          <TouchableOpacity style={[styles.advanceBanner, { backgroundColor: theme.pale, borderColor: theme.light }]} onPress={advanceStep} activeOpacity={0.85}>
            <Text style={[styles.advanceText, { color: theme.color }]}>Ready for the next step? Move to {MODE_CONFIG[SESSION_STEPS[SESSION_STEPS.indexOf(step) + 1]].label} →</Text>
          </TouchableOpacity>
        )}

        {session.status !== 'resolved' && !isBridgeStep && (
          <>
            <View style={styles.inputArea}>
              {userMsgCount === 0 && cfg.quickActions.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qaWrap}>
                  {cfg.quickActions.map((qa) => (
                    <TouchableOpacity key={qa} onPress={() => setInput(qa)} style={[styles.qaPill, { borderColor: theme.light }]}>
                      <Text style={[styles.qaText, { color: theme.color }]} numberOfLines={1}>{qa}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              {isRecording && (
                <View style={styles.recordingBanner}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Listening. Speak freely, your partner will never hear this.</Text>
                </View>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder={step === 'vent' ? "Type or tap the mic to speak freely..." : "Share what is on your heart..."}
                  placeholderTextColor={Colors.lightBrown}
                  style={[styles.input, { borderColor: theme.light }]}
                  multiline
                  blurOnSubmit={false}
                />
                {speechAvailable && (
                  <TouchableOpacity
                    onPress={toggleRecording}
                    style={[styles.micBtn, isRecording && { backgroundColor: theme.color }]}
                    activeOpacity={0.8}
                  >
                    {isRecording
                      ? <View style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: Colors.white }} />
                      : <MicIcon />
                    }
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={sendMessage}
                  disabled={loading || !input.trim()}
                  style={[styles.sendBtn, { backgroundColor: loading || !input.trim() ? Colors.sand : theme.color }]}
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

      {/* Post-session emotional capture modal */}
      <Modal visible={showCapture} transparent animationType="slide" onRequestClose={() => commitResolve()}>
        <View style={cap.overlay}>
          <View style={cap.sheet}>
            <Text style={cap.question}>{SESSION_CAPTURE.question}</Text>
            <View style={cap.optionsRow}>
              {SESSION_CAPTURE.options.map((opt) => (
                <TouchableOpacity key={opt.score} onPress={() => commitResolve(opt.score)} style={cap.optBtn} activeOpacity={0.8}>
                  <opt.Icon size={28} />
                  <Text style={cap.optLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => commitResolve()} style={cap.skipBtn} activeOpacity={0.7}>
              <Text style={cap.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
    </View>
  );
}

function generateReflection(session: Session, profile: any): string {
  const stepsUsed = session.unlockedSteps.length;
  const needLabel = profile.need || '';
  const reachedNurture = session.unlockedSteps.includes('bridge');

  const openers = [
    'You showed up for yourself today.',
    'You did something brave today.',
    'This took courage.',
    'You chose connection over disconnection.',
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  const parts = [opener];

  if (stepsUsed >= 3) {
    parts.push('You moved from raw emotion all the way through to clarity.');
  } else if (stepsUsed >= 2) {
    parts.push('You sat with what you were feeling and started to make sense of it.');
  } else {
    parts.push('Even just naming what you are going through is a step forward.');
  }

  if (needLabel) {
    parts.push(`Underneath it all, you needed to feel ${needLabel}. That matters.`);
  }

  if (reachedNurture) {
    parts.push('You prepared to bring this back to your partner. That is the hardest part, and you did it.');
  }

  return parts.join(' ');
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
  const latestSessionId = state.sessions.length > 0 ? state.sessions[0].id : null;
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

  // Clear viewingId if the session was deleted or archived
  useEffect(() => {
    if (!viewingId) return;
    const s = state.sessions.find((s) => s.id === viewingId);
    if (!s || s.status === 'archived') {
      setViewingId(null);
    }
  }, [state.sessions, viewingId]);

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

  if (viewingId && viewingSession && viewingSession.status !== 'archived') {
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
  sessionHeader: { borderBottomWidth: 1, backgroundColor: Colors.warmWhite },
  sessionHeaderNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 },
  sessionBackBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingRight: 8, minWidth: 56 },
  sessionBackText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.midBrown },
  sessionNameInput: { fontFamily: Fonts.body, fontSize: 12, color: Colors.charcoal, textAlign: 'center', paddingVertical: 2, minWidth: 120 },
  sessionNameText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, textAlign: 'center' },
  sessionStepCounter: { fontFamily: Fonts.bodyMedium, fontSize: 12, minWidth: 56, textAlign: 'right' },
  sessionStepIdentity: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 2 },
  sessionStepName: { fontFamily: Fonts.display, fontSize: 22, color: Colors.charcoal },
  floodBanner: { borderBottomWidth: 1, padding: 10, paddingHorizontal: 16 },
  floodText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown },
  msgList: { paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '88%' },
  msgRowUser: { flexDirection: 'row-reverse', alignSelf: 'flex-end', maxWidth: '88%' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.creamDark, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgBubble: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: 16, borderBottomLeftRadius: 4, padding: 12, maxWidth: '85%' },
  // msgBubbleUser now set inline via theme.color
  msgText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21 },
  qaWrap: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },
  qaPill: { backgroundColor: Colors.white, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, height: 36, justifyContent: 'center' },
  qaText: { fontFamily: Fonts.bodyMedium, fontSize: 12, lineHeight: 16 },
  inputArea: { backgroundColor: Colors.warmWhite, borderTopWidth: 1, borderTopColor: Colors.sand, padding: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, backgroundColor: Colors.cream, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal, maxHeight: 110, minHeight: 44 },
  micBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight },
  recordingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, paddingBottom: 8 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E25555' },
  recordingText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown, flex: 1 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  advanceBanner: { borderWidth: 1, marginHorizontal: 12, marginVertical: 6, borderRadius: Radius.md, padding: 12, alignItems: 'center' },
  advanceText: { fontFamily: Fonts.bodyMedium, fontSize: 13 },
});

const cap = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: Colors.warmWhite, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 44 },
  question: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, textAlign: 'center', marginBottom: 24, lineHeight: 26 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  optBtn: { flex: 1, alignItems: 'center', gap: 6 },
  optEmoji: { fontSize: 30 },
  optLabel: { fontFamily: Fonts.body, fontSize: 10, color: Colors.midBrown, textAlign: 'center' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.lightBrown },
});
