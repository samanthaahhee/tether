import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '../src/constants/theme';
import { useAuth } from '../src/hooks/useAuth';

export default function Landing() {
  const { user, profile, loading } = useAuth();

  // Returning user: splash → auto-redirect
  useEffect(() => {
    if (loading) return;
    if (!user) return; // logged out — stay and show buttons
    if (!profile) return; // profile still loading — wait

    // User is signed in + profile loaded — use as splash then redirect
    const timer = setTimeout(() => {
      if (profile.onboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/intro');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user, profile, loading]);

  const showButtons = !loading && !user;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.container}>

        {/* Logo — always visible */}
        <View style={s.logoArea}>
          <Image
            source={require('../assets/otis-logo.png')}
            style={s.logo}
            resizeMode="contain"
          />
        </View>

        {/* Buttons — only when logged out */}
        {showButtons ? (
          <View style={s.bottom}>
            <View style={s.btnWrap}>
              <TouchableOpacity style={s.btnPrimary} onPress={() => router.push('/auth/sign-up')} activeOpacity={0.85}>
                <Text style={s.btnPrimaryText}>Create an account</Text>
              </TouchableOpacity>
            </View>

            <View style={s.btnWrap}>
              <TouchableOpacity style={s.btnSecondary} onPress={() => router.push('/auth/sign-in')} activeOpacity={0.85}>
                <Text style={s.btnSecondaryText}>Sign in</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.disclaimer}>
              Hey Otis is not a replacement for professional support.
            </Text>
          </View>
        ) : (
          <View style={s.bottom}>
            <Text style={s.disclaimer}>
              Hey Otis is not a replacement for professional support.
            </Text>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16 },

  logoArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 271, height: 375 },

  bottom: { width: '100%', paddingHorizontal: 16 },
  btnWrap: { paddingVertical: 10 },
  btnPrimary: {
    width: '100%',
    height: 44,
    backgroundColor: '#96d35f',
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: '#001c14' },
  btnSecondary: {
    width: '100%',
    height: 44,
    backgroundColor: Colors.cream,
    borderWidth: 1.5,
    borderColor: Colors.sand,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: '#001c14' },
  disclaimer: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.05,
    lineHeight: 15.4,
    marginTop: 4,
  },
});
