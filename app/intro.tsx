import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, FlatList, Image, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppState } from '../src/hooks/useAppState';
import { Colors, Fonts, Radius } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'heard',
    title: 'Feel\nHeard.',
    body: 'Say what\'s on your heart. No judgment, no fixing, just space to let it out.',
    bg: '#D4EAC8',
    imageBg: '#C5E3B5',
    image: require('../assets/onboarding-screens/onboarding1.png'),
    button: 'Next',
  },
  {
    key: 'patterns',
    title: 'Understand\nPatterns.',
    body: 'Your reactions make sense. Tether helps you understand why.',
    bg: '#C8D4F0',
    imageBg: '#B8C6E8',
    image: require('../assets/onboarding-screens/onboarding2.png'),
    button: 'Next',
  },
  {
    key: 'communicate',
    title: 'Communicate\nbetter.',
    body: 'Say the thing you\'ve been struggling to say, in a way that opens doors.',
    bg: '#B8E0D4',
    imageBg: '#A8D4C4',
    image: require('../assets/onboarding-screens/onboarding3.png'),
    button: 'Let\'s get started',
  },
];

export default function IntroScreen() {
  const { dispatch } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      dispatch({ type: 'SET_PROFILE', payload: { sawIntro: true } as any });
      router.replace('/onboarding');
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.imageSection, { backgroundColor: item.bg }]}>
              <Image
                source={item.image}
                style={styles.dogImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textSection}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        )}
      />

      <SafeAreaView style={styles.footer} edges={['bottom']}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>{SLIDES[currentIndex].button}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch({ type: 'SET_PROFILE', payload: { sawIntro: true } as any });
            router.replace('/onboarding');
          }}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  slide: { flex: 1 },
  imageSection: {
    height: height * 0.52,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  dogImage: {
    width: width * 0.65,
    height: height * 0.38,
  },
  textSection: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  title: {
    fontSize: 42,
    fontFamily: Fonts.display,
    color: Colors.charcoal,
    lineHeight: 48,
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: Colors.warmBrown,
    lineHeight: 24,
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  btn: {
    backgroundColor: '#7BC67E',
    borderRadius: Radius.full,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 17,
    color: Colors.charcoal,
    letterSpacing: 0.2,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.midBrown,
  },
});
