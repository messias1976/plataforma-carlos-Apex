// src/contexts/MockAuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = '/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (rawUser) => {
    if (!rawUser || typeof rawUser !== 'object') return null;

    const normalized = { ...rawUser };

    if (!normalized.id && normalized.user_id) {
      normalized.id = normalized.user_id;
    }

    if (!normalized.user_id && normalized.id) {
      normalized.user_id = normalized.id;
    }

    const inferredIsAdmin = normalized.role === 'admin' || normalized.is_admin === true || normalized.is_admin === 1;
    normalized.is_admin = inferredIsAdmin;
    normalized.role = inferredIsAdmin ? 'admin' : (normalized.role || 'student');

    return normalized;
  };

  // --- FUNÇÃO API CENTRALIZADA (IMPLEMENTA A SUA LÓGICA) ---
  const api = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const finalOptions = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, finalOptions);

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { success: false, error: await response.text() };

    if (!response.ok) {
      throw new Error(data.error || 'Falha no pedido à API');
    }

    return data;
  };

  // Efeito para validar o token ao iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserRaw = localStorage.getItem('user');
      const storedUser = storedUserRaw ? normalizeUser(JSON.parse(storedUserRaw)) : null;

      if (storedUser) {
        setUser(storedUser);
      }

      if (token) {
        try {
          const profileData = await api('/user/profile');
          if (profileData.success) {
            const mergedUser = normalizeUser({
              ...(storedUser || {}),
              ...(profileData.data || {}),
            });
            setUser(mergedUser);
            localStorage.setItem('user', JSON.stringify(mergedUser));
          } else {
            logout();
          }
        } catch (error) {
          if (!storedUser) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // 🔥 CORREÇÃO REAL
      if (data.success && data.data?.token) {
        const normalizedUser = normalizeUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        return { user: normalizedUser, error: null };
      } else {
        throw new Error(data.error || "Resposta de login inválida");
      }
    } catch (error) {
      return { user: null, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (email, password, full_name) => {
    // ... (lógica de registo)
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
      });
      return await login(email, password);
    } catch (error) {
      return { error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAdmin: user?.role === 'admin' || user?.is_admin === true,
    isAuthenticated: !!user,
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
