import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="border-t border-white/5 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} MyFilms. Все права защищены.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-white transition-colors">Конфиденциальность</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Условия</Link>
          <a href="mailto:support@myfilms.app" className="hover:text-white transition-colors">Контакты</a>
        </div>
      </div>
    </footer>
  );
}
