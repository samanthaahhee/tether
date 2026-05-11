import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { PasswordInput } from '../../src/components/PasswordInput';

export default function SignIn() {
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields.');
    setLoading(true);
    const { error: signInError } = await signIn(email.trim().toLowerCase(), password);
    if (signInError) {
      // Surface rate-limit responses so the user understands the wait.
      if (/rate limit|too many/i.test(signInError)) {
        setError('Too many attempts. Try again in a few minutes.');
      } else {
        setError('Incorrect email or password.');
      }
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const { error: gError } = await signInWithGoogle();
    if (gError) setError(gError);
    setGoogleLoading(false);
  };

  const handleApple = async () => {
    setError('');
    setAppleLoading(true);
    const { error: aError } = await signInWithApple();
    if (aError && aError !== 'Apple sign-in was cancelled.') setError(aError);
    setAppleLoading(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <Image
            source={require('../../assets/mascot-nurture.png')}
            style={s.mascot}
            resizeMode="contain"
          />
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>Sign in to continue your journey.</Text>

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
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={!params.email}
              returnKeyType="next"
              textContentType="emailAddress"
              autoComplete="email"
            />

            <Text style={s.label}>Password</Text>
            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              onSubmitEditing={handleSignIn}
              textContentType="password"
              autoComplete="current-password"
              autoFocus={!!params.email}
            />

            {error ? <Text style={s.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.btnText}>Sign in</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/auth/forgot-password')}
              style={s.forgotLink}
              hitSlop={8}
            >
              <Text style={s.forgotText}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace('/auth/sign-up')} style={s.switchLink}>
            <Text style={s.switchText}>New to Hey Otis? <Text style={s.switchAction}>Create account</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logoOrb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  mascot: { width: 120, height: 120, marginBottom: 16 },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21, marginBottom: 28 },

  // Google
  appleBtn: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#000000', borderRadius: Radius.full, paddingVertical: 14, marginBottom: 12 },
  appleLogo: { fontSize: 18, color: '#ffffff', marginTop: -2 },
  appleText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#ffffff' },
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
  input: { width: '100%', padding: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.warmWhite, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: 4 },
  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: 12, ...Shadows.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  forgotLink: { alignSelf: 'center', paddingVertical: 12, marginTop: 4 },
  forgotText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.midBrown },
  switchLink: { marginTop: 8 },
  switchText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  switchAction: { fontFamily: Fonts.bodyMedium, color: Colors.sageDark },
});
