import { useTheme } from './ThemeProvider';
import { getThemeColors } from './themeConfig';

export const useThemeColors = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'system' ? 'dark' : theme; // Default to dark for system
  return getThemeColors(currentTheme);
};