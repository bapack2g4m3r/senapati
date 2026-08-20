import React, { createContext, useState, useContext, useEffect } from 'react';
import suTranslations from '../locales/su.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('id');

  useEffect(() => {
    const savedLang = localStorage.getItem('senapati_language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'su' : 'id';
    setLanguage(newLang);
    localStorage.setItem('senapati_language', newLang);
  };

  const t = (text) => {
    if (language === 'id') return text;
    // For Sundanese, look up the translation. If missing, fallback to original text.
    return suTranslations[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
