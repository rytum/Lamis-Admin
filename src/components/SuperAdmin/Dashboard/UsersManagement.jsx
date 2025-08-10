import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';
import { useThemeColors } from '../Theme/useThemeColors';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colors = useThemeColors();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.accent.primary }}
        ></div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div style={{ color: colors.accent.error }}>{error}</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 
          className="text-2xl font-semibold"
          style={{ color: colors.text.primary }}
        >
          Users Management
        </h1>
        <p 
          className="mt-1"
          style={{ color: colors.text.secondary }}
        >
          Manage your system users
        </p>
      </div>

      <div 
        className="shadow-sm rounded-lg overflow-hidden"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead 
              className=""
              style={{ backgroundColor: colors.background.tertiary }}
            >
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.secondary }}
                >
                  Name
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.secondary }}
                >
                  Email
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.secondary }}
                >
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.text.secondary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div style={{ color: colors.text.primary }}>{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div style={{ color: colors.text.secondary }}>{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      style={{ 
                        backgroundColor: colors.accent.success,
                        color: '#ffffff'
                      }}
                    >
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="mr-2"
                      style={{ color: colors.accent.primary }}
                    >
                      Edit
                    </button>
                    <button 
                      style={{ color: colors.accent.error }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersManagement;
