"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ListCard } from "@/components/lists/list-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n-context";
import { StaggerList, StaggerItem, FadeUp } from "@/components/motion";

interface MovieList {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isPublic: boolean;
  _count: { movies: number };
  movies: { movie: { posterUrl: string | null; title: string } }[];
}

export default function ListsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();
  const [lists, setLists] = useState<MovieList[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newList, setNewList] = useState({ name: "", description: "", isPublic: true });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) fetchLists();
  }, [session]);

  async function fetchLists() {
    const res = await fetch("/api/lists");
    if (res.ok) {
      const data = await res.json();
      setLists(data.lists);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newList.name.trim()) return;
    setCreating(true);

    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList),
    });

    if (res.ok) {
      const data = await res.json();
      setLists((l) => [data.list, ...l]);
      setDialogOpen(false);
      setNewList({ name: "", description: "", isPublic: true });
      toast(t("listCreated"), "success");
    } else {
      toast(t("failedToCreateList"), "error");
    }
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteListConfirm"))) return;

    const res = await fetch(`/api/lists/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLists((l) => l.filter((list) => list.id !== id));
      toast(t("listDeleted"), "success");
    } else {
      toast(t("failedToDeleteList"), "error");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="aspect-[16/7] skeleton rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("myLists")}</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {lists.length} {lists.length === 1 ? t("list") : t("lists")}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("newList")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("createNewList")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <Input
                label={t("listName")}
                placeholder={t("listNamePlaceholder")}
                value={newList.name}
                onChange={(e) => setNewList((l) => ({ ...l, name: e.target.value }))}
                required
              />
              <Textarea
                label={t("descriptionOptional")}
                placeholder={t("listDescPlaceholder")}
                value={newList.description}
                onChange={(e) => setNewList((l) => ({ ...l, description: e.target.value }))}
                rows={3}
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newList.isPublic}
                  onChange={(e) => setNewList((l) => ({ ...l, isPublic: e.target.checked }))}
                  className="w-4 h-4 rounded accent-red-600"
                />
                <div>
                  <p className="text-sm font-medium text-white">{t("publicList")}</p>
                  <p className="text-xs text-zinc-500">{t("publicListDesc")}</p>
                </div>
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} className="flex-1">
                  {t("cancel")}
                </Button>
                <Button type="submit" loading={creating} className="flex-1">
                  {t("createListBtn")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {lists.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-16 text-center">
          <Film className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">{t("noListsEmptyTitle")}</h2>
          <p className="text-zinc-400 text-sm mb-6">{t("noListsEmptyDesc")}</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("createList")}
          </Button>
        </div>
      ) : (
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <StaggerItem key={list.id}>
              <ListCard
                list={list}
                username={session?.user.username}
                isOwner
                onDelete={handleDelete}
              />
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
