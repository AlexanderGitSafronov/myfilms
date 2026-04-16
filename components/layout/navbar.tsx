"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Film, Plus, List, User, LogOut, Home, Search, Languages, Rss, Compass, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";
import { Locale } from "@/lib/translations";
import { motion } from "framer-motion";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "uk", label: "UK" },
  { value: "en", label: "EN" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const { t, locale, setLocale } = useI18n();

  // Clear pending when real navigation completes
  useEffect(() => { setPendingHref(null); }, [pathname]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/notifications").then(r => r.json()).then(d => setUnread(d.unreadCount ?? 0));
  }, [session, pathname]);

  // Optimistic active: use pending href if set, else real pathname
  const activeHref = pendingHref ?? pathname;

  const navLinks = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/feed", icon: Rss, label: t("feed") },
    { href: "/explore", icon: Compass, label: "Обзор" },
    { href: "/lists", icon: List, label: t("myLists") },
    { href: "/add-movie", icon: Plus, label: t("addMovie") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black backdrop-blur-xl" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center group-hover:bg-red-500 transition-colors">
              <Film className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">MyFilms</span>
          </Link>

          {/* Desktop nav — only for logged in users */}
          {session && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, icon: Icon, label }) => {
                const active = activeHref === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setPendingHref(href)}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <Icon className="relative h-4 w-4" />
                    <span className="relative">{label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            {session && (
              <Link href="/notifications" className="relative p-2 text-zinc-400 hover:text-white transition-colors" onClick={() => setUnread(0)}>
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Link>
            )}

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <Languages className="h-4 w-4" />
                <span className="text-xs font-medium hidden sm:block">{locale.toUpperCase()}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl z-20 py-1 overflow-hidden">
                    {LOCALES.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => { setLocale(value); setLangOpen(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm transition-colors",
                          locale === value
                            ? "text-red-400 bg-white/5"
                            : "text-zinc-300 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {t(value === "ru" ? "langRu" : value === "uk" ? "langUk" : "langEn")}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-full focus:outline-none"
                >
                  <Avatar src={session.user.image} name={session.user.name} size="sm" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">@{session.user.username}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        {t("profile")}
                      </Link>
                      <button
                        onClick={() => { signOut(); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("signOut")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {t("signIn")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile bottom navigation
export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useI18n();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => { setPendingHref(null); }, [pathname]);

  const activeHref = pendingHref ?? pathname;

  const links = session
    ? [
        { href: "/", icon: Home, label: t("home") },
        { href: "/feed", icon: Rss, label: t("feed") },
        { href: "/explore", icon: Compass, label: "Обзор" },
        { href: "/add-movie", icon: Plus, label: t("addMovie") },
        { href: "/profile", icon: User, label: t("profile") },
      ]
    : [
        { href: "/", icon: Home, label: t("home") },
        { href: "/login", icon: User, label: t("signIn") },
      ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-black backdrop-blur-xl border-t border-white/5" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch h-16">
        {links.map(({ href, icon: Icon, label }) => {
          const active = activeHref === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setPendingHref(href)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-100",
                active ? "text-red-400" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <motion.div
                animate={{ scale: active ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
