import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/LandingPage/Navbar';
import Dashboard from './components/SuperAdmin/LandingPage/Dashboard';
import ManagerLogin from './components/Manager/ManagerLogin';
import ManagerDashboard from './components/Manager/Dashboard';
import SuperAdminLogin from './components/SuperAdmin/SuperAdminLogin';
import { ThemeProvider } from './components/Theme/ThemeProvider';
import { useThemeColors } from './components/Theme/useThemeColors';

// Landing Page Component
const LandingPage = () => {
  const colors = useThemeColors();
  
  return (
    <>
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          /* Hide scrollbar for IE, Edge and Firefox */
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
          
          /* Hide scrollbar for the entire page */
          body {
            overflow: hidden;
          }
          
          html {
            overflow: hidden;
          }
        `}
      </style>
      <div 
        className="min-h-screen overflow-hidden no-scrollbar transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <Navbar />
        <div 
          className="flex items-center justify-center min-h-screen overflow-y-auto no-scrollbar"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="rounded-2xl shadow-2xl p-10 text-center border backdrop-blur-sm transition-colors duration-300"
              style={{ 
                borderColor: colors.border.accent,
                backgroundColor: colors.background.secondary
              }}
            >
              <div className="flex justify-center mb-6">
                {/* Use LegalCare logo image */}
                <img
                  src="/LEGALCARE.png"
                  alt="LegalCare Logo"
                  className="h-16 w-auto mx-auto mb-2"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(107, 114, 128, 0.3))' }}
                />
              </div>
              <h1 
                className="text-5xl font-extrabold mb-4 tracking-tight font-sans transition-colors duration-300"
                style={{ color: colors.text.primary }}
              >
                LegalCare
              </h1>
              <p 
                className="text-lg mb-8 font-medium transition-colors duration-300"
                style={{ color: colors.text.secondary }}
              >
                Streamline your legal operations with a secure, modern, and scalable management platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <a
                  href="/super-admin-login"
                  className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md border hover:shadow-lg"
                  style={{ 
                    borderColor: colors.accent.primary,
                    color: '#ffffff',
                    backgroundColor: colors.accent.primary
                  }}
                >
                  Super Admin Access
                </a>
                <a
                  href="/manager-login"
                  className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md border hover:shadow-lg"
                  style={{ 
                    borderColor: colors.border.primary,
                    color: colors.text.secondary,
                    backgroundColor: 'transparent'
                  }}
                >
                  Manager Access
                </a>
              </div>
            </div>
            <div 
              className="mt-12 text-center text-sm transition-colors duration-300"
              style={{ color: colors.text.muted }}
            >
              &copy; {new Date().getFullYear()} LegalCare. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ProtectedManagerRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const manager = JSON.parse(localStorage.getItem('manager'));
  if (!token || !manager || !manager.access) {
    return <Navigate to="/manager-login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/super-admin-login" element={<SuperAdminLogin />} />
          <Route path="/super-admin" element={<Dashboard />} />
          <Route path="/manager-login" element={<ManagerLogin />} />
          <Route path="/manager" element={
            <ProtectedManagerRoute>
              <ManagerDashboard />
            </ProtectedManagerRoute>
          } />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;