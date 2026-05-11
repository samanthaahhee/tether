import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, Fonts } from '../constants/theme';
import { checkPassword, PASSWORD_MIN_LENGTH } from '../utils/passwordPolicy';

/**
 * Live checklist of password requirements. Each rule shows ○ when unmet,
 * ✓ when met. Always visible (not hidden until typing) so users know up
 * front what they need to satisfy. Each row scales briefly on transition
 * from unmet → met for a small bit of delight.
 */
type Props = { password: string };

const ITEMS: { key: keyof ReturnType<typeof checkPassword>['rules']; label: string }[] = [
  { key: 'length',    label: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: 'letter',    label: 'A letter' },
  { key: 'number',    label: 'A number' },
  { key: 'symbol',    label: 'A symbol (! ? # %)' },
  { key: 'notCommon', label: 'Not a common password' },
];

function Row({ met, label }: { met: boolean; label: string }) {
  // Scale spring on transition from unmet → met. We use a ref to track the
  // previous value so we only animate on the first true, not on every render.
  const scale = useRef(new Animated.Value(1)).current;
  const wasMet = useRef(met);
  useEffect(() => {
    if (met && !wasMet.current) {
      scale.setValue(0.6);
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
    }
    wasMet.current = met;
  }, [met, scale]);

  return (
    <View style={s.row}>
      <Animated.Text style={[s.mark, met && s.markMet, { transform: [{ scale }] }]}>
        {met ? '✓' : '○'}
      </Animated.Text>
      <Text style={[s.label, met && s.labelMet]}>{label}</Text>
    </View>
  );
}

export function PasswordRules({ password }: Props) {
  const { rules } = checkPassword(password);
  return (
    <View style={s.wrap}>
      {ITEMS.map((item) => (
        <Row key={item.key} met={rules[item.key]} label={item.label} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 4, marginTop: 6, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.lightBrown, width: 14, textAlign: 'center' },
  markMet: { color: Colors.sageDark },
  label: { fontFamily: Fonts.body, fontSize: 12, color: Colors.midBrown },
  labelMet: { color: Colors.charcoal },
});
