"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Save, ExternalLink, Film, CheckCircle2, Star, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ListCard } from "@/components/lists/list-card";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n-context";
import { motion } from "framer-motion";

interface UserProfile {
  id: string;
  name: string | null;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
  lists: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    isPublic: boolean;
    _count: { movies: number };
    movies: { movie: { posterUrl: string | null; title: string } }[];
  }>;
  _count: { lists: number; likes: number };
}

interface Stats {
  totalMovies: number;
  watchedCount: number;
  topGenres: { genre: string; count: number }[];
  followerCount: number;
  followingCount: number;
}

// Achievement definitions
function getAchievements(stats: Stats, profile: UserProfile) {
  return [
    { id: "first_movie",  icon: "🎬", label: "Первый фильм",     desc: "Добавил первый фильм",      unlocked: stats.totalMovies >= 1 },
    { id: "collector10",  icon: "📚", label: "Коллекционер",     desc: "10+ фильмов в коллекции",    unlocked: stats.totalMovies >= 10 },
    { id: "cinephile50",  icon: "🏆", label: "Киноман",          desc: "50+ фильмов",                unlocked: stats.totalMovies >= 50 },
    { id: "watched10",    icon: "✅", label: "Смотритель",       desc: "Посмотрел 10 фильмов",       unlocked: stats.watchedCount >= 10 },
    { id: "social",       icon: "👥", label: "Социальный",       desc: "10+ подписчиков",            unlocked: stats.followerCount >= 10 },
    { id: "curator",      icon: "📋", label: "Куратор",          desc: "Создал 3+ списка",           unlocked: profile._count.lists >= 3 },
  ];
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((d) => {
          if (d.user) {
            setProfile(d.user);
            setStats(d.stats);
            setForm({ name: d.user.name || "", bio: d.user.bio || "" });
          }
        })
        .catch(() => {});
    }
  }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      setProfile((p) => p ? { ...p, ...data.user } : p);
      await update({ name: data.user.name });
      setEditing(false);
      toast(t("profileUpdated"), "success");
    } else {
      toast(t("failedToUpdateProfile"), "error");
    }
    setSaving(false);
  }

  if (status === "loading" || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="flex gap-5 mb-8">
          <div className="h-20 w-20 rounded-full bg-white/5" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-white/5 rounded w-48" />
            <div className="h-4 bg-white/5 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">{t("myProfileTitle")}</h1>
        <Link
          href={`/${profile.username}`}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("viewPublicProfile")}
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-8">
        <div className="flex items-start gap-5">
          <div className="relative">
            <Avatar src={profile.image} name={profile.name} size="xl" />
            <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <Camera className="h-3.5 w-3.5 text-zinc-300" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-3">
                <Input
                  label={t("displayName")}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={t("displayName")}
                />
                <Textarea
                  label={t("bio")}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder={t("bio")}
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit" loading={saving} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {t("saveChanges")}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
                <p className="text-zinc-400 text-sm">@{profile.username}</p>
                <p className="text-zinc-400 text-sm mt-0.5">{profile.email}</p>
                {profile.bio && <p className="text-zinc-300 mt-2 text-sm">{profile.bio}</p>}
                <div className="flex items-center gap-5 mt-3">
                  <div>
                    <span className="font-semibold text-white">{profile._count.lists}</span>
                    <span className="text-zinc-500 text-sm ml-1">{t("listsLabel")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">{profile._count.likes}</span>
                    <span className="text-zinc-500 text-sm ml-1">{t("likesLabel")}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditing(true)}>
                  {t("editProfile")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Film,         label: "Всего фильмов",    value: stats.totalMovies },
            { icon: CheckCircle2, label: "Посмотрел",        value: stats.watchedCount },
            { icon: Users,        label: "Подписчиков",      value: stats.followerCount },
            { icon: Star,         label: "Лайков",           value: profile._count.likes },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center"
            >
              <Icon className="h-5 w-5 text-red-400 mx-auto mb-1.5" />
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Top genres */}
      {stats && stats.topGenres.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 mb-8">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3">Любимые жанры</h2>
          <div className="space-y-2">
            {stats.topGenres.map(({ genre, count }, i) => {
              const max = stats.topGenres[0].count;
              return (
                <div key={genre} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-24 truncate">{genre}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / max) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      {stats && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Достижения</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {getAchievements(stats, profile).map(({ id, icon, label, desc, unlocked }, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-xl border p-3 flex items-center gap-3 ${
                  unlocked
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-white/5 bg-white/[0.01] opacity-40"
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${unlocked ? "text-white" : "text-zinc-500"}`}>{label}</p>
                  <p className="text-xs text-zinc-600 truncate">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">{t("myListsSection")}</h2>
        {profile.lists.length === 0 ? (
          <p className="text-zinc-400 text-sm">{t("noListsYet")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                username={profile.username}
                isOwner
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
