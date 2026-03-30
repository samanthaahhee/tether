import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface IconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function ChevronRight({ size = 10, color = Colors.midBrown, style }: IconProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderTopWidth: 1.5,
          borderRightWidth: 1.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        },
        style,
      ]}
    />
  );
}

export function ChevronLeft({ size = 10, color = Colors.midBrown, style }: IconProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderColor: color,
          transform: [{ rotate: '-45deg' }],
        },
        style,
      ]}
    />
  );
}

export function ChevronDown({ size = 10, color = Colors.midBrown, style }: IconProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderBottomWidth: 1.5,
          borderRightWidth: 1.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        },
        style,
      ]}
    />
  );
}

export function ChevronUp({ size = 10, color = Colors.midBrown, style }: IconProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderTopWidth: 1.5,
          borderRightWidth: 1.5,
          borderColor: color,
          transform: [{ rotate: '-45deg' }],
        },
        style,
      ]}
    />
  );
}
