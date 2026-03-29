import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../../src/constants/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function AcceptInvite() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { user, couple, loading: authLoading, acceptInvite } = useAuth();
  const [status, setStatus] = useState<'idle' | 'accepting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Not signed in — send to sign-up with invite code
      router.replace({ pathname: '/auth/sign-up', params: { invite: code } });
      return;
    }

    if (couple) {
      // Already in a couple
      setStatus('success');
      return;
    }

    // Signed in, no couple — accept the invite
    handleAccept();
  }, [authLoading, user, couple]);

  const handleAccept = async () => {
    if (!code) return;
    setStatus('accepting');
    const { error } = await acceptInvite(code);
    if (error) {
      setErrorMsg(error);
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  if (authLoading || status === 'idle' || status === 'accepting') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.terracotta} />
          <Text style={styles.loadingText}>Connecting you with your partner…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>😔</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>{errorMsg}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
            <Text style={styles.btnText}>Go to app</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>💞</Text>
        <Text style={styles.title}>You are connected</Text>
        <Text style={styles.subtitle}>
          You and your partner are now linked on Tether. You will see each other's Bridge sessions and can grow together.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')} activeOpacity={0.85}>
          <Text style={styles.btnText}>Enter Tether</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.warmWhite },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  loadingText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, marginTop: 16, textAlign: 'center' },
  title: { fontFamily: Fonts.display, fontSize: 26, color: Colors.charcoal, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: { backgroundColor: Colors.terracotta, borderRadius: Radius.full, paddingVertical: 14, paddingHorizontal: 32 },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
});
