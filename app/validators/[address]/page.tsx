import { notFound } from "next/navigation";
import Link from "next/link";
import { VALIDATORS, REWARD_HISTORY, ROTATIONS, getValidator } from "@/lib/mock-data";
import { RoleBadge } from "@/components/RoleBadge";
import { StatCard } from "@/components/StatCard";
import { formatAddress, formatRTM, formatPercent, timeAgo } from "@/lib/format";
import { MIN_STAKE, REWARD_SHARE, ROLE_BAR_COLOR } from "@/lib/constants";
import { Activity, Clock, ShieldAlert, TrendingUp } from "lucide-react";
import { RechartsArea } from "@/components/RechartsArea";

export function generateStaticParams() {
  return VALIDATORS.map((v) => ({ address: v.address }));
}

export default function ValidatorDetail({ params }: { params: { address: string } }) {
  const v = getValidator(params.address);
  if (!v) return notFound();

  const minStake = MIN_STAKE[v.role];
  const stakePct = Math.min(100, (v.stake / minStake) * 100);
  const rewards = REWARD_HISTORY(v.address);
  const myRotations = ROTATIONS.slice(0, 5);
  const rewardShare = REWARD_SHARE[v.role];

  return (
    <div className="space-y-6">
      <Link
        href="/validators"
        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
      >
        ← Back to validators
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-lg font-semibold tracking-tight">
                {formatAddress(v.address, 10, 8)}
              </h1>
              <RoleBadge role={v.role} size="md" />
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Full address: <span className="font-mono">{v.address}</span>
            </p>
          </div>
          <StatusBlock status={v.status} lastSeen={v.lastSeen} />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Stake progress to min</span>
            <span className="tabular-nums text-zinc-300">
              {formatRTM(v.stake)} / {formatRTM(minStake)} RTM ({stakePct.toFixed(0)}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full ${ROLE_BAR_COLOR[v.role]}`}
              style={{ width: `${stakePct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Uptime (30d)"
          value={formatPercent(v.uptime, 2)}
          icon={<Activity className="h-4 w-4 text-zinc-600" />}
        />
        <StatCard
          label="Score"
          value={`${v.score}/100`}
          icon={<TrendingUp className="h-4 w-4 text-zinc-600" />}
        />
        <StatCard
          label="Joined"
          value={timeAgo(v.joinedAt)}
          sub={new Date(v.joinedAt).toLocaleDateString()}
          icon={<Clock className="h-4 w-4 text-zinc-600" />}
        />
        <StatCard
          label="Slashing Events"
          value={v.slashingCount}
          icon={
            <ShieldAlert
              className={`h-4 w-4 ${v.slashingCount > 0 ? "text-red-500" : "text-zinc-600"}`}
            />
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Rewards — Last 30d</h3>
            <span className="text-xs text-zinc-500">share: {rewardShare}% of fees</span>
          </div>
          <div className="h-64">
            <RechartsArea
              data={rewards}
              dataKey="reward"
              xKey="day"
              stroke="#34d399"
              gradientId="reward"
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-3 text-center text-xs">
            <div>
              <div className="text-zinc-500">Lifetime rewards</div>
              <div className="mt-0.5 text-base font-semibold tabular-nums">
                {formatRTM(v.rewardsEarned)} RTM
              </div>
            </div>
            <div>
              <div className="text-zinc-500">
                {v.role === "WORKER" ? "TX Validated" : v.role === "KEEPER" ? "Blocks Planned" : "Finalized"}
              </div>
              <div className="mt-0.5 text-base font-semibold tabular-nums">
                {v.role === "WORKER"
                  ? v.txValidated.toLocaleString()
                  : v.blocksProduced.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-zinc-500">Region</div>
              <div className="mt-0.5 text-base font-semibold">{v.region}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Recent Quorums</h3>
          <ul className="space-y-2 text-xs">
            {myRotations.map((r) => {
              const included =
                r.workers.includes(v.address) ||
                r.suits.includes(v.address) ||
                r.keeper === v.address;
              const statusColor: Record<string, string> = {
                HARDFINAL: "bg-emerald-500/20 text-emerald-300",
                SOFTFINAL: "bg-violet-500/20 text-violet-300",
                SEALED: "bg-amber-500/20 text-amber-300",
                REJECTED: "bg-red-500/20 text-red-300",
                PENDING: "bg-zinc-700 text-zinc-300",
              };
              return (
                <li
                  key={r.quorumId}
                  className={`rounded-lg border p-2.5 ${
                    included
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-zinc-300">tick {r.tick}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase ${statusColor[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-1 text-zinc-500">block #{r.blockId.toLocaleString()}</div>
                  {included && (
                    <div className="mt-1 text-[10px] text-emerald-400">
                      ✓ this validator was in the quorum
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusBlock({ status, lastSeen }: { status: string; lastSeen: string }) {
  const colors: Record<string, string> = {
    active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    offline: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
    jailed: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    slashing: "text-red-400 border-red-500/30 bg-red-500/10",
  };
  const dot: Record<string, string> = {
    active: "bg-emerald-400 animate-pulse",
    offline: "bg-zinc-500",
    jailed: "bg-orange-400",
    slashing: "bg-red-400",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
        colors[status] || colors.active
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dot[status] || dot.active
        }`}
      />
      <span className="font-medium uppercase tracking-wider">{status}</span>
      <span className="text-zinc-500">· {timeAgo(lastSeen)}</span>
    </div>
  );
}
