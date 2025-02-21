import { LiveGame } from "@/models/LiveGame";
import { UserProfile } from "@/models/UserProfile";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="grid grid-cols-3 gap-2 w-[300px] h-[300px]">
      {board.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className="flex items-center justify-center border rounded-md bg-background h-24 w-24 text-4xl font-bold"
          >
            {cell}
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

  useEffect(() => {
    async function fetchData() {
      //const data = await fetch(`/api/v1/liveGameByUserId/${userProfile?.uuid}`);
      //const gamestmp: LiveGame[] = await data.json();
      //setGames(gamestmp.filter((f) => f.finished));
      setGames([
        {
          uuid: "testuuid",
          board: [
            ["X", "O", "X"],
            ["O", "X", "O"],
            ["X", "O", "X"],
          ],
          matchmakingTyps: "ranked",
          playerX: {
            uuid: "testuuid",
            createdAt: new Date(),
            username: "J1R4",
            email: "test",
            elo: 1251,
            wins: 34,
            draws: 5,
            losses: 22,
            nameColor: "#AB2E58",
          },
          playerO: {
            uuid: "testuuid",
            createdAt: new Date(),
            username: "J1R4",
            email: "test",
            elo: 1251,
            wins: 34,
            draws: 5,
            losses: 22,
            nameColor: "#AB2E58",
          },
          playerXTime: 10,
          playerOTime: 10,
          playerOEloBefore: 1251,
          playerOEloAfter: 1251,
          playerXEloBefore: 1251,
          playerXEloAfter: 1251,
          finished: true,
          createdAt: new Date(),
        },
      ]);
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
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {games.map((game) => (
        <Card
          key={game.uuid}
          onClick={() => handleGameClick(game)}
          className="p-4 cursor-pointer hover:bg-accent transition-colors"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold">
                {userProfile?.uuid === game.playerX.uuid
                  ? game.playerO.username
                  : game.playerX.username}
              </span>
              <span className="ml-2 text-muted-foreground">
                (ELO:{" "}
                {userProfile?.uuid === game.playerX.uuid
                  ? game.playerOEloBefore
                  : game.playerXEloBefore}
                )
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(game.createdAt.toString())}
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedGame && (
            <>
              <DialogHeader className="flex justify-between mb-6">
                <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="text-center">
                    <div className="font-bold">
                      {userProfile?.username}
                      <span className="text-sm ml-2">
                        {getEloDifference(
                          userProfile?.uuid === selectedGame.playerX.uuid
                            ? selectedGame.playerXEloBefore
                            : selectedGame.playerOEloBefore,
                          userProfile?.uuid === selectedGame.playerX.uuid
                            ? selectedGame.playerXEloAfter
                            : selectedGame.playerOEloAfter
                        )}
                      </span>
                    </div>
                    <div className="text-lg">
                      {userProfile?.uuid === selectedGame.playerX.uuid
                        ? "X"
                        : "O"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time:{" "}
                      {userProfile?.uuid === selectedGame.playerX.uuid
                        ? selectedGame.playerXTime
                        : selectedGame.playerOTime}
                      s
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">
                      {userProfile?.uuid === selectedGame.playerX.uuid
                        ? selectedGame.playerO.username
                        : selectedGame.playerX.username}
                      <span className="text-sm ml-2">
                        {getEloDifference(
                          userProfile?.uuid === selectedGame.playerX.uuid
                            ? selectedGame.playerOEloBefore
                            : selectedGame.playerXEloBefore,
                          userProfile?.uuid === selectedGame.playerX.uuid
                            ? selectedGame.playerOEloAfter
                            : selectedGame.playerXEloAfter
                        )}
                      </span>
                    </div>
                    <div className="text-lg">
                      {userProfile?.uuid === selectedGame.playerX.uuid
                        ? "O"
                        : "X"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time:{" "}
                      {userProfile?.uuid === selectedGame.playerX.uuid
                        ? selectedGame.playerOTime
                        : selectedGame.playerXTime}
                      s
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
