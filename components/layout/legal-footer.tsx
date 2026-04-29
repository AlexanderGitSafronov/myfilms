import Link from "next/link";
import { getServerLocale, tServer } from "@/lib/i18n-server";

export async function LegalFooter() {
  const locale = await getServerLocale();
  return (
    <footer className="border-t border-white/5 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} MyFilms. {tServer(locale, "allRightsReserved")}</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-white transition-colors">{tServer(locale, "footerPrivacy")}</Link>
          <Link href="/terms" className="hover:text-white transition-colors">{tServer(locale, "footerTerms")}</Link>
          <a href="mailto:support@myfilms.app" className="hover:text-white transition-colors">{tServer(locale, "footerContact")}</a>
        </div>
      </div>
    </footer>
  );
}
