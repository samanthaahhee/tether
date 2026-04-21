import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { IconLeaf } from '../../src/components/Icons';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email.trim()) return setError('Please enter your email.');
    setLoading(true);
    const { error: resetError } = await resetPassword(email.trim());
    setLoading(false);
    if (resetError) {
      // Only surface infrastructure errors — never leak whether the email exists.
      setError('Something went wrong. Please try again in a moment.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={s.logoOrb}>
            <IconLeaf size={28} color={Colors.white} />
          </View>

          {submitted ? (
            <>
              <Text style={s.title}>Check your email</Text>
              <Text style={s.subtitle}>
                If an account exists for <Text style={s.emphasis}>{email.trim()}</Text>, we've sent a link to reset your password. The link expires in 1 hour.
              </Text>
              <Text style={s.note}>
                Didn't receive it? Check your spam folder or try again in a few minutes.
              </Text>

              <TouchableOpacity
                style={s.btn}
                onPress={() => router.replace('/auth/sign-in')}
                activeOpacity={0.85}
              >
                <Text style={s.btnText}>Back to sign in</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={s.title}>Reset your password</Text>
              <Text style={s.subtitle}>
                Enter the email you used to sign up. We'll send you a link to choose a new password.
              </Text>

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
                  autoFocus
                  onSubmitEditing={handleSubmit}
                />

                {error ? <Text style={s.error}>{error}</Text> : null}

                <TouchableOpacity
                  style={[s.btn, loading && s.btnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading
                    ? <ActivityIndicator color={Colors.white} />
                    : <Text style={s.btnText}>Send reset link</Text>}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.replace('/auth/sign-in')} style={s.switchLink}>
                <Text style={s.switchText}>
                  Remembered it? <Text style={s.switchAction}>Back to sign in</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logoOrb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21, marginBottom: 20 },
  emphasis: { fontFamily: Fonts.bodyMedium, color: Colors.charcoal },
  note: { fontFamily: Fonts.body, fontSize: 13, color: Colors.lightBrown, textAlign: 'center', lineHeight: 20, marginBottom: 28 },

  form: { width: '100%', gap: 6, marginBottom: 24 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown, letterSpacing: 0.3, marginBottom: 2, marginTop: 4 },
  input: { width: '100%', padding: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.warmWhite, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: 4 },
  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: 12, minWidth: 200, ...Shadows.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  switchLink: { marginTop: 8 },
  switchText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  switchAction: { fontFamily: Fonts.bodyMedium, color: Colors.sageDark },
});
