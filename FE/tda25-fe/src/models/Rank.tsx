export type Rank = {
  name: string;
  minElo: number;
  maxElo: number;
  color: string; // HEX
};

export const RANKS: Rank[] = [
  { name: "UNRANKED", minElo: 0, maxElo: 0, color: "#6B7280" },
  { name: "IRON", minElo: 1, maxElo: 299, color: "#8B8C89" },
  { name: "BRONZE", minElo: 300, maxElo: 599, color: "#b06d2a" },
  { name: "SILVER", minElo: 600, maxElo: 899, color: "#C0C0C0" },
  { name: "GOLD", minElo: 900, maxElo: 1199, color: "#cbaf18" },
  { name: "PLATINUM", minElo: 1200, maxElo: 1499, color: "#57b89f" },
  { name: "DIAMOND", minElo: 1500, maxElo: 1799, color: "#328bc5" },
  { name: "MASTER", minElo: 1800, maxElo: 1999, color: "#FF4069" },
  { name: "GRANDMASTER", minElo: 2000, maxElo: Infinity, color: "#ca1c6b" },
];

export function getRankByElo(elo: number): Rank {
  if (elo === 0) return RANKS[0]; // UNRANKED
  return (
    RANKS.find((rank) => elo >= rank.minElo && elo <= rank.maxElo) || RANKS[1]
  );
}

export function getNextRank(currentElo: number): Rank | null {
  const currentRank = getRankByElo(currentElo);
  const nextRankIndex = RANKS.indexOf(currentRank) + 1;
  return nextRankIndex < RANKS.length ? RANKS[nextRankIndex] : null;
}

export function getProgressToNextRank(currentElo: number): number {
  const currentRank = getRankByElo(currentElo);
  const nextRank = getNextRank(currentElo);
  if (!nextRank) return 100;
  const totalRange = nextRank.minElo - currentRank.minElo;
  const progress = currentElo - currentRank.minElo;
  return Math.min(Math.round((progress / totalRange) * 100), 100);
}
