import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function SignUp() {
  const { invite } = useLocalSearchParams<{ invite?: string }>();
  const { signUp, acceptInvite } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    const { error: signUpError } = await signUp(email.trim(), password);
    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    // If joining via invite, accept it now
    if (invite) {
      await acceptInvite(invite);
      router.replace('/onboarding');
    } else {
      router.replace('/onboarding');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.logoOrb}>
            <Text style={styles.logoText}>◎</Text>
          </View>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            {invite
              ? 'Your partner invited you to Tether. Create an account to connect.'
              : 'Start your journey toward better communication.'}
          </Text>

          {invite && (
            <View style={styles.inviteBadge}>
              <Text style={styles.inviteText}>💞 Joining via partner invite</Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.lightBrown}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={Colors.lightBrown}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Repeat your password"
              placeholderTextColor={Colors.lightBrown}
              secureTextEntry
              onSubmitEditing={handleSignUp}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.btnText}>Create account</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace('/auth/sign-in')} style={styles.switchLink}>
            <Text style={styles.switchText}>Already have an account? <Text style={styles.switchAction}>Sign in</Text></Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.warmWhite },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32, alignItems: 'center' },
  logoOrb: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.terracotta, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoText: { fontSize: 26, color: Colors.white },
  title: { fontFamily: Fonts.display, fontSize: 28, color: Colors.charcoal, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  inviteBadge: { backgroundColor: Colors.blushPale, borderWidth: 1, borderColor: Colors.blush, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 20 },
  inviteText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.blush },
  form: { width: '100%', gap: 8, marginBottom: 24 },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.charcoal, letterSpacing: 0.3, marginBottom: 2 },
  input: { width: '100%', padding: 14, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.cream, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal, marginBottom: 8 },
  error: { fontFamily: Fonts.body, fontSize: 13, color: Colors.terracotta, marginBottom: 4 },
  btn: { backgroundColor: Colors.terracotta, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  switchLink: { marginTop: 8 },
  switchText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  switchAction: { fontFamily: Fonts.bodyMedium, color: Colors.terracotta },
});
