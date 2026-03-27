import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../src/hooks/useAppState';
import { Colors, Fonts, Radius, Shadows } from '../src/constants/theme';
import { Button } from '../src/components/UI';

export default function Landing() {
  const { state } = useAppState();

  useEffect(() => {
    if (state.loaded && state.profile.onboarded) {
      router.replace('/(tabs)');
    }
  }, [state.loaded, state.profile.onboarded]);

  if (!state.loaded) return null;

  const features = [
    { icon: '🕊️', title: 'Feel heard', desc: 'Express without judgment' },
    { icon: '🔍', title: 'Understand patterns', desc: 'Discover what is beneath conflict' },
    { icon: '🌿', title: 'Communicate better', desc: 'Build bridges, not walls' },
    { icon: '💛', title: 'Nurture your bond', desc: 'Proactive tools for thriving' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.blobTR} />
        <View style={styles.blobBL} />
        <View style={styles.inner}>
          <View style={styles.logoOrb}>
            <Text style={styles.logoText}>◎</Text>
          </View>
          <Text style={styles.brand}>Tether</Text>
          <Text style={styles.tagline}>Navigate together, grow closer</Text>
          <View style={styles.grid}>
            {features.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
          <Button label="Begin your journey" onPress={() => router.push('/onboarding')} />
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ marginTop: 12 }}>
            <Text style={styles.alreadyHave}>I already have an account</Text>
          </TouchableOpacity>
          <Text style={styles.safeNote}>
            Tether supports but does not replace professional therapy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.warmWhite },
  scroll: { flexGrow: 1 },
  inner: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32 },
  blobTR: { position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: Colors.terracottaPale, opacity: 0.55 },
  blobBL: { position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: Colors.sagePale, opacity: 0.6 },
  logoOrb: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.terracotta, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.terracotta },
  logoText: { fontSize: 32, color: Colors.white },
  brand: { fontFamily: Fonts.display, fontSize: 52, color: Colors.charcoal, letterSpacing: -1.5, marginBottom: 6 },
  tagline: { fontFamily: Fonts.displayItalic, fontSize: 16, color: Colors.midBrown, marginBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 36, width: '100%' },
  featureCard: { width: '47%', backgroundColor: Colors.cream, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14 },
  featureIcon: { fontSize: 18, marginBottom: 6 },
  featureTitle: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal, marginBottom: 3 },
  featureDesc: { fontFamily: Fonts.body, fontSize: 11, color: Colors.midBrown, lineHeight: 15 },
  alreadyHave: { fontFamily: Fonts.body, fontSize: 14, color: Colors.midBrown, textAlign: 'center' },
  safeNote: { fontFamily: Fonts.body, fontSize: 11, color: Colors.lightBrown, textAlign: 'center', marginTop: 20, lineHeight: 16 },
});
