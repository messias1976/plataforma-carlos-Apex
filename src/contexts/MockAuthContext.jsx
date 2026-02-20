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

  // --- FUNÇÃO API CENTRALIZADA (IMPLEMENTA A SUA LÓGICA) ---
  const api = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    let finalEndpoint = endpoint;
    let finalBody = options.body ? JSON.parse(options.body) : {};

    if (token) {
      if (options.method === 'GET' || !options.method) {
        const separator = finalEndpoint.includes('?') ? '&' : '?';
        finalEndpoint += `${separator}token=${token}`;
      } else {
        finalBody.token = token;
      }
    }

    const finalOptions = {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: (options.method !== 'GET' && Object.keys(finalBody).length > 0)
        ? JSON.stringify(finalBody)
        : undefined,
    };

    const response = await fetch(`${API_BASE}${finalEndpoint}`, finalOptions);

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Falha no pedido à API');
    }
    return data;
  };

  // Efeito para validar o token ao iniciar
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileData = await api('/user/profile');
          if (profileData.success) {
            setUser(profileData.data);
          } else {
            logout();
          }
        } catch (error) {
          logout();
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
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        return { user: data.data.user, error: null };
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
    isAdmin: user?.role === 'admin',
    api,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
