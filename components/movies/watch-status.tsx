"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Eye, CheckCircle2, Star, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type Status = "WANT" | "WATCHING" | "WATCHED" | null;

const STATUS_OPTIONS: { value: Status; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: "WANT",     label: "Хочу посмотреть", icon: Bookmark,     color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/30" },
  { value: "WATCHING", label: "Смотрю",           icon: Eye,          color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  { value: "WATCHED",  label: "Посмотрел",         icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30" },
];

export function WatchStatus({ movieId }: { movieId: string }) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/movies/${movieId}/status`)
      .then(r => r.json())
      .then(d => { setStatus(d.status); setUserRating(d.userRating); });
  }, [session, movieId]);

  if (!session) return null;

  async function setWatchStatus(newStatus: Status) {
    setSaving(true);
    const res = await fetch(`/api/movies/${movieId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const d = await res.json();
      setStatus(d.status);
      setOpen(false);
      toast(newStatus === null ? "Статус удалён" : STATUS_OPTIONS.find(o => o.value === newStatus)?.label ?? "", "success");
    }
    setSaving(false);
  }

  async function setRating(rating: number) {
    const newRating = userRating === rating ? null : rating;
    const res = await fetch(`/api/movies/${movieId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status ?? "WATCHED", userRating: newRating }),
    });
    if (res.ok) {
      const d = await res.json();
      setUserRating(d.userRating);
      setStatus(d.status);
    }
  }

  const current = STATUS_OPTIONS.find(o => o.value === status);

  return (
    <div className="flex flex-col gap-3">
      {/* Status button */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            current
              ? `${current.bg} ${current.color} border`
              : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
          }`}
        >
          {current ? (
            <current.icon className="h-4 w-4 flex-shrink-0" />
          ) : (
            <Bookmark className="h-4 w-4 flex-shrink-0" />
          )}
          {current?.label ?? "Добавить статус"}
        </button>

        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1 z-20 w-52 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl py-1 overflow-hidden"
              >
                {STATUS_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    onClick={() => setWatchStatus(value)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-white/5 ${status === value ? color + " font-medium" : "text-zinc-300"}`}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${status === value ? color : "text-zinc-500"}`} />
                    {label}
                    {status === value && <CheckCircle2 className={`h-3.5 w-3.5 ml-auto ${color}`} />}
                  </button>
                ))}
                {status && (
                  <>
                    <div className="my-1 border-t border-white/5" />
                    <button
                      onClick={() => setWatchStatus(null)}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                    >
                      <X className="h-4 w-4 flex-shrink-0" />
                      Удалить статус
                    </button>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Star rating — always visible if watched or has rating */}
      {(status === "WATCHED" || userRating) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1"
        >
          <span className="text-xs text-zinc-500 mr-1">Моя оценка:</span>
          {[...Array(10)].map((_, i) => {
            const val = i + 1;
            const filled = (hoverRating ?? userRating ?? 0) >= val;
            return (
              <button
                key={val}
                onMouseEnter={() => setHoverRating(val)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setRating(val)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  className={`h-4 w-4 transition-colors ${filled ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                />
              </button>
            );
          })}
          {userRating && (
            <span className="text-xs text-yellow-400 ml-1 font-medium">{userRating}/10</span>
          )}
        </motion.div>
      )}
    </div>
  );
}
