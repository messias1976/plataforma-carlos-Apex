import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/MockAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const adminLogin = async (email, password) => {
    if (email === 'admin@admin.com.br' && password === '123456') {
      await login(email, password);
      return true;
    }
    return false;
  };

  const adminLogout = async () => {
    navigate('/login');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin: user?.is_admin,
        loading: false,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);