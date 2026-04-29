"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";

interface FollowButtonProps {
  username: string;
  initialFollowing: boolean;
}

export function FollowButton({ username, initialFollowing }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function toggle() {
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    const res = await fetch(`/api/users/${username}/follow`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setFollowing(data.following);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={toggle}
      loading={loading}
      variant={following ? "outline" : "default"}
      size="sm"
      className="mt-4"
    >
      {following ? (
        <><UserCheck className="h-4 w-4 mr-2" />{t("youAreFollowing")}</>
      ) : (
        <><UserPlus className="h-4 w-4 mr-2" />{t("follow")}</>
      )}
    </Button>
  );
}
