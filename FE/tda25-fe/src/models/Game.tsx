export type Game = {
  uuid: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  name: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "extreme";
  gameState: "opening" | "midgame" | "endgame" | "unknown";
  board: Array<Array<"X" | "O" | "">>;
};
