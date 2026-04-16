"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPath = useRef(pathname + searchParams.toString());

  useEffect(() => {
    const current = pathname + searchParams.toString();
    if (current === prevPath.current) return;
    prevPath.current = current;

    // Start
    setProgress(0);
    setVisible(true);

    // Animate to ~85% quickly, then slow down
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += p < 30 ? 8 : p < 60 ? 4 : p < 80 ? 1.5 : 0.4;
      if (p >= 85) { if (intervalRef.current) clearInterval(intervalRef.current); p = 85; }
      setProgress(p);
    }, 50);

    // Complete after short delay
    timerRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-red-400 to-red-600 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.15 }}
          />
          {/* Glow */}
          <div
            className="absolute right-0 top-0 h-full w-24 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at right, rgba(239,68,68,0.6) 0%, transparent 70%)",
              right: `${100 - progress}%`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
