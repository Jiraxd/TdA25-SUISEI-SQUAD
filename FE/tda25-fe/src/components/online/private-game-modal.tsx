import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { language, TranslateText } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { useAlertContext } from "../alertContext";

interface PrivateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: language;
}

export function PrivateGameModal({
  isOpen,
  onClose,
  language,
}: PrivateGameModalProps) {
  const [symbol, setSymbol] = useState<"X" | "O">("X");
  const [timeLimit, setTimeLimit] = useState<
    "5" | "8" | "10" | "custom" | "none"
  >("8");
  const [customMinutes, setCustomMinutes] = useState("5");
  const [customSeconds, setCustomSeconds] = useState("0");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { updateErrorMessage } = useAlertContext();
  const handleCreateGame = async () => {
    const totalSeconds =
      timeLimit === "custom"
        ? parseInt(customMinutes) * 60 + parseInt(customSeconds)
        : parseInt(timeLimit) * 60;

    const response = await fetch("/api/v1/onlineGame/create-private", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        timeLimit: totalSeconds,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setGeneratedLink(`${window.location.origin}/onlineGame/${data.gameId}`);
    } else {
      updateErrorMessage(TranslateText("SOMETHING_WENT_WRONG", language));
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="bg-white border-2 border-darkshade shadow-darkshade shadow-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex justify-between items-center border-b border-darkshade pb-4">
            <DialogTitle className="text-2xl font-dosis-bold text-defaultred">
              {TranslateText("CREATE_PRIVATE_GAME", language)}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 text-darkshade">
          <div className="space-y-4 border border-darkshade p-4 rounded-md">
            <Label className="text-lg font-dosis-bold text-darkshade">
              {TranslateText("CHOOSE_SYMBOL", language)}
            </Label>
            <RadioGroup
              defaultValue={symbol}
              onValueChange={(value) => setSymbol(value as "X" | "O")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 text-darkshade">
                <RadioGroupItem
                  value="X"
                  id="X"
                  className="h-5 w-5 border-2 border-darkshade text-darkshade data-[state=checked]:bg-defaultred data-[state=checked]:border-defaultred [&_span]:hidden"
                />
                <Label htmlFor="X" className="text-lg cursor-pointer">
                  X
                </Label>
              </div>
              <div className="flex items-center space-x-2 text-darkshade">
                <RadioGroupItem
                  value="O"
                  id="O"
                  className="h-5 w-5 border-2 border-darkshade text-darkshade data-[state=checked]:bg-defaultred data-[state=checked]:border-defaultred [&_span]:hidden"
                />
                <Label htmlFor="O" className="text-lg cursor-pointer">
                  O
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4 border border-darkshade p-4 rounded-md">
            <Label className="text-lg font-dosis-bold text-darkshade">
              {TranslateText("CHOOSE_TIME_LIMIT", language)}
            </Label>
            <RadioGroup
              defaultValue={timeLimit}
              onValueChange={(value) =>
                setTimeLimit(value as "5" | "8" | "10" | "custom")
              }
              className="flex flex-col gap-4"
            >
              <div key={"none"} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={"none"}
                  id={`none`}
                  className="h-5 w-5 border-2 border-darkshade text-darkshade data-[state=checked]:bg-defaultred data-[state=checked]:border-defaultred [&_span]:hidden"
                />
                <Label htmlFor={`none`} className="text-lg cursor-pointer">
                  {TranslateText("NO_TIME_LIMIT", language)}
                </Label>
              </div>
              {[5, 8, 10].map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={time.toString()}
                    id={`${time}min`}
                    className="h-5 w-5 border-2 border-darkshade text-darkshade data-[state=checked]:bg-defaultred data-[state=checked]:border-defaultred [&_span]:hidden"
                  />
                  <Label
                    htmlFor={`${time}min`}
                    className="text-lg cursor-pointer"
                  >
                    {time} {TranslateText("MINUTES", language)}
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="h-5 w-5 border-2 border-darkshade text-darkshade data-[state=checked]:bg-defaultred data-[state=checked]:border-defaultred [&_span]:hidden"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className={`w-16 p-1 border border-darkshade rounded-md text-center ${
                      timeLimit === "custom" ? "" : "opacity-50"
                    }`}
                    disabled={timeLimit !== "custom"}
                  />
                  <span className="text-lg">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={customSeconds}
                    onChange={(e) => setCustomSeconds(e.target.value)}
                    className={`w-16 p-1 border border-darkshade rounded-md text-center ${
                      timeLimit === "custom" ? "" : "opacity-50"
                    }`}
                    disabled={timeLimit !== "custom"}
                  />
                </div>
              </div>
            </RadioGroup>
          </div>

          {!generatedLink ? (
            <Button
              onClick={handleCreateGame}
              className="w-full bg-defaultblue hover:bg-darkerblue text-white font-dosis-bold text-lg"
            >
              {TranslateText("GENERATE_LINK", language)}
            </Button>
          ) : (
            <div className="space-y-2 border border-darkshade p-4 rounded-md">
              <Label className="text-lg font-dosis-bold text-darkshade">
                {TranslateText("GAME_LINK", language)}
              </Label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={generatedLink}
                  className="flex-1 p-2 border border-darkshade rounded-md text-darkshade bg-white"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                  }}
                  className="bg-defaultblue hover:bg-darkerblue text-white font-dosis-bold"
                >
                  {TranslateText("COPY", language)}
                </Button>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="default"
          className="bg-defaultred text-lg hover:bg-red-700 text-white font-dosis-bold"
          onClick={onClose}
        >
          {TranslateText("CLOSE", language)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
