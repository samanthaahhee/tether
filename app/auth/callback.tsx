import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { IconHeart } from '../../src/components/Icons';

/**
 * Deep-link landing page for `tether://auth/callback`.
 *
 * The actual session exchange (`exchangeCodeForSession`) runs inside the
 * useAuth Linking handler the moment the URL arrives — by the time this
 * screen mounts, that exchange has either completed or is about to.
 *
 * This screen exists to:
 *   1. Show the user a "Verifying…" state instead of a blank route fallback
 *   2. Show a confirmation + auto-route once the session lands
 *   3. Give the user a manual recovery path if the link is bad / expired
 */
export default function AuthCallback() {
  const { user, loading } = useAuth();
  const [waited, setWaited] = useState(false);

  // After ~5s of no session, show the recovery UI. The Linking handler in
  // useAuth runs immediately on URL receipt, so 5s is generous — if we're
  // still waiting it's almost certainly a bad/expired link or a redirect-URL
  // allow-list mismatch in the Supabase dashboard.
  useEffect(() => {
    const t = setTimeout(() => setWaited(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // RouteGuard handles the actual onward navigation once `user` lands — we
  // just stay here until that happens.
  if (user && !loading) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.centered}>
          <View style={s.logoOrb}><IconHeart size={28} color={Colors.white} /></View>
          <Text style={s.title}>You&apos;re in.</Text>
          <Text style={s.subtitle}>Email verified — taking you to your account.</Text>
          <ActivityIndicator color={Colors.sageDark} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (waited) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.centered}>
          <View style={s.logoOrb}><IconHeart size={28} color={Colors.white} /></View>
          <Text style={s.title}>Link didn&apos;t work</Text>
          <Text style={s.subtitle}>
            This verification link may have expired or already been used. You can
            request a fresh one, or recover your account if you forgot your password.
          </Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => router.replace('/auth/verify-email')}
            activeOpacity={0.85}
          >
            <Text style={s.btnText}>Resend verification email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnSecondary}
            onPress={() => router.replace('/auth/forgot-password')}
            activeOpacity={0.85}
          >
            <Text style={s.btnSecondaryText}>Forgot your password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.linkOnly}
            onPress={() => router.replace('/auth/sign-in')}
            activeOpacity={0.7}
          >
            <Text style={s.linkOnlyText}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.centered}>
        <View style={s.logoOrb}><IconHeart size={28} color={Colors.white} /></View>
        <Text style={s.title}>Verifying…</Text>
        <Text style={s.subtitle}>One moment while we finish setting up your account.</Text>
        <ActivityIndicator color={Colors.sageDark} style={{ marginTop: 16 }} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  centered: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  logoOrb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.mauveLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 26, color: Colors.charcoal, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 22, maxWidth: 360 },
  btn: { marginTop: 24, backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 13, paddingHorizontal: 28, ...Shadows.sm },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  btnSecondary: { marginTop: 12, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.full, paddingVertical: 13, paddingHorizontal: 28 },
  btnSecondaryText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal },
  linkOnly: { marginTop: 16, paddingVertical: 8 },
  linkOnlyText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown },
});
