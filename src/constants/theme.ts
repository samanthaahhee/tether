export const Colors = {
  cream: '#F7F3ED',
  creamDark: '#EDE7DC',
  warmWhite: '#FDFAF6',
  sand: '#D9CEBB',
  sandDark: '#C4B49E',
  terracotta: '#C17F5A',
  terracottaLight: '#E8A882',
  terracottaPale: '#F2DDD0',
  sage: '#7E9E8C',
  sageLight: '#A8C4B4',
  sagePale: '#D8EAE2',
  blush: '#D4917A',
  blushPale: '#F5E4DC',
  gold: '#C4A248',
  goldPale: '#F5EDD0',
  charcoal: '#2C2825',
  warmBrown: '#6B5B4E',
  midBrown: '#9B8878',
  lightBrown: '#BEB0A4',
  white: '#FFFFFF',
};

export const Fonts = {
  display: 'Lora_500Medium',
  displayItalic: 'Lora_400Regular_Italic',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

// ── Typography scale ────────────────────────────────────────────────────────
// Use these tokens instead of raw fontSize values to keep hierarchy consistent.
export const Typography = {
  // One per screen — the page title
  screenTitle:   { fontFamily: 'Lora_500Medium',      fontSize: 26 } as const,
  // Major section headers — "Know yourself", "Breathing exercises"
  sectionTitle:  { fontFamily: 'Lora_500Medium',      fontSize: 18 } as const,
  // Card and subsection titles — pattern card values, card names
  cardTitle:     { fontFamily: 'Lora_500Medium',      fontSize: 16 } as const,
  // Primary body copy — messages, reflections, assessment paragraphs
  body:          { fontFamily: 'DMSans_400Regular',   fontSize: 14, lineHeight: 22 } as const,
  // Secondary / supporting copy — notes, intros, descriptions
  bodySmall:     { fontFamily: 'DMSans_400Regular',   fontSize: 13, lineHeight: 20 } as const,
  // ALL-CAPS labels, tags, metadata chips
  label:         { fontFamily: 'DMSans_500Medium',    fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: 0.8 } as const,
  // Captions, sub-labels, secondary metadata
  caption:       { fontFamily: 'DMSans_400Regular',   fontSize: 12 } as const,
  // Buttons and interactive labels
  button:        { fontFamily: 'DMSans_500Medium',    fontSize: 14 } as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  md: {
    shadowColor: '#2C2825',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  terracotta: {
    shadowColor: '#C17F5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
};
