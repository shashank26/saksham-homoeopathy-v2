export const loginColors = {
  background: "#f8f9ff",
  primary: "#a33f00",
  onPrimary: "#ffffff",
  onBackground: "#0b1c30",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#584238",
  outlineVariant: "#e0c0b3",
  surface: "#f8f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainer: "#e5eeff",
  surfaceContainerLow: "#eff4ff",
  secondary: "#006d36",
  secondaryContainer: "#89f6a6",
  primaryContainer: "#f06b24",
  onPrimaryFixed: "#ffdbcd",
  outline: "#8c7166",
  error: "#ba1a1a",
  onPrimaryFixedVariant: "#7c2e00",
  tertiary: "#00658f",
  tertiaryContainer: "#399cd1",
  onTertiary: "#ffffff",
  onSecondaryContainer: "#007238",
  surfaceContainerHigh: "#dce9ff",
} as const;

export const loginSpacing = {
  containerMargin: 24,
  stackSm: 8,
  stackMd: 16,
  stackLg: 32,
  sectionGap: 64,
  gutter: 16,
} as const;

export const loginRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 12,
} as const;

export const loginTypography = {
  headlineLgMobile: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Manrope_700Bold" as const,
  },
  headlineMd: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Manrope_600SemiBold" as const,
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Manrope_400Regular" as const,
  },
  labelMd: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Manrope_600SemiBold" as const,
  },
  labelSm: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Manrope_500Medium" as const,
  },
  otpDigit: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Manrope_700Bold" as const,
  },
} as const;

export const loginShadow = {
  card: {
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  button: {
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;

export const LOGIN_DISCLAIMER_TEXT =
  "This app is for clinical guidance only. Homeopathic remedies are complementary therapies. Please consult your doctor for medical advice.";
