import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useThemeColors } from '../../Theme/useThemeColors';
import ThemeToggle from '../../Theme/ThemeToggle';
import { API_ENDPOINTS } from '../../../config/api';

// --- Reusable Components ---

/**
 * 1. Dashboard Header Component
 */
const DashboardHeader = ({ onLogout }) => {
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
            <Link 
              to="/" 
              className="transition-colors duration-300"
              style={{ color: colors.text.secondary }}
              aria-label="Back to Home"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div 
              className="w-px h-6 transition-colors duration-300"
              style={{ backgroundColor: colors.border.primary }}
            ></div>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold transition-colors duration-300"
                style={{ backgroundColor: colors.accent.primary }}
              >
                LC
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
                Super Admin
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="p-3 border rounded-full bg-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ 
                borderColor: colors.border.primary,
                color: colors.text.primary
              }}
              aria-label="Logout"
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
const SummaryCard = ({ title, value, icon }) => {
  const colors = useThemeColors();
  
  return (
    <div 
      className="border rounded-lg shadow-lg p-5 transition-colors duration-300"
      style={{ 
        borderColor: colors.border.primary,
        backgroundColor: colors.background.secondary
      }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div 
            className="w-10 h-10 border rounded-lg flex items-center justify-center transition-colors duration-300"
            style={{ 
              backgroundColor: colors.accent.primary + '20',
              borderColor: colors.border.primary
            }}
          >
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <p 
            className="text-sm font-medium transition-colors duration-300"
            style={{ color: colors.text.secondary }}
          >
            {title}
          </p>
          <p 
            className="text-2xl font-semibold transition-colors duration-300"
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
 * 3. Add Manager Modal Component
 */
const AddManagerModal = ({ isOpen, onClose, onManagerAdded }) => {
  const colors = useThemeColors();
  const [newManager, setNewManager] = useState({ user_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(API_ENDPOINTS.EMPLOYEE_REGISTER, {
        ...newManager,
        role: 'manager',
        access: { canChangeSubscription: false },
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-colors duration-300"
      onClick={onClose}
    >
      <div 
        className="p-6 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 
          className="text-lg font-semibold mb-4 transition-colors duration-300"
          style={{ color: colors.text.primary }}
        >
          Add New Manager
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              className="block text-sm font-medium mb-1 transition-colors duration-300"
              style={{ color: colors.text.secondary }}
            >
              Name
            </label>
            <input
              type="text"
              value={newManager.user_name}
              onChange={(e) => setNewManager({ ...newManager, user_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg transition-all duration-300"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label 
              className="block text-sm font-medium mb-1 transition-colors duration-300"
              style={{ color: colors.text.secondary }}
            >
              Email
            </label>
            <input
              type="email"
              value={newManager.email}
              onChange={(e) => setNewManager({ ...newManager, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg transition-all duration-300"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary
              }}
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
              value={newManager.password}
              onChange={(e) => setNewManager({ ...newManager, password: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg transition-all duration-300"
              style={{ 
                borderColor: colors.border.primary,
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary
              }}
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
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg transition-all duration-300"
              style={{ 
                backgroundColor: colors.background.tertiary,
                color: colors.text.secondary,
                borderColor: colors.border.primary
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
              style={{ 
                backgroundColor: colors.accent.primary,
                color: '#ffffff'
              }}
            >
              {loading ? 'Adding...' : 'Add Manager'}
            </button>
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
  const colors = useThemeColors();
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-between items-center mt-4 p-4">
      {/* Previous Button - Left Side */}
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
        style={{ 
          borderColor: currentPage === 1 ? colors.border.secondary : colors.border.primary,
          color: currentPage === 1 ? colors.text.muted : colors.text.primary
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Page Info - Middle */}
      <span 
        className="text-sm font-medium transition-colors duration-300"
        style={{ color: colors.text.secondary }}
      >
        Page {currentPage} of {totalPages}
      </span>
      
      {/* Next Button - Right Side */}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
        style={{ 
          borderColor: currentPage === totalPages ? colors.border.secondary : colors.border.primary,
          color: currentPage === totalPages ? colors.text.muted : colors.text.primary
        }}
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
    <div 
      className="p-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.accent.primary + '10'
      }}
    >
      <div className="flex items-center space-x-3">
        <span 
          className="text-sm font-semibold transition-colors duration-300"
          style={{ color: colors.accent.primary }}
        >
          {selectedCount} selected
        </span>
        <button 
          onClick={onClear} 
          className="text-sm transition-colors duration-300"
          style={{ color: colors.accent.primary }}
        >
          Clear selection
        </button>
      </div>
      <div className="flex items-center space-x-3">
        <span 
          className="text-sm font-medium transition-colors duration-300"
          style={{ color: colors.text.secondary }}
        >
          Bulk actions:
        </span>
        <button 
          onClick={onActivate} 
          className="px-3 py-1 text-sm rounded-md transition-colors duration-300"
          style={{ 
            backgroundColor: colors.accent.success,
            color: '#ffffff'
          }}
        >
          Activate
        </button>
        <button 
          onClick={onDeactivate} 
          className="px-3 py-1 text-sm rounded-md transition-colors duration-300"
          style={{ 
            backgroundColor: colors.accent.error,
            color: '#ffffff'
          }}
        >
          Deactivate
        </button>
      </div>
    </div>
  );
};

/**
 * 6. Filter Dropdown Component
 */
const FilterDropdown = ({ isOpen, onClose, currentFilter, onFilterChange, filterOptions, title, position = 'right' }) => {
  const colors = useThemeColors();
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        className={`absolute z-50 mt-2 w-56 rounded-lg shadow-lg border transform transition-all duration-200 ${
          position === 'right' ? 'right-0' : 'left-0'
        }`}
        style={{ 
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 border-b"
          style={{ borderColor: colors.border.primary }}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent.primary }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span 
              className="text-sm font-medium"
              style={{ color: colors.text.primary }}
            >
              {title}
            </span>
          </div>
        </div>
        
        {/* Options */}
        <div className="py-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onFilterChange(option.value);
                onClose();
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-opacity-50 flex items-center justify-between ${
                currentFilter === option.value ? 'font-medium' : ''
              }`}
              style={{ 
                color: currentFilter === option.value ? colors.accent.primary : colors.text.primary,
                backgroundColor: currentFilter === option.value ? colors.accent.primary + '10' : 'transparent'
              }}
            >
              <span>{option.label}</span>
              {currentFilter === option.value && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.accent.primary }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

/**
 * 7. Selection Toolbar Component
 */
const SelectionToolbar = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onClearSelection, 
  onBulkAction,
  showSelectAllMessage = false,
  onSelectAllFiltered
}) => {
  const colors = useThemeColors();
  
  if (selectedCount === 0) return null;
  
  return (
    <div 
      className="border-b transition-colors duration-300"
      style={{ 
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary
      }}
    >
      {/* Action Toolbar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Selection control */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onClearSelection}
            className="p-2 rounded-lg hover:bg-opacity-50 transition-colors duration-200"
            style={{ 
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary
            }}
            title="Clear selection"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <span 
            className="text-sm font-medium"
            style={{ color: colors.text.primary }}
          >
            {selectedCount} selected
          </span>
        </div>

        {/* Middle - Action icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onBulkAction('activate')}
            className="p-2 rounded-lg hover:bg-opacity-50 transition-colors duration-200"
            style={{ 
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary
            }}
            title="Activate selected"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          
          <button
            onClick={() => onBulkAction('deactivate')}
            className="p-2 rounded-lg hover:bg-opacity-50 transition-colors duration-200"
            style={{ 
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary
            }}
            title="Deactivate selected"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </button>
          
          <button
            onClick={() => onBulkAction('delete')}
            className="p-2 rounded-lg hover:bg-opacity-50 transition-colors duration-200"
            style={{ 
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary
            }}
            title="Delete selected"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          <div className="w-px h-6 mx-2" style={{ backgroundColor: colors.border.primary }}></div>
          
          <button
            onClick={() => onBulkAction('more')}
            className="p-2 rounded-lg hover:bg-opacity-50 transition-colors duration-200"
            style={{ 
              backgroundColor: colors.background.tertiary,
              color: colors.text.secondary
            }}
            title="More actions"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selection status message */}
      {showSelectAllMessage && (
        <div 
          className="px-4 py-2 text-center text-sm border-t"
          style={{ 
            backgroundColor: colors.accent.primary + '10',
            borderColor: colors.border.primary
          }}
        >
          <span style={{ color: colors.text.secondary }}>
            All {selectedCount} items on this page are selected.{' '}
          </span>
          <button
            onClick={onSelectAllFiltered}
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: colors.accent.primary }}
          >
            Select all {totalCount} items
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * 6. Main Dashboard Content Component
 */
const DashboardContent = () => {
  const colors = useThemeColors();
  const navigate = useNavigate();
  
  // State
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [showAddManager, setShowAddManager] = useState(false);
  
  // State for Users Tab
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSubscriptionFilter, setUserSubscriptionFilter] = useState('all');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [showUserFilterModal, setShowUserFilterModal] = useState(false);
  const USERS_PER_PAGE = 10;

  // State for Managers Tab
  const [managerSearchTerm, setManagerSearchTerm] = useState('');
  const [managerCurrentPage, setManagerCurrentPage] = useState(1);
  const [showManagerFilter, setShowManagerFilter] = useState(false);
  const [showManagerFilterModal, setShowManagerFilterModal] = useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState(new Set());
  const MANAGERS_PER_PAGE = 10;

  const masterCheckboxRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/super-admin-login');
          return;
        }

        const [usersRes, managersRes] = await Promise.all([
                  axios.get(API_ENDPOINTS.AUTH0_ALL, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(API_ENDPOINTS.EMPLOYEE_ALL, {
          headers: { Authorization: `Bearer ${token}` }
        })
        ]);

        setUsers(usersRes.data);
        setManagers(managersRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        if (err.response?.status === 401) {
          navigate('/super-admin-login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter and paginate users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.user_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesFilter = userSubscriptionFilter === 'all' || 
                         user.subscription_status === userSubscriptionFilter;
    return matchesSearch && matchesFilter;
  });

  const paginatedUsers = filteredUsers.slice((userCurrentPage - 1) * USERS_PER_PAGE, userCurrentPage * USERS_PER_PAGE);
  const userTotalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // Filter and paginate managers
  const filteredManagers = managers.filter(manager => {
    return manager.user_name?.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
           manager.email?.toLowerCase().includes(managerSearchTerm.toLowerCase());
  });

  const paginatedManagers = filteredManagers.slice((managerCurrentPage - 1) * MANAGERS_PER_PAGE, managerCurrentPage * MANAGERS_PER_PAGE);
  const managerTotalPages = Math.ceil(filteredManagers.length / MANAGERS_PER_PAGE);

  // Selection logic
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

  const handleSubscriptionToggle = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = currentStatus === 'yes' ? 'no' : 'yes';
              await axios.put(API_ENDPOINTS.AUTH0_SUBSCRIPTION(userId), 
        { subscription_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh data
      window.location.reload();
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  const handleBulkSubscriptionChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const updatePromises = Array.from(selectedUserIds).map(userId =>
        axios.put(API_ENDPOINTS.AUTH0_SUBSCRIPTION(userId),
          { subscription_status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(updatePromises);
      setSelectedUserIds(new Set());
      window.location.reload();
    } catch (err) {
      console.error('Error updating bulk subscriptions:', err);
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
              await axios.put(API_ENDPOINTS.EMPLOYEE_ACCESS(managerId),
        { access: { canChangeSubscription: !currentAccess } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (err) {
      console.error('Error updating manager access:', err);
    }
  };

  // Manager selection functions
  const handleSelectManager = (managerId) => {
    const newSelectedIds = new Set(selectedManagerIds);
    if (newSelectedIds.has(managerId)) {
      newSelectedIds.delete(managerId);
    } else {
      newSelectedIds.add(managerId);
    }
    setSelectedManagerIds(newSelectedIds);
  };

  const handleSelectManagerPage = (e) => {
    const currentManagerPageIds = paginatedManagers.map(m => m._id);
    const newSelectedIds = new Set(selectedManagerIds);
    if (e.target.checked) {
      currentManagerPageIds.forEach(id => newSelectedIds.add(id));
    } else {
      currentManagerPageIds.forEach(id => newSelectedIds.delete(id));
    }
    setSelectedManagerIds(newSelectedIds);
  };

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

  const summaryStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.subscription_status === 'yes').length,
    pendingUsers: users.filter(u => u.subscription_status === 'pending').length,
    totalManagers: managers.length
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      <DashboardHeader onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Users" value={summaryStats.totalUsers} icon={<UserIcon />} />
          <SummaryCard title="Active Users" value={summaryStats.activeUsers} icon={<CheckIcon />} />
          <SummaryCard title="Pending Users" value={summaryStats.pendingUsers} icon={<ClockIcon />} />
          <SummaryCard title="Total Managers" value={summaryStats.totalManagers} icon={<ManagerIcon />} />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b transition-colors duration-300" style={{ borderColor: colors.border.primary }}>
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  activeTab === 'users' ? '' : ''
                }`}
                style={{
                  borderColor: activeTab === 'users' ? colors.accent.primary : 'transparent',
                  color: activeTab === 'users' ? colors.accent.primary : colors.text.secondary
                }}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('managers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                  activeTab === 'managers' ? '' : ''
                }`}
                style={{
                  borderColor: activeTab === 'managers' ? colors.accent.primary : 'transparent',
                  color: activeTab === 'managers' ? colors.accent.primary : colors.text.secondary
                }}
              >
                Managers
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'users' && (
            <div>
              {/* Search and Filter Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Left side - empty for now */}
                <div></div>

                {/* Search Bar and Filter - Right Side */}
                <div className="flex items-center space-x-2 flex-1 sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border transition-all duration-300"
                    style={{ 
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary
                    }}
                  />
                  
                  {/* Filter Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserFilterModal(true)}
                      className="p-2 rounded-lg border transition-all duration-300 hover:bg-opacity-50"
                      style={{ 
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.secondary,
                        color: colors.text.primary
                      }}
                      title="Filter options"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                    </button>
                    
                    {/* Filter Dropdown */}
                    <FilterDropdown
                      isOpen={showUserFilterModal}
                      onClose={() => setShowUserFilterModal(false)}
                      currentFilter={userSubscriptionFilter}
                      onFilterChange={setUserSubscriptionFilter}
                      filterOptions={[
                        { value: 'all', label: 'All Status' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'pending', label: 'Pending' }
                      ]}
                      title="Filter Users"
                      position="right"
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUserIds.size > 0 && (
                <BulkActionBar
                  selectedCount={selectedUserIds.size}
                  onClear={() => setSelectedUserIds(new Set())}
                  onActivate={() => handleBulkSubscriptionChange('yes')}
                  onDeactivate={() => handleBulkSubscriptionChange('no')}
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
                {/* Selection Toolbar */}
                <SelectionToolbar
                  selectedCount={selectedUserIds.size}
                  totalCount={filteredUsers.length}
                  onClearSelection={() => setSelectedUserIds(new Set())}
                  onBulkAction={(action) => {
                    switch (action) {
                      case 'activate':
                        handleBulkSubscriptionChange('yes');
                        break;
                      case 'deactivate':
                        handleBulkSubscriptionChange('no');
                        break;
                      case 'delete':
                        // Handle delete action
                        console.log('Delete selected users');
                        break;
                      case 'more':
                        // Handle more actions
                        console.log('More actions');
                        break;
                    }
                  }}
                  showSelectAllMessage={selectedUserIds.size > 0 && selectedUserIds.size === paginatedUsers.length && paginatedUsers.length > 0}
                  onSelectAllFiltered={() => {
                    const allFilteredIds = filteredUsers.map(u => u._id);
                    setSelectedUserIds(new Set(allFilteredIds));
                  }}
                />

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y" style={{ borderColor: colors.border.primary }}>
                    <thead 
                      className="transition-colors duration-300"
                      style={{ backgroundColor: colors.background.tertiary }}
                    >
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              ref={masterCheckboxRef}
                              onChange={handleSelectPage}
                              className="rounded border transition-colors duration-300 mr-3"
                              style={{ 
                                borderColor: colors.border.primary,
                                backgroundColor: colors.background.secondary
                              }}
                            />
                            <span style={{ color: colors.text.secondary }}>Select All</span>
                          </div>
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
                          className={`transition-colors duration-300 hover:bg-opacity-50 ${
                            selectedUserIds.has(user._id) ? 'bg-opacity-50' : ''
                          }`}
                          style={{ 
                            backgroundColor: selectedUserIds.has(user._id) 
                              ? colors.accent.primary + '20' 
                              : colors.background.secondary
                          }}
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
                                <div 
                                  className="h-10 w-10 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: colors.accent.primary + '20' }}
                                >
                                  <UserIcon />
                                </div>
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
                            <span
                              className={`px-4 py-1 rounded-full text-xs font-semibold
                                ${user.subscription_status === 'yes'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'}
                              `}
                            >
                              {user.subscription_status === 'yes' ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleSubscriptionToggle(user._id, user.subscription_status)}
                              className={`px-4 py-1 rounded-full text-xs font-semibold border-2 transition-colors duration-200
                                ${user.subscription_status === 'yes'
                                  ? 'border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white'
                                  : 'border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white'}
                              `}
                              style={{ minWidth: 100 }}
                            >
                              {user.subscription_status === 'yes' ? 'Deactivate' : 'Activate'}
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
          )}

          {activeTab === 'managers' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Add Manager Button - Left Side */}
                <div className="flex items-center">
                  <button 
                    onClick={() => setShowAddManager(true)} 
                    className="px-4 py-2 rounded-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: colors.accent.primary,
                      color: '#ffffff'
                    }}
                  >
                    Add Manager
                  </button>
                </div>

                {/* Search Bar and Filter - Right Side */}
                <div className="flex items-center space-x-2 flex-1 sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search managers..."
                    value={managerSearchTerm}
                    onChange={(e) => setManagerSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border transition-all duration-300"
                    style={{ 
                      borderColor: colors.border.primary,
                      backgroundColor: colors.background.secondary,
                      color: colors.text.primary
                    }}
                  />
                  
                  {/* Filter Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowManagerFilterModal(true)}
                      className="p-2 rounded-lg border transition-all duration-300 hover:bg-opacity-50"
                      style={{ 
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.secondary,
                        color: colors.text.primary
                      }}
                      title="Filter options"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                    </button>
                    
                    {/* Filter Dropdown */}
                    <FilterDropdown
                      isOpen={showManagerFilterModal}
                      onClose={() => setShowManagerFilterModal(false)}
                      currentFilter="all"
                      onFilterChange={(value) => console.log('Manager filter changed:', value)}
                      filterOptions={[
                        { value: 'all', label: 'All Managers' },
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' }
                      ]}
                      title="Filter Managers"
                      position="right"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Modal */}
              <FilterDropdown
                isOpen={showManagerFilterModal}
                onClose={() => setShowManagerFilterModal(false)}
                currentFilter="all"
                onFilterChange={(value) => console.log('Manager filter changed:', value)}
                filterOptions={[
                  { value: 'all', label: 'All Managers' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]}
                title="Filter Managers"
                position="right"
              />

              {/* Managers Table */}
              <div 
                className="rounded-lg border overflow-hidden transition-colors duration-300"
                style={{ 
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.primary
                }}
              >
                {/* Selection Toolbar */}
                <SelectionToolbar
                  selectedCount={selectedManagerIds.size}
                  totalCount={filteredManagers.length}
                  onClearSelection={() => setSelectedManagerIds(new Set())}
                  onBulkAction={(action) => {
                    switch (action) {
                      case 'activate':
                        handleBulkSubscriptionChange('yes');
                        break;
                      case 'deactivate':
                        handleBulkSubscriptionChange('no');
                        break;
                      case 'delete':
                        // Handle delete action
                        console.log('Delete selected managers');
                        break;
                      case 'more':
                        // Handle more actions
                        console.log('More actions');
                        break;
                    }
                  }}
                  showSelectAllMessage={selectedManagerIds.size > 0 && selectedManagerIds.size === paginatedManagers.length && paginatedManagers.length > 0}
                  onSelectAllFiltered={() => {
                    const allFilteredIds = filteredManagers.map(m => m._id);
                    setSelectedManagerIds(new Set(allFilteredIds));
                  }}
                />

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y" style={{ borderColor: colors.border.primary }}>
                    <thead 
                      className="transition-colors duration-300"
                      style={{ backgroundColor: colors.background.tertiary }}
                    >
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              ref={masterCheckboxRef}
                              onChange={handleSelectManagerPage}
                              className="rounded border transition-colors duration-300 mr-3"
                              style={{ 
                                borderColor: colors.border.primary,
                                backgroundColor: colors.background.secondary
                              }}
                            />
                            <span style={{ color: colors.text.secondary }}>Select All</span>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                          style={{ color: colors.text.secondary }}
                        >
                          Manager
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                          style={{ color: colors.text.secondary }}
                        >
                          Role
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                          style={{ color: colors.text.secondary }}
                        >
                          Subscription Access
                        </th>
                        <th 
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300"
                          style={{ color: colors.text.secondary }}
                        >
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: colors.border.primary }}>
                      {paginatedManagers.map((manager) => (
                        <tr 
                          key={manager._id}
                          className={`transition-colors duration-300 hover:bg-opacity-50 ${
                            selectedManagerIds.has(manager._id) ? 'bg-opacity-50' : ''
                          }`}
                          style={{ backgroundColor: selectedManagerIds.has(manager._id) ? colors.accent.primary + '20' : colors.background.secondary }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedManagerIds.has(manager._id)}
                              onChange={() => handleSelectManager(manager._id)}
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
                                <div 
                                  className="h-10 w-10 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: colors.accent.primary + '20' }}
                                >
                                  <ManagerIcon />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div 
                                  className="text-sm font-medium transition-colors duration-300"
                                  style={{ color: colors.text.primary }}
                                >
                                  {manager.user_name || 'N/A'}
                                </div>
                                <div 
                                  className="text-sm transition-colors duration-300"
                                  style={{ color: colors.text.secondary }}
                                >
                                  {manager.email || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="text-sm transition-colors duration-300 capitalize"
                              style={{ color: colors.text.secondary }}
                            >
                              {manager.role || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleManagerAccess(manager._id, manager.access?.canChangeSubscription)}
                              className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
                                manager.access?.canChangeSubscription ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {manager.access?.canChangeSubscription ? 'Allowed' : 'Not Allowed'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="text-sm transition-colors duration-300"
                              style={{ color: colors.text.secondary }}
                            >
                              {manager.createdAt ? new Date(manager.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {managerTotalPages > 1 && (
                <Pagination
                  currentPage={managerCurrentPage}
                  totalPages={managerTotalPages}
                  onPageChange={setManagerCurrentPage}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Manager Modal */}
      <AddManagerModal
        isOpen={showAddManager}
        onClose={() => setShowAddManager(false)}
        onManagerAdded={() => {
          setShowAddManager(false);
          window.location.reload();
        }}
      />
    </div>
  );
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

const ManagerIcon = () => {
  const colors = useThemeColors();
  return (
    <svg 
      className="w-5 h-5" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      style={{ color: colors.accent.primary }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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

// Export the Dashboard component
export default function Dashboard() {
  return <DashboardContent />;
}