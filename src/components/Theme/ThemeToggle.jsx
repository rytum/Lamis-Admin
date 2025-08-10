import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { useThemeColors } from './useThemeColors';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const colors = useThemeColors();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m6.75-6.75l.707.707M6.343 6.343l.707-.707m12.728 0l-.707.707M17.657 6.343l-.707-.707M6.343 17.657l-.707.707M17.657 17.657l.707-.707M4 12a8 8 0 118 8" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-3 border rounded-full bg-transparent hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200"
        style={{
          borderColor: colors.border.primary,
          color: colors.text.primary,
          backgroundColor: showDropdown ? colors.background.secondary : 'transparent'
        }}
        aria-label="Toggle theme"
      >
        {getThemeIcon()}
      </button>
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-32 border rounded-md shadow-lg z-10"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="py-1">
            <button
              onClick={() => { setTheme('light'); setShowDropdown(false); }}
              className="block w-full text-left px-4 py-2 text-sm transition-colors"
              style={{
                backgroundColor: theme === 'light' ? colors.accent.primary : 'transparent',
                color: theme === 'light' ? '#ffffff' : colors.text.secondary
              }}
            >
              Light
            </button>
            <button
              onClick={() => { setTheme('dark'); setShowDropdown(false); }}
              className="block w-full text-left px-4 py-2 text-sm transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? colors.accent.primary : 'transparent',
                color: theme === 'dark' ? '#ffffff' : colors.text.secondary
              }}
            >
              Dark
            </button>
            <button
              onClick={() => { setTheme('system'); setShowDropdown(false); }}
              className="block w-full text-left px-4 py-2 text-sm transition-colors"
              style={{
                backgroundColor: theme === 'system' ? colors.accent.primary : 'transparent',
                color: theme === 'system' ? '#ffffff' : colors.text.secondary
              }}
            >
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle; 