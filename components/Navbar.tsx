import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-white text-zinc-900 text-xs font-bold">
            R
          </div>
          <span>
            Retium<span className="text-zinc-500"> / Validators</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            Overview
          </Link>
          <Link
            href="/validators"
            className="rounded-md px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            Validators
          </Link>
          <Link
            href="/become-validator"
            className="rounded-md px-3 py-1.5 text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            Become Validator
          </Link>
          <span className="ml-3 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Testnet
          </span>
        </nav>
      </div>
    </header>
  );
}
