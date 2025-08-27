import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../Theme/ThemeProvider';
import { useThemeColors } from '../Theme/useThemeColors';
import ThemeToggle from '../Theme/ThemeToggle';
import { API_ENDPOINTS } from '../../config/api';

// --- Reusable Components ---

/**
 * 1. Dashboard Header Component (MODIFIED)
 * - Using the consistent ThemeToggle component.
 */
const DashboardHeader = ({ managerName, onLogout }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="border-b shadow-sm sticky top-0 z-40 transition-colors duration-300"
      style={{ 
        borderColor: colors.border.primary,
        backgroundColor: colors.background.primary
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.accent.primary }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span 
                className="ml-3 text-xl font-bold transition-colors duration-300"
                style={{ color: colors.text.primary }}
              >
                LegalCare
              </span>
              <span 
                className="ml-2 text-xs font-semibold px-2 py-1 rounded-full border transition-colors duration-300"
                style={{ 
                  color: colors.text.secondary,
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.secondary
                }}
              >
                Manager
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span 
              className="text-sm font-medium hidden sm:block transition-colors duration-300"
              style={{ color: colors.text.secondary }}
            >
              Welcome, {managerName}
            </span>
            <ThemeToggle />
            <button 
              onClick={onLogout} 
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: colors.background.secondary,
                borderColor: colors.accent.error,
                color: colors.accent.error
              }}
              aria-label="Logout"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Summary Card Component (MODIFIED)
 * - Updated to use theme colors.
 */
const SummaryCard = ({ title, value, icon }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="p-6 rounded-lg border transition-colors duration-300"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary
      }}
    >
      <div className="flex items-center">
        <div 
          className="p-3 rounded-full"
          style={{ backgroundColor: colors.accent.primary + '20' }}
        >
          {icon}
        </div>
        <div className="ml-4">
          <p 
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: colors.text.secondary }}
          >
            {title}
          </p>
          <p 
            className="text-2xl font-bold transition-colors duration-300"
            style={{ color: colors.text.primary }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Pagination Component (MODIFIED)
 * - Updated to use theme colors.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const colors = useThemeColors();
  
  return (
    <div className="flex items-center justify-between mt-6">
      {/* Previous Button - Left Side */}
      <div className="flex-1 flex justify-start">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 hover:scale-105"
          style={{ 
            backgroundColor: currentPage === 1 ? colors.background.tertiary : colors.background.secondary,
            borderColor: currentPage === 1 ? colors.border.secondary : colors.accent.primary,
            color: currentPage === 1 ? colors.text.muted : colors.accent.primary
          }}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <ChevronLeftIcon />
        </button>
      </div>

      {/* Page Info - Middle */}
      <div className="flex-1 flex justify-center">
        <span 
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: colors.text.primary }}
        >
          {currentPage}/{totalPages}
        </span>
      </div>

      {/* Next Button - Right Side */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 hover:scale-105"
          style={{ 
            backgroundColor: currentPage === totalPages ? colors.background.tertiary : colors.background.secondary,
            borderColor: currentPage === totalPages ? colors.border.secondary : colors.accent.primary,
            color: currentPage === totalPages ? colors.text.muted : colors.accent.primary
          }}
          aria-label="Go to next page"
          title="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

/**
 * 4. Bulk Action Bar Component (MODIFIED)
 * - Updated to use theme colors.
 */
const BulkActionBar = ({ selectedCount, onClear, onActivate, onDeactivate, disabled = false }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg border transition-colors duration-300"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary
      }}
    >
      <span 
        className="text-sm transition-colors duration-300"
        style={{ color: colors.text.secondary }}
      >
        {selectedCount} user(s) selected
      </span>
      <div className="flex space-x-2">
        <button
          onClick={onClear}
          className="px-3 py-1 rounded text-sm transition-all duration-300"
          style={{ 
            backgroundColor: colors.background.tertiary,
            color: colors.text.secondary,
            borderColor: colors.border.primary
          }}
        >
          Clear Selection
        </button>
        <button
          onClick={onActivate}
          disabled={disabled}
          className="px-3 py-1 rounded text-sm transition-all duration-300 disabled:opacity-50"
          style={{ 
            backgroundColor: colors.accent.success,
            color: '#ffffff'
          }}
        >
          Activate
        </button>
        <button
          onClick={onDeactivate}
          disabled={disabled}
          className="px-3 py-1 rounded text-sm transition-all duration-300 disabled:opacity-50"
          style={{ 
            backgroundColor: colors.accent.warning,
            color: '#ffffff'
          }}
        >
          Deactivate
        </button>
      </div>
    </div>
  );
};


// --- Main Manager Dashboard Component ---

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();

  // State
  const [manager, setManager] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSubscriptionFilter, setUserSubscriptionFilter] = useState('all');
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [refreshData, setRefreshData] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const masterCheckboxRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const USERS_PER_PAGE = 10;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Fetch initial data for the manager and all users
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/manager-login');
          return;
        }

        const managerData = JSON.parse(localStorage.getItem('manager'));
        if (!managerData || !managerData.access) {
          navigate('/manager-login');
          return;
        }

        setManager(managerData);

        // Fetch users
        const usersResponse = await axios.get(API_ENDPOINTS.AUTH0_ALL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        if (err.response?.status === 401) {
          navigate('/manager-login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, refreshData]);

  const canEdit = manager?.access?.canChangeSubscription === true;

  // Filtering and Pagination
  const filteredUsers = users.filter(user => {
    const search = userSearchTerm.toLowerCase();
    const matchesSearch = (user.user_name?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search));
    const matchesFilter = userSubscriptionFilter === 'all' || user.subscription_status === userSubscriptionFilter;
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice((userCurrentPage - 1) * USERS_PER_PAGE, userCurrentPage * USERS_PER_PAGE);
  const userTotalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // Selection Logic
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
    if (e.target.checked) currentUserPageIds.forEach(id => newSelectedIds.add(id));
    else currentUserPageIds.forEach(id => newSelectedIds.delete(id));
    setSelectedUserIds(newSelectedIds);
  };

  const handleSelectUser = (userId) => {
    const newSelectedIds = new Set(selectedUserIds);
    if (newSelectedIds.has(userId)) newSelectedIds.delete(userId);
    else newSelectedIds.add(userId);
    setSelectedUserIds(newSelectedIds);
  };

  const handleSelectAllFiltered = () => {
    setSelectedUserIds(new Set(filteredUsers.map(u => u._id)));
  };

  // Action Handlers (all respect the 'canEdit' permission)
  const updateUserStatus = async (userId, newStatus) => {
    if (!canEdit) {
      alert("You do not have permission to perform this action.");
      return false;
    }
    try {
      const token = localStorage.getItem('token');
              await axios.put(API_ENDPOINTS.AUTH0_SUBSCRIPTION(userId),
        { subscription_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch (err) {
      alert('Failed to update user status.');
      return false;
    }
  };

  const handleApprovalAction = async (userId, newStatus) => {
    if (await updateUserStatus(userId, newStatus)) {
      setRefreshData(p => !p);
    }
  };

  const handleSubscriptionToggle = async (userId, currentStatus) => {
    let newStatus;
    
    // Determine the new status based on current status
    switch (currentStatus) {
      case 'yes':
        newStatus = 'no'; // Deactivate active user
        break;
      case 'applied':
        newStatus = 'accepted'; // Approve applied user
        break;
      case 'accepted':
        newStatus = 'yes'; // Activate accepted user
        break;
      case 'rejected':
        newStatus = 'accepted'; // Approve rejected user
        break;
      case 'no':
      default:
        newStatus = 'yes'; // Activate inactive user
        break;
    }
    
    if (await updateUserStatus(userId, newStatus)) {
      setRefreshData(p => !p);
    }
  };
  
  const handleBulkSubscriptionChange = async (newStatus) => {
    if (!canEdit) {
      alert("You do not have permission to perform this action.");
      return;
    }
    
    // Map the action to appropriate status
    let targetStatus;
    if (newStatus === 'yes') {
      targetStatus = 'yes'; // Activate users
    } else {
      targetStatus = 'no'; // Deactivate users
    }
    
    const updatePromises = Array.from(selectedUserIds).map(userId => updateUserStatus(userId, targetStatus));
    await Promise.all(updatePromises);
    setRefreshData(p => !p);
    setSelectedUserIds(new Set());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/manager-login');
  };

  // Render Logic
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div 
          className="text-center transition-colors duration-300"
          style={{ color: colors.text.primary }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: colors.accent.primary }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div 
          className="text-center p-6 rounded-lg border transition-colors duration-300"
          style={{ 
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.accent.error
          }}
        >
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 rounded transition-all duration-300"
            style={{ 
              backgroundColor: colors.accent.primary,
              color: '#ffffff'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!manager) return <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">Manager data not found.</div>;

  if (!manager.access) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 dark:text-purple-300">Access Denied</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-300">Welcome, <span className="font-semibold">{manager.user_name || manager.email}</span>.</p>
          <p className="mb-6 text-red-600 dark:text-red-400 font-semibold">Your account has not been granted access by a Super Admin.</p>
          <button onClick={handleLogout} className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      <DashboardHeader managerName={manager.user_name || manager.email} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Users" value={users.length} icon={<UserIcon />} />
          <SummaryCard title="Active Users" value={users.filter(u => u.subscription_status === 'yes').length} icon={<CheckIcon />} />
          <SummaryCard title="Pending Approvals" value={users.filter(u => u.subscription_status === 'applied').length} icon={<ClockIcon />} />
          <SummaryCard title="Inactive Users" value={users.filter(u => u.subscription_status === 'no').length} icon={<UserIcon />} />
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex justify-end items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: colors.background.secondary,
                color: colors.text.primary
              }}
              aria-label="Search users by name or email"
              title="Search users"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 relative ${
                userSubscriptionFilter !== 'all' ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900' : ''
              }`}
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: userSubscriptionFilter !== 'all' ? colors.accent.primary + '20' : colors.background.secondary,
                color: colors.text.primary
              }}
              aria-label="Filter users by subscription status"
              title={`Filter by status: ${userSubscriptionFilter === 'all' ? 'All Status' : 
                userSubscriptionFilter === 'yes' ? 'Active' :
                userSubscriptionFilter === 'no' ? 'Inactive' :
                userSubscriptionFilter === 'applied' ? 'Applied' :
                userSubscriptionFilter === 'accepted' ? 'Accepted' :
                userSubscriptionFilter === 'rejected' ? 'Rejected' : 'All Status'}`}
            >
              <FilterIcon />
              {userSubscriptionFilter !== 'all' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
              )}
            </button>
            {showFilterDropdown && (
              <div 
                ref={filterDropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-10"
              >
                <div className="py-1">
                  <button
                    onClick={() => { setUserSubscriptionFilter('all'); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      userSubscriptionFilter === 'all' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => { setUserSubscriptionFilter('yes'); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      userSubscriptionFilter === 'yes' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => { setUserSubscriptionFilter('no'); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      userSubscriptionFilter === 'no' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    Inactive
                  </button>
                  <button
                    onClick={() => { setUserSubscriptionFilter('applied'); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      userSubscriptionFilter === 'applied' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    Applied
                  </button>
                  <button
                    onClick={() => { setUserSubscriptionFilter('accepted'); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      userSubscriptionFilter === 'accepted' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    Accepted
                  </button>
                  <button
                    onClick={() => { setUserSubscriptionFilter('rejected'); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      userSubscriptionFilter === 'rejected' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUserIds.size > 0 && (
          <BulkActionBar
            selectedCount={selectedUserIds.size}
            onClear={() => setSelectedUserIds(new Set())}
            onActivate={() => handleBulkSubscriptionChange('yes')}
            onDeactivate={() => handleBulkSubscriptionChange('no')}
            disabled={loading}
          />
        )}

        {/* Users Table */}
        <div 
          className="rounded-lg border overflow-hidden transition-colors duration-300"
          style={{ 
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y" style={{ borderColor: colors.border.primary }}>
              <thead 
                className="transition-colors duration-300"
                style={{ backgroundColor: colors.background.tertiary }}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <input
                      type="checkbox"
                      ref={masterCheckboxRef}
                      onChange={handleSelectPage}
                      className="rounded border transition-colors duration-300"
                      style={{ 
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.secondary
                      }}
                    />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                    style={{ color: colors.text.secondary }}
                  >
                    User
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                    style={{ color: colors.text.secondary }}
                  >
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                    style={{ color: colors.text.secondary }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: colors.border.primary }}>
                {paginatedUsers.map((user) => (
                  <tr 
                    key={user._id}
                    className="transition-colors duration-300 hover:bg-opacity-50"
                    style={{ backgroundColor: colors.background.secondary }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.has(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="rounded border transition-colors duration-300"
                        style={{ 
                          borderColor: colors.border.primary,
                          backgroundColor: colors.background.secondary
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.picture ? (
                            <img 
                              src={user.picture} 
                              alt="avatar" 
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div 
                              className="h-10 w-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.accent.primary + '20' }}
                            >
                              <UserIcon />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div 
                            className="text-sm font-medium transition-colors duration-300"
                            style={{ color: colors.text.primary }}
                          >
                            {user.user_name}
                          </div>
                          <div 
                            className="text-sm transition-colors duration-300"
                            style={{ color: colors.text.secondary }}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`w-[80px] px-2 inline-flex text-xs leading-5 font-semibold rounded-full justify-center ${
                        user.subscription_status === 'yes' ? 'bg-green-100 text-green-800' :
                        user.subscription_status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                        user.subscription_status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        user.subscription_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscription_status === 'yes' ? 'Active' :
                         user.subscription_status === 'applied' ? 'Applied' :
                         user.subscription_status === 'accepted' ? 'Accepted' :
                         user.subscription_status === 'rejected' ? 'Rejected' :
                         'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleSubscriptionToggle(user._id, user.subscription_status)} 
                        disabled={!canEdit}
                        className="focus:ring-2 focus:ring-purple-500"
                        style={getThemeButtonStyles(colors, 
                          user.subscription_status === 'yes' ? 'error' : 
                          user.subscription_status === 'applied' ? 'warning' :
                          user.subscription_status === 'accepted' ? 'success' :
                          user.subscription_status === 'rejected' ? 'error' : 'success'
                        )}
                        onMouseEnter={(e) => e.target.style.backgroundColor = getHoverStyles(colors, 
                          user.subscription_status === 'yes' ? 'error' : 
                          user.subscription_status === 'applied' ? 'warning' :
                          user.subscription_status === 'accepted' ? 'success' :
                          user.subscription_status === 'rejected' ? 'error' : 'success'
                        ).backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = getThemeButtonStyles(colors, 
                          user.subscription_status === 'yes' ? 'error' : 
                          user.subscription_status === 'applied' ? 'warning' :
                          user.subscription_status === 'accepted' ? 'success' :
                          user.subscription_status === 'rejected' ? 'error' : 'success'
                        ).backgroundColor}
                        aria-label={`${user.subscription_status === 'yes' ? 'Deactivate' : 
                          user.subscription_status === 'applied' ? 'Approve' :
                          user.subscription_status === 'accepted' ? 'Activate' :
                          user.subscription_status === 'rejected' ? 'Approve' : 'Activate'} subscription for ${user.user_name}`}
                        title={`${user.subscription_status === 'yes' ? 'Deactivate' : 
                          user.subscription_status === 'applied' ? 'Approve' :
                          user.subscription_status === 'accepted' ? 'Activate' :
                          user.subscription_status === 'rejected' ? 'Approve' : 'Activate'} subscription for ${user.user_name}`}
                        role="button"
                      >
                        {user.subscription_status === 'yes' ? 'Deactivate' : 
                         user.subscription_status === 'applied' ? 'Approve' :
                         user.subscription_status === 'accepted' ? 'Activate' :
                         user.subscription_status === 'rejected' ? 'Approve' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {userTotalPages > 1 && (
          <Pagination
            currentPage={userCurrentPage}
            totalPages={userTotalPages}
            onPageChange={setUserCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

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

// --- Icon Components (Updated to use theme colors) ---

const UserIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: colors.accent.primary }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
};

const CheckIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: colors.accent.success }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
};

const ClockIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: colors.accent.warning }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
};

const SearchIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5 text-gray-500 dark:text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
};

const FilterIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5 text-gray-500 dark:text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
};

const ChevronLeftIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: 'currentColor' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
};

const ChevronRightIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: 'currentColor' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
};

const LogoutIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: colors.accent.error }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
};

export default ManagerDashboard;