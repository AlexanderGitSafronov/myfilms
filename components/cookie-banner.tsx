"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "myfilms-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: false, date: new Date().toISOString() }));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-3 right-3 md:left-6 md:right-auto md:max-w-md z-50 pointer-events-auto"
          style={{
            bottom: "calc(env(safe-area-inset-bottom) + 5rem)",
          }}
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-red-600/20 flex items-center justify-center flex-shrink-0">
                <Cookie className="h-4 w-4 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">Мы используем cookies</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Мы используем cookies для работы авторизации и сохранения ваших настроек.
                  Подробнее — в{" "}
                  <Link href="/privacy" className="text-red-400 hover:text-red-300 underline">
                    политике конфиденциальности
                  </Link>.
                </p>
              </div>
              <button
                onClick={decline}
                className="text-zinc-500 hover:text-white transition-colors flex-shrink-0 -mt-1 -mr-1 p-1"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={decline}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors"
              >
                Только необходимые
              </button>
              <button
                onClick={accept}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-600 text-white hover:bg-red-500 transition-colors"
              >
                Принять все
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
