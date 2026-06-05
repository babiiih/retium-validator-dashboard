import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
      {(sub || trend) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {trend && (
            <span className={trend.positive ? "text-emerald-400" : "text-red-400"}>
              {trend.positive ? "▲" : "▼"} {trend.value}
            </span>
          )}
          {sub && <span className="text-zinc-500">{sub}</span>}
        </div>
      )}
    </div>
  );
}
