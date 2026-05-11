import React, { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';
import { ChevronLeft } from '../../src/components/Icon';
import { PasswordInput, PasswordInputHandle } from '../../src/components/PasswordInput';
import { PasswordRules } from '../../src/components/PasswordRules';
import { checkPassword, PASSWORD_MIN_LENGTH } from '../../src/utils/passwordPolicy';

/**
 * Change password from inside Settings. Reachable only when signed in;
 * the existing session is enough authority for Supabase's updateUser.
 * (Re-authentication mid-session would be more conservative but is
 * unusual for in-app password changes — most consumer apps don't.)
 */
export default function ChangePassword() {
  const { user, updatePassword } = useAuth();
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwFocused, setPwFocused] = useState(false);
  const confirmRef = useRef<PasswordInputHandle>(null);

  const handleSubmit = async () => {
    setError('');
    const check = checkPassword(pw1);
    if (!check.ok) return setError(check.error || 'Password is not strong enough.');
    if (pw1 !== pw2) return setError('Passwords do not match.');

    setLoading(true);
    const { error: updateError } = await updatePassword(pw1);
    setLoading(false);
    if (updateError) {
      if (/rate limit|too many/i.test(updateError)) {
        setError('Too many attempts. Try again in a few minutes.');
      } else {
        setError(updateError);
      }
      return;
    }
    router.replace('/(tabs)/settings');
  };

  if (!user) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.centered}>
          <Text style={s.title}>You&apos;re signed out</Text>
          <Text style={s.subtitle}>Sign in again to change your password.</Text>
          <TouchableOpacity style={s.btn} onPress={() => router.replace('/auth/sign-in')} activeOpacity={0.85}>
            <Text style={s.btnText}>Go to sign in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={s.back}>
            <ChevronLeft size={24} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Change password</Text>
          <View style={{ width: 24 }} />
        </View>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={s.subtitle}>
            Choose a new password. You&apos;ll stay signed in on this device; other devices will need to sign in again.
          </Text>

          <View style={s.form}>
            <Text style={s.label}>New password</Text>
            <PasswordInput
              value={pw1}
              onChangeText={(v) => { setPw1(v); if (error) setError(''); }}
              placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              autoFocus
              textContentType="newPassword"
              autoComplete="new-password"
              passwordRules={`minlength: ${PASSWORD_MIN_LENGTH}; required: lower; required: upper; required: digit; required: special;`}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              accessibilityLabel="New password"
            />
            {(pwFocused || pw1.length > 0) && <PasswordRules password={pw1} />}

            <Text style={s.label}>Confirm new password</Text>
            <PasswordInput
              ref={confirmRef}
              value={pw2}
              onChangeText={(v) => { setPw2(v); if (error) setError(''); }}
              placeholder="Repeat your new password"
              placeholderTextColor={Colors.lightBrown}
              selectionColor="#96d35f"
              cursorColor="#96d35f"
              textContentType="newPassword"
              autoComplete="new-password"
              onSubmitEditing={handleSubmit}
              returnKeyType="go"
              accessibilityLabel="Confirm new password"
            />
            {pw2.length > 0 && pw2 !== pw1 && (
              <Text style={s.mismatch}>Passwords don&apos;t match yet.</Text>
            )}

            {error ? <Text style={s.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.btnText}>Update password</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.sand },
  back: { width: 24, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.displaySemiBold, fontSize: 16, color: Colors.charcoal },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 32 },
  centered: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 24, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  form: { width: '100%', gap: 6 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.midBrown, letterSpacing: 0.3, marginBottom: 2, marginTop: 8 },
  mismatch: { fontFamily: Fonts.body, fontSize: 12, color: Colors.errorText, marginTop: 4 },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.errorText, marginTop: 4 },
  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: 16, ...Shadows.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
});
