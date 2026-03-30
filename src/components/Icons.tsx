import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Polygon, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const D = { size: 20, color: 'currentColor', sw: 1.5 };

// ── Navigation & UI ──

export function IconHome({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="9,22 9,12 15,12 15,22" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconCompass({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={D.sw} />
      <Polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconBarChart({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Line x1={18} y1={20} x2={18} y2={10} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={12} y1={20} x2={12} y2={4} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={6} y1={20} x2={6} y2={14} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconSettings({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={D.sw} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSearch({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={D.sw} />
      <Line x1={21} y1={21} x2={16.65} y2={16.65} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconPlus({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Line x1={12} y1={5} x2={12} y2={19} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={5} y1={12} x2={19} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconCheck({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Polyline points="20,6 9,17 4,12" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconX({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Line x1={18} y1={6} x2={6} y2={18} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={6} y1={6} x2={18} y2={18} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconArrowRight({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Line x1={5} y1={12} x2={19} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Polyline points="12,5 19,12 12,19" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Content & Features ──

export function IconHeart({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSparkles({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M8 3l1.5 4L13 8.5 9.5 10 8 14l-1.5-4L3 8.5 6.5 7z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 12l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconLeaf({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M12 22V12" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Path d="M12 12C12 12 6 11 5 5c5 0 7 3 7 7z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 12C12 12 18 11 19 5c-5 0-7 3-7 7z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconVoice({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect x={9} y={2} width={6} height={11} rx={3} stroke={color} strokeWidth={D.sw} />
      <Path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={12} y1={19} x2={12} y2={22} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={8} y1={22} x2={16} y2={22} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconBell({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconMoon({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconFlame({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconWind({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Path d="M9.6 4.6A2 2 0 1 1 11 8H2" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Path d="M12.6 19.4A2 2 0 1 0 14 16H2" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconActivity({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconClock({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={D.sw} />
      <Polyline points="12,6 12,12 16,14" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconUser({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={D.sw} />
    </Svg>
  );
}

export function IconBookmark({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSliders({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Line x1={4} y1={21} x2={4} y2={14} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={4} y1={10} x2={4} y2={3} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={12} y1={21} x2={12} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={12} y1={8} x2={12} y2={3} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={20} y1={21} x2={20} y2={16} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={20} y1={12} x2={20} y2={3} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={1} y1={14} x2={7} y2={14} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={9} y1={8} x2={15} y2={8} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={17} y1={16} x2={23} y2={16} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconPlay({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Polygon points="5,3 19,12 5,21" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconSun({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={12} cy={12} r={5} stroke={color} strokeWidth={D.sw} />
      <Line x1={12} y1={1} x2={12} y2={3} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={12} y1={21} x2={12} y2={23} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={4.22} y1={4.22} x2={5.64} y2={5.64} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={18.36} y1={18.36} x2={19.78} y2={19.78} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={1} y1={12} x2={3} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={21} y1={12} x2={23} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={4.22} y1={19.78} x2={5.64} y2={18.36} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={18.36} y1={5.64} x2={19.78} y2={4.22} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

// ── Mood faces (filled) ──

export function IconMoodLow({ size = D.size, color = '#BCB7AC', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Circle cx={9} cy={9.5} r={1.2} fill="white" />
      <Circle cx={15} cy={9.5} r={1.2} fill="white" />
      <Path d="M8.5 15.5 Q12 13 15.5 15.5" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function IconMoodOkay({ size = D.size, color = '#8E8880', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Circle cx={9} cy={9.5} r={1.2} fill="white" />
      <Circle cx={15} cy={9.5} r={1.2} fill="white" />
      <Line x1={8.5} y1={15} x2={15.5} y2={15} stroke="white" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function IconMoodGood({ size = D.size, color = '#D4A340', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Circle cx={9} cy={9.5} r={1.2} fill="white" />
      <Circle cx={15} cy={9.5} r={1.2} fill="white" />
      <Path d="M8.5 13.5 Q12 16.5 15.5 13.5" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function IconMoodGreat({ size = D.size, color = '#8A9660', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Circle cx={9} cy={9} r={1.3} fill="white" />
      <Circle cx={15} cy={9} r={1.3} fill="white" />
      <Path d="M8.5 13.5 Q12 18 16.5 13.5" stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function IconMoodAmazing({ size = D.size, color = '#636E3F', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={10} fill={color} />
      <Circle cx={9} cy={9} r={1.3} fill="white" />
      <Circle cx={15} cy={9} r={1.3} fill="white" />
      <Path d="M7.5 13.5 Q12 18.5 16.5 13.5 Z" fill="white" />
    </Svg>
  );
}

// ── Additional UI icons ──

export function IconLink({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconMail({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect x={2} y={4} width={20} height={16} rx={2} stroke={color} strokeWidth={D.sw} />
      <Polyline points="22,4 12,13 2,4" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconKey({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconEdit({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconShield({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconBox({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1={12} y1={22.08} x2={12} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconPhone({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth={D.sw} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconInfo({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={D.sw} />
      <Line x1={12} y1={16} x2={12} y2={12} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
      <Line x1={12} y1={8} x2={12.01} y2={8} stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}

export function IconLock({ size = D.size, color = '#5E5A53', style }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Rect x={3} y={11} width={18} height={11} rx={2} stroke={color} strokeWidth={D.sw} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth={D.sw} strokeLinecap="round" />
    </Svg>
  );
}
