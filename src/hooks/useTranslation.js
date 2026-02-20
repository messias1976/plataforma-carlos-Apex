import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const context = useLanguage();
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};