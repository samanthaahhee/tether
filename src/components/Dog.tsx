import React from 'react';
import { View, ViewStyle } from 'react-native';

interface DogProps {
  size?: number;
  style?: ViewStyle;
}

const WHITE = '#FAFAF8';
const NOSE = '#3D3D3D';
const CHEEK = '#F5DDD0';
const EAR = '#E8DDD4';
const TONGUE = '#E8A0A0';
const EYE = '#3D3D3D';

/**
 * DogSitting — calm, upright posture.
 * Used for greetings and onboarding welcome.
 */
export function DogSitting({ size = 64, style }: DogProps) {
  const s = size / 64; // scale factor
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      {/* Ears */}
      <View style={{ position: 'absolute', top: 2 * s, left: 10 * s, width: 14 * s, height: 18 * s, borderRadius: 7 * s, backgroundColor: EAR, transform: [{ rotate: '-12deg' }] }} />
      <View style={{ position: 'absolute', top: 2 * s, right: 10 * s, width: 14 * s, height: 18 * s, borderRadius: 7 * s, backgroundColor: EAR, transform: [{ rotate: '12deg' }] }} />

      {/* Head */}
      <View style={{ position: 'absolute', top: 8 * s, width: 32 * s, height: 28 * s, borderRadius: 14 * s, backgroundColor: WHITE, alignItems: 'center' }}>
        {/* Eyes */}
        <View style={{ flexDirection: 'row', gap: 10 * s, marginTop: 10 * s }}>
          <View style={{ width: 4 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: EYE }} />
          <View style={{ width: 4 * s, height: 5 * s, borderRadius: 2.5 * s, backgroundColor: EYE }} />
        </View>
        {/* Nose */}
        <View style={{ width: 6 * s, height: 4 * s, borderRadius: 3 * s, backgroundColor: NOSE, marginTop: 3 * s }} />
        {/* Cheeks */}
        <View style={{ flexDirection: 'row', gap: 14 * s, marginTop: 1 * s }}>
          <View style={{ width: 5 * s, height: 3 * s, borderRadius: 2 * s, backgroundColor: CHEEK, opacity: 0.6 }} />
          <View style={{ width: 5 * s, height: 3 * s, borderRadius: 2 * s, backgroundColor: CHEEK, opacity: 0.6 }} />
        </View>
      </View>

      {/* Body */}
      <View style={{ width: 28 * s, height: 22 * s, borderTopLeftRadius: 14 * s, borderTopRightRadius: 14 * s, borderBottomLeftRadius: 6 * s, borderBottomRightRadius: 6 * s, backgroundColor: WHITE }} />

      {/* Paws */}
      <View style={{ flexDirection: 'row', gap: 8 * s, marginTop: -2 * s }}>
        <View style={{ width: 10 * s, height: 6 * s, borderRadius: 5 * s, backgroundColor: WHITE }} />
        <View style={{ width: 10 * s, height: 6 * s, borderRadius: 5 * s, backgroundColor: WHITE }} />
      </View>
    </View>
  );
}

/**
 * DogLying — relaxed, settled posture.
 * Used for safe-space moments (Vent step, Nurture guide).
 */
export function DogLying({ size = 64, style }: DogProps) {
  const s = size / 64;
  return (
    <View style={[{ width: size * 1.3, height: size * 0.7, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      {/* Ears */}
      <View style={{ position: 'absolute', top: 0, left: 18 * s, width: 12 * s, height: 14 * s, borderRadius: 6 * s, backgroundColor: EAR, transform: [{ rotate: '-20deg' }] }} />
      <View style={{ position: 'absolute', top: 0, right: 22 * s, width: 12 * s, height: 14 * s, borderRadius: 6 * s, backgroundColor: EAR, transform: [{ rotate: '20deg' }] }} />

      {/* Head */}
      <View style={{ position: 'absolute', top: 6 * s, right: 20 * s, width: 28 * s, height: 24 * s, borderRadius: 12 * s, backgroundColor: WHITE, alignItems: 'center' }}>
        {/* Eyes — slightly sleepy */}
        <View style={{ flexDirection: 'row', gap: 8 * s, marginTop: 9 * s }}>
          <View style={{ width: 5 * s, height: 3 * s, borderRadius: 2 * s, backgroundColor: EYE }} />
          <View style={{ width: 5 * s, height: 3 * s, borderRadius: 2 * s, backgroundColor: EYE }} />
        </View>
        {/* Nose */}
        <View style={{ width: 5 * s, height: 3.5 * s, borderRadius: 2.5 * s, backgroundColor: NOSE, marginTop: 3 * s }} />
      </View>

      {/* Body — elongated */}
      <View style={{ width: size * 1.15, height: 18 * s, borderRadius: 9 * s, backgroundColor: WHITE }} />

      {/* Front paws */}
      <View style={{ position: 'absolute', bottom: 0, right: 16 * s, flexDirection: 'row', gap: 4 * s }}>
        <View style={{ width: 9 * s, height: 5 * s, borderRadius: 4 * s, backgroundColor: WHITE }} />
        <View style={{ width: 9 * s, height: 5 * s, borderRadius: 4 * s, backgroundColor: WHITE }} />
      </View>

      {/* Tail */}
      <View style={{ position: 'absolute', bottom: 6 * s, left: 2 * s, width: 14 * s, height: 6 * s, borderRadius: 3 * s, backgroundColor: WHITE, transform: [{ rotate: '-15deg' }] }} />
    </View>
  );
}

/**
 * DogPeeking — curious head tilt with one ear up.
 * Used for empty states.
 */
export function DogPeeking({ size = 64, style }: DogProps) {
  const s = size / 64;
  return (
    <View style={[{ width: size, height: size * 0.75, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      {/* Left ear — perked up */}
      <View style={{ position: 'absolute', top: 0, left: 14 * s, width: 12 * s, height: 16 * s, borderRadius: 6 * s, backgroundColor: EAR, transform: [{ rotate: '-15deg' }] }} />
      {/* Right ear — flopped */}
      <View style={{ position: 'absolute', top: 4 * s, right: 10 * s, width: 14 * s, height: 12 * s, borderRadius: 6 * s, backgroundColor: EAR, transform: [{ rotate: '25deg' }] }} />

      {/* Head — tilted */}
      <View style={{ width: 32 * s, height: 28 * s, borderRadius: 14 * s, backgroundColor: WHITE, alignItems: 'center', transform: [{ rotate: '8deg' }] }}>
        {/* Eyes — wide, curious */}
        <View style={{ flexDirection: 'row', gap: 10 * s, marginTop: 9 * s }}>
          <View style={{ width: 5 * s, height: 6 * s, borderRadius: 3 * s, backgroundColor: EYE }} />
          <View style={{ width: 5 * s, height: 6 * s, borderRadius: 3 * s, backgroundColor: EYE }} />
        </View>
        {/* Nose */}
        <View style={{ width: 6 * s, height: 4 * s, borderRadius: 3 * s, backgroundColor: NOSE, marginTop: 2 * s }} />
        {/* Tongue peeking out */}
        <View style={{ width: 4 * s, height: 5 * s, borderBottomLeftRadius: 3 * s, borderBottomRightRadius: 3 * s, backgroundColor: TONGUE, marginTop: 1 * s, marginLeft: 3 * s }} />
      </View>

      {/* Paws on ledge */}
      <View style={{ flexDirection: 'row', gap: 6 * s, marginTop: -3 * s }}>
        <View style={{ width: 11 * s, height: 6 * s, borderTopLeftRadius: 5 * s, borderTopRightRadius: 5 * s, backgroundColor: WHITE }} />
        <View style={{ width: 11 * s, height: 6 * s, borderTopLeftRadius: 5 * s, borderTopRightRadius: 5 * s, backgroundColor: WHITE }} />
      </View>
    </View>
  );
}

/**
 * DogHappy — tail up, bright expression.
 * Used for post-session check-in and celebrations.
 */
export function DogHappy({ size = 64, style }: DogProps) {
  const s = size / 64;
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }, style]}>
      {/* Ears — perked */}
      <View style={{ position: 'absolute', top: 0, left: 10 * s, width: 13 * s, height: 16 * s, borderRadius: 6.5 * s, backgroundColor: EAR, transform: [{ rotate: '-8deg' }] }} />
      <View style={{ position: 'absolute', top: 0, right: 10 * s, width: 13 * s, height: 16 * s, borderRadius: 6.5 * s, backgroundColor: EAR, transform: [{ rotate: '8deg' }] }} />

      {/* Head */}
      <View style={{ position: 'absolute', top: 6 * s, width: 32 * s, height: 28 * s, borderRadius: 14 * s, backgroundColor: WHITE, alignItems: 'center' }}>
        {/* Eyes — happy crescents */}
        <View style={{ flexDirection: 'row', gap: 10 * s, marginTop: 10 * s }}>
          <View style={{ width: 6 * s, height: 3 * s, borderTopLeftRadius: 3 * s, borderTopRightRadius: 3 * s, backgroundColor: EYE }} />
          <View style={{ width: 6 * s, height: 3 * s, borderTopLeftRadius: 3 * s, borderTopRightRadius: 3 * s, backgroundColor: EYE }} />
        </View>
        {/* Nose */}
        <View style={{ width: 6 * s, height: 4 * s, borderRadius: 3 * s, backgroundColor: NOSE, marginTop: 3 * s }} />
        {/* Smile / tongue */}
        <View style={{ width: 8 * s, height: 6 * s, borderBottomLeftRadius: 4 * s, borderBottomRightRadius: 4 * s, backgroundColor: TONGUE, marginTop: 1 * s }} />
      </View>

      {/* Body */}
      <View style={{ width: 28 * s, height: 20 * s, borderTopLeftRadius: 14 * s, borderTopRightRadius: 14 * s, borderBottomLeftRadius: 6 * s, borderBottomRightRadius: 6 * s, backgroundColor: WHITE }} />

      {/* Tail — wagging up */}
      <View style={{ position: 'absolute', bottom: 16 * s, right: 6 * s, width: 12 * s, height: 5 * s, borderRadius: 3 * s, backgroundColor: WHITE, transform: [{ rotate: '-35deg' }] }} />

      {/* Paws */}
      <View style={{ flexDirection: 'row', gap: 8 * s, marginTop: -2 * s }}>
        <View style={{ width: 10 * s, height: 6 * s, borderRadius: 5 * s, backgroundColor: WHITE }} />
        <View style={{ width: 10 * s, height: 6 * s, borderRadius: 5 * s, backgroundColor: WHITE }} />
      </View>
    </View>
  );
}
