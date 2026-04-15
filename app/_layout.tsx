import { useEffect } from 'react';
import { View } from 'react-native';
import { Slot, router, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { Poppins_300Light, Poppins_300Light_Italic, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';
import { AppStateProvider } from '../src/hooks/useAppState';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';

function RouteGuard() {
  const { user, profile, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const seg0 = segments[0] as string | undefined;
    const inAuthGroup = seg0 === 'auth';
    const inInviteGroup = seg0 === 'invite';
    const inTabs = seg0 === '(tabs)';

    // Let invite links always through
    if (inInviteGroup) return;

    // Opening screen (index) handles its own splash/redirect logic — let it be
    if (seg0 === undefined) return;

    if (!user) {
      // Not signed in — only allow opening screen and auth pages
      if (!inAuthGroup) {
        router.replace('/');
      }
    } else if (!profile) {
      // Signed in but profile not loaded yet — stay put, don't redirect anywhere
      // This prevents the flash of intro/onboarding while profile is still fetching
      return;
    } else if (!profile.onboarded) {
      // Signed in, profile loaded, but not onboarded — allow intro slides and onboarding quiz
      if (seg0 !== 'intro' && seg0 !== 'onboarding' && seg0 !== 'partner-onboarding') {
        router.replace('/intro');
      }
    } else {
      // Signed in + onboarded — go to tabs (allow standalone pages through)
      const standalonePages = ['reflections', 'assessment', 'frameworks', 'privacy'];
      if (!inTabs && !standalonePages.includes(seg0)) {
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
