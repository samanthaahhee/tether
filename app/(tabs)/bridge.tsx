import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { Button } from '../../src/components/UI';

const REPAIR_ATTEMPTS = [
  { icon: '💛', name: 'Olive branch', msg: 'I know we are in a difficult moment. I do not want to be disconnected from you. Can we try again?' },
  { icon: '🤝', name: 'Accountability', msg: 'I said some things that were not fair. I am sorry for that part of it. You did not deserve that.' },
  { icon: '⏸️', name: 'Pause request', msg: 'I am feeling overwhelmed and I need 20 minutes. I am not going anywhere — I just need to come back to this calmer.' },
  { icon: '🌿', name: 'Soft start', msg: 'Can we try talking about this again? I want to understand your side better. I am listening.' },
  { icon: '💬', name: 'I hear you', msg: 'I can see this really hurt you. Your feelings make sense to me, even if I did not intend to cause them.' },
  { icon: '🫂', name: 'Be together', msg: 'I do not want us to go to sleep like this. Can I just sit with you, even if we do not talk yet?' },
];

interface SentMessage { msg: string; toPartner: boolean; time: string }

export default function BridgeTab() {
  const partnerName = 'Alex';
  const [obs, setObs] = useState('');
  const [feel, setFeel] = useState('');
  const [need, setNeed] = useState('');
  const [request, setRequest] = useState('');
  const [sent, setSent] = useState<SentMessage[]>([
    { msg: 'When you went quiet after dinner, I felt scared I had done something wrong. I need us to be okay. Could we take a walk together tonight?', toPartner: false, time: '2 hours ago' }
  ]);

  const sendBridge = () => {
    if (!obs && !feel) {
      Alert.alert('Please add at least an observation and a feeling');
      return;
    }
    const parts: string[] = [];
    if (obs) parts.push('When ' + (obs.toLowerCase().startsWith('when') ? obs.slice(5) : obs));
    if (feel) parts.push('I felt ' + feel);
    if (need) parts.push('because I need ' + need);
    if (request) parts.push(request);
    const msg = parts.join('. ') + '.';
    setSent([{ msg, toPartner: true, time: 'Just now' }, ...sent]);
    setObs(''); setFeel(''); setNeed(''); setRequest('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>The Bridge</Text>
          <Text style={styles.subtitle}>Send a calm, considered message — composed here, delivered with context and care.</Text>
        </View>

        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatar}>
            <Text style={styles.partnerAvatarText}>{partnerName[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>{partnerName}</Text>
            <Text style={styles.partnerSub}>Partner · Connected via Tether</Text>
          </View>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Connected</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick repair attempts</Text>
          <View style={styles.repairGrid}>
            {REPAIR_ATTEMPTS.map((r) => (
              <TouchableOpacity
                key={r.name}
                style={styles.repairCard}
                onPress={() => setSent([{ msg: r.msg, toPartner: true, time: 'Just now' }, ...sent])}
                activeOpacity={0.8}
              >
                <Text style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</Text>
                <Text style={styles.repairName}>{r.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.composeCard}>
          <Text style={styles.composeTitle}>Compose a bridge message</Text>
          <Text style={styles.composeSub}>Observation — Feeling — Need — Request</Text>
          {[
            { label: 'Observation — what happened?', value: obs, onChange: setObs, placeholder: 'A specific event without judgment...', multiline: true },
            { label: 'Feeling', value: feel, onChange: setFeel, placeholder: 'e.g. hurt, scared, lonely...', multiline: false },
            { label: 'Need', value: need, onChange: setNeed, placeholder: 'e.g. reassurance, connection...', multiline: false },
            { label: 'Request — one specific ask', value: request, onChange: setRequest, placeholder: 'e.g. could we talk for 15 min tonight?', multiline: false },
          ].map((field) => (
            <View key={field.label} style={{ marginBottom: 12 }}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.lightBrown}
                style={[styles.fieldInput, field.multiline && { minHeight: 64, textAlignVertical: 'top' }]}
                multiline={field.multiline}
              />
            </View>
          ))}
          <Button label="Send bridge message 🌿" onPress={sendBridge} variant="sage" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages with {partnerName}</Text>
          {sent.map((m, i) => (
            <View key={i} style={[styles.msgCard, m.toPartner && styles.msgCardSent]}>
              <Text style={[styles.msgFrom, m.toPartner && { color: Colors.sage }]}>
                {m.toPartner ? 'SENT TO ' + partnerName.toUpperCase() : 'FROM ' + partnerName.toUpperCase()} · {m.time}
              </Text>
              <Text style={styles.msgContent}>"{m.msg}"</Text>
              <Text style={styles.msgTs}>Sent with care via Tether</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  header: { padding: 20, paddingBottom: 12 },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, marginBottom: 6 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, lineHeight: 20 },
  partnerCard: { marginHorizontal: 20, marginBottom: 20, backgroundColor: Colors.sagePale, borderWidth: 1, borderColor: Colors.sageLight, borderRadius: Radius.lg, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  partnerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.sageLight, alignItems: 'center', justifyContent: 'center' },
  partnerAvatarText: { fontFamily: Fonts.bodyMedium, fontSize: 18, color: Colors.sage },
  partnerName: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.charcoal },
  partnerSub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.warmBrown },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.sage },
  statusText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.sage },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 12 },
  repairGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  repairCard: { width: '30%', backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 12, alignItems: 'center' },
  repairName: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.charcoal, textAlign: 'center' },
  composeCard: { marginHorizontal: 20, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 16, marginBottom: 24, ...Shadows.sm },
  composeTitle: { fontFamily: Fonts.display, fontSize: 17, color: Colors.charcoal, marginBottom: 4 },
  composeSub: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, marginBottom: 16, lineHeight: 18 },
  fieldLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: Colors.terracotta, marginBottom: 5 },
  fieldInput: { backgroundColor: Colors.cream, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.sm, padding: 10, fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal },
  msgCard: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14, marginBottom: 10 },
  msgCardSent: { backgroundColor: Colors.sagePale, borderColor: Colors.sageLight },
  msgFrom: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.4, color: Colors.terracotta, marginBottom: 7 },
  msgContent: { fontFamily: Fonts.displayItalic, fontSize: 14, color: Colors.charcoal, lineHeight: 22 },
  msgTs: { fontFamily: Fonts.body, fontSize: 11, color: Colors.lightBrown, marginTop: 7 },
});
