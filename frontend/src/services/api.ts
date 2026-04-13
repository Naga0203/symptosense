import axios from 'axios';
import { getSessionUserId } from '../utils/session';
import { logger } from '../utils/logger';
import { auth } from './firebase';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor — log outgoing calls & add auth token ───
api.interceptors.request.use(
  async (config) => {
    // Inject Firebase ID Token if user is logged in
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = (config.method || 'GET').toUpperCase();
    const url = `${config.baseURL || ''}${config.url || ''}`;
    logger.api(method, url);
    return config;
  },
  (error) => {
    logger.error('Request setup failed', error, 'API');
    return Promise.reject(error);
  }
);

// ─── Response interceptor — log results & errors ─────
api.interceptors.response.use(
  (response) => {
    const method = (response.config.method || 'GET').toUpperCase();
    const url = `${response.config.baseURL || ''}${response.config.url || ''}`;
    logger.api(method, url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const method = (error.config?.method || 'GET').toUpperCase();
    const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
    logger.api(method, url, status, { message: error.message });
    return Promise.reject(error);
  }
);

export const authService = {
  getProfile: () => api.get('/auth/profile/', { params: { user_id: getSessionUserId() } }),
  updateProfile: (data: any) => api.post('/auth/profile/', { ...data, user_id: getSessionUserId() }),
  register: (data: any) => api.post('/auth/register/', data),
  sync: () => api.post('/auth/sync/'),
};

export const assessmentService = {
  extractSymptoms: (formData: FormData) => api.post('/assessment/extract/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  diagnose: (symptoms: string) => 
    api.post('/assessment/diagnose/', { symptoms, user_id: getSessionUserId() }),
  getHistory: () => 
    api.get('/assessment/history/', { params: { user_id: getSessionUserId() } }),
  getDiseases: () => api.get('/assessment/diseases/'),
  insight: (formData: FormData) => api.post('/assessment/insight/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const healthCheck = () => api.get('/health/');

export const predictionService = {
  getModels: () => api.get('/predictions/'),
  trainRegression: (data: { model_name: string; X: number[][]; y: number[] }) =>
    api.post('/predictions/', { action: 'train_regression', ...data }),
  trainClassification: (data: { model_name: string; X: number[][]; y: number[] }) =>
    api.post('/predictions/', { action: 'train_classification', ...data }),
  predict: (model_name: string, X: number[][]) =>
    api.post('/predictions/', { action: 'predict', model_name, X }),
  predictProba: (model_name: string, X: number[][]) =>
    api.post('/predictions/', { action: 'predict_proba', model_name, X }),
};

export const aiService = {
  getAgents: () => api.get('/ai/agents/'),
  createAgent: (data: { name: string; role: string; goal: string; backstory?: string }) =>
    api.post('/ai/agents/', { action: 'create', ...data }),
  executeAgent: (agent_name: string, task: string, context?: object) =>
    api.post('/ai/agents/', { action: 'execute', agent_name, task, context }),
  getWorkflows: () => api.get('/ai/workflows/'),
  createWorkflow: (name: string, agents: string[]) =>
    api.post('/ai/workflows/', { action: 'create', name, agents }),
  executeWorkflow: (name: string, task: string, context?: object) =>
    api.post('/ai/workflows/', { action: 'execute', name, task, context }),
};

export const firebaseService = {
  getCollection: (collection: string) => api.get(`/firebase/${collection}/`),
  getDocument: (collection: string, id: string) =>
    api.get(`/firebase/${collection}/`, { data: { id } }),
  createDocument: (collection: string, data: object) =>
    api.post(`/firebase/${collection}/`, data),
  updateDocument: (collection: string, id: string, data: object) =>
    api.put(`/firebase/${collection}/`, { id, ...data }),
  deleteDocument: (collection: string, id: string) =>
    api.delete(`/firebase/${collection}/`, { data: { id } }),
};

export default api;
