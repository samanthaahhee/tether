import { useEffect } from 'react';
import { View } from 'react-native';
import { Slot, router, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { Poppins_300Light, Poppins_300Light_Italic, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';
import { AppStateProvider } from '../src/hooks/useAppState';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';
import { track } from '../src/lib/posthog';

function RouteGuard() {
  const { user, profile, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const seg0 = segments[0] as string | undefined;
    const seg1 = (segments as unknown as string[])[1] as string | undefined;
    const inAuthGroup = seg0 === 'auth';
    const inInviteGroup = seg0 === 'invite';
    const inTabs = seg0 === '(tabs)';
    const onVerifyEmail = inAuthGroup && seg1 === 'verify-email';
    const onResetPassword = inAuthGroup && seg1 === 'reset-password';
    const onForgotPassword = inAuthGroup && seg1 === 'forgot-password';

    // Let invite links always through
    if (inInviteGroup) return;

    // Password-reset flow has the highest precedence — do not redirect out.
    // It's an authenticated screen (short-lived session), but it is NOT a
    // signal that the user should land in tabs.
    if (onResetPassword) return;

    // Opening screen (index) handles its own splash/redirect logic — let it be
    if (seg0 === undefined) return;

    if (!user) {
      // Not signed in — only allow opening screen and auth pages.
      // Forgot-password is reachable without a session.
      if (!inAuthGroup) {
        router.replace('/');
      }
      return;
    }

    // Signed-in user: enforce email verification. OAuth users (e.g. Google)
    // arrive with `email_confirmed_at` already set, so they pass through.
    // Email+password users who bypassed confirmation are pinned to the
    // verify-email screen until they click the link.
    const emailVerified = !!user.email_confirmed_at || !!(user as any).confirmed_at;
    if (!emailVerified) {
      if (!onVerifyEmail) {
        router.replace('/auth/verify-email');
      }
      return;
    }

    if (!profile) {
      // Signed in + verified but profile not loaded yet — stay put, don't redirect.
      // This prevents the flash of intro/onboarding while profile is still fetching.
      return;
    }

    if (!profile.onboarded) {
      // Signed in, profile loaded, but not onboarded — allow intro slides and onboarding quiz
      if (seg0 !== 'intro' && seg0 !== 'onboarding' && seg0 !== 'partner-onboarding') {
        router.replace('/intro');
      }
    } else {
      // Signed in + onboarded — go to tabs (allow standalone pages + forgot-password through)
      const standalonePages = ['reflections', 'assessment', 'frameworks', 'privacy'];
      if (!inTabs && !standalonePages.includes(seg0) && !onForgotPassword) {
        router.replace('/(tabs)');
      }
    }
  }, [user, profile, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
  });

  // Fire once per cold start. No-op until the user has accepted the
  // consent gate (PostHog starts opted-out).
  useEffect(() => {
    track('app_opened');
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f5fd' }}>
    <AppStateProvider>
      <AuthProvider>
        <RouteGuard />
      </AuthProvider>
    </AppStateProvider>
    </View>
  );
}
