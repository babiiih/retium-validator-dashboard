import type { Role } from "@/lib/types";
import { ROLE_COLORS } from "@/lib/constants";
import { Crown, HardHat, ShieldCheck } from "lucide-react";

const ICONS = {
  KEEPER: Crown,
  SUIT: ShieldCheck,
  WORKER: HardHat,
} as const;

export function RoleBadge({ role, size = "sm" }: { role: Role; size?: "sm" | "md" }) {
  const Icon = ICONS[role];
  const c = ROLE_COLORS[role];
  const sizing = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";
  const iconSize = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${c.border} ${c.bg} ${c.text} ${sizing} font-medium uppercase tracking-wider`}
    >
      <Icon className={iconSize} />
      {role}
    </span>
  );
}
