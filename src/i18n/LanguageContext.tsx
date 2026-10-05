import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import {
  translations,
  type Language,
  type TranslationDictionary,
} from "./translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationDictionary;
};

const STORAGE_KEY = "manulcoffee-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function languageFromPathname(pathname: string): Language {
  return pathname === "/lv" || pathname.startsWith("/lv/") ? "lv" : "en";
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const navigate = useNavigate();

  const language = languageFromPathname(pathname);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage: Language) => {
        if (nextLanguage === language) return;

        void navigate({
          to: nextLanguage === "lv" ? "/lv" : "/",
        });
      },
      t: translations[language] as TranslationDictionary,
    }),
    [language, navigate],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
