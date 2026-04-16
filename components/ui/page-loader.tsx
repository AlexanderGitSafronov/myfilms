"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Film } from "lucide-react";

// ── Centered loader (fits between header + footer) ───────────────────────────
function LoaderContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {/* Spinner ring + logo */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Static track */}
        <div className="absolute inset-0 rounded-full border-2 border-white/8" />
        {/* Spinning arc — rotates the whole div so the arc orbits the logo */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 border-r-red-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ borderTopColor: "#ef4444", borderRightColor: "rgba(239,68,68,0.3)", borderBottomColor: "transparent", borderLeftColor: "transparent" }}
        />
        {/* Logo */}
        <motion.div
          className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ boxShadow: "0 0 28px rgba(220,38,38,0.55)" }}
        >
          <Film className="h-6 w-6 text-white" />
        </motion.div>
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-red-500"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Navigation loader — shows in content area only ───────────────────────────
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
    timerRef.current = setTimeout(() => setVisible(false), 700);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nav-loader"
          // Sits between header (4rem + safe-area-top) and mobile footer (4rem + safe-area-bottom)
          className="fixed left-0 right-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm md:bottom-0"
          style={{
            top: "calc(4rem + env(safe-area-inset-top))",
            bottom: "calc(4rem + env(safe-area-inset-bottom))",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <LoaderContent />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── PWA splash screen ─────────────────────────────────────────────────────────
export function SplashLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1000);
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
          {/* Aurora */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute rounded-full" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%)", top: "-10%", left: "10%", filter: "blur(60px)" }} />
            <div className="absolute rounded-full" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)", bottom: "5%", right: "5%", filter: "blur(80px)" }} />
          </div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Big spinner + logo */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <motion.div
                className="absolute inset-0 rounded-full border-[3px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: "#ef4444", borderRightColor: "rgba(239,68,68,0.25)", borderBottomColor: "transparent", borderLeftColor: "transparent" }}
              />
              <motion.div
                className="h-16 w-16 rounded-2xl bg-red-600 flex items-center justify-center"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ boxShadow: "0 0 40px rgba(220,38,38,0.5), 0 0 80px rgba(220,38,38,0.2)" }}
              >
                <Film className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            {/* Name */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
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
