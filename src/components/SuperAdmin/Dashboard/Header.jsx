import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut } from 'lucide-react';
import ThemeToggle from '../Theme/ThemeToggle';
import { useThemeColors } from '../Theme/useThemeColors';

const Header = () => {
  const navigate = useNavigate();
  const [superadmin, setSuperadmin] = React.useState(null);
  const colors = useThemeColors();

  React.useEffect(() => {
    const adminData = localStorage.getItem('superadmin');
    if (adminData) {
      setSuperadmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('superadmin');
    navigate('/super-admin/login');
  };

  return (
    <header 
      className="shadow-sm z-30 border-b"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 
              className="text-xl font-semibold"
              style={{ color: colors.text.primary }}
            >
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button 
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: colors.text.secondary,
                ':hover': { backgroundColor: colors.background.tertiary }
              }}
            >
              <Bell className="h-5 w-5" />
            </button>
            <button 
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: colors.text.secondary,
                ':hover': { backgroundColor: colors.background.tertiary }
              }}
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: colors.text.secondary,
                ':hover': { backgroundColor: colors.background.tertiary }
              }}
            >
              <LogOut className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <span 
                className="text-sm font-medium"
                style={{ color: colors.text.secondary }}
              >
                {superadmin?.email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
