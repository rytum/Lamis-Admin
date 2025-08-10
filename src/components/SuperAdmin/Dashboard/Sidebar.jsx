import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, Settings, HelpCircle } from 'lucide-react';
import { useThemeColors } from '../Theme/useThemeColors';

const Sidebar = () => {
  const colors = useThemeColors();
  const menuItems = [
    { icon: Home, name: 'Overview', path: '/super-admin' },
    { icon: Users, name: 'Users', path: '/super-admin/users' },
    { icon: FileText, name: 'Documents', path: '/super-admin/documents' },
    { icon: Settings, name: 'Settings', path: '/super-admin/settings' },
    { icon: HelpCircle, name: 'Help', path: '/super-admin/help' },
  ];

  return (
    <div 
      className="flex flex-col w-64 border-r"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary
      }}
    >
      <div 
        className="flex items-center justify-center h-16 border-b"
        style={{ borderColor: colors.border.primary }}
      >
        <span 
          className="text-lg font-semibold"
          style={{ color: colors.accent.primary }}
        >
          Legal Care Admin
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-purple-600 dark:text-purple-400'
                      : ''
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? colors.accent.primary : colors.text.secondary,
                  backgroundColor: isActive ? `${colors.accent.primary}20` : 'transparent',
                  ':hover': {
                    backgroundColor: isActive ? `${colors.accent.primary}20` : colors.background.tertiary
                  }
                })}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
