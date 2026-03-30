import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface Props {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function MascotDog({ size = 80, color = '#201D18', style }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 140" fill="none" style={style}>
      {/* Head — curly fluffy shape */}
      <Path
        d="M60 18c-8-2-18 2-22 8-6-2-14 2-16 9-4 4-5 10-3 15-4 4-3 12 2 16 2 5 8 9 14 10 4 2 8 3 12 3h6c4 0 8-1 12-3 6-1 12-5 14-10 5-4 6-12 2-16 2-5 1-11-3-15-2-7-10-11-16-9C82 20 70 16 60 18z"
        fill="white"
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Left ear — floppy curly */}
      <Path
        d="M28 35c-6-1-12 4-14 10-3 7 0 14 5 16 3 1 5 0 7-1"
        fill="white"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right ear — floppy curly */}
      <Path
        d="M92 35c6-1 12 4 14 10 3 7 0 14-5 16-3 1-5 0-7-1"
        fill="white"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left eye */}
      <Ellipse cx={47} cy={48} rx={4} ry={4.5} fill={color} />
      {/* Right eye */}
      <Ellipse cx={73} cy={48} rx={4} ry={4.5} fill={color} />
      {/* Nose */}
      <Ellipse cx={60} cy={58} rx={5} ry={4} fill={color} />
      {/* Mouth */}
      <Path
        d="M60 62v4M56 66c2 2 6 2 8 0"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Body */}
      <Path
        d="M38 76c-2 4-4 12-4 20 0 10 4 18 10 22h32c6-4 10-12 10-22 0-8-2-16-4-20"
        fill="white"
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* Chest line */}
      <Path
        d="M60 78v24"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      {/* Left front paw */}
      <Path
        d="M44 118c0 4-1 8 2 10h10c3-2 2-6 2-10"
        fill="white"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paw toes left */}
      <Path d="M48 128v-3M52 128v-3" stroke={color} strokeWidth={2} strokeLinecap="round" />

      {/* Right front paw */}
      <Path
        d="M62 118c0 4-1 8 2 10h10c3-2 2-6 2-10"
        fill="white"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Paw toes right */}
      <Path d="M66 128v-3M70 128v-3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
