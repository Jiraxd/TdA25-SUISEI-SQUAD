import { motion } from "framer-motion";
import { GameLayoutPropsDesktop } from "@/models/GameLayoutProps";
import { TranslateText } from "@/lib/utils";
import { GameControls } from "./DialogControls";

export function DesktopGame({
  game,
  winner,
  currentPlayer,
  winLane,
  language,
  handleClick,
  controls,
  isNewGame,
  isSaveDialogOpen,
  setIsSaveDialogOpen,
  setGameName,
  setDifficulty,
  startNewGame,
  saveGame,
  startNewGameFromExisting,
}: GameLayoutPropsDesktop) {
  return (
    <>
      <h1
        className="text-4xl mb-4 mt-4 text-center"
        style={{ color: "var(--darkshade)" }}
      >
        {game.name === "" ? "-" : game.name}
      </h1>

      {winner ? (
        <div className="w-full flex items-center justify-center align-middle">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl mb-8 py-2 px-4  text-white rounded-lg shadow-lg text-center flex w-fit"
            style={{
              backgroundColor:
                winner === "O" ? "var(--defaultblue)" : "var(--defaultred)",
            }}
          >
            {TranslateText("WINNER", language) + winner + "!"}
          </motion.div>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center align-middle">
          <motion.div
            key={currentPlayer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-2xl mb-8 py-2 px-4 text-center"
            style={{
              color:
                currentPlayer === "O"
                  ? "var(--defaultblue)"
                  : "var(--defaultred)",
            }}
          >
            {TranslateText("TURN", language) + currentPlayer}
          </motion.div>
        </div>
      )}

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
                  backgroundColor: winLane.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  )
                    ? "#22c55e"
                    : "var(--whitelessbright)",
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
            startNewGameFromExisting={startNewGameFromExisting}
            vertical={true}
          />
        </div>
      </div>
    </>
  );
}
