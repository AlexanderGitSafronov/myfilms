"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Locale, TranslationKey } from "./translations";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "ru",
  setLocale: () => {},
  t: (key) => translations.ru[key],
});

const COOKIE_NAME = "myfilms-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function writeLocaleCookie(l: Locale) {
  document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

// SW serves HTML pages stale-while-revalidate, so a plain reload would show
// the previous locale. Clear the pages cache first so the reload hits network.
async function clearPagesCacheAndReload() {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.includes("pages")).map((k) => caches.delete(k)));
    }
  } catch {}
  window.location.reload();
}

export function I18nProvider({ children, initialLocale = "ru" }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  function setLocale(l: Locale) {
    setLocaleState(l);
    writeLocaleCookie(l);
    try { localStorage.setItem("locale", l); } catch {}
    if (typeof window !== "undefined") clearPagesCacheAndReload();
  }

  function t(key: TranslationKey): string {
    return translations[locale][key] ?? translations.en[key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
