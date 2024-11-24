"use client";

import { useAlertContext } from "@/components/alertContext";
import { DesktopEdit } from "@/components/edit/DesktopEdit";
import { EditControls } from "@/components/edit/EditControls";
import { MobileEdit } from "@/components/edit/MobileEdit";
import { useLanguage } from "@/components/languageContext";
import { LoadingCircle } from "@/components/loadingCircle";
import { TranslateText } from "@/lib/utils";
import { Game } from "@/models/Game";
import { GameCreateUpdate } from "@/models/GameCreateUpdate";
import { motion, useAnimation } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPage() {
  const isDev = process.env.NODE_ENV === "development";
  const pathName = usePathname();
  const gameId = pathName.split("/").pop();
  const [game, setGame] = useState<Game | null>(null);
  const { language } = useLanguage();
  const { updateErrorMessage, updateSuccessMessage } = useAlertContext();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveAsNewOrUpdate, setSaveAsNewOrUpdate] = useState<"new" | "update">(
    "update"
  );
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | "">("X");
  const emptyBoard = Array.from({ length: 15 }, () => Array(15).fill(""));
  function changePlayer() {
    if (currentPlayer === "X") setCurrentPlayer("O");
    if (currentPlayer === "O") setCurrentPlayer("");
    if (currentPlayer === "") setCurrentPlayer("X");
  }

  const router = useRouter();

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
    if (gameId && gameId !== "edit") fetchGame(gameId);
    else updateErrorMessage(TranslateText("ERROR_FETCH", language));
  }, [gameId]);

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

  function handleClick(rowIndex: number, colIndex: number) {
    if (!game) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[rowIndex][colIndex] = currentPlayer;
    setGame({
      ...game,
      board: newBoard,
    });
  }
  const controls = useAnimation();

  async function SaveNewUpdate() {
    const gamePayload: GameCreateUpdate = {
      name: game?.name ?? "Name",
      difficulty: game?.difficulty ?? "medium",
      board: game?.board ?? emptyBoard,
    };
    if (saveAsNewOrUpdate === "new") {
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
      } else {
        setIsSaveDialogOpen(false);
        updateSuccessMessage(TranslateText("SUCCESS_UPDATE", language));
      }
    }
  }

  return (
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
            <MobileEdit
              game={game}
              currentPlayer={currentPlayer}
              language={language}
              handleClick={handleClick}
              controls={controls}
              setCurrentPlayer={changePlayer}
            />
          </div>

          <div className="hidden lg:block w-full">
            <DesktopEdit
              game={game}
              language={language}
              setGameName={setGameName}
              setDifficulty={setDifficulty}
              deleteGame={deleteGame}
              isSaveDialogOpen={isSaveDialogOpen}
              setIsSaveDialogOpen={setIsSaveDialogOpen}
              handleClick={handleClick}
              controls={controls}
              saveNew={saveAsNewOrUpdate}
              updateSaveNew={setSaveAsNewOrUpdate}
              saveGameNewOrUpdate={SaveNewUpdate}
              currentPlayer={currentPlayer}
              setCurrentPlayer={changePlayer}
            />
          </div>
          <div className="block lg:hidden">
            <EditControls
              isSaveDialogOpen={isSaveDialogOpen}
              setIsSaveDialogOpen={setIsSaveDialogOpen}
              saveNew={saveAsNewOrUpdate}
              setGameName={setGameName}
              setDifficulty={setDifficulty}
              saveGameNewOrUpdate={SaveNewUpdate}
              deleteGame={deleteGame}
              language={language}
              vertical={false}
              game={game}
              updateSaveNew={setSaveAsNewOrUpdate}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
