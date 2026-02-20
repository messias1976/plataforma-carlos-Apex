// lib/api.js - Cliente HTTP para o backend

const rawApiBaseUrl = import.meta.env.VITE_API_URL || '';
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
const isBrowser = typeof window !== 'undefined';
const shouldUseSameOriginApi = isBrowser && /(^|\.)apexestudos\.com$/i.test(window.location.hostname);
export const API_BASE = shouldUseSameOriginApi ? '/api' : (normalizedApiBaseUrl || '/api');

// Helper para fazer requisições
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    const rawBody = await response.text();
    const hasBody = rawBody && rawBody.trim().length > 0;
    let data = null;

    if (hasBody) {
        try {
            data = JSON.parse(rawBody);
        } catch (parseError) {
            const bodyPreview = rawBody.substring(0, 200);
            throw new Error(`Resposta inválida do servidor (esperado JSON, HTTP ${response.status}): ${bodyPreview}`);
        }
    }

    if (!response.ok) {
        const message = data?.error || data?.message || `HTTP ${response.status}`;
        throw new Error(message);
    }

    return data ?? {};
}

// Subjects API
export const subjectsApi = {
    getAll: () => apiRequest('/subjects'),
    getById: (id) => apiRequest(`/subjects/${id}`),
    create: (data) => apiRequest('/subjects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/subjects/${id}`, { method: 'DELETE' }),
};

// Topics API
export const topicsApi = {
    getAll: (subjectId) => apiRequest(`/topics${subjectId ? `?subject_id=${subjectId}` : ''}`),
    getById: (id) => apiRequest(`/topics/${id}`),
    getCount: (subjectId) => apiRequest(`/topics/count/${subjectId}`),
    create: (data) => apiRequest('/topics', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/topics/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/topics/${id}`, { method: 'DELETE' }),
};

// Topic Content API
export const topicContentApi = {
    getAll: (topicId) => apiRequest(`/topic-content${topicId ? `?topic_id=${topicId}` : ''}`),
    getById: (id) => apiRequest(`/topic-content/${id}`),
    create: (data) => apiRequest('/topic-content', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/topic-content/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(`/topic-content/${id}`, { method: 'DELETE' }),
    bulkDelete: () => apiRequest('/topic-content/bulk/delete', { method: 'DELETE' }),
};

// Subscriptions API
export const subscriptionsApi = {
    getAll: () => apiRequest('/subscriptions'),
    getByUserId: (userId) => apiRequest(`/subscriptions/user/${userId}`),
    getStats: () => apiRequest('/subscriptions/stats/overview'),
    create: (data) => apiRequest('/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiRequest(`/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Auth API
export const authApi = {
    login: async (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
    register: async (email, password, full_name) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name }),
        });
    },
    registerBulk: async (users) => {
        return apiRequest('/auth/register/bulk', {
            method: 'POST',
            body: JSON.stringify({ users }),
        });
    },
};

// User Profile API
export const userApi = {
    getProfile: () => apiRequest('/user/profile'),
    updateProfile: (data) => apiRequest('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

export default {
    subjects: subjectsApi,
    topics: topicsApi,
    topicContent: topicContentApi,
    subscriptions: subscriptionsApi,
    auth: authApi,
    user: userApi,
};
