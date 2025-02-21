import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "../languageContext";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { getRankByElo } from "@/models/Rank";
import { useAlertContext } from "../alertContext";

export interface GameFoundProps {
  isOpen: boolean;
  opponent: {
    username: string;
    elo: number;
    avatar: string;
    nameColor: string;
  };
  onAccept: () => void;
  onDecline: () => void;
  timeoutSeconds?: number;
}

export function GameFound({
  isOpen,
  opponent,
  onAccept,
  onDecline,
  timeoutSeconds = 30,
}: GameFoundProps) {
  const { language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);
  const { updateErrorMessage } = useAlertContext();
  const [shouldTimeout, setShouldTimeout] = useState(false);

  useEffect(() => {
    if (shouldTimeout) {
      updateErrorMessage(TranslateText("MATCHMAKING_TIMEOUT", language));
      setShouldTimeout(false);
    }
  }, [shouldTimeout, language, updateErrorMessage]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(timeoutSeconds);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShouldTimeout(true);
          onDecline();
          return timeoutSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeoutSeconds, onDecline]);

  return (
    <Dialog open={isOpen} modal={true} onOpenChange={() => {}}>
      <DialogContent
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-md border-2 border-darkshade font-dosis-bold shadow-md shadow-darkshade [&>button]:hidden"
      >
        <DialogHeader>
          <DialogTitle className="text-defaultred text-2xl">
            {TranslateText("GAME_FOUND_TITLE", language)}
          </DialogTitle>
          <DialogDescription className="text-darkshade text-lg">
            {TranslateText("GAME_FOUND_DESCRIPTION", language)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-4 p-4 border border-darkshade ">
          <Avatar className="h-16 w-16">
            <AvatarImage src={opponent.avatar} alt={opponent.username} />
          </Avatar>
          <div className="flex-1">
            <div className="text-xl" style={{ color: opponent.nameColor }}>
              {opponent.username}
            </div>
            <p className="text-lg text-gray-600">ELO: {opponent.elo}</p>
            <p className="text-lg text-gray-600">
              {TranslateText("CURRENT_RANK", language)}:{" "}
              {getRankByElo(opponent.elo).name}
            </p>
          </div>
          <div className="flex items-center text-pink">
            <Timer className="mr-2" />
            <span className="font-dosis-medium">{timeLeft}s</span>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            className="bg-defaultblue hover:bg-darkerblue"
            onClick={onDecline}
          >
            {TranslateText("DECLINE", language)}
          </Button>
          <Button onClick={onAccept} className="bg-defaultred hover:bg-red-700">
            {TranslateText("ACCEPT", language)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
