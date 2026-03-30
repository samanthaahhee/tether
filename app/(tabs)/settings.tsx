import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert, Linking, Share, ActivityIndicator, Modal, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { IconHeart, IconUser, IconBell, IconLeaf, IconBookmark, IconLink, IconMail, IconKey, IconEdit, IconShield, IconBox, IconPhone, IconInfo, IconLock, IconSun, IconSearch, IconX } from '../../src/components/Icons';
import { ChevronRight } from '../../src/components/Icon';
import { CRISIS_COUNTRIES, getCrisisLines } from '../../src/constants/crisisLines';
import { useAppState } from '../../src/hooks/useAppState';
import { ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS } from '../../src/constants/data';
import { PartnerProfile } from '../../src/hooks/useAppState';
import { useAuth } from '../../src/hooks/useAuth';

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
  const [notifDaily, setNotifDaily] = useState(true);
  const [notifBridge, setNotifBridge] = useState(true);
  const [appLock, setAppLock] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

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
                    message: `Join me on Tether 💞\n\nDownload the app and use invite code: ${code}\n\nor tap: tether://invite/${code}`,
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
                sub="Send them a link to create their account"
                onPress={async () => {
                  setInviteLoading(true);
                  const code = await generateInvite();
                  setInviteLoading(false);
                  Share.share({
                    message: `Join me on Tether 💞\n\nDownload the app and use invite code: ${code}\n\nor tap: tether://invite/${code}`,
                    title: 'Join me on Tether',
                  });
                }}
                right={inviteLoading ? <ActivityIndicator size="small" color={Colors.terracotta} /> : undefined}
              />
              <SettingsRow
                icon={<IconKey size={18} color={Colors.midBrown} />}
                label="I have an invite code"
                sub="Enter a code your partner sent you"
                onPress={() => {
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
          <SettingsRow icon={<IconEdit size={18} color={Colors.midBrown} />} label="Retake onboarding" sub="Update your profile answers" onPress={() => router.push('/onboarding')} />
        </Section>

        <Section title="Partner's profile">
          {partnerSet ? (
            <View style={styles.profileGrid}>
              {[
                { label: 'Attachment', value: ATTACHMENT_LABELS[pp.attachment] || 'Not set' },
                { label: 'Love language', value: LOVE_LABELS[pp.love] || 'Not set' },
                { label: 'Conflict style', value: CONFLICT_LABELS[pp.conflict] || 'Not set' },
                { label: 'Body response', value: WINDOW_LABELS[pp.window] || 'Not set' },
                { label: 'Core need', value: NEED_LABELS[pp.need] || 'Not set' },
              ].map((item) => (
                <View key={item.label} style={styles.profilePill}>
                  <Text style={styles.pillLabel}>{item.label}</Text>
                  <Text style={styles.pillValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <SettingsRow
            icon={<IconHeart size={18} color={Colors.midBrown} />}
            label={partnerSet ? `Update ${pp.name || 'partner'}'s profile` : 'Set up partner profile'}
            sub={partnerSet ? 'They can redo the questions anytime' : 'Hand your phone to your partner to fill in'}
            onPress={() => router.push('/partner-onboarding')}
          />
        </Section>

        <Section title="Notifications">
          <SettingsRow icon={<IconSun size={18} color={Colors.midBrown} />} label="Daily check-in reminder" sub="9:00 AM" right={<Switch value={notifDaily} onValueChange={setNotifDaily} trackColor={{ false: Colors.sand, true: Colors.sage }} />} />
          <SettingsRow icon={<IconBell size={18} color={Colors.midBrown} />} label="Session alerts" sub="When a session is completed" right={<Switch value={notifBridge} onValueChange={setNotifBridge} trackColor={{ false: Colors.sand, true: Colors.sage }} />} />
        </Section>

        <Section title="Privacy and safety">
          <SettingsRow icon={<IconLock size={18} color={Colors.midBrown} />} label="App lock" sub="Require Face ID or passcode" right={<Switch value={appLock} onValueChange={setAppLock} trackColor={{ false: Colors.sand, true: Colors.sage }} />} />
          <SettingsRow icon={<IconShield size={18} color={Colors.midBrown} />} label="Data and encryption" sub="AES-256, never sold or shared" onPress={() => Alert.alert('Your data is protected', 'All session content is encrypted with AES-256. Your vent sessions are never visible to your partner. Your data is never sold or shared with third parties.')} />
          <SettingsRow icon={<IconBox size={18} color={Colors.midBrown} />} label="Export my data" sub="Download everything (GDPR)" onPress={() => Alert.alert('Coming soon', 'Data export will be available in the next update.')} />
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
          <SettingsRow icon={<IconBookmark size={18} color={Colors.midBrown} />} label="Therapeutic frameworks" sub="Gottman, EFT, NVC, IFS, CBCT" onPress={() => Alert.alert('About Tether', 'Tether draws on research from Gottman Method, Emotionally Focused Therapy (EFT), Non-Violent Communication (NVC), Internal Family Systems (IFS), and Cognitive Behavioural Couples Therapy (CBCT).')} />
          <SettingsRow
            icon={<IconInfo size={18} color={Colors.midBrown} />}
            label="Important notice"
            sub="Tether is not a substitute for therapy"
            onPress={() => Alert.alert(
              'Important notice',
              'Tether is a self-guided relationship wellness tool, not a substitute for therapy, counselling, or medical advice.\n\nThe assessments are for self-reflection only and are not clinical diagnoses.\n\nIf you are experiencing a mental health crisis, domestic abuse, or feel you need professional support, please reach out to a qualified mental health professional or use the crisis contacts listed in this section.'
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
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.terracotta, marginBottom: 8, paddingLeft: 2 },
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
});

const cs = StyleSheet.create({
  countryPicker: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  countryLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 2 },
  countryName: { fontFamily: Fonts.display, fontSize: 16, color: Colors.charcoal },
  changeText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.sage },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: Colors.warmWhite, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '80%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  sheetTitle: { fontFamily: Fonts.display, fontSize: 20, color: Colors.charcoal },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12, backgroundColor: Colors.creamDark, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 10 },
  searchInput: { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  countryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  countryRowActive: { backgroundColor: Colors.sagePale },
  countryRowName: { fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  countryRowCount: { fontFamily: Fonts.body, fontSize: 12, color: Colors.lightBrown },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', paddingVertical: 40 },
});
