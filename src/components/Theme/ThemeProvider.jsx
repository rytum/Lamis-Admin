import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark'; // Default to dark theme
  });

  useEffect(() => {
    let appliedTheme = theme;
    if (theme === 'system') {
      appliedTheme = getSystemTheme();
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(appliedTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      const listener = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
      };
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 