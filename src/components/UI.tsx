import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Fonts, Radius, Shadows } from '../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'sage';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary', loading, disabled, style, fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        btn.base,
        variant === 'primary' && btn.primary,
        variant === 'secondary' && btn.secondary,
        variant === 'ghost' && btn.ghost,
        variant === 'sage' && btn.sage,
        fullWidth && { alignSelf: 'stretch' },
        isDisabled && { opacity: 0.55 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? Colors.sageDark : Colors.white} />
      ) : (
        <Text style={[
          btn.label,
          variant === 'secondary' && { color: Colors.charcoal },
          variant === 'ghost' && { color: Colors.midBrown },
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: Colors.sageDark, ...Shadows.sm },
  secondary: { backgroundColor: Colors.warmWhite, borderWidth: 1.5, borderColor: Colors.sand },
  ghost: { backgroundColor: 'transparent' },
  sage: { backgroundColor: Colors.sage, ...Shadows.sm },
  label: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, letterSpacing: 0.2 },
});

export function InsightReveal({
  label, title, body, bg, borderColor, labelColor,
}: {
  label: string; title: string; body: string;
  /** @deprecated kept for caller back-compat — visual treatment is now white. */
  bg: string;
  borderColor: string;
  labelColor: string;
}) {
  // White card + coloured left-edge accent. The colour signal (sage,
  // blue, amber, mauve depending on which step) is preserved via the
  // accent stripe + label colour; the body text now sits on white for
  // far better contrast and readability.
  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: Colors.sand,
      borderLeftWidth: 4,
      borderLeftColor: borderColor,
      borderRadius: Radius.md,
      padding: 14,
      marginTop: 14,
    }}>
      <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 10, letterSpacing: 0.7, textTransform: 'uppercase', color: labelColor, marginBottom: 5 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: Fonts.display, fontSize: 15, color: Colors.charcoal, marginBottom: 5 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: Fonts.body, fontSize: 13, color: Colors.charcoal, lineHeight: 20 }}>
        {body}
      </Text>
    </View>
  );
}
