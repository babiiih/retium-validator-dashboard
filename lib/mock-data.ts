import type { Validator, NetworkStats, NetworkEvent, Rotation } from "./types";

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(2026);
const hex = "abcdef0123456789";

function pseudoAddr(seed: number): string {
  let s = "retee";
  let n = seed * 7919;
  for (let i = 0; i < 56; i++) {
    s += hex[(n * (i + 1) * 13 + i * 7) % 16];
  }
  return s;
}

const REGIONS = ["EU-WEST", "US-EAST", "ASIA-SE", "ASIA-NE", "SA-EAST", "OCE", "AF-N"];

export const VALIDATORS: Validator[] = Array.from({ length: 36 }, (_, i) => {
  const role = i < 6 ? "KEEPER" : i < 30 ? "WORKER" : "SUIT";
  const minStake = role === "KEEPER" ? 1_000_000 : role === "SUIT" ? 100_000 : 10_000;
  const stakeMultiplier = 1 + rand() * (role === "KEEPER" ? 2.5 : 5);
  const status: Validator["status"] =
    i === 7 ? "offline" : i === 22 ? "jailed" : i === 31 ? "slashing" : "active";
  return {
    address: pseudoAddr(i + 1),
    role,
    stake: Math.floor(minStake * stakeMultiplier),
    status,
    uptime: status === "active" ? 95 + rand() * 5 : status === "offline" ? 30 + rand() * 20 : 60 + rand() * 30,
    score:
      status === "slashing" ? Math.floor(20 + rand() * 30) :
      status === "offline" ? Math.floor(40 + rand() * 30) :
      Math.floor(75 + rand() * 25),
    joinedAt: new Date(Date.now() - (30 + i * 5) * 24 * 3600 * 1000).toISOString(),
    lastSeen: new Date(
      Date.now() - (status === "offline" ? 600_000 : Math.floor(rand() * 30_000))
    ).toISOString(),
    blocksProduced:
      role === "KEEPER" ? Math.floor(800 + rand() * 5000) :
      role === "SUIT" ? Math.floor(200 + rand() * 1500) : 0,
    txValidated:
      role === "WORKER" ? Math.floor(10_000 + rand() * 200_000) :
      Math.floor(rand() * 2_000),
    rewardsEarned: Math.floor(
      (role === "WORKER" ? 8_000 : role === "KEEPER" ? 30_000 : 2_000) * (0.5 + rand() * 1.5)
    ),
    slashingCount: status === "slashing" ? 2 : status === "jailed" ? 1 : 0,
    region: REGIONS[i % REGIONS.length],
  };
});

export const NETWORK_STATS: NetworkStats = {
  currentTick: 47,
  blockHeight: 184_291,
  tps: 1247,
  totalValidators: 3_842,
  activeByRole: { KEEPER: 142, WORKER: 3_512, SUIT: 188 },
  totalStake: 128_400_000,
  burn30d: 12_847,
  uptime: 99.74,
};

const EVENT_TYPES: NetworkEvent["type"][] = [
  "BLOCK_HARDFINAL", "BLOCK_SEALED", "QUORUM_ASSIGNED",
  "TICK_ADVANCE", "VALIDATOR_JOINED", "SLASHING",
];

export const EVENTS: NetworkEvent[] = Array.from({ length: 30 }, (_, i) => {
  const type = EVENT_TYPES[i % EVENT_TYPES.length];
  return {
    id: `evt-${i}`,
    type,
    tick: 47 - Math.floor(i / 5),
    blockId: type.includes("BLOCK") ? 184_291 - i : undefined,
    address:
      type === "VALIDATOR_JOINED" || type === "SLASHING" ? pseudoAddr(i + 100) : undefined,
    amount: type === "SLASHING" ? 2_400 : undefined,
    reason: type === "SLASHING" ? "downtime" : undefined,
    timestamp: new Date(Date.now() - i * 47_000).toISOString(),
  };
});

export const TPS_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  tps: 900 + Math.floor(rand() * 600),
  blocks: 120 + Math.floor(rand() * 80),
}));

export const REWARD_HISTORY = (addr: string) => {
  const base = VALIDATORS.find((v) => v.address === addr);
  const roleMul = base?.role === "KEEPER" ? 80 : base?.role === "SUIT" ? 25 : 35;
  return Array.from({ length: 30 }, (_, i) => ({
    day: `D-${30 - i}`,
    reward: Math.floor(roleMul + rand() * roleMul * 0.6),
  }));
};

export const ROTATIONS: Rotation[] = Array.from({ length: 8 }, (_, i) => {
  const tick = 47 - i;
  const workers = VALIDATORS.filter((v) => v.role === "WORKER")
    .slice(i, i + 5)
    .map((v) => v.address);
  const suits = VALIDATORS.filter((v) => v.role === "SUIT")
    .slice(i, i + 5)
    .map((v) => v.address);
  const keeper = VALIDATORS.filter((v) => v.role === "KEEPER")[i % 6].address;
  const status: Rotation["status"] =
    i === 0 ? "PENDING" :
    i < 3 ? "SEALED" :
    i < 6 ? "SOFTFINAL" : "HARDFINAL";
  return {
    tick,
    quorumId: `qrm-${tick}-${i}`,
    workers,
    suits,
    keeper,
    blockId: 184_291 - i * 12,
    status,
  };
});

export function getValidator(address: string) {
  return VALIDATORS.find((v) => v.address === address);
}
