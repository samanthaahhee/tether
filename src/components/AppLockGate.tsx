import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../constants/theme';
import { useAppLock } from '../hooks/useAppLock';

/**
 * Wraps the app and intercepts rendering when the lock is engaged.
 * Renders a minimal "Hey Otis is locked" screen with a single Unlock
 * button that triggers Face ID / Touch ID / passcode.
 *
 * Auto-prompts on mount so the user doesn't have to tap a button to
 * see the system biometric sheet — feels native.
 */
export function AppLockGate({ children }: { children: React.ReactNode }) {
  const { locked, attemptUnlock } = useAppLock();

  // Auto-prompt after the lock screen renders. 1200ms lets the user
  // comfortably read 'Hey Otis is locked' + 'Use Face ID, Touch ID,
  // or your passcode to unlock' before the system sheet covers it —
  // shorter delays felt like a flicker.
  useEffect(() => {
    if (!locked) return;
    const t = setTimeout(() => attemptUnlock(), 1200);
    return () => clearTimeout(t);
  }, [locked, attemptUnlock]);

  if (!locked) return <>{children}</>;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.centered}>
        <Image source={require('../../assets/icon.png')} style={s.icon} resizeMode="contain" />
        <Text style={s.title}>Hey Otis is locked</Text>
        <Text style={s.subtitle}>Use Face ID, Touch ID, or your passcode to unlock.</Text>
        <TouchableOpacity style={s.btn} onPress={attemptUnlock} activeOpacity={0.85}>
          <Text style={s.btnText}>Unlock</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  centered: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 96, height: 96, marginBottom: 24, borderRadius: 22 },
  title: { fontFamily: Fonts.displaySemiBold, fontSize: 22, color: Colors.charcoal, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center', marginBottom: 32, maxWidth: 340 },
  btn: { backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 14, paddingHorizontal: 40, ...Shadows.sm },
  btnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
});
