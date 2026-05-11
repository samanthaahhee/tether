import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { IconHeart } from '../../src/components/Icons';

/**
 * Shown after email+password sign-up when the Supabase project has
 * "Confirm email" enabled. Also reached by the RouteGuard if a signed-in user
 * has `email_confirmed_at === null`.
 *
 * The user lands here without a full session — they cannot enter the app
 * until they click the link in their email.
 */
export default function VerifyEmail() {
  const { user, resendVerification, signOut } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = user?.email || params.email || '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const handleResend = async () => {
    if (!email) {
      setStatus('error');
      setErrorText('We could not find your email. Please sign in again.');
      return;
    }
    setStatus('sending');
    const { error } = await resendVerification(email);
    if (error) {
      setStatus('error');
      setErrorText(error);
      return;
    }
    setStatus('sent');
  };

  const handleChangeAccount = async () => {
    await signOut();
    router.replace('/auth/sign-up');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.logoOrb}>
          <IconHeart size={28} color={Colors.white} />
        </View>
        <Text style={s.title}>Verify your email</Text>
        <Text style={s.subtitle}>
          We sent a verification link to
          {email ? <> <Text style={s.emphasis}>{email}</Text></> : null}.
          Open it from your inbox to finish setting up your account.
        </Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Didn't get the email?</Text>
          <Text style={s.cardBody}>
            Check your spam folder. If it's not there, we can send a fresh link.
          </Text>

          <TouchableOpacity
            style={[s.btn, status === 'sending' && s.btnDisabled]}
            onPress={handleResend}
            disabled={status === 'sending' || status === 'sent'}
            activeOpacity={0.85}
          >
            {status === 'sending'
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.btnText}>
                  {status === 'sent' ? 'Link sent — check your inbox' : 'Send a new link'}
                </Text>}
          </TouchableOpacity>

          {status === 'error' && errorText ? <Text style={s.error}>{errorText}</Text> : null}
        </View>

        <TouchableOpacity onPress={handleChangeAccount} style={s.switchLink}>
          <Text style={s.switchText}>
            Wrong email? <Text style={s.switchAction}>Sign up again</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} style={s.switchLink}>
          <Text style={s.switchText}>
            Already verified? <Text style={s.switchAction}>Reset your password</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logoOrb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.mauveLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 380 },
  emphasis: { fontFamily: Fonts.bodyMedium, color: Colors.charcoal },

  card: { width: '100%', maxWidth: 420, backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 20, marginBottom: 20 },
  cardTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 16, color: Colors.charcoal, marginBottom: 6 },
  cardBody: { fontFamily: Fonts.body, fontSize: 13, color: Colors.midBrown, lineHeight: 20, marginBottom: 16 },

  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 13, alignItems: 'center', ...Shadows.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: 10, textAlign: 'center' },

  switchLink: { marginTop: 8 },
  switchText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  switchAction: { fontFamily: Fonts.bodyMedium, color: Colors.sageDark },
});
