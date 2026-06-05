import type { Role } from "./types";

export const MIN_STAKE: Record<Role, number> = {
  KEEPER: 1_000_000,
  SUIT: 100_000,
  WORKER: 10_000,
};

export const ROLE_COLORS: Record<Role, { text: string; bg: string; border: string }> = {
  KEEPER: { text: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  SUIT:   { text: "text-amber-300",  bg: "bg-amber-500/10",  border: "border-amber-500/30"  },
  WORKER: { text: "text-emerald-300",bg: "bg-emerald-500/10",border: "border-emerald-500/30"},
};

export const ROLE_BAR_COLOR: Record<Role, string> = {
  KEEPER: "bg-violet-500",
  SUIT:   "bg-amber-500",
  WORKER: "bg-emerald-500",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  KEEPER: "Plan blocks, coordinate the network, store full mesh state, manage tick advancement.",
  SUIT: "Validate sealed blocks, manage finality voting, verify Keeper consensus.",
  WORKER: "Validate individual transactions through quorums of 5. Most accessible role.",
};

export const REWARD_SHARE: Record<Role, number> = {
  WORKER: 90,
  KEEPER: 3,
  SUIT: 0.5,
};
