"use client";
import { GameEditProps } from "@/models/GameEditProps";
import { motion } from "framer-motion";
import { TranslateText } from "@/lib/utils";
import { Button } from "../ui/button";
import { EditControls } from "./EditControls";

export function DesktopEdit({
  game,
  language,
  handleClick,
  controls,
  isSaveDialogOpen,
  setIsSaveDialogOpen,
  saveNew,
  setGameName,
  setDifficulty,
  saveGameNewOrUpdate,
  deleteGame,
  updateSaveNew,
  currentPlayer,
  setCurrentPlayer,
}: GameEditProps) {
  return (
    <>
      <h1
        className="text-4xl mb-4 mt-4 text-center"
        style={{ color: "var(--darkshade)" }}
      >
        {game.name === "" ? "-" : game.name}
      </h1>
      <div className="w-full flex items-center justify-center align-middle flex-row gap-6 mb-8 py-4">
        <motion.div
          key={currentPlayer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-2xl text-center"
          style={{
            color:
              currentPlayer === "O"
                ? "var(--defaultblue)"
                : currentPlayer === "X"
                ? "var(--defaultred)"
                : "var(--darkshade)",
          }}
        >
          {TranslateText("TURN_EDIT", language) +
            (currentPlayer === ""
              ? TranslateText("EMPTY", language)
              : currentPlayer)}
        </motion.div>
        <Button onClick={setCurrentPlayer}>
          {TranslateText("CHANGE_PLAYER", language)}
        </Button>
      </div>

      <div className="flex flex-row justify-center w-full">
        <div className="text-center text-black w-1/6 text-xl mr-8">
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
                className="h-[2.5vh] w-[2.5vh] lg:h-[3vh] lg:w-[3vh] xl:h-[3.5vh] xl:w-[3.5vh] 3xl:h-[4vh] 3xl:w-[4vh]
                 flex items-center justify-center text-xl lg:text-2xl xl:text-3xl 3xl:text-4xl font-bold"
                style={{
                  backgroundColor: "var(--whitelessbright)",
                  color:
                    cell.toUpperCase() === "X"
                      ? "var(--defaultred)"
                      : "var(--defaultblue)",
                }}
                onClick={() => handleClick(rowIndex, colIndex)}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.85 }}
              >
                {cell.toUpperCase()}
              </motion.button>
            ))
          )}
        </motion.div>
        <div className="flex w-1/6 ml-8">
          <EditControls
            isSaveDialogOpen={isSaveDialogOpen}
            setIsSaveDialogOpen={setIsSaveDialogOpen}
            saveNew={saveNew}
            setGameName={setGameName}
            setDifficulty={setDifficulty}
            saveGameNewOrUpdate={saveGameNewOrUpdate}
            deleteGame={deleteGame}
            language={language}
            vertical={true}
            game={game}
            updateSaveNew={updateSaveNew}
          />
        </div>
      </div>
    </>
  );
}
