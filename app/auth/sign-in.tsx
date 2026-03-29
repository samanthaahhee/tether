import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !password.trim()) return setError('Please fill in all fields.');
    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) {
      setError('Incorrect email or password.');
      setLoading(false);
      return;
    }
    // Routing handled by _layout based on auth + onboarded state
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.logoOrb}>
            <Text style={styles.logoText}>◎</Text>
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey.</Text>

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
              placeholder="Your password"
              placeholderTextColor={Colors.lightBrown}
              secureTextEntry
              onSubmitEditing={handleSignIn}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.btnText}>Sign in</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.replace('/auth/sign-up')} style={styles.switchLink}>
            <Text style={styles.switchText}>New to Tether? <Text style={styles.switchAction}>Create account</Text></Text>
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
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 21, marginBottom: 32 },
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
