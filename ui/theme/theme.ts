export const bonitaTheme = {
  colors: {
    brandRed: '#ff1744',
    brandRedHover: '#e3123c',
    brandBlue: '#2f80ff',
    brandBlueHover: '#1e5bff',

    background: {
      app: '#061a40',
      sidebar: '#071a45',
      topbar: '#0a2256',
      card: '#0d2761',
      panel: '#102c6b',
      cardHover: '#15357a',
    },

    text: {
      primary: '#ffffff',
      secondary: '#c9d4f2',
      muted: '#8fa6d8',
    },

    semantic: {
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#38bdf8',
    },

    chart: {
      primary: '#2f80ff',
      secondary: '#ff1744',
      success: '#22c55e',
      warning: '#f59e0b',
      neutral: '#8fa6d8',
      grid: 'rgba(201, 212, 242, 0.12)',
    },
  },

  gradients: {
    app: 'linear-gradient(135deg, #061a40 0%, #0b245b 55%, #123a8a 100%)',
    primary: 'linear-gradient(135deg, #2f80ff 0%, #1e5bff 100%)',
    danger: 'linear-gradient(135deg, #ff1744 0%, #e3123c 100%)',
    highlight: 'linear-gradient(135deg, rgba(47,128,255,0.18) 0%, rgba(255,23,68,0.10) 100%)',
  },

  radius: {
    sm: 10,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },

  shadows: {
    card: '0 10px 30px rgba(0,0,0,0.25)',
    glowBlue: '0 0 0 1px rgba(47,128,255,0.25), 0 0 18px rgba(47,128,255,0.18)',
    glowRed: '0 0 0 1px rgba(255,23,68,0.22), 0 0 18px rgba(255,23,68,0.15)',
  },

  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },
} as const;

export type BonitaTheme = typeof bonitaTheme;

export const statusColors = {
  completed: bonitaTheme.colors.semantic.success,
  inProgress: bonitaTheme.colors.brandBlue,
  waiting: bonitaTheme.colors.semantic.warning,
  failed: bonitaTheme.colors.brandRed,
  rejected: bonitaTheme.colors.brandRed,
  approved: bonitaTheme.colors.semantic.success,
} as const;
