import { cookies } from "next/headers";
import { translations, Locale, TranslationKey } from "./translations";

const COOKIE_NAME = "myfilms-locale";

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (raw === "ru" || raw === "uk" || raw === "en") return raw;
  return "ru";
}

export function tServer(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key] ?? key;
}
