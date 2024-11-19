"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Game } from "@/models/Game";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingCircle } from "@/components/loadingCircle";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import { GameCreateUpdate } from "@/models/GameCreateUpdate";
import { useErrorMessage } from "@/components/errorContext";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const isDev = process.env.NODE_ENV === "development";
  const pathName = usePathname();
  const gameId = pathName.split("/").pop();
  const [game, setGame] = useState<Game | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentPlayer, setPlayer] = useState<"X" | "O">("X");
  const controls = useAnimation();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [dialogNewGameFromExisting, setDialogNewGameFromExisting] =
    useState(false);
  const [isNewGame, setIsNewGame] = useState(true);
  const [winLane, setWinningLine] = useState<number[][]>([]);
  const emptyBoard = Array.from({ length: 15 }, () => Array(15).fill(""));
  const { updateErrorMessage } = useErrorMessage();
  const router = useRouter();

  const { language } = useLanguage();

  const fetchGame = async (id: string) => {
    try {
      const res = await fetch(
        isDev
          ? `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games/${id}`
          : `/api/v1/games/${id}`
      );
      const data: Game = await res.json();

      setGame(data);
    } catch (error) {
      console.log("Error message:" + error);
      updateErrorMessage(TranslateText("ERROR_FETCH", language));
    }
  };

  useEffect(() => {
    if (gameId && gameId !== "game") {
      fetchGame(gameId);
      setIsNewGame(false);
    } else {
      startNewGame();
    }
  }, [gameId]);

  function startNewGame() {
    setWinningLine([]);
    setPlayer("X");
    setWinner(null);

    setIsNewGame(true);

    setGame({
      uuid: "none",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: language === "EN" ? "Untitled Game" : "Neuložená hra",
      difficulty: "medium",
      gameState: "unknown",
      board: emptyBoard,
    });
  }

  function setGameName(gameName: string) {
    if (!game) {
      return;
    }

    setGame({
      ...game,
      name: gameName,
    });
  }

  function setDifficulty(
    dif: "beginner" | "easy" | "medium" | "hard" | "extreme"
  ) {
    if (!game) {
      return;
    }

    setGame({
      ...game,
      difficulty: dif,
    });
  }

  async function saveUpdateGame() {
    const gamePayload: GameCreateUpdate = {
      name: game?.name ?? "Name",
      difficulty: game?.difficulty ?? "medium",
      board: game?.board ?? emptyBoard,
    };
    if (dialogNewGameFromExisting || isNewGame) {
      const res = await fetch(
        isDev
          ? `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games`
          : `/api/v1/games`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gamePayload),
        }
      );
      if (res.ok) {
        const data: Game = await res.json();
        await router.push(`/game/${data.uuid}`);
      } else {
        updateErrorMessage(TranslateText("ERROR_SAVE", language));
      }
    } else {
      const res = await fetch(
        isDev
          ? `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games/${game?.uuid}`
          : `/api/v1/games/${game?.uuid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gamePayload),
        }
      );
      if (!res.ok) {
        updateErrorMessage(TranslateText("ERROR_UPDATE", language));
      }
    }
  }

  function deleteGame() {
    fetch(
      isDev
        ? `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games/${game?.uuid}`
        : `/api/v1/games/${game?.uuid}`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      if (res.ok) {
        router.push("/games");
      } else {
        updateErrorMessage(TranslateText("ERROR_DELETE", language));
      }
    });
  }
  function checkWinner(board: string[][]): {
    winner: boolean;
    winningLine: number[][];
  } {
    const lines = [
      // Horizontal lines
      ...board.map((row, rowIndex) =>
        row.map((_, colIndex) => [rowIndex, colIndex])
      ),
      // Vertical lines
      ...board[0].map((_, colIndex) =>
        board.map((_, rowIndex) => [rowIndex, colIndex])
      ),
      // Diagonal lines
      ...Array.from({ length: board.length * 2 - 1 }, (_, i) => {
        const diagonal1 = [];
        const diagonal2 = [];
        for (let j = 0; j <= i; j++) {
          const x1 = i - j;
          const y1 = j;
          const x2 = board.length - 1 - (i - j);
          const y2 = j;
          if (x1 < board.length && y1 < board.length) {
            diagonal1.push([x1, y1]);
          }
          if (x2 >= 0 && y2 < board.length) {
            diagonal2.push([x2, y2]);
          }
        }
        return [diagonal1, diagonal2];
      }).flat(),
    ];

    for (const line of lines) {
      for (let i = 0; i <= line.length - 5; i++) {
        const segment = line.slice(i, i + 5);
        const cells = segment.map(
          ([rowIndex, colIndex]) => board[rowIndex][colIndex]
        );
        if (
          cells.every((cell) => cell === "X") ||
          cells.every((cell) => cell === "O")
        ) {
          return { winner: true, winningLine: segment };
        }
      }
    }
    return { winner: false, winningLine: [] };
  }
  function handleClick(rowIndex: number, colIndex: number) {
    if (!game || game.board[rowIndex][colIndex] !== "" || winner) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[rowIndex][colIndex] = currentPlayer;
    setGame({
      ...game,
      board: newBoard,
    });

    const { winner: hasWinner, winningLine } = checkWinner(newBoard);
    if (hasWinner) {
      setWinner(currentPlayer);
      setWinningLine(winningLine);
      return;
    }

    setPlayer(currentPlayer === "X" ? "O" : "X");
  }

  return (
    <motion.div
      className="font-[family-name:var(--font-dosis-bold)] flex flex-col items-center justify-center pt-12"
      style={{ backgroundColor: "var(--whitelessbright)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {!game ? (
        <div>
          <LoadingCircle />
        </div>
      ) : (
        <>
          <h1
            className="text-4xl mb-4 text-center"
            style={{ color: "var(--darkshade)" }}
          >
            {game.name === "" ? "-" : game.name}
          </h1>
          {winner ? (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl mb-8 p-2 bg-green-500 text-white rounded-lg shadow-lg"
            >
              {TranslateText("WINNER", language) + winner + "!"}
            </motion.div>
          ) : (
            <div
              className="text-2xl mb-8 p-2"
              style={{
                color:
                  currentPlayer === "O"
                    ? "var(--defaultblue)"
                    : "var(--defaultred)",
              }}
            >
              {TranslateText("TURN", language) + currentPlayer}
            </div>
          )}
          <div className="flex flex-row justify-center w-full">
            <div className="text-center text-black w-1/6 mr-8 text-xl">
              <h2 className="text-4xl mb-2">
                {TranslateText("GAME_INFO", language)}
              </h2>
              <p>
                {TranslateText("STATE", language)}{" "}
                {TranslateText(game.gameState.toUpperCase(), language)}
              </p>
              <p>
                {TranslateText("CREATED", language)}
                {new Date(game.createdAt).toLocaleString()}
              </p>
              <p>
                {TranslateText("LAST_UPDATE", language)}
                {new Date(game.updatedAt).toLocaleString()}
              </p>
            </div>
            <motion.div
              className="grid grid-cols-15 gap-1 mb-4 border-4"
              style={{
                backgroundColor: "var(--darkshade)",
                borderColor: "var(--darkshade)",
              }}
              initial="hidden"
              animate={controls}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.01,
                  },
                },
              }}
            >
              {game.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <motion.button
                    key={`${rowIndex}-${colIndex}`}
                    className="h-[1.5vh] w-[1.5vh] sm:h-[2vh] sm:w-[2vh] md:h-[2.5vh] md:w-[2.5vh] lg:h-[3vh] lg:w-[3vh] xl:h-[3.5vh] xl:w-[3.5vh] 3xl:h-[4vh] 3xl:w-[4vh]
                     flex items-center justify-center  md:text-xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold "
                    style={{
                      backgroundColor: winLane.some(
                        ([r, c]) => r === rowIndex && c === colIndex
                      )
                        ? "#22c55e"
                        : "var(--whitelessbright)",
                      color:
                        cell === "X"
                          ? "var(--defaultred)"
                          : "var(--defaultblue)",
                    }}
                    onClick={() => {
                      handleClick(rowIndex, colIndex);
                    }}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    {cell}
                  </motion.button>
                ))
              )}
            </motion.div>
            <div className="text-center text-black w-1/6 ml-8">
              <h2 className="text-2xl mb-2">
                {TranslateText("HISTORY", language)}
              </h2>
              <p>TODO</p>
            </div>
          </div>
          <div className="flex flex-row space-x-4 ">
            <Button onClick={startNewGame}>
              {TranslateText("NEW_GAME", language)}
            </Button>
            <Dialog
              open={isSaveDialogOpen}
              onOpenChange={(open: boolean) => {
                setIsSaveDialogOpen(!isSaveDialogOpen);
                if (open === false) setDialogNewGameFromExisting(false);
              }}
            >
              <DialogTrigger asChild>
                <div className="flex flex-row space-x-4 ">
                  <Button>
                    {isNewGame
                      ? TranslateText("SAVE_GAME", language)
                      : TranslateText("UPDATE_GAME", language)}
                  </Button>
                  {!isNewGame && (
                    <Button onClick={() => setDialogNewGameFromExisting(true)}>
                      {TranslateText("SAVE_GAME_NEW", language)}
                    </Button>
                  )}
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
                    {dialogNewGameFromExisting
                      ? TranslateText("SAVE_GAME_NEW", language)
                      : isNewGame
                      ? TranslateText("SAVE_GAME", language)
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
                      style={{
                        borderColor: "var(--purple)",
                      }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setGameName(e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 ">
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
                        style={{
                          borderColor: "var(--purple)",
                        }}
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
                    onClick={saveUpdateGame}
                  >
                    {dialogNewGameFromExisting
                      ? TranslateText("SAVE_GAME_NEW", language)
                      : isNewGame
                      ? TranslateText("SAVE_GAME", language)
                      : TranslateText("UPDATE_GAME", language)}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {!isNewGame && (
              <Button onClick={deleteGame} variant="destructive">
                {TranslateText("DELETE_GAME", language)}
              </Button>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
