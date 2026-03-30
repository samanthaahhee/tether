import { useEffect } from 'react';
import { Slot, router, useSegments } from 'expo-router';
import { useFonts, Lora_500Medium, Lora_400Regular_Italic } from '@expo-google-fonts/lora';
import { Questrial_400Regular } from '@expo-google-fonts/questrial';
import { Fraunces_300Light, Fraunces_400Regular, Fraunces_300Light_Italic, Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { AppStateProvider } from '../src/hooks/useAppState';
import { AuthProvider, useAuth } from '../src/hooks/useAuth';

function RouteGuard() {
  const { user, profile, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inInviteGroup = segments[0] === 'invite';
    const inTabs = segments[0] === '(tabs)';

    // Let invite links always through
    if (inInviteGroup) return;

    if (!user) {
      // Not signed in — go to landing unless already in auth
      if (!inAuthGroup && segments[0] !== undefined) {
        router.replace('/');
      }
    } else if (!profile?.onboarded) {
      // Signed in but not onboarded
      if (segments[0] !== 'onboarding' && segments[0] !== 'partner-onboarding') {
        router.replace('/onboarding');
      }
    } else {
      // Signed in + onboarded — go to tabs (allow standalone pages through)
      const standalonePages = ['reflections', 'assessment'];
      if (!inTabs && !standalonePages.includes(segments[0] as string)) {
        router.replace('/(tabs)');
      }
    }
  }, [user, profile, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lora_500Medium,
    Lora_400Regular_Italic,
    Questrial_400Regular,
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_300Light_Italic,
    Fraunces_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <AppStateProvider>
      <AuthProvider>
        <RouteGuard />
      </AuthProvider>
    </AppStateProvider>
  );
}
