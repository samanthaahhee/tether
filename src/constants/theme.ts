// ── Color Tokens ──────────────────────────────────────────────────────────────
// Based on Tether Wellness Design System v2

export const Colors = {
  // Cream
  cream: '#FAF7F0',
  creamDark: '#F2EDE0',
  warmWhite: '#FDFBF7',
  sand: '#E8DFCC',
  sandDark: '#E8DFCD',

  // Sage (primary)
  sage: '#8A9660',
  sageDark: '#636E3F',
  sageDeep: '#404727',
  sageLight: '#D4D8B8',
  sagePale: '#F0F1E6',

  // Mauve (accent)
  mauve: '#9E87C3',
  mauveDark: '#735EA0',
  mauveDeep: '#4D3E72',
  mauveLight: '#DDD4EC',
  mauvePale: '#F2EEF7',

  // Blue-teal (warm)
  blue: '#55BFC1',
  blueDark: '#329799',
  blueDeep: '#1D6B6C',
  blueLight: '#C0EBEB',
  bluePale: '#EAF7F7',

  // Amber (glow)
  amber: '#D4A340',
  amberDark: '#9E7420',
  amberLight: '#F5E0B5',
  amberPale: '#FBF4E6',

  // Stone (text)
  charcoal: '#201D18',
  warmBrown: '#3A3630',
  midBrown: '#5E5A53',
  lightBrown: '#8E8880',
  stone200: '#BCB7AC',
  stone100: '#DDD9D0',
  stone50: '#F5F2EC',

  // Legacy aliases (keep for compatibility during migration)
  terracotta: '#8A9660',        // → sage (primary CTA)
  terracottaLight: '#B5BC8A',   // → sage-200
  terracottaPale: '#F0F1E6',    // → sagePale
  blush: '#9E87C3',             // → mauve (accent)
  blushPale: '#F2EEF7',         // → mauvePale
  gold: '#D4A340',              // → amber
  goldPale: '#FBF4E6',          // → amberPale

  white: '#FFFFFF',

  // Functional
  successBg: '#EAFAF0',
  successBorder: '#7ECFA0',
  successText: '#1E6B43',
  warningBg: '#FBF4E6',
  warningBorder: '#ECC97A',
  warningText: '#9E7420',
  errorBg: '#FBF0EE',
  errorBorder: '#E8B0A8',
  errorText: '#6F3327',
  infoBg: '#EAF7F7',
  infoBorder: '#8ED9DA',
  infoText: '#1D6B6C',
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
    shadowColor: '#636E3F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
};
