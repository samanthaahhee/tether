import { Slot } from 'expo-router';
import { useFonts, Lora_500Medium, Lora_400Regular_Italic } from '@expo-google-fonts/lora';
import { DMSans_400Regular, DMSans_500Medium } from '@expo-google-fonts/dm-sans';
import { AppStateProvider } from '../src/hooks/useAppState';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lora_500Medium,
    Lora_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <AppStateProvider>
      <Slot />
    </AppStateProvider>
  );
}
