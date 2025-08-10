import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useThemeColors } from '../Theme/useThemeColors';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const colors = useThemeColors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/employees/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('manager', JSON.stringify(res.data.employee));
      navigate('/manager');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div 
        className="p-8 rounded-2xl shadow-2xl w-full max-w-md border backdrop-blur-sm transition-colors duration-300"
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.accent
        }}
      >
        <h2 
          className="text-2xl font-bold mb-6 text-center transition-colors duration-300"
          style={{ color: colors.text.primary }}
        >
          Manager Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              className="block text-sm font-medium mb-1 transition-colors duration-300"
              style={{ color: colors.text.secondary }}
            >
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-xl bg-transparent focus:outline-none focus:ring-2 transition-all duration-300"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary
              }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-sm font-medium mb-1 transition-colors duration-300"
              style={{ color: colors.text.secondary }}
            >
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-xl bg-transparent focus:outline-none focus:ring-2 transition-all duration-300"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary
              }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div 
              className="mb-4 p-3 rounded-lg text-sm transition-colors duration-300"
              style={{ 
                backgroundColor: colors.accent.error + '20',
                color: colors.accent.error,
                border: `1px solid ${colors.accent.error}`
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-md border hover:shadow-lg disabled:opacity-50"
            style={{ 
              borderColor: colors.accent.primary,
              color: '#ffffff',
              backgroundColor: colors.accent.primary
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerLogin; 