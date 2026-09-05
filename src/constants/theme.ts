export const Theme = {
  colors: {
    // Comfy brownish-white background tones
    bgBase: '#FAF7F2',
    bgSecondary: '#F3EDE4',
    bgWarmGradientStart: '#FCFAF6',
    bgWarmGradientEnd: '#EFE6D8',
    card: '#FFFFFF',
    cardBorder: '#ECE2D4',
    cardBorderHover: '#D4B89C',
    cardGlow: 'rgba(142, 90, 56, 0.08)',

    // Text colors (deep espresso to soft mocha)
    textPrimary: '#2B1E16',
    textSecondary: '#5A4638',
    textMuted: '#8C7769',
    textPlaceholder: '#BAA89C',

    // Primary Accents (warm caramel, cozy terracotta, and amber gold)
    primary: '#8A5333',
    primaryHover: '#734327',
    primaryLight: '#F7EDE4',
    primaryGlow: 'rgba(138, 83, 51, 0.25)',

    accentGold: '#D49244',
    accentGoldLight: '#FDF4EA',
    accentTerracotta: '#B8583B',
    accentSage: '#4A7A5B',
    accentSageLight: '#EDF5F0',

    // Feedback colors
    success: '#3D7A58',
    error: '#B84534',
    errorLight: '#FBEFED',

    // UI elements
    inputBg: '#FAF7F3',
    inputBorder: '#E2D5C5',
    inputBorderFocused: '#9A6344',
    progressBg: '#EBE1D3',
    progressFill: '#8A5333',
    badgeBg: '#F2E8DC',
    badgeText: '#6D442A',
  },
  shadows: {
    soft: {
      shadowColor: '#3E2A1E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
      elevation: 2,
    },
    card: {
      shadowColor: '#3E2A1E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.09,
      shadowRadius: 28,
      elevation: 4,
    },
    glow: {
      shadowColor: '#8A5333',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 18,
      elevation: 5,
    },
  },
  radii: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    full: 9999,
  },
};
