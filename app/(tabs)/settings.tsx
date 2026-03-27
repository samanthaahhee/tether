import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { useAppState } from '../../src/hooks/useAppState';
import { ATTACHMENT_LABELS, LOVE_LABELS, CONFLICT_LABELS, WINDOW_LABELS, NEED_LABELS } from '../../src/constants/data';

function SettingsRow({ icon, label, sub, onPress, right }: { icon: string; label: string; sub?: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.row} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowIcon}>{icon}</Text>
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          {sub && <Text style={styles.rowSub}>{sub}</Text>}
        </View>
      </View>
      {right || (onPress && <Text style={styles.chevron}>›</Text>)}
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
  const p = state.profile;
  const [notifDaily, setNotifDaily] = useState(true);
  const [notifBridge, setNotifBridge] = useState(true);
  const [appLock, setAppLock] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

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
          <SettingsRow icon="✏️" label="Retake onboarding" sub="Update your profile answers" onPress={() => router.push('/onboarding')} />
        </Section>

        <Section title="Notifications">
          <SettingsRow icon="🌅" label="Daily check-in reminder" sub="9:00 AM" right={<Switch value={notifDaily} onValueChange={setNotifDaily} trackColor={{ false: Colors.sand, true: Colors.sage }} />} />
          <SettingsRow icon="🌉" label="Bridge message alerts" sub="When partner sends a message" right={<Switch value={notifBridge} onValueChange={setNotifBridge} trackColor={{ false: Colors.sand, true: Colors.sage }} />} />
        </Section>

        <Section title="Privacy and safety">
          <SettingsRow icon="🔒" label="App lock" sub="Require Face ID or passcode" right={<Switch value={appLock} onValueChange={setAppLock} trackColor={{ false: Colors.sand, true: Colors.sage }} />} />
          <SettingsRow icon="🛡️" label="Data and encryption" sub="AES-256, never sold or shared" onPress={() => Alert.alert('Encryption', 'All session content is encrypted. Your vent sessions are never visible to your partner.')} />
          <SettingsRow icon="📦" label="Export my data" sub="Download everything (GDPR)" onPress={() => Alert.alert('Coming soon', 'Data export will be available in the next update.')} />
        </Section>

        <Section title="Crisis support">
          <SettingsRow icon="🆘" label="Lifeline SA" sub="0800 567 567" onPress={() => Linking.openURL('tel:+27800567567')} />
          <SettingsRow icon="📞" label="SA DSD Crisis Line" sub="116" onPress={() => Linking.openURL('tel:116')} />
          <SettingsRow icon="💙" label="SADAG" sub="0800 456 789" onPress={() => Linking.openURL('tel:+27800456789')} />
        </Section>

        <Section title="About">
          <SettingsRow icon="📚" label="Therapeutic frameworks" sub="Gottman, EFT, NVC, IFS, CBCT" onPress={() => Alert.alert('Frameworks', 'Tether is built on Gottman Method, EFT, NVC, IFS, and CBCT research.')} />
          <SettingsRow icon="ℹ️" label="Version" sub="Tether 1.0.0" />
        </Section>

        <TouchableOpacity
          style={styles.signOut}
          onPress={() => {
            dispatch({ type: 'SET_PROFILE', payload: { onboarded: false } });
            router.replace('/');
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
  rowIcon: { fontSize: 17 },
  rowLabel: { fontFamily: Fonts.body, fontSize: 14, color: Colors.charcoal },
  rowSub: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginTop: 1 },
  chevron: { fontSize: 18, color: Colors.lightBrown },
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.creamDark },
  profilePill: { backgroundColor: Colors.creamDark, borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 8 },
  pillLabel: { fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.midBrown, marginBottom: 2 },
  pillValue: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.charcoal },
  signOut: { marginHorizontal: 20, marginTop: 8, borderWidth: 1.5, borderColor: Colors.sandDark, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center' },
  signOutText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.warmBrown },
});
