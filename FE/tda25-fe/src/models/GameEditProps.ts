import { language } from "@/lib/utils";
import { Game } from "./Game";
import { AnimationControls } from "framer-motion";

export interface GameEditProps {
  game: Game;
  language: language;
  handleClick: (rowIndex: number, colIndex: number) => void;
  controls: AnimationControls;
  isSaveDialogOpen: boolean;
  setIsSaveDialogOpen: (open: boolean) => void;
  saveNew: "new" | "update";
  updateSaveNew: (savenew: "new" | "update") => void;
  setGameName: (name: string) => void;
  setDifficulty: (
    difficulty: "beginner" | "easy" | "medium" | "hard" | "extreme"
  ) => void;
  saveGameNewOrUpdate: () => void;
  deleteGame: () => void;
  currentPlayer: "X" | "O" | "";
  setCurrentPlayer: () => void;
}

export interface GameEditPropsMobile {
  game: Game;
  language: language;
  handleClick: (rowIndex: number, colIndex: number) => void;
  controls: AnimationControls;
  currentPlayer: "X" | "O" | "";
  setCurrentPlayer: () => void;
}
