import { language } from "@/lib/utils";
import { Game } from "@/models/Game";
import { AnimationControls } from "framer-motion";

export interface GameLayoutProps {
  game: Game;
  winner: string | null;
  currentPlayer: "X" | "O";
  winLane: number[][];
  language: language;
  handleClick: (rowIndex: number, colIndex: number) => void;
  controls: AnimationControls;
}

export interface GameLayoutPropsDesktop {
  game: Game;
  winner: string | null;
  currentPlayer: "X" | "O";
  winLane: number[][];
  language: language;
  handleClick: (rowIndex: number, colIndex: number) => void;
  controls: AnimationControls;
  isNewGame: boolean;
  isSaveDialogOpen: boolean;
  setIsSaveDialogOpen: (open: boolean) => void;
  dialogNewGameFromExisting: boolean;
  setDialogNewGameFromExisting: (open: boolean) => void;
  setGameName: (name: string) => void;
  setDifficulty: (
    difficulty: "beginner" | "easy" | "medium" | "hard" | "extreme"
  ) => void;
  startNewGame: () => void;
  saveUpdateGame: () => void;
  deleteGame: () => void;
}
