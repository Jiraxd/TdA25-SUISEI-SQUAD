import { EditGameControlProps } from "@/models/EditGameControls";
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
import { TranslateText } from "@/lib/utils";
import { Game } from "@/models/Game";
import { ChangeEvent } from "react";

export function EditControls({
  language,
  saveGameNewOrUpdate,
  saveNew,
  setDifficulty,
  setGameName,
  deleteGame,
  isSaveDialogOpen,
  setIsSaveDialogOpen,
  vertical,
  game,
  updateSaveNew,
}: EditGameControlProps) {
  return (
    <div
      className={`flex ${
        vertical ? "flex-col space-y-4" : "flex-row space-x-4"
      } p-4`}
    >
      <Dialog
        open={isSaveDialogOpen}
        onOpenChange={() => {
          setIsSaveDialogOpen(!isSaveDialogOpen);
        }}
      >
        <DialogTrigger asChild>
          <div
            className={`flex ${
              vertical ? "flex-col space-y-4" : "flex-row space-x-4"
            }`}
          >
            <Button onClick={() => updateSaveNew("update")}>
              {TranslateText("UPDATE_GAME", language)}
            </Button>
            <Button onClick={() => updateSaveNew("new")}>
              {TranslateText("SAVE_GAME_NEW", language)}
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
              {saveNew === "new"
                ? TranslateText("SAVE_GAME_NEW", language)
                : TranslateText("UPDATE_GAME", language)}
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
              onClick={saveGameNewOrUpdate}
            >
              {saveNew === "new"
                ? TranslateText("SAVE_GAME_NEW", language)
                : TranslateText("UPDATE_GAME", language)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        style={{ backgroundColor: "var(--defaultred)" }}
        onClick={deleteGame}
      >
        {TranslateText("DELETE_GAME", language)}
      </Button>
    </div>
  );
}
