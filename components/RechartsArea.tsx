"use client";
import dynamic from "next/dynamic";

const Inner = dynamic(
  () => import("./RechartsAreaInner").then((m) => m.RechartsAreaInner),
  {
    ssr: false,
    loading: () => <div className="h-64 animate-pulse rounded-lg bg-zinc-900/50" />,
  }
);

export function RechartsArea(props: React.ComponentProps<typeof Inner>) {
  return <Inner {...props} />;
}
