import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Alert, Linking, Share, ActivityIndicator, Modal, TextInput, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { IconHeart, IconUser, IconBell, IconLeaf, IconBookmark, IconLink, IconMail, IconKey, IconEdit, IconShield, IconBox, IconPhone, IconInfo, IconLock, IconSun, IconSearch, IconX } from '../../src/components/Icons';
import { ChevronRight } from '../../src/components/Icon';
import { CRISIS_COUNTRIES, getCrisisLines } from '../../src/constants/crisisLines';
import { useAppState } from '../../src/hooks/useAppState';
import { ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS } from '../../src/constants/data';
import { PartnerProfile } from '../../src/hooks/useAppState';
import { useAuth } from '../../src/hooks/useAuth';

function Toggle({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [value]);

  const trackBg = anim.interpolate({ inputRange: [0, 1], outputRange: ['#d4d2de', '#96d35f'] });
  const thumbLeft = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 27] });
  const thumbColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['#9e9aab', '#ffffff'] });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={{ width: 52, height: 30, borderRadius: 15, backgroundColor: trackBg, justifyContent: 'center' }}>
        <Animated.View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: thumbColor, position: 'absolute', left: thumbLeft, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2 }} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function SettingsRow({ icon, label, sub, onPress, right }: { icon: React.ReactNode; label: string; sub?: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>{label}</Text>
          {sub && <Text style={styles.rowSub}>{sub}</Text>}
        </View>
      </View>
      {right || (onPress && <ChevronRight size={10} color={Colors.lightBrown} />)}
    </TouchableOpacity>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export default function SettingsTab() {
  const { state, dispatch } = useAppState();
  const { couple, partnerProfile: supabasePartner, signOut, generateInvite } = useAuth();
  const p = state.profile;
  const pp: PartnerProfile = state.partnerProfile;
  const partnerSet = !!pp.attachment;
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [appLock, setAppLock] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const crisisData = getCrisisLines(state.crisisCountry);
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return CRISIS_COUNTRIES;
    const q = countrySearch.toLowerCase();
    return CRISIS_COUNTRIES.filter((c) => c.country.toLowerCase().includes(q));
  }, [countrySearch]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* Partner connection */}
        <Section title="Partner">
          {couple ? (
            <View>
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedDot}>●</Text>
                <Text style={styles.connectedText}>
                  Connected{supabasePartner?.name ? ` with ${supabasePartner.name}` : ''}
                </Text>
              </View>
              <SettingsRow
                icon={<IconLink size={18} color={Colors.midBrown} />}
                label="Send another invite"
                sub="Regenerate a link if your partner needs it again"
                onPress={async () => {
                  setInviteLoading(true);
                  const code = await generateInvite();
                  setInviteLoading(false);
                  Share.share({
                    message: `Join me on Tether\n\nDownload the app and use invite code: ${code}\n\nor tap: tether://invite/${code}`,
                    title: 'Join me on Tether',
                  });
                }}
                right={inviteLoading ? <ActivityIndicator size="small" color={Colors.terracotta} /> : undefined}
              />
            </View>
          ) : (
            <View>
              <View style={styles.notConnectedRow}>
                <Text style={styles.notConnectedText}>No partner connected yet</Text>
              </View>
              <SettingsRow
                icon={<IconMail size={18} color={Colors.midBrown} />}
                label="Invite your partner"
                sub="Generate a code and share it with them"
                onPress={async () => {
                  setInviteLoading(true);
                  const code = await generateInvite();
                  setInviteCode(code);
                  setInviteLoading(false);
                }}
                right={inviteLoading ? <ActivityIndicator size="small" color={Colors.terracotta} /> : undefined}
              />
              {inviteCode && (
                <View style={styles.inviteCodeBox}>
                  <Text style={styles.inviteCodeLabel}>YOUR INVITE CODE</Text>
                  <Text style={styles.inviteCodeValue}>{inviteCode}</Text>
                  <Text style={styles.inviteCodeHint}>Expires in 7 days</Text>
                  <TouchableOpacity
                    style={styles.inviteShareBtn}
                    activeOpacity={0.8}
                    onPress={() => {
                      Share.share({
                        message: `Join me on Tether\n\nDownload the app and use invite code: ${inviteCode}\n\nor tap: tether://invite/${inviteCode}`,
                        title: 'Join me on Tether',
                      });
                    }}
                  >
                    <Text style={styles.inviteShareBtnText}>Share invite link</Text>
                  </TouchableOpacity>
                </View>
              )}
              <SettingsRow
                icon={<IconKey size={18} color={Colors.midBrown} />}
                label="I have an invite code"
                sub="Enter a code your partner sent you"
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Alert.prompt(
                      'Enter invite code',
                      'Paste or type the code your partner shared with you.',
                      async (code) => {
                        if (!code) return;
                        router.push(`/invite/${code.trim().toUpperCase()}`);
                      },
                      'plain-text',
                      '',
                      'default',
                    );
                  } else {
                    router.push('/invite/ENTER');
                  }
                }}
              />
            </View>
          )}
        </Section>

        <Section title="Profile">
          <View style={styles.profileGrid}>
            {[
              { label: 'Attachment', value: ATTACHMENT_LABELS[p.attachment] || 'Not set' },
              { label: 'Love language', value: LOVE_LABELS[p.love] || 'Not set' },
              { label: 'Conflict style', value: CONFLICT_LABELS[p.conflict] || 'Not set' },
              { label: 'Body response', value: WINDOW_LABELS[p.window] || 'Not set' },
              { label: 'Core need', value: NEED_LABELS[p.need] || 'Not set' },
            ].map((item) => (
              <View key={item.label} style={styles.profilePill}>
                <Text style={styles.pillLabel}>{item.label}</Text>
                <Text style={styles.pillValue}>{item.value}</Text>
              </View>
            ))}
          </View>
          <SettingsRow icon={<IconEdit size={18} color={Colors.midBrown} />} label="Retake onboarding" sub="Start fresh and update your answers" onPress={() => {
            Alert.alert(
              'Retake onboarding',
              'This will reset your profile answers. Your sessions and learnings will be kept. Continue?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Continue', onPress: () => {
                    dispatch({
                      type: 'SET_PROFILE',
                      payload: { attachment: '', conflict: '', love: '', window: '', need: '', context: '', onboarded: false },
                    });
                    router.replace('/onboarding');
                  },
                },
              ],
            );
          }} />
        </Section>



        <Section title="Privacy and safety">
          <SettingsRow icon={<IconLock size={18} color={Colors.midBrown} />} label="App lock" sub="Require Face ID or passcode" right={<Toggle value={appLock} onValueChange={setAppLock} />} />
          <SettingsRow icon={<IconShield size={18} color={Colors.midBrown} />} label="Data and encryption" sub="How your data is protected" onPress={() => Alert.alert(
            'Data and encryption',
            'Your data is protected in the following ways:\n\n' +
            'End-to-end encryption\nAll session content is encrypted using AES-256 before being stored.\n\n' +
            'Private by design\nYour vent sessions are never visible to your partner. Only you can see what you share in private mode.\n\n' +
            'No selling or sharing\nYour data is never sold, shared with third parties, or used to train AI models.\n\n' +
            'Local-first storage\nYour profile and session data is stored on your device. Server sync is encrypted and minimal.\n\n' +
            'You are in control\nExport or delete your data at any time using the options below.'
          )} />
          <SettingsRow
            icon={<IconBox size={18} color={Colors.midBrown} />}
            label="Export my data"
            sub="Download a copy of all your data"
            onPress={async () => {
              setExporting(true);
              try {
                const raw = await AsyncStorage.getItem('tether_app_state');
                const exportData = {
                  exportedAt: new Date().toISOString(),
                  profile: state.profile,
                  sessions: state.sessions.map(s => ({
                    id: s.id,
                    name: s.name,
                    status: s.status,
                    currentStep: s.currentStep,
                    startDate: s.startDate,
                    resolvedDate: s.resolvedDate,
                    messages: s.messages,
                    reflection: s.reflection,
                  })),
                  learnings: state.learnings,
                };
                const json = JSON.stringify(exportData, null, 2);
                await Share.share({
                  message: json,
                  title: 'Tether Data Export',
                });
              } catch (e) {
                Alert.alert('Export failed', 'Something went wrong exporting your data. Please try again.');
              }
              setExporting(false);
            }}
            right={exporting ? <ActivityIndicator size="small" color={Colors.midBrown} /> : undefined}
          />
        </Section>

        <Section title="Crisis support">
          <TouchableOpacity style={cs.countryPicker} onPress={() => setShowCountryPicker(true)} activeOpacity={0.7}>
            <View style={{ flex: 1 }}>
              <Text style={cs.countryLabel}>Your country</Text>
              <Text style={cs.countryName}>{crisisData.country}</Text>
            </View>
            <Text style={cs.changeText}>Change</Text>
          </TouchableOpacity>
          {crisisData.lines.map((line, i) => (
            <SettingsRow
              key={i}
              icon={<IconPhone size={18} color={Colors.midBrown} />}
              label={line.name}
              sub={line.note}
              onPress={line.number ? () => Linking.openURL(line.number) : undefined}
            />
          ))}
        </Section>

        {/* Country picker modal */}
        <Modal visible={showCountryPicker} animationType="slide" transparent onRequestClose={() => setShowCountryPicker(false)}>
          <View style={cs.overlay}>
            <View style={cs.sheet}>
              <View style={cs.sheetHeader}>
                <Text style={cs.sheetTitle}>Select your country</Text>
                <TouchableOpacity onPress={() => { setShowCountryPicker(false); setCountrySearch(''); }} activeOpacity={0.7}>
                  <IconX size={20} color={Colors.midBrown} />
                </TouchableOpacity>
              </View>
              <View style={cs.searchWrap}>
                <IconSearch size={16} color={Colors.lightBrown} />
                <TextInput
                  value={countrySearch}
                  onChangeText={setCountrySearch}
                  placeholder="Search countries..."
                  placeholderTextColor={Colors.lightBrown}
                  selectionColor="#96d35f"
                  cursorColor="#96d35f"
                  style={cs.searchInput}
                  autoFocus
                />
              </View>
              <FlatList
                data={filteredCountries}
                keyExtractor={(c) => c.code}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item: c }) => (
                  <TouchableOpacity
                    style={[cs.countryRow, c.code === state.crisisCountry && cs.countryRowActive]}
                    onPress={() => {
                      dispatch({ type: 'SET_CRISIS_COUNTRY', code: c.code });
                      setShowCountryPicker(false);
                      setCountrySearch('');
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={cs.countryRowName}>{c.country}</Text>
                    <Text style={cs.countryRowCount}>{c.lines.length} line{c.lines.length !== 1 ? 's' : ''}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={cs.emptyText}>No countries found</Text>}
              />
            </View>
          </View>
        </Modal>

        <Section title="About">
          <SettingsRow icon={<IconBookmark size={18} color={Colors.midBrown} />} label="Therapeutic frameworks" sub="Gottman, EFT, NVC, IFS, CBCT" onPress={() => router.push('/frameworks')} />
          <SettingsRow
            icon={<IconInfo size={18} color={Colors.midBrown} />}
            label="Important notice"
            sub="Please read before using Tether"
            onPress={() => Alert.alert(
              'Important notice',
              'Tether is a self-guided relationship wellness tool designed to support your personal growth and communication skills.\n\n' +
              'Tether is not a replacement for professional support\n' +
              'The content, exercises, and insights provided are for self-reflection and personal development only. They are not clinical diagnoses, medical advice, or a substitute for qualified professional guidance.\n\n' +
              'When to seek professional support\n' +
              'If you or your partner are experiencing domestic abuse, a mental health crisis, thoughts of self-harm, or feel unsafe in your relationship, please contact a qualified professional or use the crisis support contacts in your settings.\n\n' +
              'Your safety comes first\n' +
              'Tether is designed to be used in relationships where both partners feel safe. If there is any form of coercion, control, or abuse, relationship tools alone are not sufficient. Please prioritise your safety.\n\n' +
              'AI limitations\n' +
              'Tether uses AI to guide conversations and offer insights. While grounded in established research, AI responses are not infallible and should be taken as suggestions, not prescriptions.'
            )}
          />
          <SettingsRow icon={<IconShield size={18} color={Colors.midBrown} />} label="Privacy policy" sub="How we handle your data" onPress={() => Alert.alert('Privacy policy', 'Your session content is encrypted and stored only on your device and secure servers. It is never sold, shared, or used to train AI models. Your partner cannot see your vent sessions. You can export or delete your data at any time.')} />
          <SettingsRow icon={<IconInfo size={18} color={Colors.midBrown} />} label="Version" sub="Tether 1.0.0" />
        </Section>

        <TouchableOpacity
          style={styles.signOut}
          onPress={() => {
            Alert.alert('Sign out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign out', style: 'destructive', onPress: async () => {
                  dispatch({ type: 'SET_PROFILE', payload: { onboarded: false } });
                  await signOut();
                  router.replace('/');
                },
              },
            ]);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  header: { padding: 20, paddingBottom: 8 },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 26, color: Colors.charcoal },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 8, paddingLeft: 2 },
  sectionCard: { backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rowIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.creamDark, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal },
  rowSub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginTop: 1 },
  chevron: { fontSize: 18, color: Colors.lightBrown },
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  profilePill: { backgroundColor: Colors.creamDark, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 8 },
  pillLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 2 },
  pillValue: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.charcoal },
  signOut: { marginHorizontal: 20, marginTop: 8, borderWidth: 1.5, borderColor: Colors.sandDark, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center' },
  signOutText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.warmBrown },
  connectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  connectedDot: { fontSize: 10, color: Colors.sage },
  connectedText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.sage },
  notConnectedRow: { padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  notConnectedText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown },
  inviteCodeBox: { padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.creamDark, alignItems: 'center' },
  inviteCodeLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 8 },
  inviteCodeValue: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, letterSpacing: 4, marginBottom: 4 },
  inviteCodeHint: { fontFamily: Fonts.body, fontSize: 12, color: Colors.lightBrown, marginBottom: 12 },
  inviteShareBtn: { backgroundColor: '#96d35f', borderRadius: Radius.full, paddingHorizontal: 24, paddingVertical: 10 },
  inviteShareBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#001c14' },
});

const cs = StyleSheet.create({
  countryPicker: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  countryLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 2 },
  countryName: { fontFamily: Fonts.displaySemiBold, fontSize: 16, color: Colors.charcoal },
  changeText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.sage },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: Colors.warmWhite, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  sheetTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 20, color: Colors.charcoal },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.creamDark, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  countryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  countryRowActive: { backgroundColor: Colors.sagePale },
  countryRowName: { fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  countryRowCount: { fontFamily: Fonts.body, fontSize: 12, color: Colors.lightBrown },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', paddingVertical: 40 },
});
