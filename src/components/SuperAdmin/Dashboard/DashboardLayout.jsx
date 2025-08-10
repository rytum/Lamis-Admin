import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../Theme/useThemeColors';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  // Check for authentication
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const superadmin = localStorage.getItem('superadmin');
    if (!token || !superadmin) {
      navigate('/super-admin/login');
    }
  }, [navigate]);

  return (
    <div 
      className="flex h-screen"
      style={{ backgroundColor: colors.background.primary }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
