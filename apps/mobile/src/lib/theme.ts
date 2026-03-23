export const Theme = {
  colors: {
    background: '#0f172a', // Deep Slate
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Violet
    accent: '#f43f5e', // Rose/Red
    foreground: '#ffffff',
    muted: '#94a3b8',
    card: '#1e293b',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  roundness: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32,
    full: 999,
  },
  typography: {
    fontFamily: 'System', // Will use default for now, unless fonts are linked
    sizes: {
      xs: 11,
      sm: 13,
      base: 15,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  }
};
