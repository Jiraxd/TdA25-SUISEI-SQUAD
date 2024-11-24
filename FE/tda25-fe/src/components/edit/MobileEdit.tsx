"use client";
import { GameEditPropsMobile } from "@/models/GameEditProps";
import { motion } from "framer-motion";
import { TranslateText } from "@/lib/utils";
import { Button } from "../ui/button";

export function MobileEdit({
  game,
  language,
  handleClick,
  controls,
  currentPlayer,
  setCurrentPlayer,
}: GameEditPropsMobile) {
  return (
    <>
      <h1
        className="text-3xl mb-4 text-center px-4"
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

      <div className="w-full overflow-x-auto overflow-y-hidden mb-4 px-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent flex mobile_special:justify-center">
        <div className="min-w-max mx-auto">
          <motion.div
            className="grid grid-cols-15 gap-1 border-2 w-[70vh] h-[70vh]"
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
                  className="aspect-square w-full flex items-center justify-center text-base font-bold"
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
          <div className="flex flex-col gap-6 px-4 mb-8">
            <div className="text-center text-black">
              <h2 className="text-2xl mb-2">
                {TranslateText("GAME_INFO", language)}
              </h2>
              <p className="text-sm">
                {TranslateText("STATE", language)}{" "}
                {TranslateText(game.gameState.toUpperCase(), language)}
              </p>
              <p className="text-sm">
                {TranslateText("CREATED", language)}
                {new Date(game.createdAt).toLocaleString()}
              </p>
              <p className="text-sm">
                {TranslateText("LAST_UPDATE", language)}
                {new Date(game.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
