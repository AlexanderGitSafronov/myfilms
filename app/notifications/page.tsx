"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, UserPlus, Heart, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";
import type { TranslationKey } from "@/lib/translations";

interface Notification {
  id: string;
  type: "FOLLOW" | "LIKE" | "COMMENT";
  read: boolean;
  createdAt: string;
  movieId: string | null;
  fromUser: { id: string; name: string | null; username: string; image: string | null } | null;
}

const TYPE_CONFIG: Record<"FOLLOW" | "LIKE" | "COMMENT", { icon: React.ElementType; color: string; bg: string; textKey: TranslationKey }> = {
  FOLLOW:  { icon: UserPlus,       color: "text-blue-400",   bg: "bg-blue-500/10",   textKey: "notifFollow" },
  LIKE:    { icon: Heart,          color: "text-red-400",    bg: "bg-red-500/10",    textKey: "notifLike" },
  COMMENT: { icon: MessageCircle,  color: "text-green-400",  bg: "bg-green-500/10",  textKey: "notifComment" },
};

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications || []); setLoading(false); });
    // Mark all as read
    fetch("/api/notifications", { method: "PATCH" });
  }, [session]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-3">
        <div className="h-8 w-48 skeleton rounded-lg mb-6" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <FadeUp>
        <div className="flex items-center gap-3 mb-8">
          <Bell className="h-6 w-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">{t("notifications")}</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">{t("noNotificationsTitle")}</p>
            <p className="text-zinc-600 text-sm mt-1">{t("noNotificationsDesc")}</p>
          </div>
        ) : (
          <StaggerList className="space-y-2">
            {notifications.map((n) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              const href = n.type === "FOLLOW"
                ? `/${n.fromUser?.username}`
                : n.movieId ? `/movies/${n.movieId}` : "#";

              return (
                <StaggerItem key={n.id}>
                  <Link href={href}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors ${
                        n.read
                          ? "border-white/5 bg-white/[0.01] hover:bg-white/[0.03]"
                          : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]"
                      }`}
                    >
                      {/* Icon */}
                      <div className={`h-9 w-9 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                      </div>

                      {/* Avatar */}
                      {n.fromUser && (
                        <Avatar src={n.fromUser.image} name={n.fromUser.name} size="sm" className="flex-shrink-0" />
                      )}

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                          <span className="font-semibold">{n.fromUser?.name || n.fromUser?.username}</span>
                          {" "}{t(cfg.textKey)}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">{formatDate(n.createdAt)}</p>
                      </div>

                      {/* Unread dot */}
                      {!n.read && (
                        <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerList>
        )}
      </FadeUp>
    </div>
  );
}
