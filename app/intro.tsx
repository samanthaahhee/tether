import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, FlatList, Image, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Fonts, Radius } from '../src/constants/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'heard',
    title: 'Feel\nHeard.',
    body: 'Say what\'s on your heart.\nNo judgment, no fixing, just space to let it out.',
    gradient: ['#9ADA5E', '#C8ECB0', '#FFFFFF'] as const,
    gradientLocations: [0, 0.38, 0.55] as const,
    image: require('../assets/onboarding-screens/onboarding1.png'),
    button: 'Next',
  },
  {
    key: 'patterns',
    title: 'Understand\nPatterns.',
    body: 'Your reactions make sense.\nHey Otis helps you understand why.',
    gradient: ['#92A6F4', '#C5CFFA', '#FFFFFF'] as const,
    gradientLocations: [0, 0.45, 0.77] as const,
    image: require('../assets/onboarding-screens/onboarding2.png'),
    button: 'Next',
  },
  {
    key: 'communicate',
    title: 'Communicate\nbetter.',
    body: 'Say the thing you\'ve been struggling to say, in a way that opens doors.',
    gradient: ['#4EA989', '#A8D8C8', '#FFFFFF'] as const,
    gradientLocations: [0, 0.38, 0.55] as const,
    image: require('../assets/onboarding-screens/onboarding3.png'),
    button: 'Let\'s get started',
  },
];

export default function IntroScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/onboarding');
    }
  };

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
          <LinearGradient
            colors={[...item.gradient]}
            locations={[...item.gradientLocations]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.slide, { width, height }]}
          >
            <View style={styles.imageSection}>
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
          </LinearGradient>
        )}
      />

      <SafeAreaView style={styles.footer} edges={['bottom']} pointerEvents="box-none">
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  slide: { flex: 1 },
  imageSection: {
    height: height * 0.52,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 32,
    paddingBottom: 0,
  },
  dogImage: {
    width: width * 0.65,
    height: height * 0.38,
    marginBottom: -40,
  },
  textSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  title: {
    fontSize: 40,
    fontFamily: Fonts.displaySemiBold,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    backgroundColor: '#96D35F',
  },
  btn: {
    backgroundColor: '#96D35F',
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
});
