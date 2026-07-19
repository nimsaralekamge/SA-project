/**
 * TalentFlow AI — shared color tokens.
 * Source: brand palette board (color.adobe.com export).
 */
export const COLORS = {
  bg: "#1A2126",
  panel: "#1F2933",
  panelAlt: "#232E38",
  border: "#2C3944",
  blue: "#27668C",
  cyan: "#0CF2F2",
  teal: "#2CBFBF",
  gold: "#D9B855",
  textPrimary: "#E7EEF2",
  textSecondary: "#8FA3AE",
  danger: "#F0997B",
} as const;

export type ThemeColors = typeof COLORS;
