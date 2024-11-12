"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { v4 as uuidv4 } from "uuid";
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

export default function GamePage() {
  const pathName = usePathname();
  const gameId = pathName.split("/").pop();
  const [game, setGame] = useState<Game | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentPlayer, setPlayer] = useState<"X" | "O">("X");
  const controls = useAnimation();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);

  const { language } = useLanguage();

  const fetchGame = async (id: string) => {
    try {
      const response = await fetch(
        `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games/${id}`
      );
      const data: Game = await response.json();

      setGame(data);
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  useEffect(() => {
    if (gameId && gameId !== "game") {
      fetchGame(gameId);
      setIsNewGame(false);
    } else {
      setIsNewGame(true);
      const emptyBoard = Array.from({ length: 15 }, () => Array(15).fill(""));

      setGame({
        uuid: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: language === "EN" ? "Untitled Game" : "Neuložená hra",
        difficulty: "medium",
        gameState: "unknown",
        board: emptyBoard,
      });
    }
  }, [gameId]);

  function setGameName(name: string) {
    // temporary
    console.log(name);
  }

  function setDifficulty(difficulty: string) {
    // temporary
    console.log(difficulty);
  }
  function checkWinner(board: string[][]): boolean {
    const lines = [
      // Horizontal lines
      ...board,
      // Vertical lines
      ...board[0].map((_, colIndex) => board.map((row) => row[colIndex])),
      // Diagonal lines
      ...Array.from({ length: board.length * 2 - 1 }, (_, i) => {
        const diagonal1 = [];
        const diagonal2 = [];
        for (let j = 0; j <= i; j++) {
          const x = i - j;
          const y = j;
          if (x < board.length && y < board.length) {
            diagonal1.push(board[x][y]);
            diagonal2.push(board[y][x]);
          }
        }
        return [diagonal1, diagonal2];
      }).flat(),
    ];

    for (const line of lines) {
      for (let i = 0; i <= line.length - 5; i++) {
        const segment = line.slice(i, i + 5);
        if (
          segment.every((cell) => cell === "X") ||
          segment.every((cell) => cell === "O")
        ) {
          return true;
        }
      }
    }
    return false;
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

    const hasWinner = checkWinner(newBoard);
    if (hasWinner) {
      setWinner(currentPlayer);
      return;
    }

    setPlayer(currentPlayer === "X" ? "O" : "X");
  }

  return (
    <div
      className="font-[family-name:var(--font-dosis-bold)] flex flex-col items-center justify-center pt-12"
      style={{ backgroundColor: "var(--whitelessbright)" }}
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
            {game.name}
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
              className="text-2xl mb-8 "
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
            <div className="text-center text-black w-1/6 mr-8">
              <h2 className="text-2xl mb-2">
                {TranslateText("GAME_INFO", language)}
              </h2>
              <p>
                {TranslateText("STATE", language)} {game.gameState}
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
              className="grid grid-cols-15 gap-1 mb-4 "
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
                    className="w-5 h-5 sm:h-6 sm:w-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:h-10 xl:w-10 2xl:h-11 2xl:w-11 3xl:h-14 3xl:w-14 flex items-center justify-center text-4xl font-bold"
                    style={{
                      backgroundColor: "var(--darkshade)",
                      color:
                        cell === "X"
                          ? "var(--defaultred)"
                          : "var(--defaultblue)",
                    }}
                    onClick={() => {
                      handleClick(rowIndex, colIndex);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
            <Button>{TranslateText("NEW_GAME", language)}</Button>
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  {isNewGame
                    ? TranslateText("SAVE_GAME", language)
                    : TranslateText("UPDATE_GAME", language)}
                </Button>
              </DialogTrigger>
              <DialogContent
                style={{
                  backgroundColor: "var(--darkshade)",
                  borderColor: "var(--defaultred)",
                }}
              >
                <DialogHeader>
                  <DialogTitle>
                    {isNewGame ? "Save Game" : "Update Game"}
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
                        borderColor: "var(--defaultred)",
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
                          borderColor: "var(--defaultred)",
                        }}
                      >
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">
                          {TranslateText("BEGINNER", language)}
                        </SelectItem>
                        <SelectItem value="easy">
                          {TranslateText("EASY", language)}
                        </SelectItem>
                        <SelectItem value="medium">
                          {TranslateText("MEDIUM", language)}
                        </SelectItem>
                        <SelectItem value="hard">
                          {TranslateText("HARD", language)}
                        </SelectItem>
                        <SelectItem value="extreme">
                          {TranslateText("EXTREME", language)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button style={{ backgroundColor: "var(--darkerblue)" }}>
                    {isNewGame
                      ? TranslateText("SAVE_GAME", language)
                      : TranslateText("UPDATE_GAME", language)}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {!isNewGame && (
              <>
                <Button>Save as New Game</Button>
                <Button variant="destructive">Delete Game</Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
