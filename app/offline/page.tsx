import { Film, WifiOff } from "lucide-react";
import Link from "next/link";
import { getServerLocale, tServer } from "@/lib/i18n-server";

export default async function OfflinePage() {
  const locale = await getServerLocale();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-6">
        <WifiOff className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{tServer(locale, "youreOffline")}</h1>
      <p className="text-zinc-400 mb-8 max-w-xs">
        {tServer(locale, "offlineDesc")}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
      >
        <Film className="h-4 w-4" />
        {tServer(locale, "backToApp")}
      </Link>
    </div>
  );
}
