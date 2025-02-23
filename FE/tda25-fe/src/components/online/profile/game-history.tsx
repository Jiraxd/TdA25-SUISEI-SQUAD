import { LiveGame } from "@/models/LiveGame";
import { UserProfile } from "@/models/UserProfile";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";

type GameHistoryProps = {
  userProfile: UserProfile | null;
};

function GameBoard({
  board,
  disabled,
}: {
  board: string[][];
  disabled: boolean;
}) {
  return (
    <div
      className="grid grid-cols-15 border-2"
      style={{
        backgroundColor: "var(--darkshade)",
        borderColor: "var(--darkshade)",
        width: "min(90vw, 60vh)",
        height: "min(90vw, 60vh)",
      }}
    >
      {board.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className="aspect-square flex items-center justify-center text-base sm:text-xl md:text-2xl lg:text-3xl font-bold"
            style={{
              backgroundColor: "var(--whitelessbright)",
              color: cell === "X" ? "var(--defaultred)" : "var(--defaultblue)",
              borderColor: "var(--darkshade)",
              borderWidth: "1px",
            }}
          >
            {cell === "X" ? (
              <img className="w-[80%] h-[80%]" src="/icons/X_cervene.svg" />
            ) : cell === "O" ? (
              <img className="w-[80%] h-[80%]" src="/icons/O_modre.svg" />
            ) : null}
          </div>
        ))
      )}
    </div>
  );
}

export default function GameHistory({ userProfile }: GameHistoryProps) {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      const data = await fetch(`/api/v1/liveGameByUserId/${userProfile?.uuid}`);
      const gamestmp: LiveGame[] = await data.json();
      setGames(gamestmp.filter((f) => f.finished));
    }
    fetchData();
  }, [userProfile]);

  const handleGameClick = (game: LiveGame) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const getEloDifference = (beforeElo: number, afterElo: number) => {
    const diff = afterElo - beforeElo;
    return diff >= 0 ? `(+${diff})` : `(${diff})`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("cz", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {games.map((game) => (
        <Card
          key={game.uuid}
          onClick={() => handleGameClick(game)}
          className="p-4 cursor-pointer transition-colors border-2 border-darkshade"
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-darkshade">
              <div className="font-dosis-medium">
                <span className="font-dosis-bold text-xl">
                  {userProfile?.uuid === game.playerX.uuid
                    ? game.playerO.username
                    : game.playerX.username}
                </span>
                <span className="ml-2 text-lg">
                  ({TranslateText("ELO_OPPONENT_DURING_GAME", language)}:{" "}
                  {userProfile?.uuid === game.playerX.uuid
                    ? game.playerOEloBefore
                    : game.playerXEloBefore}
                  )
                </span>
              </div>
              <div className="text-lg font-dosis-medium">
                {formatDate(game.createdAt.toString())}
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 font-dosis-medium">
              {TranslateText("CLICK_TO_VIEW_GAME", language)}
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-3xl bg-white border-2 text-black border-darkshade shadow-darkshade shadow-md">
          {selectedGame && (
            <>
              <DialogTitle></DialogTitle>
              <DialogHeader className="flex justify-between mb-6 border-b border-darkshade pb-4">
                <div className="grid grid-cols-2 gap-8 w-full text-darkshade">
                  <div className="text-center">
                    <div
                      className="font-dosis-bold text-xl"
                      style={{ color: selectedGame.playerX.nameColor }}
                    >
                      {selectedGame.playerX.username}
                      <span className="text-lg ml-2 font-dosis-medium text-black">
                        {getEloDifference(
                          selectedGame.playerXEloBefore,
                          selectedGame.playerXEloAfter
                        )}
                      </span>
                    </div>
                    <div className="text-xl font-dosis-bold flex justify-center">
                      <img
                        src="/icons/X_cervene.svg"
                        alt="X"
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="text-lg font-dosis-medium">
                      {TranslateText("TIME_REMAINING", language)}
                      {": "} {selectedGame.playerXTime}s
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className="font-dosis-bold text-xl"
                      style={{ color: selectedGame.playerO.nameColor }}
                    >
                      {selectedGame.playerO.username}
                      <span className="text-lg ml-2 font-dosis-medium text-black">
                        {getEloDifference(
                          selectedGame.playerOEloBefore,
                          selectedGame.playerOEloAfter
                        )}
                      </span>
                    </div>
                    <div className="text-xl font-dosis-bold flex justify-center">
                      <img
                        src="/icons/O_modre.svg"
                        alt="O"
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="text-lg font-dosis-medium">
                      {TranslateText("TIME_REMAINING", language)}
                      {": "}
                      {selectedGame.playerOTime}s
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex justify-center">
                <GameBoard board={selectedGame.board} disabled={true} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
