import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { PasswordInput } from '../../src/components/PasswordInput';
import { PasswordRules } from '../../src/components/PasswordRules';
import { IconLeaf, IconHeart } from '../../src/components/Icons';
import { checkPassword, PASSWORD_MIN_LENGTH } from '../../src/utils/passwordPolicy';

export default function SignUp() {
  const { invite } = useLocalSearchParams<{ invite?: string }>();
  const { signUp, signInWithGoogle, signInWithApple, acceptInvite } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwFocused, setPwFocused] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields.');
    if (password !== confirm) return setError('Passwords do not match.');

    const check = checkPassword(password);
    if (!check.ok) return setError(check.error || 'Password is not strong enough.');

    const cleanEmail = email.trim().toLowerCase();
    setLoading(true);
    const { error: signUpError, needsVerification } = await signUp(cleanEmail, password);
    if (signUpError) {
      // Friendlier copy for the two errors a user can actually act on.
      if (/rate limit|too many|email rate/i.test(signUpError)) {
        setError('We\'ve sent too many emails recently. Wait a few minutes, then try again. If you already have an account, sign in below.');
      } else if (/network|fetch|offline/i.test(signUpError)) {
        setError('Check your connection and try again.');
      } else {
        setError(signUpError);
      }
      setLoading(false);
      return;
    }

    if (invite && !needsVerification) await acceptInvite(invite);

    setLoading(false);

    if (needsVerification) {
      router.replace({ pathname: '/auth/verify-email', params: { email: cleanEmail } });
    } else {
      router.replace('/intro');
    }
  };

  // Detect the friendly "already have an account" error so we can surface a
  // direct path to sign in (with the email pre-filled).
  const alreadyExists = error.toLowerCase().includes('already have an account');

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: gError } = await signInWithGoogle();
    if (gError) setError(gError);
    if (invite) await acceptInvite(invite);
    setGoogleLoading(false);
  };

  const handleApple = async () => {
    setError('');
    setAppleLoading(true);
    const { error: aError } = await signInWithApple();
    if (aError && aError !== 'Apple sign-in was cancelled.') setError(aError);
    if (!aError && invite) await acceptInvite(invite);
    setAppleLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={s.logoOrb}>
            <IconLeaf size={28} color={Colors.white} />
          </View>
          <Text style={s.title}>Create your account</Text>
          <Text style={s.subtitle}>
            {invite
              ? 'Your partner invited you to Hey Otis. Create an account to connect.'
              : 'Start your journey toward better communication.'}
          </Text>

          {invite && (
            <View style={s.inviteBadge}>
              <IconHeart size={14} color={Colors.mauve} />
              <Text style={s.inviteText}>Joining via partner invite</Text>
            </View>
          )}

          {/* Apple Sign-In — iOS only, required by Apple Guideline 4.8
              when any third-party social sign-in is offered. */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={s.appleBtn} onPress={handleApple} disabled={appleLoading} activeOpacity={0.85}>
              {appleLoading
                ? <ActivityIndicator color={Colors.white} />
                : <>
                    <Text style={s.appleLogo}></Text>
                    <Text style={s.appleText}>Continue with Apple</Text>
                  </>
              }
            </TouchableOpacity>
          )}

          {/* Google Sign-In */}
          <TouchableOpacity style={s.googleBtn} onPress={handleGoogle} disabled={googleLoading} activeOpacity={0.85}>
            {googleLoading
              ? <ActivityIndicator color={Colors.charcoal} />
              : <>
                  <Text style={s.googleG}>G</Text>
                  <Text style={s.googleText}>Continue with Google</Text>
                </>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Email form */}
          <View style={s.form}>
            <Text style={s.label}>Email</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={(v) => { setEmail(v); if (error) setError(''); }}
              placeholder="you@example.com"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="emailAddress"
              autoComplete="email"
            />

            <Text style={s.label}>Password</Text>
            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              textContentType="newPassword"
              autoComplete="new-password"
              passwordRules={`minlength: ${PASSWORD_MIN_LENGTH}; required: lower; required: upper; required: digit; required: special;`}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
            />
            {(pwFocused || password.length > 0) && <PasswordRules password={password} />}

            <Text style={s.label}>Confirm password</Text>
            <PasswordInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Repeat your password"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              textContentType="newPassword"
              autoComplete="new-password"
              onSubmitEditing={handleSignUp}
            />
            {confirm.length > 0 && confirm !== password && (
              <Text style={s.mismatch}>Passwords don&apos;t match yet.</Text>
            )}

            {error ? <Text style={s.error}>{error}</Text> : null}
            {alreadyExists && (
              <TouchableOpacity
                style={s.altBtn}
                onPress={() => router.replace({ pathname: '/auth/sign-in', params: { email: email.trim().toLowerCase() } })}
                activeOpacity={0.85}
              >
                <Text style={s.altBtnText}>Go to sign in</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.btnText}>Create account</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace('/auth/sign-in')} style={s.switchLink}>
            <Text style={s.switchText}>Already have an account? <Text style={s.switchAction}>Sign in</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 40, paddingBottom: 32, alignItems: 'center' },
  logoOrb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  inviteBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.mauvePale, borderWidth: 1, borderColor: Colors.mauveLight, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 20 },
  inviteText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.mauveDark },

  // Apple
  appleBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#000000', borderRadius: Radius.full, paddingVertical: 14, marginBottom: 12 },
  appleLogo: { fontSize: 18, color: '#ffffff', marginTop: -2 },
  appleText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#ffffff' },

  // Google
  googleBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.full, paddingVertical: 14, marginBottom: 20 },
  googleG: { fontFamily: Fonts.bodyMedium, fontSize: 18, color: Colors.charcoal },
  googleText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.sand },
  dividerText: { fontFamily: Fonts.body, fontSize: 12, color: Colors.lightBrown },

  // Form
  form: { width: '100%', gap: 6, marginBottom: 24 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown, letterSpacing: 0.3, marginBottom: 2, marginTop: 4 },
  input: { width: '100%', padding: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  hint: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginTop: 2 },
  hintBold: { fontFamily: Fonts.bodyMedium, color: Colors.charcoal },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: 4 },
  mismatch: { fontFamily: Fonts.body, fontSize: 12, color: Colors.errorText, marginTop: 4 },
  altBtn: { marginTop: 10, backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.full, paddingVertical: 12, alignItems: 'center' },
  altBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.charcoal },
  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: 12, ...Shadows.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  switchLink: { marginTop: 8 },
  switchText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  switchAction: { fontFamily: Fonts.bodyMedium, color: Colors.sageDark },
});
