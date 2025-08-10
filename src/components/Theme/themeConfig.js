// Theme configuration for the admin interface
export const themeConfig = {
  dark: {
    // Original dark theme colors
    background: {
      primary: '#121212',
      secondary: '#1e1e1e',
      tertiary: '#2d2d2d',
      card: '#1a1a1a',
      modal: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      tertiary: '#b0b0b0',
      muted: '#808080'
    },
    border: {
      primary: '#404040',
      secondary: '#333333',
      accent: '#6b46c1'
    },
    accent: {
      primary: '#6b46c1',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  light: {
    // Light theme colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      modal: '#ffffff'
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      tertiary: '#64748b',
      muted: '#94a3b8'
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      accent: '#6b46c1'
    },
    accent: {
      primary: '#6b46c1',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  }
};

// Helper function to get theme colors
export const getThemeColors = (theme) => {
  return themeConfig[theme] || themeConfig.dark;
};