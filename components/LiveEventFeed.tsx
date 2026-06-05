"use client";
import { useEffect, useState } from "react";
import type { NetworkEvent } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import {
  Box, CheckCircle2, LogIn, LogOut, AlertOctagon, FastForward, Users,
} from "lucide-react";

const ICONS: Record<string, { icon: typeof Box; color: string }> = {
  BLOCK_SEALED: { icon: Box, color: "text-zinc-400" },
  BLOCK_HARDFINAL: { icon: CheckCircle2, color: "text-emerald-400" },
  VALIDATOR_JOINED: { icon: LogIn, color: "text-emerald-400" },
  VALIDATOR_LEFT: { icon: LogOut, color: "text-zinc-500" },
  SLASHING: { icon: AlertOctagon, color: "text-red-400" },
  TICK_ADVANCE: { icon: FastForward, color: "text-violet-400" },
  QUORUM_ASSIGNED: { icon: Users, color: "text-amber-400" },
};

const STREAM_TYPES: NetworkEvent["type"][] = [
  "BLOCK_HARDFINAL", "BLOCK_SEALED", "QUORUM_ASSIGNED", "TICK_ADVANCE",
];

export function LiveEventFeed({ initial }: { initial: NetworkEvent[] }) {
  const [events, setEvents] = useState(initial);

  useEffect(() => {
    const id = setInterval(() => {
      setEvents((prev) => {
        const next: NetworkEvent = {
          id: `live-${Date.now()}`,
          type: STREAM_TYPES[Math.floor(Math.random() * STREAM_TYPES.length)],
          tick: 47,
          blockId: 184291,
          timestamp: new Date().toISOString(),
        };
        return [next, ...prev.slice(0, 19)];
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h3 className="text-sm font-semibold">Live Events</h3>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          streaming
        </span>
      </div>
      <ul className="divide-y divide-zinc-800/60 max-h-96 overflow-y-auto">
        {events.map((e) => {
          const meta = ICONS[e.type] || ICONS.BLOCK_SEALED;
          const Icon = meta.icon;
          return (
            <li key={e.id} className="flex items-start gap-3 px-4 py-2.5 text-sm">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.color}`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-zinc-200">
                  {e.type.replace(/_/g, " ").toLowerCase()}
                  {e.blockId && (
                    <span className="text-zinc-500"> · block #{e.blockId.toLocaleString()}</span>
                  )}
                  {e.amount && (
                    <span className="text-red-400"> · −{e.amount.toLocaleString()} RTM</span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">
                  tick {e.tick} · {timeAgo(e.timestamp)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
