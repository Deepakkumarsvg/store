import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const networkMessage = 'Network error: backend API is unreachable. Start backend server and verify API URL.';
    const message = error.response?.data?.message
      || (error.code === 'ERR_NETWORK' ? networkMessage : '')
      || error.message
      || 'An error occurred';
    
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getStats: (config = {}) => api.get('/dashboard/stats', config),
};

// Products API
export const productsAPI = {
  getAll: (config = {}) => api.get('/products', config),
  getById: (id, config = {}) => api.get(`/products/${id}`, config),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: (config = {}) => api.get('/suppliers', config),
  getById: (id, config = {}) => api.get(`/suppliers/${id}`, config),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: (config = {}) => api.get('/customers', config),
  getById: (id, config = {}) => api.get(`/customers/${id}`, config),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Units API
export const unitsAPI = {
  getAll: (config = {}) => api.get('/units', config),
  getById: (id, config = {}) => api.get(`/units/${id}`, config),
  create: (data) => api.post('/units', data),
  update: (id, data) => api.put(`/units/${id}`, data),
  delete: (id) => api.delete(`/units/${id}`),
};

// Purchases API
export const purchasesAPI = {
  getAll: (config = {}) => api.get('/purchases', config),
  getById: (id, config = {}) => api.get(`/purchases/${id}`, config),
  create: (data) => api.post('/purchases', data),
  update: (id, data) => api.put(`/purchases/${id}`, data),
  delete: (id) => api.delete(`/purchases/${id}`),
};

// Raw Materials API
export const rawMaterialsAPI = {
  getAll: (config = {}) => api.get('/raw-materials', config),
  getById: (id, config = {}) => api.get(`/raw-materials/${id}`, config),
  create: (data) => api.post('/raw-materials', data),
  update: (id, data) => api.put(`/raw-materials/${id}`, data),
  delete: (id) => api.delete(`/raw-materials/${id}`),
};

// Production API
export const productionAPI = {
  getAll: (config = {}) => api.get('/production', config),
  getById: (id, config = {}) => api.get(`/production/${id}`, config),
  create: (data) => api.post('/production', data),
  update: (id, data) => api.put(`/production/${id}`, data),
  delete: (id) => api.delete(`/production/${id}`),
};

// Finished Goods API
export const finishedGoodsAPI = {
  getAll: (config = {}) => api.get('/finished-goods', config),
  getById: (id, config = {}) => api.get(`/finished-goods/${id}`, config),
  create: (data) => api.post('/finished-goods', data),
  update: (id, data) => api.put(`/finished-goods/${id}`, data),
  delete: (id) => api.delete(`/finished-goods/${id}`),
};

// Sales API
export const salesAPI = {
  getAll: (config = {}) => api.get('/sales', config),
  getById: (id, config = {}) => api.get(`/sales/${id}`, config),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  delete: (id) => api.delete(`/sales/${id}`),
};

// Public Enquiries API
export const enquiriesAPI = {
  create: (data) => api.post('/enquiries', data),
  getAll: (params = {}, config = {}) => api.get('/enquiries', { ...config, params }),
  updateStatus: (id, status) => api.put(`/enquiries/${id}/status`, { status }),
};

// Reports API
export const reportsAPI = {
  getAll: (config = {}) => api.get('/reports', config),
};

export const createRequestController = () => new AbortController();

export default api;
