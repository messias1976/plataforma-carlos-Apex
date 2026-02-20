import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import ptBR from '@/locales/pt-BR.json';
import enUS from '@/locales/en-US.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  'pt': ptBR,
  'en': enUS
};

export const LanguageProvider = ({ children }) => {
  // Default to 'pt' if nothing in localStorage
  const [language, setLanguage] = useState(() => {
    const storedLang = localStorage.getItem('apex_lang');
    return storedLang || 'pt';
  });

  // Sync with backend on mount if user is logged in
  useEffect(() => {
    const syncLanguage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const profile = await api.user.getProfile();
          if (profile?.language_preference && profile.language_preference !== language) {
            setLanguage(profile.language_preference);
            localStorage.setItem('apex_lang', profile.language_preference);
          }
        }
      } catch (error) {
        // User not logged in or profile not found - use localStorage
        console.debug('Language sync skipped:', error.message);
      }
    };
    syncLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    localStorage.setItem('apex_lang', lang);

    // Persist to backend if authenticated
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.user.updateProfile({ language_preference: lang });
      }
    } catch (error) {
      console.error("Failed to sync language preference:", error);
    }
  };

  const t = (path) => {
    const keys = path.split('.');

    // Try current language
    let current = translations[language];
    let value = getNestedValue(current, keys);

    if (value !== undefined) return value;

    // Fallback to pt-BR
    if (language !== 'pt') {
      current = translations['pt'];
      value = getNestedValue(current, keys);
      if (value !== undefined) return value;
    }

    // Return the key itself if no translation found, 
    // unless it's expected to be an array or specific type, 
    // but in that case the caller usually handles undefined.
    return path;
  };

  const getNestedValue = (obj, keys) => {
    let current = obj;
    for (const key of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};