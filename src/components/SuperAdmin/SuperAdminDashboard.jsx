import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useThemeColors } from '../Theme/useThemeColors';

// --- Helper Functions ---

/**
 * Helper function to get theme-aware button styles (matching status column style)
 */
const getThemeButtonStyles = (colors, type = 'success') => {
  const baseStyles = {
    width: '80px',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    lineHeight: '1.25rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const colorMap = {
    success: {
      backgroundColor: colors.accent.success + '20',
      color: colors.accent.success
    },
    error: {
      backgroundColor: colors.accent.error + '20',
      color: colors.accent.error
    },
    warning: {
      backgroundColor: colors.accent.warning + '20',
      color: colors.accent.warning
    }
  };

  return { ...baseStyles, ...colorMap[type] };
};

/**
 * Helper function to get hover styles
 */
const getHoverStyles = (colors, type = 'success') => {
  const hoverMap = {
    success: {
      backgroundColor: colors.accent.success + '30'
    },
    error: {
      backgroundColor: colors.accent.error + '30'
    },
    warning: {
      backgroundColor: colors.accent.warning + '30'
    }
  };

  return hoverMap[type];
};

/**
 * Helper function to get theme-aware button styles for bulk actions (larger size)
 */
const getBulkActionButtonStyles = (colors, type = 'success') => {
  const baseStyles = {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: 'none',
    outline: 'none',
    cursor: 'pointer'
  };

  const colorMap = {
    success: {
      backgroundColor: colors.accent.success + '20',
      color: colors.accent.success
    },
    error: {
      backgroundColor: colors.accent.error + '20',
      color: colors.accent.error
    },
    warning: {
      backgroundColor: colors.accent.warning + '20',
      color: colors.accent.warning
    }
  };

  return { ...baseStyles, ...colorMap[type] };
};

// --- Reusable Components (In a real project, these would be in separate files) ---

/**
 * 1. Dashboard Header Component
 */
const DashboardHeader = ({ onLogout }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="border-b shadow-sm sticky top-0 z-40"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="transition-colors"
              style={{ color: colors.text.secondary }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div 
              className="w-px h-6"
              style={{ backgroundColor: colors.border.primary }}
            ></div>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: colors.accent.primary }}
              >
                LC
              </div>
              <span 
                className="ml-3 text-xl font-bold"
                style={{ color: colors.text.primary }}
              >
                LegalCare
              </span>
              <span 
                className="ml-2 text-xs font-semibold px-2 py-1 rounded-full border"
                style={{ 
                  color: colors.text.secondary,
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary
                }}
              >
                Super Admin
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onLogout}
              className="p-3 border rounded-full bg-transparent transition-colors duration-200"
              style={{ 
                borderColor: colors.border.primary,
                color: colors.text.primary
              }}
              aria-label="Logout from Super Admin dashboard"
              title="Logout"
              role="button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Summary Card Component
 */
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

/**
 * 3. Add Manager Modal Component
 */
const AddManagerModal = ({ isOpen, onClose, onManagerAdded }) => {
  const [newManager, setNewManager] = useState({ user_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/employees/register', {
        ...newManager,
        role: 'manager',
        access: { canChangeSubscription: false }, // Default access
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onManagerAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add manager. Check permissions.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Manager</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 dark:text-white" value={newManager.user_name} onChange={e => setNewManager({ ...newManager, user_name: e.target.value })} required />
            <input type="email" placeholder="Email Address" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 dark:text-white" value={newManager.email} onChange={e => setNewManager({ ...newManager, email: e.target.value })} required />
            <input type="password" placeholder="Password" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 dark:text-white" value={newManager.password} onChange={e => setNewManager({ ...newManager, password: e.target.value })} required />
          </div>
          {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500" onClick={onClose} disabled={loading} aria-label="Cancel adding manager" title="Cancel">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400" disabled={loading} aria-label="Add new manager" title="Add Manager">{loading ? 'Adding...' : 'Add Manager'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


/**
 * 4. Pagination Component
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-between items-center mt-4 p-4">
            {/* Previous Button - Left Side */}
            <button 
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ 
                    borderColor: currentPage === 1 ? '#9CA3AF' : '#6B7280',
                    color: currentPage === 1 ? '#9CA3AF' : '#6B7280'
                }}
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            {/* Page Info - Middle */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
            </span>
            
            {/* Next Button - Right Side */}
            <button 
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ 
                    borderColor: currentPage === totalPages ? '#9CA3AF' : '#6B7280',
                    color: currentPage === totalPages ? '#9CA3AF' : '#6B7280'
                }}
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

/**
 * 5. Bulk Action Bar Component
 */
const BulkActionBar = ({ selectedCount, onClear, onActivate, onDeactivate }) => {
    const colors = useThemeColors();
    
    return (
        <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 bg-purple-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">{selectedCount} selected</span>
                <button onClick={onClear} className="text-sm text-purple-600 dark:text-purple-300 hover:underline" aria-label="Clear all selected users" title="Clear selection">Clear selection</button>
            </div>
            <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bulk actions:</span>
                <button 
                    onClick={onActivate} 
                    className="focus:ring-2 focus:ring-purple-500" 
                    style={getBulkActionButtonStyles(colors, 'success')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = getHoverStyles(colors, 'success').backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = getBulkActionButtonStyles(colors, 'success').backgroundColor}
                    aria-label="Activate all selected users" 
                    title="Activate selected"
                >
                    Activate
                </button>
                <button 
                    onClick={onDeactivate} 
                    className="focus:ring-2 focus:ring-purple-500" 
                    style={getBulkActionButtonStyles(colors, 'error')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = getHoverStyles(colors, 'error').backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = getBulkActionButtonStyles(colors, 'error').backgroundColor}
                    aria-label="Deactivate all selected users" 
                    title="Deactivate selected"
                >
                    Deactivate
                </button>
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---

const DashboardContent = () => {
  const navigate = useNavigate();
  // State Management
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [showAddManager, setShowAddManager] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  // State for Users Tab
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSubscriptionFilter, setUserSubscriptionFilter] = useState('all');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const USERS_PER_PAGE = 10;

  // State for Managers Tab
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [managerCurrentPage, setManagerCurrentPage] = useState(1);
  const MANAGERS_PER_PAGE = 10;
  
  const masterCheckboxRef = useRef(null);

  // Data Fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/super-admin-login');
        return;
    }
    const headers = { Authorization: `Bearer ${token}` };
    try {
        const [usersRes, managersRes] = await Promise.all([
            axios.get('http://localhost:5000/api/auth0/all', { headers }),
            axios.get('http://localhost:5000/api/employees/all', { headers })
        ]);
        setUsers(usersRes.data);
        setManagers(managersRes.data);
        setError(null);
    } catch (err) {
        setError('Failed to fetch data. Your session may have expired.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshData]);

  // Filtering and Pagination Logic
  const filteredUsers = users.filter(user => {
    const search = userSearchTerm.toLowerCase();
    const matchesSearch = (user.user_name?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search));
    const matchesFilter = userSubscriptionFilter === 'all' || user.subscription_status === userSubscriptionFilter;
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice((userCurrentPage - 1) * USERS_PER_PAGE, userCurrentPage * USERS_PER_PAGE);
  const userTotalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const filteredManagers = managers.filter(manager => {
      const search = managerSearchTerm.toLowerCase();
      return manager.user_name?.toLowerCase().includes(search) || manager.email?.toLowerCase().includes(search);
  });
  
  const paginatedManagers = filteredManagers.slice((managerCurrentPage - 1) * MANAGERS_PER_PAGE, managerCurrentPage * MANAGERS_PER_PAGE);
  const managerTotalPages = Math.ceil(filteredManagers.length / MANAGERS_PER_PAGE);
  
    // Logic for User Selection
    const currentUserPageIds = paginatedUsers.map(u => u._id);
    const selectedOnPageCount = currentUserPageIds.filter(id => selectedUserIds.has(id)).length;

    useEffect(() => {
        if (masterCheckboxRef.current) {
            const allOnPageSelected = selectedOnPageCount === currentUserPageIds.length && currentUserPageIds.length > 0;
            masterCheckboxRef.current.checked = allOnPageSelected;
            masterCheckboxRef.current.indeterminate = selectedOnPageCount > 0 && !allOnPageSelected;
        }
    }, [selectedOnPageCount, currentUserPageIds.length]);

    useEffect(() => {
      setUserCurrentPage(1);
    }, [userSearchTerm, userSubscriptionFilter]);

    const handleSelectPage = (e) => {
        const newSelectedIds = new Set(selectedUserIds);
        if (e.target.checked) {
            currentUserPageIds.forEach(id => newSelectedIds.add(id));
        } else {
            currentUserPageIds.forEach(id => newSelectedIds.delete(id));
        }
        setSelectedUserIds(newSelectedIds);
    };

    const handleSelectUser = (userId) => {
        const newSelectedIds = new Set(selectedUserIds);
        if (newSelectedIds.has(userId)) {
            newSelectedIds.delete(userId);
        } else {
            newSelectedIds.add(userId);
        }
        setSelectedUserIds(newSelectedIds);
    };

    const handleSelectAllFiltered = () => {
        const allFilteredIds = filteredUsers.map(u => u._id);
        setSelectedUserIds(new Set(allFilteredIds));
    };

    // Handler for the individual row action button
    const handleSubscriptionToggle = async (userId, currentStatus) => {
      // Backend logic remains 'yes'/'no'
      const newStatus = currentStatus === 'yes' ? 'no' : 'yes';
      try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:5000/api/auth0/${userId}/subscription`, 
          { subscription_status: newStatus }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRefreshData(p => !p);
      } catch (err) {
        alert('Failed to update subscription status.');
      }
    };
  
    const handleBulkSubscriptionChange = async (newStatus) => {
        const token = localStorage.getItem('token');
        const updatePromises = Array.from(selectedUserIds).map(userId => 
            axios.put(`http://localhost:5000/api/auth0/${userId}/subscription`, 
                { subscription_status: newStatus }, // Logic is still 'yes'/'no'
                { headers: { Authorization: `Bearer ${token}` } }
            )
        );
        try {
            await Promise.all(updatePromises);
            setRefreshData(p => !p);
            setSelectedUserIds(new Set());
        } catch (err) {
            alert(`Failed to update some users. Please try again.`);
        }
    };


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('superadmin');
    navigate('/super-admin-login');
  };

  const handleToggleManagerAccess = async (managerId, currentAccess) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/employees/${managerId}/access`, 
        { access: { canChangeSubscription: !currentAccess } }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setManagers(managers.map(m => m._id === managerId ? { ...m, access: { ...m.access, canChangeSubscription: !currentAccess } } : m));
    } catch (err) {
      alert('Failed to update manager permission.');
    }
  };

  const colors = useThemeColors();
  if (loading) return <div className="flex items-center justify-center h-screen" style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}>Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen" style={{ backgroundColor: colors.background.primary, color: colors.accent.error }}>{error}</div>;

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: colors.background.primary,
        color: colors.text.primary
      }}
    >
      <DashboardHeader onLogout={handleLogout} />
      <AddManagerModal isOpen={showAddManager} onClose={() => setShowAddManager(false)} onManagerAdded={() => setRefreshData(p => !p)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 
          className="text-3xl font-bold"
          style={{ color: colors.text.primary }}
        >
          Super Admin Dashboard
        </h1>
        <p 
          className="mt-1"
          style={{ color: colors.text.secondary }}
        >
          Manage users, managers, and system settings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <SummaryCard title="Total Users" value={users.length} icon={<UserIcon />} />
            <SummaryCard title="Total Managers" value={managers.length} icon={<ManagerIcon />} />
            <SummaryCard title="Active Users" value={users.filter(u => u.subscription_status === 'yes').length} icon={<CheckIcon />} />
            <SummaryCard title="Pending Actions" value={0} icon={<ClockIcon />} />
        </div>
        
        <div className="mt-8">
          <div 
            className="border-b"
            style={{ borderColor: colors.border.primary }}
          >
            <nav className="-mb-px flex space-x-8">
              <button 
                onClick={() => setActiveTab('users')} 
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'users' ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
                style={{ 
                  color: activeTab === 'users' ? colors.accent.primary : colors.text.secondary,
                  borderColor: activeTab === 'users' ? colors.accent.primary : 'transparent'
                }}
              >
                Users ({users.length})
              </button>
              <button 
                onClick={() => setActiveTab('managers')} 
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'managers' ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
                style={{ 
                  color: activeTab === 'managers' ? colors.accent.primary : colors.text.secondary,
                  borderColor: activeTab === 'managers' ? colors.accent.primary : 'transparent'
                }}
              >
                Managers ({managers.length})
              </button>
            </nav>
          </div>
        </div>

        <div 
          className="mt-6 rounded-lg shadow"
          style={{ backgroundColor: colors.background.secondary }}
        >
          {activeTab === 'users' && (
            <div>
              {selectedUserIds.size > 0 ? (
                <BulkActionBar 
                    selectedCount={selectedUserIds.size}
                    onClear={() => setSelectedUserIds(new Set())}
                    onActivate={() => handleBulkSubscriptionChange('yes')}
                    onDeactivate={() => handleBulkSubscriptionChange('no')}
                />
              ) : (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                  <input type="text" placeholder="Search users by name or email..." value={userSearchTerm} onChange={(e) => setUserSearchTerm(e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700" aria-label="Search users by name or email" title="Search users" />
                  <select value={userSubscriptionFilter} onChange={(e) => setUserSubscriptionFilter(e.target.value)} className="w-full md:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700" aria-label="Filter users by subscription status" title="Filter by status">
                      <option value="all">All Status</option>
                      <option value="yes">Active</option>
                      <option value="no">Inactive</option>
                  </select>
                </div>
              )}
                {masterCheckboxRef.current?.checked && selectedUserIds.size > 0 && selectedUserIds.size < filteredUsers.length && (
                    <div className="p-4 text-center text-sm bg-purple-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        All {selectedOnPageCount} users on this page are selected. {' '}
                        <button onClick={handleSelectAllFiltered} className="font-semibold text-purple-600 dark:text-purple-300 hover:underline">
                            Select all {filteredUsers.length} users that match this filter
                        </button>
                    </div>
                )}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 w-12 text-left">
                        <input type="checkbox" ref={masterCheckboxRef} onChange={handleSelectPage} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" aria-label="Select all users on this page" title="Select all" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedUsers.map(user => (
                      <tr key={user._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${selectedUserIds.has(user._id) ? 'bg-purple-50 dark:bg-gray-700' : ''}`}>
                        <td className="px-4 py-4"><input type="checkbox" checked={selectedUserIds.has(user._id)} onChange={() => handleSelectUser(user._id)} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" aria-label={`Select ${user.user_name}`} title={`Select ${user.user_name}`} /></td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <img src={user.picture} alt="avatar" className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.user_name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`w-[80px] px-2 inline-flex text-xs leading-5 font-semibold rounded-full justify-center ${user.subscription_status === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.subscription_status === 'yes' ? 'Active' : 'Inactive'}
                            </span>

                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                                onClick={() => handleSubscriptionToggle(user._id, user.subscription_status)} 
                                className="focus:ring-2 focus:ring-purple-500"
                                style={getThemeButtonStyles(colors, user.subscription_status === 'yes' ? 'error' : 'success')}
                                onMouseEnter={(e) => e.target.style.backgroundColor = getHoverStyles(colors, user.subscription_status === 'yes' ? 'error' : 'success').backgroundColor}
                                onMouseLeave={(e) => e.target.style.backgroundColor = getThemeButtonStyles(colors, user.subscription_status === 'yes' ? 'error' : 'success').backgroundColor}
                                aria-label={`${user.subscription_status === 'yes' ? 'Deactivate' : 'Activate'} subscription for ${user.user_name}`}
                                title={`${user.subscription_status === 'yes' ? 'Deactivate' : 'Activate'} subscription for ${user.user_name}`}
                                role="button"
                            >
                                {user.subscription_status === 'yes' ? 'Deactivate' : 'Activate'}
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={userCurrentPage} totalPages={userTotalPages} onPageChange={setUserCurrentPage} />
            </div>
          )}
          {activeTab === 'managers' && (
             <div>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                <input type="text" placeholder="Search managers..." value={managerSearchTerm} onChange={(e) => setManagerSearchTerm(e.target.value)} className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700" aria-label="Search managers by name or email" title="Search managers" />
                 <button onClick={() => setShowAddManager(true)} className="w-full md:w-auto bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center space-x-2" aria-label="Add new manager to the system" title="Add Manager">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <span>Add Manager</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Manager</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subscription Access</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedManagers.map(manager => (
                        <tr key={manager._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{manager.user_name || 'N/A'}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{manager.email || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{manager.role || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    onClick={() => handleToggleManagerAccess(manager._id, manager.access?.canChangeSubscription)} 
                                    className="focus:ring-2 focus:ring-purple-500"
                                    style={getThemeButtonStyles(colors, manager.access?.canChangeSubscription ? 'success' : 'error')}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = getHoverStyles(colors, manager.access?.canChangeSubscription ? 'success' : 'error').backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = getThemeButtonStyles(colors, manager.access?.canChangeSubscription ? 'success' : 'error').backgroundColor}
                                    aria-label={`${manager.access?.canChangeSubscription ? 'Remove' : 'Grant'} subscription access for ${manager.user_name}`}
                                    title={`${manager.access?.canChangeSubscription ? 'Remove' : 'Grant'} subscription access for ${manager.user_name}`}
                                    role="button"
                                >
                                    {manager.access?.canChangeSubscription ? 'Allowed' : 'Not Allowed'}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{manager.createdAt ? new Date(manager.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={managerCurrentPage} totalPages={managerTotalPages} onPageChange={setManagerCurrentPage} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- Icon Components ---
const UserIcon = () => <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>;
const ManagerIcon = () => <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CheckIcon = () => <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const Dashboard = () => (
  // The ThemeProvider should wrap this component at a higher level in your app
  <DashboardContent />
);

export default Dashboard;