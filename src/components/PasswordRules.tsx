import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants/theme';
import { checkPassword, PASSWORD_MIN_LENGTH } from '../utils/passwordPolicy';

/**
 * Live checklist of password requirements. Each rule shows ○ when unmet,
 * ✓ when met. Always visible (not hidden until typing) so users know up
 * front what they need to satisfy. Drives off the same `rules` object
 * that `checkPassword` returns, so this stays in sync with validation.
 */
type Props = { password: string };

const ITEMS: { key: keyof ReturnType<typeof checkPassword>['rules']; label: string }[] = [
  { key: 'length',    label: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: 'letter',    label: 'A letter' },
  { key: 'number',    label: 'A number' },
  { key: 'symbol',    label: 'A symbol (! ? # %)' },
  { key: 'notCommon', label: 'Not a common password' },
];

export function PasswordRules({ password }: Props) {
  const { rules } = checkPassword(password);
  return (
    <View style={s.wrap}>
      {ITEMS.map((item) => {
        const met = rules[item.key];
        return (
          <View key={item.key} style={s.row}>
            <Text style={[s.mark, met && s.markMet]}>{met ? '✓' : '○'}</Text>
            <Text style={[s.label, met && s.labelMet]}>{item.label}</Text>
          </View>
        );
      })}
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
