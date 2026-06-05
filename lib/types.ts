export type Role = "KEEPER" | "WORKER" | "SUIT";
export type Status = "active" | "offline" | "jailed" | "slashing";

export type Validator = {
  address: string;
  role: Role;
  stake: number;
  status: Status;
  uptime: number;
  score: number;
  joinedAt: string;
  lastSeen: string;
  blocksProduced: number;
  txValidated: number;
  rewardsEarned: number;
  slashingCount: number;
  region: string;
};

export type NetworkStats = {
  currentTick: number;
  blockHeight: number;
  tps: number;
  totalValidators: number;
  activeByRole: Record<Role, number>;
  totalStake: number;
  burn30d: number;
  uptime: number;
};

export type EventType =
  | "BLOCK_SEALED"
  | "BLOCK_HARDFINAL"
  | "VALIDATOR_JOINED"
  | "VALIDATOR_LEFT"
  | "SLASHING"
  | "TICK_ADVANCE"
  | "QUORUM_ASSIGNED";

export type NetworkEvent = {
  id: string;
  type: EventType;
  tick: number;
  blockId?: number;
  address?: string;
  amount?: number;
  reason?: string;
  timestamp: string;
};

export type RotationStatus = "PENDING" | "SEALED" | "SOFTFINAL" | "HARDFINAL" | "REJECTED";

export type Rotation = {
  tick: number;
  quorumId: string;
  workers: string[];
  suits: string[];
  keeper: string;
  blockId: number;
  status: RotationStatus;
};
