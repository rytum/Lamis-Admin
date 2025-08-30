import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../Theme/ThemeToggle';
import { useAuth0 } from '@auth0/auth0-react';
import { useThemeColors } from '../Theme/useThemeColors';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, logout, isLoading } = useAuth0();
  const colors = useThemeColors();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper for Super Admin button
  const renderSuperAdminButton = () => {
    if (isLoading) return <span className="px-3 py-2 text-sm">Loading...</span>;
    if (!isAuthenticated) {
      return (
        <button
          onClick={() => loginWithRedirect()}
          className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
          style={{ color: colors.accent.primary }}
        >
          Super Admin Login
        </button>
      );
    }
    if (user?.email === 'ops@lamis.ai') {
      return (
        <>
          <Link
            to="/super-admin"
            className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ color: colors.accent.primary }}
          >
            Super Admin Dashboard
          </Link>
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="ml-2 text-sm px-2 py-1 border rounded transition-colors"
            style={{ 
              borderColor: colors.border.primary,
              color: colors.text.secondary
            }}
          >
            Logout
          </button>
        </>
      );
    }
    return (
      <>
        <span 
          className="px-3 py-2 text-sm"
          style={{ color: colors.accent.error }}
        >
          Access denied
        </span>
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="ml-2 text-sm px-2 py-1 border rounded transition-colors"
          style={{ 
            borderColor: colors.border.primary,
            color: colors.text.secondary
          }}
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav 
      className="shadow-lg border-b"
      style={{ 
        borderColor: colors.border.primary,
        backgroundColor: colors.background.primary
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: colors.accent.primary }}
                >
                  LA
                </div>
                <span 
                  className="ml-[1px] text-xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Lamis AI
                </span>
              </Link>
            </div>
          </div>

          {/* Right side - Theme Toggle only */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
