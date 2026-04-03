// ── Color Tokens ──────────────────────────────────────────────────────────────
// Based on Fresh & Vibrant Design System — Dark Green + Flower-Inspired Accents

export const Colors = {
  // ── Core palette scales ────────────────────────────────────────────────────

  // Green (deep / dark backgrounds & text)
  green50: '#d3ffe7',
  green100: '#b8f9d8',
  green200: '#94e9c3',
  green300: '#5dcca3',
  green400: '#4ea989',
  green500: '#408770',
  green600: '#2b6755',
  green700: '#174a3b',
  green800: '#002f23',
  green900: '#001c14',

  // Lime (primary action)
  lime50: '#dfffbc',
  lime100: '#cdfda0',
  lime200: '#b8f37e',
  lime300: '#a1e55f',
  lime400: '#9ada5e',
  lime500: '#96d35f',
  lime600: '#81b756',
  lime700: '#679647',
  lime800: '#497032',
  lime900: '#2e4c1e',

  // Purple (accent)
  purple50: '#fdeaff',
  purple100: '#f7d0ff',
  purple200: '#ebb0ff',
  purple300: '#d484ff',
  purple400: '#bd57f2',
  purple500: '#af30dc',
  purple600: '#9615b5',
  purple700: '#79028e',
  purple800: '#5d006a',
  purple900: '#44004b',

  // Coral
  coral50: '#ffe0e4',
  coral100: '#ffc7ca',
  coral200: '#ffa6a8',
  coral300: '#ff797b',
  coral400: '#ff4853',
  coral500: '#f90330',
  coral600: '#d4001a',
  coral700: '#a90005',
  coral800: '#830000',
  coral900: '#620000',

  // Orange
  orange50: '#ffe9bf',
  orange100: '#ffd692',
  orange200: '#ffbb55',
  orange300: '#ff9700',
  orange400: '#f67700',
  orange500: '#e96300',
  orange600: '#c45100',
  orange700: '#9c3f00',
  orange800: '#752d00',
  orange900: '#541f00',

  // Yellow
  yellow50: '#fff9aa',
  yellow100: '#ffef79',
  yellow200: '#fcdf25',
  yellow300: '#e8c700',
  yellow400: '#d2b100',
  yellow500: '#bf9e00',
  yellow600: '#9f8700',
  yellow700: '#7c6a00',
  yellow800: '#5b4e00',
  yellow900: '#413900',

  // Pastels
  pastelPeach: '#ffe3db',
  pastelRose: '#ffe3d8',
  pastelLavender: '#e7ecff',
  pastelSage: '#eaf4cf',
  pastelCoral: '#ffe2e4',
  pastelMint: '#d8f9dd',

  white: '#FFFFFF',

  // ── Semantic / mapped aliases (light lavender mode — from Figma) ─────────────
  // Background — light lavender surfaces
  cream: '#f7f5fd',      // neutral.100 — main background
  creamDark: '#eeebf4',  // neutral.200 — elevated surface
  warmWhite: '#fbf9ff',  // neutral.50 — card background
  sand: '#dedde8',       // border
  sandDark: '#d0cfdb',   // darker border

  // Primary — Lime green
  sage: '#96d35f',       // lime.500
  sageDark: '#81b756',   // lime.600 — primary CTA
  sageDeep: '#679647',   // lime.700
  sageLight: '#b8f37e',  // lime.200
  sagePale: '#dfffbc',   // lime.50

  // Accent — Purple
  mauve: '#bd57f2',      // purple.400
  mauveDark: '#af30dc',  // purple.500
  mauveDeep: '#9615b5',  // purple.600
  mauveLight: '#ebb0ff', // purple.200
  mauvePale: '#fdeaff',  // purple.50

  // Blue (periwinkle/lavender)
  blue: '#92a6f4',       // periwinkle from Figma
  blueDark: '#7088e0',
  blueDeep: '#5570cc',
  blueLight: '#c3cefc',
  bluePale: '#e7ecff',   // pastel lavender

  // Amber → Orange/Yellow
  amber: '#f67700',      // orange.400
  amberDark: '#e96300',  // orange.500
  amberLight: '#ffbb55', // orange.200
  amberPale: '#ffe9bf',  // orange.50

  // Text — dark on light
  charcoal: '#211e28',   // foreground
  warmBrown: '#3a3630',  // secondary text
  midBrown: '#80798c',   // muted foreground
  lightBrown: '#a09bac', // very muted
  stone200: '#dedde8',   // border
  stone100: '#eeebf4',   // muted surface
  stone50: '#f7f5fd',    // background

  // Legacy aliases
  terracotta: '#81b756',        // lime.600 (primary CTA)
  terracottaLight: '#96d35f',   // lime.500
  terracottaPale: '#dfffbc',    // lime.50
  blush: '#bd57f2',             // purple.400
  blushPale: '#fdeaff',         // purple.50
  gold: '#d2b100',              // yellow.400
  goldPale: '#fff9aa',          // yellow.50

  // Functional
  successBg: '#d8f9dd',
  successBorder: '#5dcca3',
  successText: '#174a3b',
  warningBg: '#ffe9bf',
  warningBorder: '#f67700',
  warningText: '#9c3f00',
  errorBg: '#ffe0e4',
  errorBorder: '#ff4853',
  errorText: '#a90005',
  infoBg: '#fdeaff',
  infoBorder: '#bd57f2',
  infoText: '#9615b5',

  // ── Semantic (light mode — matching Figma) ─────────────────────────────────
  background: '#f7f5fd',   // neutral.100
  foreground: '#211e28',   // dark text
  primary: '#96d35f',      // lime.500
  primaryForeground: '#001c14',
  secondary: '#679647',
  secondaryForeground: '#edf0e8',
  muted: '#eeebf4',       // neutral.200
  mutedForeground: '#80798c',
  accent: '#bd57f2',       // purple.400
  accentForeground: '#211e28',
  border: '#dedde8',
  input: '#dedde8',
  ring: '#a1e55f',
  success: '#408770',
  warning: '#e96300',
  error: '#f90330',
  info: '#af30dc',
};

// ── Typography ────────────────────────────────────────────────────────────────
// Display: Poppins (clean, modern headlines)
// Body: Inter (clear, versatile)

export const Fonts = {
  displayLight: 'InstrumentSans_400Regular',
  display: 'InstrumentSans_400Regular',
  displayItalic: 'Poppins_400Regular_Italic',
  displayLightItalic: 'Poppins_300Light_Italic',
  displayMedium: 'InstrumentSans_600SemiBold',
  displaySemiBold: 'InstrumentSans_600SemiBold',
  displayBold: 'InstrumentSans_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
};

// ── Radius ────────────────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// ── Typography Scale ──────────────────────────────────────────────────────────

export const Typography = {
  // Hero headline (Poppins Light)
  hero:          { fontFamily: 'Poppins_300Light',      fontSize: 34 } as const,
  // Page title (Poppins Light)
  screenTitle:   { fontFamily: 'Poppins_300Light',      fontSize: 26 } as const,
  // Section heading (Poppins Regular)
  sectionTitle:  { fontFamily: 'Poppins_400Regular',    fontSize: 20 } as const,
  // Card heading (Poppins Regular)
  cardTitle:     { fontFamily: 'Poppins_400Regular',    fontSize: 17 } as const,
  // Body L — Intro paragraph
  bodyLead:      { fontFamily: 'Inter_400Regular',      fontSize: 17, lineHeight: 30 } as const,
  // Body M — Default body
  body:          { fontFamily: 'Inter_400Regular',      fontSize: 15, lineHeight: 26 } as const,
  // Body S — Supporting text
  bodySmall:     { fontFamily: 'Inter_400Regular',      fontSize: 13, lineHeight: 20 } as const,
  // UI M — Form labels, nav, buttons
  label:         { fontFamily: 'Inter_500Medium',       fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 1.1 } as const,
  caption:       { fontFamily: 'Inter_400Regular',      fontSize: 13 } as const,
  button:        { fontFamily: 'Inter_500Medium',       fontSize: 13 } as const,
};

// ── Button Sizes ─────────────────────────────────────────────────────────────

export const ButtonSizes = {
  xs: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 12, height: 28 },
  sm: { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14, height: 36 },
  md: { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16, height: 44 },
  lg: { paddingHorizontal: 32, paddingVertical: 16, fontSize: 18, height: 52 },
  xl: { paddingHorizontal: 40, paddingVertical: 20, fontSize: 20, height: 60 },
};

// ── Shadows ───────────────────────────────────────────────────────────────────

export const Shadows = {
  xs: {
    shadowColor: '#001c14',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#001c14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#001c14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#001c14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  // Legacy alias
  terracotta: {
    shadowColor: '#679647',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};
