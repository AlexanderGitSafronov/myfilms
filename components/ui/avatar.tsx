import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className={cn("relative rounded-full overflow-hidden bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center flex-shrink-0", sizes[size], className)}>
      {src ? (
        <Image src={src} alt={name || "Avatar"} fill className="object-cover" />
      ) : (
        <span className="font-semibold text-white">{initials}</span>
      )}
    </div>
  );
}
