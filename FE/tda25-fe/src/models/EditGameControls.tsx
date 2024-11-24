import { language } from "@/lib/utils";
import { Game } from "./Game";

export interface EditGameControlProps {
  language: language;
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
  vertical: boolean;
  game: Game;
}
