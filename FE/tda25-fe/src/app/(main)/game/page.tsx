"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation } from "framer-motion";
import { Game } from "@/models/Game";
import { LoadingCircle } from "@/components/loadingCircle";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import { GameCreateUpdate } from "@/models/GameCreateUpdate";
import { useAlertContext } from "@/components/alertContext";
import { useRouter } from "next/navigation";
import { GameControls } from "@/components/game/DialogControls";
import { DesktopGame } from "@/components/game/DesktopGame";
import { MobileGame } from "@/components/game/MobileGame";

export default function GamePage() {
  const isDev = process.env.NODE_ENV === "development";
  const pathName = usePathname();
  const gameId = pathName.split("/").pop();
  const [game, setGame] = useState<Game | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentPlayer, setPlayer] = useState<"X" | "O">("X");
  const controls = useAnimation();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isNewGame, setIsNewGame] = useState(true);
  const [winLane, setWinningLine] = useState<number[][]>([]);
  const { updateErrorMessage } = useAlertContext();
  const router = useRouter();

  const emptyBoard = Array.from({ length: 15 }, () => Array(15).fill(""));
  const [baseBoard, setBaseBoard] =
    useState<Array<Array<"X" | "O" | "">>>(emptyBoard);
  const [basePlayer, setBasePlayer] = useState<"X" | "O">("X");
  const [hasBaseWinner, setHasBaseWinner] = useState<boolean>(false);

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

      const boardCopy = data.board.map((row) => [...row]);
      setBaseBoard(boardCopy);

      const counts = data.board.flat().reduce(
        (acc, cell) => {
          if (cell.toUpperCase() === "X") acc.x++;
          if (cell.toUpperCase() === "O") acc.o++;
          return acc;
        },
        { x: 0, o: 0 }
      );

      // Set next player based on counts
      setPlayer(counts.x === counts.o ? "X" : "O");
      setBasePlayer(counts.x === counts.o ? "X" : "O");

      const { winner: hasWinner, winningLine } = checkWinner(data.board);
      if (hasWinner) {
        // We need to change the winner to the last player who played
        setWinner(currentPlayer === "X" ? "O" : "X");

        setWinningLine(winningLine);
        setHasBaseWinner(true);
      }
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
      setIsNewGame(true);
      startNewGame();
    }
  }, [gameId]);

  async function startNewGame() {
    if (isNewGame) {
      setNewGame();
    } else {
      router.push("/game");
      setNewGame();
    }
  }

  function setNewGame() {
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

  function startNewGameFromExisting() {
    if (hasBaseWinner) {
      updateErrorMessage(TranslateText("ERROR_START_NEW_GAME", language));
      return;
    }
    setWinningLine([]);
    setPlayer(basePlayer);
    setWinner(null);

    setIsNewGame(false);

    // Jako chápu že mám povolenou i null hodnotu, ale zbytečný if :D
    if (game) setGame({ ...game, board: structuredClone(baseBoard) });
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

  async function saveGame() {
    const gamePayload: GameCreateUpdate = {
      name: game?.name ?? "Name",
      difficulty: game?.difficulty ?? "medium",
      board: game?.board ?? emptyBoard,
    };
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
          cells.every((cell) => cell.toUpperCase() === "X") ||
          cells.every((cell) => cell.toUpperCase() === "O")
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
    <>
      <title>{TranslateText("GAME_PAGE_TITLE", language)}</title>
      <motion.div
        className="font-[family-name:var(--font-dosis-bold)] flex flex-col items-center justify-center pt-4"
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
            <div className="block lg:hidden w-full">
              <MobileGame
                game={game}
                winner={winner}
                currentPlayer={currentPlayer}
                winLane={winLane}
                language={language}
                handleClick={handleClick}
                controls={controls}
              />
            </div>

            <div className="hidden lg:block w-full">
              <DesktopGame
                game={game}
                winner={winner}
                currentPlayer={currentPlayer}
                winLane={winLane}
                language={language}
                handleClick={handleClick}
                controls={controls}
                isNewGame={isNewGame}
                isSaveDialogOpen={isSaveDialogOpen}
                setIsSaveDialogOpen={setIsSaveDialogOpen}
                setGameName={setGameName}
                setDifficulty={setDifficulty}
                startNewGame={startNewGame}
                saveGame={saveGame}
                startNewGameFromExisting={startNewGameFromExisting}
              />
            </div>
            <div className="block lg:hidden">
              <GameControls
                isNewGame={isNewGame}
                isSaveDialogOpen={isSaveDialogOpen}
                setIsSaveDialogOpen={setIsSaveDialogOpen}
                game={game}
                language={language}
                setGameName={setGameName}
                setDifficulty={setDifficulty}
                startNewGame={startNewGame}
                saveGame={saveGame}
                vertical={false}
                startNewGameFromExisting={startNewGameFromExisting}
              />
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
