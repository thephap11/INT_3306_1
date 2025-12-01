// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API client with token handling
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Get refresh token from localStorage
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  // Save tokens to localStorage
  saveTokens(token, refreshToken) {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Remove tokens from localStorage
  clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { message: 'Invalid response from server' };
      }

      // Handle 401 - ONLY refresh token if we have a token and it's not a login/register endpoint
      if (response.status === 401 && 
          !endpoint.includes('/refresh') && 
          !endpoint.includes('/login') && 
          !endpoint.includes('/register') &&
          token) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry original request with new token
          return this.request(endpoint, options);
        } else {
          // Refresh failed, clear all auth data and redirect to login
          this.clearTokens();
          localStorage.removeItem('user');
          window.location.href = '/user/login';
          throw new Error('Session expired');
        }
      }

      // If response is not ok, throw error with message from server
      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.response = data;
        error.status = response.status;
        throw error;
      }

      return data;
    } catch (error) {
      // If it's already our error, rethrow it
      if (error.response || error.status) {
        throw error;
      }
      // Otherwise wrap it
      console.error('API Error:', error);
      throw new Error(error.message || 'Network error');
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.success) {
        this.saveTokens(data.data.token, data.data.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.success) {
      apiClient.saveTokens(response.data.token, response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    // Clear any existing tokens first to avoid auto-refresh on login failure
    const oldToken = apiClient.getToken();
    if (oldToken) {
      apiClient.clearTokens();
    }
    
    const response = await apiClient.post('/auth/login', credentials);
    if (response.success) {
      apiClient.saveTokens(response.data.token, response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      // Always clear all auth data
      apiClient.clearTokens();
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getMe: async () => {
    return apiClient.get('/auth/me');
  },

  // Check if user is authenticated (checks both token and user exist)
  isAuthenticated: () => {
    const token = apiClient.getToken();
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Password Reset API
export const passwordResetAPI = {
  // Request OTP for password reset
  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Verify OTP code
  verifyOTP: async (email, otp) => {
    return apiClient.post('/auth/verify-otp', { email, otp });
  },

  // Reset password with OTP
  resetPassword: async (email, otp, newPassword) => {
    return apiClient.post('/auth/reset-password', { email, otp, newPassword });
  },

  // Resend OTP
  resendOTP: async (email) => {
    return apiClient.post('/auth/resend-otp', { email });
  },
};

export default apiClient;