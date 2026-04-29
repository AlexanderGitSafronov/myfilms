"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

export default function EditListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/lists/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.isOwner) { router.push("/lists"); return; }
        setName(data.list.name);
        setDescription(data.list.description ?? "");
        setIsPublic(data.list.isPublic);
        setLoading(false);
      });
  }, [session, id, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/lists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || null, isPublic }),
    });
    setSaving(false);
    if (res.ok) {
      toast(t("listUpdated"), "success");
      router.push(`/lists/${id}`);
    } else {
      const err = await res.json().catch(() => ({}));
      toast(err.error || t("saveError"), "error");
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <Link href={`/lists/${id}`} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t("backToList")}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl font-bold text-white mb-8">{t("editListTitle")}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              {t("listNameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-colors"
              placeholder={t("listNamePlaceholderEdit")}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              {t("descLabel")} <span className="text-zinc-600 font-normal">({t("descriptionOptional").replace(/^.*\(/, "").replace(/\)$/, "")})</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-colors resize-none"
              placeholder={t("descListPlaceholder")}
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">{t("visibility")}</label>
            <div className="flex gap-3">
              {[
                { value: true, label: t("public"), desc: t("publicDesc") },
                { value: false, label: t("private"), desc: t("privateDesc") },
              ].map(({ value, label, desc }) => (
                <button
                  key={String(value)}
                  type="button"
                  onClick={() => setIsPublic(value)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-left transition-all ${
                    isPublic === value
                      ? "border-red-600/50 bg-red-600/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20"
                  }`}
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={saving || !name.trim()} className="w-full mt-2">
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {t("saving")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t("saveBtn")}
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
