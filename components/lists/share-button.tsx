"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

interface ShareButtonProps {
  url: string;
  listName: string;
}

export function ShareButton({ url, listName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: listName, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Share2 className="h-3.5 w-3.5" />}
      {copied ? t("copied") : t("shareList")}
    </button>
  );
}
