export type GameCreateUpdate = {
  name: string;
  difficulty: "beginner" | "easy" | "medium" | "hard" | "extreme";
  board: Array<Array<"X" | "O" | "">>;
};
