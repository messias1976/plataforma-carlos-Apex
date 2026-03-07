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

const normalizeLanguage = (lang) => {
  if (!lang || typeof lang !== 'string') return 'pt';

  const normalized = lang.trim().toLowerCase();

  if (normalized === 'pt' || normalized === 'pt-br' || normalized === 'pt_br') return 'pt';
  if (normalized === 'en' || normalized === 'en-us' || normalized === 'en_us') return 'en';

  if (normalized.startsWith('pt')) return 'pt';
  if (normalized.startsWith('en')) return 'en';

  return 'pt';
};

export const LanguageProvider = ({ children }) => {
  // Default to 'pt' if nothing in localStorage
  const [language, setLanguage] = useState(() => {
    const storedLang = localStorage.getItem('apex_lang');
    return normalizeLanguage(storedLang || 'pt');
  });

  // Sync with backend on mount if user is logged in
  useEffect(() => {
    const syncLanguage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const profile = await api.user.getProfile();
          if (profile?.language_preference) {
            const normalizedPreference = normalizeLanguage(profile.language_preference);
            if (normalizedPreference !== language) {
              setLanguage(normalizedPreference);
              localStorage.setItem('apex_lang', normalizedPreference);
            }
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
    const normalizedLang = normalizeLanguage(lang);

    // Avoid no-op profile updates when the selected language is already active.
    if (normalizedLang === language) {
      localStorage.setItem('apex_lang', normalizedLang);
      return;
    }

    setLanguage(normalizedLang);
    localStorage.setItem('apex_lang', normalizedLang);

    // Persist to backend if authenticated
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.user.updateProfile({ language_preference: normalizedLang });
      }
    } catch (error) {
      if (error?.message?.includes('Nenhum campo para atualizar')) {
        console.debug('Language already synced with backend.');
        return;
      }
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