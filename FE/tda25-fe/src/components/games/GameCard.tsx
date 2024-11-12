import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GamePreview } from "./GamePreview";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useRouter } from "next/navigation";
import { TranslateText } from "@/lib/utils";
import DifficultyDislay from "./DifficultyDisplay";
import { Game } from "@/models/Game";
import { useLanguage } from "../languageContext";

export function GameCard({ game }: { game: Game }) {
  const { language } = useLanguage();
  const router = useRouter();
  return (
    <Card
      className="flex flex-col h-full border-2 shadow-md hover:shadow-lg transition-shadow duration-300"
      style={{
        borderColor: "var(--defaultred)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg truncate">{game.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <GamePreview board={game.board} />
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center w-full gap-2 justify-center">
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger>
              <DifficultyDislay difficulty={game.difficulty} />
            </HoverCardTrigger>
            <HoverCardContent className="p-2 flex items-center justify-center whitespace-nowrap">
              {TranslateText(game.difficulty.toUpperCase(), language)}
            </HoverCardContent>
          </HoverCard>

          <Button
            className="w-full"
            style={{
              color: "var(--whitelessbright)",
              backgroundColor: "var(--darkerblue)",
            }}
            onClick={() => {
              router.push(`/game/${game.uuid}`);
            }}
          >
            {TranslateText("PLAY", language)}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
