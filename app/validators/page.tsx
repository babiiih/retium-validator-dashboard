"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { VALIDATORS } from "@/lib/mock-data";
import { RoleBadge } from "@/components/RoleBadge";
import { formatAddress, formatRTM, formatPercent } from "@/lib/format";
import { MIN_STAKE } from "@/lib/constants";
import { Search, ArrowUpDown } from "lucide-react";
import type { Role, Status } from "@/lib/types";

type SortKey = "stake" | "uptime" | "score" | "joinedAt";

export default function ValidatorsPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "ALL">("ALL");
  const [status, setStatus] = useState<Status | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("stake");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    return VALIDATORS
      .filter((v) => role === "ALL" || v.role === role)
      .filter((v) => status === "ALL" || v.status === status)
      .filter((v) => v.address.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const av = sort === "joinedAt" ? new Date(a.joinedAt).getTime() : (a[sort] as number);
        const bv = sort === "joinedAt" ? new Date(b.joinedAt).getTime() : (b[sort] as number);
        return dir === "desc" ? bv - av : av - bv;
      });
  }, [query, role, status, sort, dir]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Validators</h1>
        <p className="text-sm text-zinc-500">
          {filtered.length} of {VALIDATORS.length} shown · live testnet data
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by address…"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2 pl-9 pr-3 text-sm placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1 text-xs">
          {(["ALL", "KEEPER", "WORKER", "SUIT"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r as Role | "ALL")}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                role === r ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | "ALL")}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm focus:outline-none"
        >
          <option value="ALL">All status</option>
          <option value="active">Active</option>
          <option value="offline">Offline</option>
          <option value="jailed">Jailed</option>
          <option value="slashing">Slashing</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm focus:outline-none"
        >
          <option value="stake">Sort: Stake</option>
          <option value="uptime">Sort: Uptime</option>
          <option value="score">Sort: Score</option>
          <option value="joinedAt">Sort: Joined</option>
        </select>
        <button
          onClick={() => setDir(dir === "desc" ? "asc" : "desc")}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-400 hover:text-white"
          title="Toggle direction"
        >
          <ArrowUpDown className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/80 text-left text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Validator</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium text-right">Stake</th>
              <th className="px-4 py-3 font-medium text-right">Uptime</th>
              <th className="px-4 py-3 font-medium text-right">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Region</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.map((v) => (
              <tr key={v.address} className="group hover:bg-zinc-900/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/validators/${v.address}`}
                    className="font-mono text-xs text-zinc-300 group-hover:text-white"
                  >
                    {formatAddress(v.address, 8, 6)}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={v.role} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <div className="text-zinc-200">{formatRTM(v.stake)} RTM</div>
                  <div className="text-[10px] text-zinc-500">
                    min {formatShort(MIN_STAKE[v.role])}
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                  {formatPercent(v.uptime, 1)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`tabular-nums ${
                      v.score >= 80
                        ? "text-emerald-400"
                        : v.score >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                    }`}
                  >
                    {v.score}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={v.status} />
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">{v.region}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500">
                  No validators match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    offline: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
    jailed: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    slashing: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  const dot: Record<Status, string> = {
    active: "bg-emerald-400 animate-pulse",
    offline: "bg-zinc-500",
    jailed: "bg-orange-400",
    slashing: "bg-red-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${colors[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

function formatShort(n: number) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return n.toString();
}
