import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadows } from '../src/constants/theme';
import { IconHeart, IconSearch, IconLeaf, IconSliders } from '../src/components/Icons';

const features = [
  { Icon: IconHeart, color: Colors.mauve, title: 'Feel heard', desc: 'Express without judgment' },
  { Icon: IconSearch, color: Colors.blue, title: 'Understand patterns', desc: 'Discover what is beneath conflict' },
  { Icon: IconLeaf, color: Colors.sage, title: 'Communicate better', desc: 'Build bridges, not walls' },
  { Icon: IconSliders, color: Colors.amber, title: 'Tools for tough moments', desc: 'Breathing, grounding, repair' },
];

export default function Landing() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.blobTR} />
        <View style={styles.blobBL} />
        <View style={styles.inner}>

          <View style={styles.logoOrb}>
            <IconLeaf size={32} color={Colors.white} />
          </View>
          <Text style={styles.brand}>Tether</Text>
          <Text style={styles.tagline}>Navigate together, grow closer</Text>

          <View style={styles.grid}>
            {features.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <View style={[styles.featureIconWrap, { backgroundColor: f.color + '18' }]}>
                  <f.Icon size={18} color={f.color} />
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/auth/sign-up')} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/auth/sign-in')} activeOpacity={0.85}>
            <Text style={styles.btnSecondaryText}>Sign in</Text>
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
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: { flexGrow: 1 },
  inner: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 48, paddingBottom: 32 },
  blobTR: { position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: Colors.sagePale, opacity: 0.6 },
  blobBL: { position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: Colors.mauvePale, opacity: 0.5 },
  logoOrb: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...Shadows.sm },
  brand: { fontFamily: Fonts.displayLight, fontSize: 48, color: Colors.charcoal, marginBottom: 6 },
  tagline: { fontFamily: Fonts.displayItalic, fontSize: 16, color: Colors.midBrown, marginBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 36, width: '100%' },
  featureCard: { width: '47%', backgroundColor: Colors.warmWhite, borderWidth: 1, borderColor: Colors.sand, borderRadius: Radius.lg, padding: 14 },
  featureIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featureTitle: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.charcoal, marginBottom: 3 },
  featureDesc: { fontFamily: Fonts.body, fontSize: 11, color: Colors.midBrown, lineHeight: 15 },
  btnPrimary: { width: '100%', backgroundColor: Colors.sageDark, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center', marginBottom: 10, ...Shadows.sm },
  btnPrimaryText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  btnSecondary: { width: '100%', backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand, borderRadius: Radius.full, paddingVertical: 15, alignItems: 'center' },
  btnSecondaryText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.charcoal },
  safeNote: { fontFamily: Fonts.body, fontSize: 11, color: Colors.lightBrown, textAlign: 'center', marginTop: 24, lineHeight: 16 },
});
