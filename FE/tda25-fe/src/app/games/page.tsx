"use client";

import { GameCard } from "@/components/games/GameCard";
import { Pagination } from "@/components/games/Pagination";
import { useLanguage } from "@/components/languageContext";
import { LoadingCircle } from "@/components/loadingCircle";
import { TranslateText } from "@/lib/utils";
import { Game } from "@/models/Game";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function Games() {
  const [page, setPage] = useState<number>(1);
  const [games, setGames] = useState<Game[] | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    async function getGames() {
      const isDev = process.env.NODE_ENV === "development";

      const res = await fetch(
        isDev
          ? `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games`
          : `/api/v1/games`
      );

      if (!res.ok) throw new Error("Failed to fetch games");
      return res.json();
    }

    getGames().then((res) => {
      setGames(res);
      console.log(res);
    });
  }, [page]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = games ? Math.ceil(games.length / ITEMS_PER_PAGE) : 1;
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentGames = games ? games.slice(startIdx, endIdx) : [];

  return (
    <div className="container mx-auto pb-8 font-[family-name:var(--font-dosis-bold)]">
      <div className="flex mb-6 justify-center align-middle items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold w-fit text-center p-8 "
          style={{
            color: "var(--defaultred)",
          }}
        >
          {TranslateText("PUZZLES_TO_SOLVE", language)}
        </motion.div>
      </div>
      {games === null ? (
        <div className="flex w-full justify-center align-middle items-center mb-8">
          <LoadingCircle />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {currentGames.map((game: Game) => (
            <GameCard key={game.uuid} game={game} />
          ))}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          callback={handleChangePage}
        />
      </motion.div>
    </div>
  );
}
