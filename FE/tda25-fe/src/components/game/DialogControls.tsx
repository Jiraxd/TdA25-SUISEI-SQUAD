import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { language, TranslateText } from "@/lib/utils";
import { Game } from "@/models/Game";
import { ChangeEvent } from "react";

interface GameControlsProps {
  isNewGame: boolean;
  isSaveDialogOpen: boolean;
  setIsSaveDialogOpen: (open: boolean) => void;
  game: Game | null;
  language: language;
  setGameName: (name: string) => void;
  setDifficulty: (difficulty: Game["difficulty"]) => void;
  startNewGame: () => void;
  saveGame: () => void;
  startNewGameFromExisting: () => void;
  vertical: boolean;
}

export function GameControls({
  isNewGame,
  isSaveDialogOpen,
  setIsSaveDialogOpen,
  game,
  language,
  setGameName,
  setDifficulty,
  startNewGame,
  startNewGameFromExisting,
  saveGame,
  vertical,
}: GameControlsProps) {
  return (
    <div
      className={`flex ${
        vertical ? "flex-col space-y-4" : "flex-row space-x-4"
      } p-4`}
    >
      <Button onClick={startNewGame}>
        {TranslateText("NEW_GAME", language)}
      </Button>
      {!isNewGame && (
        <Button onClick={startNewGameFromExisting}>
          {TranslateText("NEW_GAME_EXISTING", language)}
        </Button>
      )}
      <Dialog
        open={isSaveDialogOpen}
        onOpenChange={() => {
          setIsSaveDialogOpen(!isSaveDialogOpen);
        }}
      >
        <DialogTrigger asChild>
          <div className="flex flex-row space-x-4">
            <Button>
              {isNewGame
                ? TranslateText("SAVE_GAME", language)
                : TranslateText("SAVE_GAME_NEW", language)}
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent
          style={{
            backgroundColor: "var(--darkshade)",
            borderColor: "var(--purple)",
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {isNewGame
                ? TranslateText("SAVE_GAME", language)
                : TranslateText("SAVE_GAME_NEW", language)}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                {TranslateText("NAME", language)}
              </label>
              <Input
                id="name"
                value={game?.name ?? "Name"}
                style={{ borderColor: "var(--purple)" }}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGameName(e.target.value)
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="difficulty" className="text-right">
                {TranslateText("DIFFICULTY", language)}
              </label>
              <Select
                value={game?.difficulty ?? "Medium"}
                onValueChange={(value: Game["difficulty"]) =>
                  setDifficulty(value)
                }
              >
                <SelectTrigger
                  className="col-span-3"
                  style={{ borderColor: "var(--purple)" }}
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner" className="cursor-pointer">
                    {TranslateText("BEGINNER", language)}
                  </SelectItem>
                  <SelectItem value="easy" className="cursor-pointer">
                    {TranslateText("EASY", language)}
                  </SelectItem>
                  <SelectItem value="medium" className="cursor-pointer">
                    {TranslateText("MEDIUM", language)}
                  </SelectItem>
                  <SelectItem value="hard" className="cursor-pointer">
                    {TranslateText("HARD", language)}
                  </SelectItem>
                  <SelectItem value="extreme" className="cursor-pointer">
                    {TranslateText("EXTREME", language)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              style={{ backgroundColor: "var(--darkerblue)" }}
              onClick={saveGame}
            >
              {isNewGame
                ? TranslateText("SAVE_GAME", language)
                : TranslateText("SAVE_GAME_NEW", language)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
