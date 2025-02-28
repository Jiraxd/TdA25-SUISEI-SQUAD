import { LiveGame } from "@/models/LiveGame";
import { UserProfile } from "@/models/UserProfile";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {
  checkWinner,
  formatDate,
  formatTime,
  TranslateText,
} from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cs, enUS } from "date-fns/locale";

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
  const { winningLine } = checkWinner(board);
  return (
    <div
      className="grid grid-cols-15 border-2"
      style={{
        backgroundColor: "var(--darkshade)",
        borderColor: "var(--darkshade)",
        width: "min(90vw, 600px)",
        height: "min(90vw, 600px)",
        aspectRatio: "1 / 1",
      }}
    >
      {board.map((row, i) =>
        row.map((cell, j) => (
          <div
            key={`${i}-${j}`}
            className={`aspect-square flex items-center justify-center text-base sm:text-xl md:text-2xl lg:text-3xl font-bold`}
            style={{
              backgroundColor: winningLine.some(([r, c]) => r === i && c === j)
                ? "#22c55e"
                : "var(--whitelessbright)",
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
  const [allGames, setAllGames] = useState<LiveGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<LiveGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<LiveGame | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await fetch(
          `/api/v1/liveGameByUserId/${userProfile?.uuid}`
        );
        const gamestmp: LiveGame[] = await data.json();

        const finishedGames = gamestmp
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .filter((f) => f.finished);

        setAllGames(finishedGames);
        setFilteredGames(finishedGames);
      } catch (error) {
        console.error("Failed to fetch game history:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (userProfile?.uuid) {
      fetchData();
    }
  }, [userProfile]);

  useEffect(() => {
    let result = [...allGames];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((game) => {
        const opponent =
          userProfile?.uuid === game.playerX.uuid ? game.playerO : game.playerX;

        return opponent.username.toLowerCase().includes(lowerSearchTerm);
      });
    }

    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      result = result.filter((game) => {
        const gameDate = new Date(game.createdAt);
        return format(gameDate, "yyyy-MM-dd") === dateString;
      });
    }

    setFilteredGames(result);
    setCurrentPage(1);
  }, [searchTerm, selectedDate, allGames, userProfile]);

  const handleGameClick = (game: LiveGame) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const getEloDifference = (beforeElo: number, afterElo: number) => {
    const diff = afterElo - beforeElo;
    const textColor = diff >= 0 ? "text-green-600" : "text-red-600";
    return (
      <span className={textColor}>
        {diff >= 0 ? `(+${diff})` : `(${diff})`}
      </span>
    );
  };

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDate(undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <div className="flex-1 relative">
          <Input
            placeholder={TranslateText("SEARCH_OPPONENT", language)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 border-2 border-darkshade text-gray-500"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-600" />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left border-2 border-darkshade",
                !selectedDate && "text-gray-600"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? selectedDate.toLocaleDateString("cs-CZ")
                : TranslateText("SELECT_DATE", language)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border border-darkshade">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={language === "CZ" ? cs : enUS}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          onClick={resetFilters}
          className="border-2 border-darkshade"
        >
          {TranslateText("CLEAR_FILTERS", language)}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card
              key={i}
              className="p-4 animate-pulse border-2 border-darkshade h-20"
            >
              <div className="bg-gray-300 h-4 w-3/4 mb-2 rounded"></div>
              <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
            </Card>
          ))}
        </div>
      ) : currentGames.length === 0 ? (
        <div className="text-center py-8 text-darkshade">
          {searchTerm || selectedDate
            ? TranslateText("NO_GAMES_FOUND_FILTERED", language)
            : TranslateText("NO_GAMES_FOUND", language)}
        </div>
      ) : (
        currentGames.map((game) => {
          let gameResult: "X" | "O" | "Draw";

          if (
            game.playerXEloAfter === game.playerXEloBefore &&
            game.playerOEloAfter === game.playerOEloBefore
          ) {
            gameResult = "Draw";
          } else if (
            game.playerXEloAfter > game.playerXEloBefore ||
            game.playerOEloAfter < game.playerOEloBefore
          ) {
            gameResult = "X";
          } else {
            gameResult = "O";
          }

          const playerSymbol =
            userProfile?.uuid === game.playerX.uuid ? "X" : "O";

          return (
            <Card
              key={game.uuid}
              onClick={() => handleGameClick(game)}
              className="p-4 cursor-pointer transition-colors border-2 border-darkshade hover:bg-gray-200"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-darkshade">
                  <div className="font-dosis-medium">
                    <a
                      href={`/profile/${
                        userProfile?.uuid === game.playerX.uuid
                          ? game.playerO.uuid
                          : game.playerX.uuid
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-dosis-bold text-xl hover:underline hover:text-defaultblue transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {userProfile?.uuid === game.playerX.uuid
                        ? game.playerO.username
                        : game.playerX.username}
                    </a>
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
                <div className="flex justify-between items-center text-sm text-gray-500 font-dosis-medium">
                  <div>
                    {gameResult === "Draw"
                      ? TranslateText("GAME_RESULT_DRAW", language)
                      : gameResult === playerSymbol
                      ? TranslateText("GAME_RESULT_WIN", language)
                      : TranslateText("GAME_RESULT_LOSS", language)}
                  </div>
                  <div>{TranslateText("CLICK_TO_VIEW_GAME", language)}</div>
                </div>
              </div>
            </Card>
          );
        })
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="bg-white text-darkshade border-darkshade"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white text-darkshade border-darkshade"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="mx-2 text-darkshade">
            {TranslateText("PAGE", language)} {currentPage}{" "}
            {TranslateText("OF", language)} {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white text-darkshade border-darkshade"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-white text-darkshade border-darkshade"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[800px] bg-white border-2 text-black border-darkshade shadow-darkshade shadow-md">
          {selectedGame &&
            (() => {
              let gameResult: "X" | "O" | "Draw";

              if (
                selectedGame.playerXEloAfter ===
                  selectedGame.playerXEloBefore &&
                selectedGame.playerOEloAfter === selectedGame.playerOEloBefore
              ) {
                gameResult = "Draw";
              } else if (
                selectedGame.playerXEloAfter > selectedGame.playerXEloBefore ||
                selectedGame.playerOEloAfter < selectedGame.playerOEloBefore
              ) {
                gameResult = "X";
              } else {
                gameResult = "O";
              }

              return (
                <>
                  <DialogTitle></DialogTitle>
                  <DialogHeader className="flex justify-between mb-6 border-b border-darkshade pb-4">
                    <div className="grid grid-cols-2 gap-8 w-full text-darkshade">
                      <div className="text-center">
                        <div
                          className="font-dosis-bold text-xl"
                          style={{ color: selectedGame.playerX.nameColor }}
                        >
                          <a
                            href={`/profile/${selectedGame.playerX.uuid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline transition-colors"
                            style={{ color: selectedGame.playerX.nameColor }}
                          >
                            {selectedGame.playerX.username}
                          </a>
                          <span className="text-lg ml-2 font-dosis-medium">
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
                          {": "} {formatTime(selectedGame.playerXTime)}
                        </div>
                      </div>

                      <div className="text-center">
                        <div
                          className="font-dosis-bold text-xl"
                          style={{ color: selectedGame.playerO.nameColor }}
                        >
                          <a
                            href={`/profile/${selectedGame.playerO.uuid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline transition-colors"
                            style={{ color: selectedGame.playerO.nameColor }}
                          >
                            {selectedGame.playerO.username}
                          </a>
                          <span className="text-lg ml-2 font-dosis-medium">
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
                          {formatTime(selectedGame.playerOTime)}
                        </div>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <GameBoard board={selectedGame.board} disabled={true} />
                  </div>
                  <p className="text-center font-dosis-medium mt-4 text-darkshade">
                    {format(new Date(selectedGame.createdAt), "PPP")} -{" "}
                    {gameResult === "Draw"
                      ? TranslateText("GAME_ENDED_IN_DRAW", language)
                      : TranslateText("WINNER", language) +
                        ": " +
                        (gameResult === "X"
                          ? selectedGame.playerX.username
                          : selectedGame.playerO.username)}
                  </p>
                </>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
