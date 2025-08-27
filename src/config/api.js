// API Configuration
export const API_BASE_URL = 'https://backend.lamis.ai';

// API endpoints
export const API_ENDPOINTS = {
  // Super Admin endpoints
  SUPERADMIN_LOGIN: `${API_BASE_URL}/api/superadmin/login`,
  
  // Employee endpoints
  EMPLOYEE_LOGIN: `${API_BASE_URL}/api/employees/login`,
  EMPLOYEE_REGISTER: `${API_BASE_URL}/api/employees/register`,
  EMPLOYEE_ALL: `${API_BASE_URL}/api/employees/all`,
  EMPLOYEE_BY_ID: (id) => `${API_BASE_URL}/api/employees/${id}`,
  EMPLOYEE_ACCESS: (id) => `${API_BASE_URL}/api/employees/${id}/access`,
  
  // Auth0 endpoints
  AUTH0_ALL: `${API_BASE_URL}/api/auth0/all`,
  AUTH0_SUBSCRIPTION: (id) => `${API_BASE_URL}/api/auth0/${id}/subscription`,
  
  // General endpoints
  EMPLOYEES: `${API_BASE_URL}/api/employees`,
};
