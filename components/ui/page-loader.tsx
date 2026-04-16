"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Film } from "lucide-react";

// ── Spinner ring ─────────────────────────────────────────────────────────────
function SpinnerRing() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="absolute inset-0">
      {/* Track */}
      <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      {/* Animated arc */}
      <motion.circle
        cx="36" cy="36" r="30"
        fill="none"
        stroke="url(#spinGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="60 130"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        style={{ originX: "36px", originY: "36px" }}
      />
      <defs>
        <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Loader overlay ────────────────────────────────────────────────────────────
function LoaderOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-[72px] h-[72px] flex items-center justify-center">
            <SpinnerRing />
            {/* Logo in center */}
            <motion.div
              className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ boxShadow: "0 0 24px rgba(220,38,38,0.5)" }}
            >
              <Film className="h-5 w-5 text-white" />
            </motion.div>
          </div>

          {/* Dots */}
          <div className="flex gap-1.5 mt-5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-red-500"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Navigation loader ─────────────────────────────────────────────────────────
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname + searchParams.toString());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (current === prevPath.current) return;
    prevPath.current = current;

    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 600);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname, searchParams]);

  return <LoaderOverlay visible={visible} />;
}

// ── PWA launch loader ─────────────────────────────────────────────────────────
export function SplashLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide after fonts/styles loaded — short delay so it feels intentional
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Aurora blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)", top: "-10%", left: "10%", filter: "blur(60px)" }} />
            <div className="absolute rounded-full" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)", bottom: "5%", right: "5%", filter: "blur(80px)" }} />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="relative w-[88px] h-[88px] flex items-center justify-center">
              <svg width="88" height="88" viewBox="0 0 88 88" className="absolute inset-0">
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle
                  cx="44" cy="44" r="38"
                  fill="none" stroke="url(#splashGrad)" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="70 170"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  style={{ originX: "44px", originY: "44px" }}
                />
                <defs>
                  <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.div
                className="h-14 w-14 rounded-2xl bg-red-600 flex items-center justify-center"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ boxShadow: "0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(220,38,38,0.2)" }}
              >
                <Film className="h-7 w-7 text-white" />
              </motion.div>
            </div>

            {/* App name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <p className="text-2xl font-bold text-white tracking-tight">MyFilms</p>
              <p className="text-sm text-zinc-500 mt-1">Коллекция фильмов</p>
            </motion.div>

            {/* Dots */}
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-red-500"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
