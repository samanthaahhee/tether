import React, { forwardRef, useState } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius } from '../constants/theme';

/**
 * Password input with a Show/Hide toggle. Defaults to obscured. Renders the
 * toggle as a small text button on the right edge — no icon dependency.
 *
 * Apple's HIG and modern web/mobile UX both recommend a reveal toggle:
 * users mistype complex passwords more often than shoulder-surfers steal
 * them, and password reset flows are far more painful than a brief reveal.
 */
type Props = Omit<TextInputProps, 'secureTextEntry'> & {
  /** Optional override for the wrapper View style. */
  containerStyle?: TextInputProps['style'];
};

export const PasswordInput = forwardRef<TextInput, Props>(({ containerStyle, style, ...rest }, ref) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <View style={[s.wrap, containerStyle]}>
      <TextInput
        ref={ref}
        {...rest}
        style={[s.input, style]}
        secureTextEntry={!revealed}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
      />
      <TouchableOpacity
        onPress={() => setRevealed((v) => !v)}
        style={s.toggle}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
      >
        <Text style={s.toggleText}>{revealed ? 'Hide' : 'Show'}</Text>
      </TouchableOpacity>
    </View>
  );
});
PasswordInput.displayName = 'PasswordInput';

const s = StyleSheet.create({
  wrap: { width: '100%', position: 'relative' },
  input: { width: '100%', padding: 14, paddingRight: 64, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.sand, backgroundColor: Colors.white, fontFamily: Fonts.body, fontSize: 15, color: Colors.charcoal },
  toggle: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', paddingHorizontal: 8 },
  toggleText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.sageDark },
});
