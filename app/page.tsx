import { StatCard } from "@/components/StatCard";
import { LiveEventFeed } from "@/components/LiveEventFeed";
import { EVENTS, NETWORK_STATS, TPS_HISTORY } from "@/lib/mock-data";
import { Activity, Box, Gauge, Users, Flame, Layers } from "lucide-react";
import { formatRTM, formatPercent } from "@/lib/format";
import { RoleBadge } from "@/components/RoleBadge";
import { RechartsArea } from "@/components/RechartsArea";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Network Overview</h1>
        <p className="text-sm text-zinc-500">
          Real-time health of the Retium validator mesh · Testnet
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Current Tick"
          value={NETWORK_STATS.currentTick}
          icon={<Layers className="h-4 w-4 text-zinc-600" />}
          sub="advancing every ~1m"
        />
        <StatCard
          label="Block Height"
          value={NETWORK_STATS.blockHeight.toLocaleString()}
          icon={<Box className="h-4 w-4 text-zinc-600" />}
        />
        <StatCard
          label="TPS"
          value={NETWORK_STATS.tps.toLocaleString()}
          icon={<Gauge className="h-4 w-4 text-zinc-600" />}
          trend={{ value: "8.4%", positive: true }}
        />
        <StatCard
          label="Active Validators"
          value={NETWORK_STATS.totalValidators.toLocaleString()}
          icon={<Users className="h-4 w-4 text-zinc-600" />}
          sub={`${formatPercent(NETWORK_STATS.uptime, 2)} uptime`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">TPS — Last 24h</h3>
            <span className="text-xs text-zinc-500">target 3,000–5,000</span>
          </div>
          <div className="h-64">
            <RechartsArea
              data={TPS_HISTORY}
              dataKey="tps"
              xKey="hour"
              stroke="#e4e4e7"
              gradientId="tps"
            />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Active by Role</h3>
          <div className="space-y-3">
            {(["KEEPER", "SUIT", "WORKER"] as const).map((role) => {
              const n = NETWORK_STATS.activeByRole[role];
              const pct = (n / NETWORK_STATS.totalValidators) * 100;
              return (
                <div key={role}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <RoleBadge role={role} />
                    <span className="text-sm font-medium tabular-nums">{n.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div className="h-full bg-zinc-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-800 pt-4 text-xs">
            <div>
              <div className="text-zinc-500">Total Stake</div>
              <div className="mt-0.5 text-base font-semibold tabular-nums">
                {formatRTM(NETWORK_STATS.totalStake)} RTM
              </div>
            </div>
            <div>
              <div className="text-zinc-500 flex items-center gap-1">
                <Flame className="h-3 w-3 text-orange-400" /> Burned 30d
              </div>
              <div className="mt-0.5 text-base font-semibold tabular-nums">
                {NETWORK_STATS.burn30d.toLocaleString()} RTM
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Reward Distribution per Finalized Block</h3>
          <div className="space-y-2">
            <BarRow label="Workers" value={90} color="bg-emerald-500" />
            <BarRow label="Treasury" value={5.5} color="bg-zinc-500" />
            <BarRow label="Keepers" value={3} color="bg-violet-500" />
            <BarRow label="Burn" value={1} color="bg-orange-500" />
            <BarRow label="Suits" value={0.5} color="bg-amber-500" />
          </div>
          <p className="mt-3 text-xs text-zinc-500">100% of network fees · no inflation · 1% burned</p>
        </div>
        <LiveEventFeed initial={EVENTS} />
      </div>
    </div>
  );
}

function BarRow({ label, value, color }: { label: string; value: number; color: string }) {
  const max = 90;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-zinc-300">{label}</span>
        <span className="tabular-nums text-zinc-400">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}
