// ── Color Tokens ──────────────────────────────────────────────────────────────
// Based on Tether Wellness Design System v2

export const Colors = {
  // Cream
  cream: '#FAF7F0',
  creamDark: '#F2EDE0',
  warmWhite: '#FDFBF7',
  sand: '#E8DFCC',
  sandDark: '#E8DFCD',

  // Sage (primary) — soft mint
  sage: '#9BBF9E',
  sageDark: '#6E9B72',
  sageDeep: '#4A7A4E',
  sageLight: '#C8E0CA',
  sagePale: '#E4F0E5',

  // Mauve (accent) — soft lilac
  mauve: '#B49EDE',
  mauveDark: '#8B6FC0',
  mauveDeep: '#5E4494',
  mauveLight: '#DCD0F0',
  mauvePale: '#F0ECF8',

  // Blue-periwinkle (fresh)
  blue: '#8BA4D4',
  blueDark: '#5B78B5',
  blueDeep: '#3A5490',
  blueLight: '#C5D3EC',
  bluePale: '#E8EEF8',

  // Amber (glow) — chartreuse/lime
  amber: '#D2D965',
  amberDark: '#A8B03A',
  amberLight: '#E8ECB0',
  amberPale: '#F5F6E2',

  // Stone (text)
  charcoal: '#201D18',
  warmBrown: '#3A3630',
  midBrown: '#5E5A53',
  lightBrown: '#8E8880',
  stone200: '#BCB7AC',
  stone100: '#DDD9D0',
  stone50: '#F5F2EC',

  // Legacy aliases (keep for compatibility during migration)
  terracotta: '#6E9B72',        // → sage-dark (primary CTA)
  terracottaLight: '#9BBF9E',   // → sage-400
  terracottaPale: '#E4F0E5',    // → sagePale
  blush: '#9E87C3',             // → mauve (accent)
  blushPale: '#F2EEF7',         // → mauvePale
  gold: '#D4A340',              // → amber
  goldPale: '#FBF4E6',          // → amberPale

  white: '#FFFFFF',

  // Functional
  successBg: '#EAFAF0',
  successBorder: '#7ECFA0',
  successText: '#1E6B43',
  warningBg: '#F5F6E2',
  warningBorder: '#D2D965',
  warningText: '#A8B03A',
  errorBg: '#FBF0EE',
  errorBorder: '#E8B0A8',
  errorText: '#6F3327',
  infoBg: '#E8EEF8',
  infoBorder: '#8BA4D4',
  infoText: '#3A5490',
};

// ── Typography ────────────────────────────────────────────────────────────────
// Display: Questrial (clean, modern, warm)
// Body: DM Sans (clear, friendly)

export const Fonts = {
  displayLight: 'Fraunces_300Light',
  display: 'Fraunces_400Regular',
  displayItalic: 'Fraunces_400Regular_Italic',
  displayLightItalic: 'Fraunces_300Light_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
};

// ── Radius ────────────────────────────────────────────────────────────────────

export const Radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  '2xl': 48,
  full: 100,
};

// ── Typography Scale ──────────────────────────────────────────────────────────

export const Typography = {
  // 2XL — Hero headline (Fraunces Light)
  hero:          { fontFamily: 'Fraunces_300Light',      fontSize: 34 } as const,
  // XL — Page title (Fraunces Light)
  screenTitle:   { fontFamily: 'Fraunces_300Light',      fontSize: 26 } as const,
  // M — Card heading (Fraunces Regular)
  sectionTitle:  { fontFamily: 'Fraunces_400Regular',    fontSize: 20 } as const,
  // S — Component title (DM Sans Medium)
  cardTitle:     { fontFamily: 'Fraunces_400Regular',    fontSize: 17 } as const,
  // Body L — Intro paragraph
  bodyLead:      { fontFamily: 'DMSans_400Regular',      fontSize: 17, lineHeight: 30 } as const,
  // Body M — Default body
  body:          { fontFamily: 'DMSans_400Regular',      fontSize: 15, lineHeight: 26 } as const,
  // Body S — Supporting text
  bodySmall:     { fontFamily: 'DMSans_400Regular',      fontSize: 13, lineHeight: 20 } as const,
  // UI M — Form labels, nav, buttons
  label:         { fontFamily: 'DMSans_500Medium',       fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: 1.1 } as const,
  caption:       { fontFamily: 'DMSans_400Regular',      fontSize: 13 } as const,
  button:        { fontFamily: 'DMSans_500Medium',       fontSize: 13 } as const,
};

// ── Shadows ───────────────────────────────────────────────────────────────────

export const Shadows = {
  xs: {
    shadowColor: '#2A2114',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#2A2114',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#2A2114',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#2A2114',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  // Legacy alias
  terracotta: {
    shadowColor: '#4A7A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
};
