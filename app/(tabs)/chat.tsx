import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState, Message } from '../../src/hooks/useAppState';
import { useClaude } from '../../src/hooks/useClaude';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { MODE_CONFIG, ModeKey, CRISIS_WORDS } from '../../src/constants/data';

const MODES: ModeKey[] = ['vent', 'understand', 'prepare', 'nurture'];

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

export default function ChatTab() {
  const { state, dispatch } = useAppState();
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList>(null);
  const mode = state.currentMode;
  const cfg = MODE_CONFIG[mode];

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

  const messages = state.messages[mode] || [];

  useEffect(() => {
    if (messages.length === 0) {
      const welcomes: Record<ModeKey, string> = {
        vent: 'Hello' + (state.profile.name ? ', ' + state.profile.name : '') + '. This space is completely safe and private. There is nothing you need to explain here — just share what you are carrying. What is on your heart?',
        understand: 'When you are ready, let us look gently at what has been happening. Often the surface argument is pointing to something deeper — a fear, a need, a longing to feel close. What would you like to explore?',
        prepare: 'Let us build something useful together. Whether you want to write a message to your partner, prepare for a difficult conversation, or find a way to repair — what would be most helpful?',
        nurture: 'It is beautiful that you are here when things are relatively good. The Gottman research shows moments between conflicts matter most. What would you like to nurture today?',
      };
      dispatch({ type: 'ADD_MESSAGE', mode, message: { role: 'ai', text: welcomes[mode], id: Date.now().toString() } });
    }
  }, [mode]);

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
    dispatch({ type: 'ADD_MESSAGE', mode, message: userMsg });
    dispatch({ type: 'LOG_SESSION', entry: { mode, text: text.slice(0, 60), date: 'Just now' } });

    const history = messages.map((m) => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.text,
    }));
    const reply = await send(text, history);
    dispatch({ type: 'ADD_MESSAGE', mode, message: { role: 'ai', text: reply, id: (Date.now() + 1).toString() } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>

        <View style={styles.modeTabs}>
          {MODES.map((m) => {
            const c = MODE_CONFIG[m];
            const active = m === mode;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => dispatch({ type: 'SET_MODE', mode: m })}
                style={[styles.modeTab, active && { backgroundColor: c.paleBg, borderColor: c.color }]}
                activeOpacity={0.75}
              >
                <Text style={{ fontSize: 13 }}>{c.emoji}</Text>
                <Text style={[styles.modeTabLabel, active && { color: c.color }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.modeBanner, { backgroundColor: cfg.paleBg, borderBottomColor: cfg.borderColor }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerStep, { color: cfg.color }]}>{cfg.stepLabel}</Text>
            <Text style={styles.bannerTitle}>{cfg.stepTitle}</Text>
            <Text style={styles.bannerDesc}>{cfg.stepDesc}</Text>
          </View>
        </View>

        {floodingDetected && mode === 'vent' && (
          <View style={styles.floodBanner}>
            <Text style={styles.floodText}>💛 You seem very activated. A short pause can help.</Text>
          </View>
        )}

        <View style={styles.contextStrip}>
          <Text style={styles.contextText}>{cfg.context}</Text>
        </View>

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

        <View style={styles.qaWrap}>
          {cfg.quickActions.map((qa) => (
            <TouchableOpacity key={qa} onPress={() => setInput(qa)} style={styles.qaPill}>
              <Text style={styles.qaText}>{qa}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputArea}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Share what is on your heart..."
              placeholderTextColor={Colors.lightBrown}
              style={styles.input}
              multiline
              blurOnSubmit={false}
            />
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

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  modeTabs: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10, gap: 6, backgroundColor: Colors.warmWhite, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  modeTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 7, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.sand },
  modeTabLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.midBrown },
  modeBanner: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  bannerStep: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2 },
  bannerTitle: { fontFamily: Fonts.display, fontSize: 15, color: Colors.charcoal, marginBottom: 2 },
  bannerDesc: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown },
  floodBanner: { backgroundColor: Colors.terracottaPale, borderBottomWidth: 1, borderBottomColor: Colors.terracottaLight, padding: 10, paddingHorizontal: 16 },
  floodText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.warmBrown },
  contextStrip: { backgroundColor: Colors.blushPale, borderBottomWidth: 1, borderBottomColor: Colors.sand, paddingHorizontal: 16, paddingVertical: 8 },
  contextText: { fontFamily: Fonts.displayItalic, fontSize: 13, color: Colors.warmBrown },
  msgList: { paddingHorizontal: 16, paddingVertical: 14, gap: 12, flexGrow: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '88%' },
  msgRowUser: { flexDirection: 'row-reverse', alignSelf: 'flex-end', maxWidth: '88%' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.terracottaPale, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgAvatarUser: { backgroundColor: Colors.sagePale },
  msgBubble: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: 16, borderBottomLeftRadius: 4, padding: 12, maxWidth: '85%' },
  msgBubbleUser: { backgroundColor: Colors.terracotta, borderWidth: 0, borderBottomLeftRadius: 16, borderBottomRightRadius: 4 },
  msgText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal, lineHeight: 21 },
  qaWrap: { flexDirection: 'row', paddingHorizontal: 12, paddingBottom: 6, paddingTop: 6, gap: 6 },
  qaPill: { backgroundColor: Colors.cream, borderWidth: 1, borderColor: Colors.sandDark, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  qaText: { fontFamily: Fonts.body, fontSize: 11, color: Colors.warmBrown },
  inputArea: { backgroundColor: Colors.warmWhite, borderTopWidth: 1, borderTopColor: Colors.sand, padding: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, backgroundColor: Colors.cream, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal, maxHeight: 110, minHeight: 44 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', ...Shadows.terracotta },
});
