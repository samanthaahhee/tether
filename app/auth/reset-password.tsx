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
import { PasswordInput } from '../../src/components/PasswordInput';
import { checkPassword, passwordStrengthLabel, PASSWORD_MIN_LENGTH } from '../../src/utils/passwordPolicy';

/**
 * Reached via deep-link from the password-reset email:
 *   tether://auth/reset-password
 *
 * Supabase's email link puts the one-time code in a fragment. The root auth
 * provider (`useAuth`) listens for the incoming URL, calls
 * `exchangeCodeForSession`, and by the time we land on this screen the user
 * already has a short-lived authenticated session that can call updateUser.
 *
 * If there's no session (e.g. direct nav, expired code), we bail out back to
 * forgot-password so the user requests a fresh link.
 */
export default function ResetPassword() {
  const { user, updatePassword } = useAuth();
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = passwordStrengthLabel(pw1);

  const handleSubmit = async () => {
    setError('');
    if (!user) {
      setError('Your reset link has expired or is invalid. Please request a new one.');
      return;
    }
    const check = checkPassword(pw1);
    if (!check.ok) return setError(check.error || 'Password is not strong enough.');
    if (pw1 !== pw2) return setError('Passwords do not match.');

    setLoading(true);
    const { error: updateError } = await updatePassword(pw1);
    setLoading(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    router.replace('/(tabs)');
  };

  // If the user arrived here without an active session the code exchange
  // failed or expired. Give them a clear path back.
  if (!user) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.centered}>
          <View style={s.logoOrb}><IconLeaf size={28} color={Colors.white} /></View>
          <Text style={s.title}>Link expired</Text>
          <Text style={s.subtitle}>
            This password-reset link has expired or is invalid. Please request a new one.
          </Text>
          <TouchableOpacity
            style={s.btn}
            onPress={() => router.replace('/auth/forgot-password')}
            activeOpacity={0.85}
          >
            <Text style={s.btnText}>Request a new link</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.logoOrb}>
            <IconLeaf size={28} color={Colors.white} />
          </View>
          <Text style={s.title}>Set a new password</Text>
          <Text style={s.subtitle}>
            Choose something at least {PASSWORD_MIN_LENGTH} characters, with a letter, a number and a symbol.
          </Text>

          <View style={s.form}>
            <Text style={s.label}>New password</Text>
            <PasswordInput
              value={pw1}
              onChangeText={setPw1}
              placeholder="Your new password"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              autoFocus
            />
            {pw1.length > 0 && (
              <Text style={[s.hint, strength === 'strong' && s.hintStrong]}>
                Strength: {strength}
              </Text>
            )}

            <Text style={s.label}>Confirm new password</Text>
            <PasswordInput
              value={pw2}
              onChangeText={setPw2}
              placeholder="Repeat your new password"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
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
                : <Text style={s.btnText}>Set new password</Text>}
            </TouchableOpacity>

            <Text style={s.note}>
              Setting a new password will sign you out on any other devices for your security.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logoOrb: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 28, color: Colors.charcoal, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21, marginBottom: 24 },

  form: { width: '100%', gap: 6, marginBottom: 24 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown, letterSpacing: 0.3, marginBottom: 2, marginTop: 4 },
  input: { width: '100%', padding: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.warmWhite, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  hint: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown, marginTop: 2 },
  hintStrong: { color: Colors.sageDark, fontFamily: Fonts.bodyMedium },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: 4 },
  note: { fontFamily: Fonts.body, fontSize: 12, color: Colors.lightBrown, textAlign: 'center', marginTop: 14, lineHeight: 18 },
  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: 12, minWidth: 200, ...Shadows.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
});
