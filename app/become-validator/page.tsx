import { MIN_STAKE, ROLE_DESCRIPTION, REWARD_SHARE } from "@/lib/constants";
import { ArrowRight, Download, Cpu, ShieldCheck, Coins } from "lucide-react";
import { RoleBadge } from "@/components/RoleBadge";
import Link from "next/link";

export default function BecomeValidator() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Become a Validator</h1>
        <p className="text-sm text-zinc-500">
          Join the Retium mesh. Earn from real network fees. No inflation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {(["KEEPER", "SUIT", "WORKER"] as const).map((role) => (
          <div key={role} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <RoleBadge role={role} size="md" />
            <p className="mt-2 min-h-[3rem] text-xs text-zinc-500">{ROLE_DESCRIPTION[role]}</p>
            <div className="mt-3 space-y-1.5 border-t border-zinc-800 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Min stake</span>
                <span className="font-semibold tabular-nums">
                  {(MIN_STAKE[role] / 1000).toLocaleString()}K RTM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Reward share</span>
                <span className="font-semibold tabular-nums">{REWARD_SHARE[role]}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold">Setup Steps</h3>
        </div>
        <ol className="divide-y divide-zinc-800/60">
          {[
            {
              icon: Coins,
              title: "Stake RTM",
              desc: `Lock your tokens for the role of your choice. Min ${
                (MIN_STAKE.WORKER / 1000).toLocaleString()
              }K RTM (Worker).`,
            },
            {
              icon: Download,
              title: "Download Validator Pack",
              desc: "Official binary + config bundle. Includes desktop app for easy management.",
            },
            {
              icon: Cpu,
              title: "Run Node",
              desc: "Binary self-verifies Ed25519 signature on startup. Hardware requirements scale with role.",
            },
            {
              icon: ShieldCheck,
              title: "Begin Validation",
              desc: "Start earning from real network fees. Slashing applies to misbehavior.",
            },
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-4 px-4 py-3.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-800 text-sm font-semibold text-zinc-300">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-xs text-zinc-500">{s.desc}</div>
              </div>
              <s.icon className="mt-1 h-4 w-4 text-zinc-600" />
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div>
          <div className="text-sm font-medium">Ready to go deeper?</div>
          <div className="text-xs text-zinc-500">
            Read the full whitepaper, validator specs, and slashing rules.
          </div>
        </div>
        <Link
          href="https://docs.retium.org/whitepaper"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200"
        >
          Read Whitepaper <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
