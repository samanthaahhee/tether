import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Image,
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
import { IconLeaf, IconWind, IconSearch, IconHeart, IconX, IconBookmark, IconVoice, IconMoodLow, IconMoodOkay, IconMoodGood, IconMoodGreat, IconMoodAmazing } from '../../src/components/Icons';

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
  color: string;       // primary accent color
  mid: string;         // medium shade for progress nodes
  light: string;       // light shade for borders/outlines
  pale: string;        // pastel bg for user bubbles
  gradient: [string, string, string]; // gradient stops (unused in new design)
}> = {
  vent: {
    color: '#96d35f',    // lime green (from redesign screenshot)
    mid: '#96d35f',
    light: '#dfffbc',
    pale: '#eaf4cf',     // pastel sage for user bubbles
    gradient: ['#eaf4cf', '#f7f5fd', '#fbf9ff'],
  },
  understand: {
    color: '#92a6f4',    // blue/periwinkle
    mid: '#92a6f4',
    light: '#c3cefc',
    pale: '#e7ecff',     // pastel lavender for user bubbles
    gradient: ['#e7ecff', '#f7f5fd', '#fbf9ff'],
  },
  prepare: {
    color: '#f67700',    // orange for text/accents
    mid: '#f6b756',      // lighter warm orange for step nodes
    light: '#ffd692',
    pale: '#ffe9bf',     // pastel orange for user bubbles
    gradient: ['#ffe9bf', '#f7f5fd', '#fbf9ff'],
  },
  bridge: {
    color: '#af30dc',    // purple 500
    mid: '#d484ff',      // purple 300 for progress nodes
    light: '#ebb0ff',
    pale: '#fdeaff',     // pastel purple for user bubbles / button bg
    gradient: ['#fdeaff', '#f7f5fd', '#fbf9ff'],
  },
};

// Flat color lookups for step dots and progress bar
const STEP_COLORS: Record<ModeKey, string> = {
  vent: '#5dcca3',
  understand: '#92a6f4',
  prepare: '#ffbb55',
  bridge: '#d484ff',
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
    <View style={sp.container}>
      {/* Top row: nodes + gradient lines, no gaps */}
      <View style={sp.nodesRow}>
        {SESSION_STEPS.map((step, i) => {
          const isCompleted = session.unlockedSteps.includes(step) && step !== session.currentStep;
          const isCurrent = step === session.currentStep;
          const isLocked = !session.unlockedSteps.includes(step);
          const isActive = isCompleted || isCurrent;
          // Determine the line color: gradient from prev step color to white
          const prevStep = i > 0 ? SESSION_STEPS[i - 1] : null;
          const prevCompleted = prevStep ? session.unlockedSteps.includes(prevStep) : false;
          const lineActive = prevCompleted || isCurrent || isCompleted;

          return (
            <React.Fragment key={step}>
              {i > 0 && (
                <LinearGradient
                  colors={lineActive ? [activeTheme.color, '#dedde8'] : ['#dedde8', '#dedde8']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={sp.line}
                />
              )}
              <TouchableOpacity
                activeOpacity={(!isLocked && !isCurrent) ? 0.6 : 1}
                onPress={() => (!isLocked && !isCurrent) && onGoToStep(step)}
                disabled={isLocked}
              >
                <View style={[
                  sp.node,
                  (isCurrent || isCompleted) && { backgroundColor: '#ffffff', borderWidth: 2, borderColor: activeTheme.mid || activeTheme.color },
                  isLocked && { backgroundColor: '#eeebf4' },
                ]}>
                  <Text style={[sp.nodeNum, {
                    color: (isCurrent || isCompleted) ? (activeTheme.mid || activeTheme.color) : '#80798c',
                  }]}>{i + 1}</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const sp = StyleSheet.create({
  container: { paddingTop: 6, paddingBottom: 8, paddingHorizontal: 60, width: '100%' },
  nodesRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  node: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eeebf4', alignItems: 'center', justifyContent: 'center' },
  nodeNum: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#80798c' },
  line: { flex: 1, height: 3, minWidth: 20 },
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
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={nr.guideNum}>1</Text>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={nr.guideTitle}>Your opening line</Text>
            <Text style={nr.guideBody}>{openingLine}</Text>
          </View>
        </View>
      </View>

      <View style={nr.guideCard}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={nr.guideNum}>2</Text>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={nr.guideTitle}>If things get heated</Text>
            <Text style={nr.guideBody}>{repair.msg}</Text>
          </View>
        </View>
      </View>

      <View style={nr.guideCard}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={nr.guideNum}>3</Text>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={nr.guideTitle}>What you need</Text>
            <Text style={nr.guideBody}>
              {draft.need
                ? `You need ${draft.need}. Keep returning to this.`
                : 'Revisit your Understand step to name what you most need your partner to hear.'}
            </Text>
          </View>
        </View>
      </View>

      <View style={nr.guideCard}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={nr.guideNum}>4</Text>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={nr.guideTitle}>How to close well</Text>
            <Text style={nr.guideBody}>Thank you for staying in this with me. It means a lot.</Text>
          </View>
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
  heading: { fontFamily: Fonts.displaySemiBold, fontSize: 18, color: Colors.charcoal, marginBottom: 4 },
  sub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 20 },

  // Guide cards — white card with purple numbers (matching Figma)
  guideCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 16, marginBottom: 10, ...Shadows.xs },
  guideNum: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#af30dc', width: 17, flexShrink: 0 },
  guideTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#af30dc', marginBottom: 8 },
  guideBody: { fontFamily: Fonts.body, fontSize: 14, color: '#211e28', lineHeight: 21 },
  guideTip: { fontFamily: Fonts.body, fontSize: 11, color: '#80798c', lineHeight: 16 },

  reminderHeading: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.warmBrown, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 14, marginBottom: 8 },
  reminderRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  reminderChip: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#dedde8', borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8 },
  reminderChipText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#211e28' },
  reminderSet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fdeaff', borderWidth: 1, borderColor: '#dedde8', borderRadius: Radius.md, padding: 12, marginBottom: 16 },
  reminderSetText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#211e28' },
  reminderChange: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#80798c' },

  // Primary action button — green
  primaryBtn: { backgroundColor: '#96d35f', borderRadius: 9999, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  primaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#001c14' },
  sentRow: { marginTop: 4, gap: 10 },
  sentConfirm: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#af30dc', textAlign: 'center', paddingVertical: 4 },
  resolveBtn: { backgroundColor: Colors.charcoal, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center' },
  resolveBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
});

const PAST_SESSIONS_PREVIEW = 3;

function SessionMenu({ sessionId, status, dispatch: d, onDelete }: { sessionId: string; status: string; dispatch: any; onDelete?: () => void }) {
  // haptic on menu open handled inline
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => {setOpen(!open); }} style={sm.trigger} activeOpacity={0.6} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
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
            if (Platform.OS === 'web') {
              if (confirm('Delete this session? This cannot be undone.')) {
                d({ type: 'DELETE_SESSION', sessionId });
                if (onDelete) onDelete();
              }
            } else {
              Alert.alert('Delete session', 'This will permanently remove this session and its data.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { d({ type: 'DELETE_SESSION', sessionId }); if (onDelete) onDelete(); } },
              ]);
            }
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

function SessionListView({ sessions, dispatch: d, onOpenSession, onStartNew, onDeleteSession }: { sessions: Session[]; dispatch: any; onOpenSession: (id: string) => void; onStartNew: () => void; onDeleteSession: () => void }) {
  const [showAllPast, setShowAllPast] = useState(false);
  const [filter, setFilter] = useState<SessionFilter>('active');

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const resolvedSessions = sessions.filter((s) => s.status === 'resolved');
  const archivedSessions = sessions.filter((s) => s.status === 'archived');
  const hasSessions = sessions.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* New Session CTA card — white card matching Figma */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, marginBottom: 24 }}>
          <View style={sl.startCard}>
            <Text style={sl.startTag}>SHARE YOUR FEELINGS</Text>
            <Text style={sl.startTitle}>Start a new session</Text>
            <Text style={sl.startBody}>Whatever is happening, start here.{'\n'}Your partner will never see what you say or hear how you feel. This is a safe place to say whats on your mind.</Text>
            <TouchableOpacity style={sl.startBtn} onPress={onStartNew} activeOpacity={0.85}>
              <Text style={sl.startBtnText}>Let's get started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Sessions heading + filter chips */}
        <View style={{ paddingHorizontal: 16, marginBottom: 10, gap: 10 }}>
          <Text style={sl.sessionsHeading}>Your Sessions</Text>
          <View style={sf.bar}>
            {([['active', 'Active', activeSessions.length], ['resolved', 'Completed', resolvedSessions.length], ['archived', 'Archived', archivedSessions.length]] as const).map(([key, label, count]) => (
              <TouchableOpacity key={key} style={[sf.tab, filter === key && sf.tabActive]} onPress={() => setFilter(key)} activeOpacity={0.7}>
                <Text style={[sf.tabText, filter === key && sf.tabTextActive]}>{filter === key && count > 0 ? `${label} (${count})` : label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Active sessions */}
        {filter === 'active' && activeSessions.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            {activeSessions.map((s) => {
              const firstMsg = s.name || s.messages.vent?.[1]?.text?.slice(0, 80) || 'Session in progress...';
              const stepsCompleted = s.unlockedSteps.length;
              const date = new Date(s.startDate);
              const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }).toUpperCase();
              const currentStepCfg = MODE_CONFIG[s.currentStep];
              // Step badge colors from Figma
              const BADGE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
                vent: { bg: '#e8f7d6', border: '#96d35f', text: '#5a8a2f' },
                understand: { bg: '#e3e8fa', border: '#92a6f4', text: '#5877ee' },
                prepare: { bg: '#fde8cc', border: '#f6b756', text: '#c76800' },
                bridge: { bg: '#f0dcfa', border: '#d484ff', text: '#9020c0' },
              };
              const badge = BADGE_COLORS[s.currentStep] || BADGE_COLORS.vent;
              return (
                <View key={s.id} style={sl.sessionCard}>
                  {/* Date + badge + menu */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={sl.sessionDate}>{dateStr}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[sl.statusBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                        <Text style={[sl.statusText, { color: badge.text }]}>{currentStepCfg.label}</Text>
                      </View>
                      <SessionMenu sessionId={s.id} status={s.status} dispatch={d} onDelete={onDeleteSession} />
                    </View>
                  </View>
                  {/* Session name */}
                  <Text style={sl.sessionName}>{firstMsg}</Text>
                  {/* Step dots */}
                  <View style={sl.stepDotsRow}>
                    <View style={sl.stepDots}>
                      {SESSION_STEPS.map((step) => (
                        <View key={step} style={[sl.stepDot, s.unlockedSteps.includes(step) && { backgroundColor: STEP_COLORS[step] }]} />
                      ))}
                    </View>
                    <Text style={sl.stepCount}>{stepsCompleted}/{SESSION_STEPS.length} steps</Text>
                  </View>
                  {/* Continue button */}
                  <TouchableOpacity style={sl.continueBtn} onPress={() => onOpenSession(s.id)} activeOpacity={0.8}>
                    <Text style={sl.continueBtnText}>Continue session</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {filter === 'resolved' && resolvedSessions.length > 0 && (() => {
          const visible = showAllPast ? resolvedSessions : resolvedSessions.slice(0, PAST_SESSIONS_PREVIEW);
          const hidden = resolvedSessions.length - PAST_SESSIONS_PREVIEW;
          return (
            <View style={{ paddingHorizontal: 16 }}>
              {visible.map((s) => {
                const firstMsg = s.name || s.messages.vent?.[1]?.text?.slice(0, 80) || 'No messages recorded';
                const stepsCompleted = s.unlockedSteps.length;
                const date = new Date(s.startDate);
                const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }).toUpperCase();
                return (
                  <View key={s.id} style={sl.sessionCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={sl.sessionDate}>{dateStr}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[sl.statusBadge, { backgroundColor: '#e8f7d6', borderColor: '#96d35f' }]}>
                          <Text style={[sl.statusText, { color: '#5a8a2f' }]}>Completed</Text>
                        </View>
                        <SessionMenu sessionId={s.id} status={s.status} dispatch={d} onDelete={onDeleteSession} />
                      </View>
                    </View>
                    <Text style={sl.sessionName}>{firstMsg}</Text>
                    <View style={sl.stepDotsRow}>
                      <View style={sl.stepDots}>
                        {SESSION_STEPS.map((step) => (
                          <View key={step} style={[sl.stepDot, s.unlockedSteps.includes(step) && { backgroundColor: STEP_COLORS[step] }]} />
                        ))}
                      </View>
                      <Text style={sl.stepCount}>{stepsCompleted}/{SESSION_STEPS.length} steps</Text>
                    </View>
                    <TouchableOpacity style={sl.continueBtn} onPress={() => onOpenSession(s.id)} activeOpacity={0.8}>
                      <Text style={sl.continueBtnText}>Continue session</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {!showAllPast && hidden > 0 && (
                <TouchableOpacity onPress={() => setShowAllPast(true)} style={sl.showMoreBtn} activeOpacity={0.7}>
                  <Text style={sl.showMoreText}>Show {hidden} more</Text>
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
          <View style={{ paddingHorizontal: 16 }}>
            {archivedSessions.map((s) => {
              const firstMsg = s.name || s.messages.vent?.[1]?.text?.slice(0, 80) || 'No messages recorded';
              const date = new Date(s.startDate);
              const dateStr = date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }).toUpperCase();
              return (
                <View key={s.id} style={[sl.sessionCard, { opacity: 0.7 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={sl.sessionDate}>{dateStr}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={[sl.statusBadge, { backgroundColor: '#eeebf4', borderColor: '#dedde8' }]}>
                        <Text style={[sl.statusText, { color: '#80798c' }]}>Archived</Text>
                      </View>
                      <SessionMenu sessionId={s.id} status={s.status} dispatch={d} onDelete={onDeleteSession} />
                    </View>
                  </View>
                  <Text style={sl.sessionName}>{firstMsg}</Text>
                  <TouchableOpacity style={sl.continueBtn} onPress={() => onOpenSession(s.id)} activeOpacity={0.8}>
                    <Text style={sl.continueBtnText}>Continue session</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sf = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 12 },
  tab: { paddingHorizontal: 16, height: 44, justifyContent: 'center', borderRadius: 9999, borderWidth: 1, borderColor: '#dedde8' },
  tabActive: { backgroundColor: '#96d35f', borderColor: '#96d35f' },
  tabText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#211e28', letterSpacing: 0.026 },
  tabTextActive: { color: '#211e28' },
});

const sl = StyleSheet.create({
  // Page header
  pageTitle: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 22, color: '#211e28', textAlign: 'center' },
  pageSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', textAlign: 'center', lineHeight: 21 },
  // New session CTA card
  startCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 20, padding: 24, overflow: 'hidden', ...Shadows.xs },
  startTag: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#211e28', textAlign: 'center', letterSpacing: 0.036, marginBottom: 8 },
  startTitle: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 22, color: '#211e28', textAlign: 'center', marginBottom: 12 },
  startBody: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#80798c', textAlign: 'center', lineHeight: 21, marginBottom: 16 },
  startBtn: { backgroundColor: '#96d35f', borderRadius: 9999, height: 48, alignItems: 'center', justifyContent: 'center' },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#001c14' },
  // Sessions heading
  sessionsHeading: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 16, color: '#211e28' },
  // Session cards
  sessionCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 16, marginBottom: 10 },
  sessionDate: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#80798c', letterSpacing: 0.88 },
  statusBadge: { borderWidth: 1, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden' },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.055 },
  sessionName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#211e28', lineHeight: 21, marginBottom: 8 },
  stepDotsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  stepDots: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#dedde8' },
  stepCount: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#80798c', letterSpacing: 0.026 },
  continueBtn: { borderWidth: 1.5, borderColor: '#dedde8', borderRadius: 9999, height: 44, alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#211e28' },
  showMoreBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 4, marginBottom: 8 },
  showMoreText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#80798c' },
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

function ChatBubble({ item, theme, profileInitial }: { item: Message; theme: typeof STEP_THEME[ModeKey]; profileInitial: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {item.role === 'ai' ? (
        <Image source={require('../../assets/otis-avatar.png')} style={styles.msgAvatarImg} />
      ) : (
        <View style={[styles.msgAvatar]}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#001c14' }}>{profileInitial}</Text>
        </View>
      )}
      <View style={[styles.msgBubble, item.role === 'user' && { backgroundColor: theme.pale, borderColor: '#dedde8' }]}>
        <Text style={styles.msgText}>{item.text}</Text>
      </View>
    </Animated.View>
  );
}

const MASCOT_SOURCES: Record<string, any> = {
  vent: require('../../assets/mascot-vent.png'),
  understand: require('../../assets/mascot-understand.png'),
  prepare: require('../../assets/mascot-prepare.png'),
};

function ChatMascot({ step }: { step: ModeKey }) {
  const opacities = useRef(
    Object.fromEntries(['vent', 'understand', 'prepare'].map(s => [s, new Animated.Value(s === step ? 1 : 0)]))
  ).current as Record<string, Animated.Value>;

  useEffect(() => {
    ['vent', 'understand', 'prepare'].forEach(s => {
      Animated.timing(opacities[s], {
        toValue: s === step ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }, [step]);

  return (
    <View style={styles.chatMascotWrap} pointerEvents="none">
      {['vent', 'understand', 'prepare'].map(s => (
        <Animated.Image
          key={s}
          source={MASCOT_SOURCES[s]}
          style={[styles.chatMascot, { position: 'absolute', opacity: opacities[s] }]}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

const CRISIS_HELPLINES = [
  { label: 'SA Lifeline', number: '0800 567 567' },
  { label: 'SA Depression & Anxiety', number: '0800 456 789' },
  { label: 'USA 988 Suicide & Crisis', number: '988' },
  { label: 'UK Samaritans', number: '116 123' },
];

const SESSION_DURATION_NUDGE_MS = 30 * 60 * 1000; // 30 minutes

function ActiveSessionView({ session, state, dispatch: d, onBack }: { session: Session; state: any; dispatch: any; onBack: () => void }) {
  const [input, setInput] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(session?.name || '');
  const [showCapture, setShowCapture] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [showDurationNudge, setShowDurationNudge] = useState(false);
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false);
  const transcriptRef = useRef('');
  const flatRef = useRef<FlatList>(null);
  const sessionStartRef = useRef(Date.now());
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

  // Session duration nudge — gentle reminder after 30 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDurationNudge(true);
    }, SESSION_DURATION_NUDGE_MS);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');

    const lower = text.toLowerCase();
    const isCrisis = CRISIS_WORDS.some((w) => lower.includes(w));
    if (isCrisis) {
      setShowCrisisBanner(true);
      Alert.alert(
        'You are not alone',
        'It sounds like you may be going through something serious. Please reach out to a crisis helpline — you deserve real support right now.\n\nSA Lifeline: 0800 567 567\nSA Depression & Anxiety: 0800 456 789\nUSA: 988\nUK Samaritans: 116 123',
        [{ text: 'I understand, continue', style: 'cancel' }]
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
      Alert.alert('Permission needed', 'Hey Otis needs microphone access for voice input.');
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
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>

        <View style={styles.sessionTopBlock}>
          {/* Nav row with Back + Step name centred */}
          <View style={styles.sessionNavRow}>
            <TouchableOpacity onPress={goBack} style={styles.sessionBackBtn} activeOpacity={0.7}>
              <ChevronLeft size={11} color={Colors.midBrown} style={{ marginTop: 1 }} />
              <Text style={styles.sessionBackText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.sessionStepNameRow}>
              <Text style={styles.sessionStepName}>{SESSION_STEPS.indexOf(step) + 1}. {cfg.label}</Text>
            </View>
            <View style={{ minWidth: 56 }} />
          </View>

          {/* Session name */}
          {editingName ? (
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={() => { d({ type: 'RENAME_SESSION', sessionId: session.id, name: nameInput }); setEditingName(false); }}
              onSubmitEditing={() => { d({ type: 'RENAME_SESSION', sessionId: session.id, name: nameInput }); setEditingName(false); }}
              autoFocus
              placeholder="Name this session"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              style={styles.sessionNameInput}
            />
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(session.name); setEditingName(true); }} activeOpacity={0.7}>
              <Text style={styles.sessionNameSub}>{session.name || 'Name this session'}</Text>
            </TouchableOpacity>
          )}

          {/* Step progress */}
          <StepProgressBar session={session} activeTheme={theme} onGoToStep={(s) => d({ type: 'GO_TO_STEP', sessionId: session.id, step: s })} />
        </View>

        {/* Disclaimer — shown once per session until dismissed */}
        {!disclaimerDismissed && step === 'vent' && messages.length <= 1 && (
          <View style={styles.disclaimerBanner}>
            <Text style={styles.disclaimerText}>
              Hey Otis is a wellness tool, not a substitute for professional therapy. If you're in crisis, please contact a helpline.
            </Text>
            <TouchableOpacity onPress={() => setDisclaimerDismissed(true)} activeOpacity={0.7}>
              <Text style={styles.disclaimerDismiss}>Got it</Text>
            </TouchableOpacity>
          </View>
        )}

        {floodingDetected && step === 'vent' && (
          <View style={[styles.floodBanner, { backgroundColor: theme.pale, borderBottomColor: theme.light }]}>
            <Text style={[styles.floodText, { color: theme.color }]}>You seem very activated. A short pause can help.</Text>
          </View>
        )}

        {/* Persistent crisis banner — stays visible after crisis words detected */}
        {showCrisisBanner && (
          <View style={styles.crisisBanner}>
            <Text style={styles.crisisBannerTitle}>💛 You're not alone</Text>
            <Text style={styles.crisisBannerText}>If you're in immediate danger, please reach out:</Text>
            {CRISIS_HELPLINES.map((h) => (
              <Text key={h.number} style={styles.crisisHelpline}>{h.label}: {h.number}</Text>
            ))}
            <TouchableOpacity onPress={() => setShowCrisisBanner(false)} activeOpacity={0.7} style={styles.crisisDismissBtn}>
              <Text style={styles.crisisDismissText}>I'm okay, dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Gentle nudge after 30 minutes of session use */}
        {showDurationNudge && (
          <View style={styles.nudgeBanner}>
            <Text style={styles.nudgeText}>You've been here a while — it's okay to take a break and come back later. Your session will be saved. 🌿</Text>
            <TouchableOpacity onPress={() => setShowDurationNudge(false)} activeOpacity={0.7}>
              <Text style={styles.nudgeDismiss}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {isBridgeStep ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <NurtureCard session={session} dispatch={d} profile={state.profile} onResolved={resolveSession} />
          </ScrollView>
        ) : (
          <View style={{ flex: 1, backgroundColor: '#fbf9ff' }}>
            <FlatList
              ref={flatRef}
              data={messages}
              keyExtractor={(m) => m.id}
              style={{ flex: 1 }}
              contentContainerStyle={[styles.msgList, { paddingBottom: 130 }]}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ChatBubble item={item} theme={theme} profileInitial={state.profile.name?.[0] || '?'} />
              )}
              ListFooterComponent={loading ? (
                <View style={styles.msgRow}>
                  <Image source={require('../../assets/otis-avatar.png')} style={styles.msgAvatarImg} />
                  <View style={styles.msgBubble}><TypingIndicator /></View>
                </View>
              ) : null}
            />
          </View>
        )}

        {canAdvance && (
          <TouchableOpacity style={[styles.advanceBanner, { backgroundColor: '#96d35f' }]} onPress={advanceStep} activeOpacity={0.85}>
            <Text style={styles.advanceText}>Ready? Move to {MODE_CONFIG[SESSION_STEPS[SESSION_STEPS.indexOf(step) + 1]].label} →</Text>
          </TouchableOpacity>
        )}

        {session.status !== 'resolved' && !isBridgeStep && (
          <>
            <View style={styles.inputArea}>
              {userMsgCount === 0 && cfg.quickActions.length > 0 && (
                <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.qaWrap}>
                  {cfg.quickActions.map((qa) => (
                    <TouchableOpacity key={qa} onPress={() => setInput(qa)} style={styles.qaPill}>
                      <Text style={styles.qaText} numberOfLines={1}>{qa}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                </>
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
                  placeholder="Type your message here..."
                  placeholderTextColor="#80798c"
                  selectionColor="#96d35f"
                  cursorColor="#96d35f"
                  style={[styles.input, inputFocused && styles.inputFocused]}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  blurOnSubmit={false}
                />
                {speechAvailable && (
                  <TouchableOpacity
                    onPress={toggleRecording}
                    style={[styles.micBtn, isRecording && { backgroundColor: '#ff4853' }]}
                    activeOpacity={0.8}
                  >
                    {isRecording
                      ? <View style={{ width: 14, height: 14, borderRadius: 2, backgroundColor: '#ffffff' }} />
                      : <IconVoice size={22} color="#ffffff" />
                    }
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={sendMessage}
                  disabled={loading || !input.trim()}
                  style={[styles.sendBtn, { opacity: loading || !input.trim() ? 0.5 : 1 }]}
                  activeOpacity={0.8}
                >
                  {loading
                    ? <ActivityIndicator color="#ffffff" size="small" />
                    : <Text style={{ color: '#ffffff', fontSize: 18, fontFamily: 'Inter_600SemiBold', marginTop: -2 }}>↑</Text>
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
  const navigation = require('@react-navigation/native').useNavigation();
  const [viewingId, setViewingId] = useState<string | null>(null);

  // Reset to session list when tab is tapped (re-focused)
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      setViewingId(null);
      setShowNamePrompt(false);
    });
    return unsubscribe;
  }, [navigation]);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [pendingFeeling, setPendingFeeling] = useState<string | null>(null);
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

  // Check for initial feeling from home screen (only once on mount)
  const feelingChecked = useRef(false);
  useEffect(() => {
    if (feelingChecked.current) return;
    const feeling = (global as any).__tether_initial_feeling;
    if (feeling) {
      setPendingFeeling(feeling);
      delete (global as any).__tether_initial_feeling;
      feelingChecked.current = true;
    }
  }, []);

  // Track session IDs to detect additions vs deletions
  const prevSessionIdsRef = useRef<string[]>(state.sessions.map(s => s.id));
  useEffect(() => {
    const currentIds = state.sessions.map(s => s.id);
    const prevIds = prevSessionIdsRef.current;

    // Find newly added sessions
    const newIds = currentIds.filter(id => !prevIds.includes(id));

    if (newIds.length > 0) {
      // A session was ADDED — auto-open it
      const latestSessionId = newIds[0];
      if (newSessionName.trim()) {
        dispatch({ type: 'RENAME_SESSION', sessionId: latestSessionId, name: newSessionName.trim() });
      }
      if (pendingFeeling) {
        setTimeout(() => {
          dispatch({
            type: 'ADD_SESSION_MESSAGE',
            sessionId: latestSessionId,
            step: 'vent',
            message: { role: 'user', text: pendingFeeling, id: Date.now().toString() },
          });
          setPendingFeeling(null);
        }, 500);
      }
      setViewingId(latestSessionId);
      setNewSessionName('');
    }

    // Clear viewingId if the viewed session was deleted
    if (viewingId && !currentIds.includes(viewingId)) {
      setViewingId(null);
    }

    prevSessionIdsRef.current = currentIds;
  }, [state.sessions]);

  if (showNamePrompt) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
          <Text style={{ fontFamily: Fonts.displaySemiBold, fontSize: 24, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 }}>
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
            selectionColor="#96d35f"
            cursorColor="#96d35f"
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

  return <SessionListView sessions={state.sessions} dispatch={dispatch} onOpenSession={openSession} onStartNew={promptNewSession} onDeleteSession={() => setViewingId(null)} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  headerTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 22, color: Colors.charcoal, marginBottom: 6 },
  headerSub: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown },
  sectionLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 14 },
  sessionBackBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingRight: 8, minWidth: 56 },
  sessionBackText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.midBrown },
  sessionNameInput: { fontFamily: Fonts.body, fontSize: 12, color: Colors.charcoal, textAlign: 'center', paddingVertical: 2, minWidth: 120 },
  sessionNameText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, textAlign: 'center' },
  sessionStepCounter: { fontFamily: Fonts.bodyMedium, fontSize: 12, minWidth: 56, textAlign: 'right' },
  sessionTopBlock: { backgroundColor: '#ffffff', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#dedde8' },
  sessionNavRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  sessionStepNameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  sessionStepName: { fontFamily: 'InstrumentSans_600SemiBold', fontSize: 20, color: '#211e28' },
  sessionNameSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#a09bac', textAlign: 'center', marginBottom: 4 },
  sessionNameInput: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#211e28', textAlign: 'center', marginBottom: 4, padding: 0 },
  floodBanner: { borderBottomWidth: 1, padding: 10, paddingHorizontal: 16 },
  floodText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown },
  chatMascotWrap: { position: 'absolute', bottom: 8, right: 16, zIndex: 0, width: 110, height: 110 },
  chatMascot: { width: 110, height: 110 },
  msgList: { paddingHorizontal: 16, paddingVertical: 12, gap: 16 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, maxWidth: '90%' },
  msgRowUser: { flexDirection: 'row-reverse', alignSelf: 'flex-end', maxWidth: '90%' },
  msgAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#bcb8c3', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgAvatarImg: { width: 32, height: 32, borderRadius: 16, flexShrink: 0 },
  msgBubble: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dedde8', borderRadius: 16, padding: 12, maxWidth: '85%', ...Shadows.xs },
  // msgBubbleUser now set inline via theme.pale
  msgText: { fontFamily: Fonts.body, fontSize: 14, color: '#211e28', lineHeight: 21 },
  qaWrap: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, paddingHorizontal: 0 },
  qaPill: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#dedde8', borderRadius: 9999, paddingHorizontal: 24, height: 44, justifyContent: 'center', marginRight: 8 },
  qaText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#211e28', letterSpacing: 0.026 },
  inputArea: { backgroundColor: '#fbf9ff', borderTopWidth: 1, borderTopColor: '#dedde8', padding: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#dedde8', borderRadius: 9999, paddingHorizontal: 20, paddingVertical: 0, fontFamily: 'Inter_400Regular', fontSize: 14, color: '#211e28', maxHeight: 80, height: 44, outlineStyle: 'none' } as any,
  inputFocused: { borderColor: '#96d35f' },
  micBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#96d35f' },
  recordingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, paddingBottom: 8 },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E25555' },
  recordingText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown, flex: 1 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#96d35f' },
  advanceBanner: { marginHorizontal: 16, marginVertical: 8, borderRadius: 9999, height: 48, alignItems: 'center', justifyContent: 'center' },
  advanceText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#001c14' },
  // Disclaimer banner
  disclaimerBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0eef5', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  disclaimerText: { flex: 1, fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, lineHeight: 17 },
  disclaimerDismiss: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#96d35f' },
  // Crisis banner
  crisisBanner: { backgroundColor: '#fef3e6', borderBottomWidth: 1, borderBottomColor: '#f5d9a8', paddingHorizontal: 16, paddingVertical: 14 },
  crisisBannerTitle: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: '#8a5a00', marginBottom: 4 },
  crisisBannerText: { fontFamily: Fonts.body, fontSize: 13, color: '#8a5a00', marginBottom: 6 },
  crisisHelpline: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#8a5a00', marginLeft: 8, lineHeight: 22 },
  crisisDismissBtn: { marginTop: 8, alignSelf: 'flex-start' },
  crisisDismissText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#b07800' },
  // Duration nudge
  nudgeBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', paddingHorizontal: 16, paddingVertical: 10, gap: 12 },
  nudgeText: { flex: 1, fontFamily: Fonts.body, fontSize: 12, color: '#2e7d32', lineHeight: 17 },
  nudgeDismiss: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#4caf50' },
});

const cap = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: Colors.warmWhite, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 44 },
  question: { fontFamily: Fonts.displaySemiBold, fontSize: 17, color: Colors.charcoal, textAlign: 'center', marginBottom: 24, lineHeight: 26 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  optBtn: { flex: 1, alignItems: 'center', gap: 6 },
  optEmoji: { fontSize: 30 },
  optLabel: { fontFamily: Fonts.body, fontSize: 10, color: Colors.midBrown, textAlign: 'center' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.lightBrown },
});
