import { useEffect } from 'react';
import { View } from 'react-native';
import { Slot, router, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { Poppins_300Light, Poppins_300Light_Italic, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { InstrumentSans_400Regular, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans';
import { AppStateProvider, useAppState } from '../src/hooks/useAppState';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';

function RouteGuard() {
  const { user, profile, loading } = useAuth();
  const { state } = useAppState();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inInviteGroup = segments[0] === 'invite';
    const inTabs = segments[0] === '(tabs)';

    // Let invite links always through
    if (inInviteGroup) return;

    if (!user) {
      // Not signed in — show intro first, then landing
      if (segments[0] === 'intro') return; // already on intro, stay
      if (!state.profile.sawIntro) {
        router.replace('/intro');
        return;
      }
      if (!inAuthGroup && segments[0] !== undefined) {
        router.replace('/auth/sign-up');
      }
    } else if (!profile?.onboarded) {
      // Signed in but not onboarded
      if (segments[0] !== 'onboarding' && segments[0] !== 'partner-onboarding') {
        router.replace('/onboarding');
      }
    } else {
      // Signed in + onboarded — go to tabs (allow standalone pages through)
      const standalonePages = ['reflections', 'assessment', 'frameworks', 'privacy', 'intro'];
      if (!inTabs && !standalonePages.includes(segments[0] as string)) {
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
