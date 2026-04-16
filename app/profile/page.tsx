"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Save, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ListCard } from "@/components/lists/list-card";
import { useToast } from "@/components/ui/toast";

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

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
          setProfile(d.user);
          setForm({ name: d.user.name || "", bio: d.user.bio || "" });
        });
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
      toast("Profile updated!", "success");
    } else {
      toast("Failed to update profile", "error");
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
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <Link
          href={`/${profile.username}`}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View public profile
        </Link>
      </div>

      {/* Profile card */}
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
                  label="Display name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                />
                <Textarea
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell people about yourself..."
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={saving} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save changes
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
                    <span className="text-zinc-500 text-sm ml-1">lists</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">{profile._count.likes}</span>
                    <span className="text-zinc-500 text-sm ml-1">likes</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditing(true)}>
                  Edit profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">My Lists</h2>
        {profile.lists.length === 0 ? (
          <p className="text-zinc-400 text-sm">No lists yet</p>
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
