"use client";

import { GameCard } from "@/components/games/GameCard";
import { Pagination } from "@/components/games/Pagination";
import { getCookie, language, TranslateText } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Games() {
  const [page, setPage] = useState<number>(1);
  const [games, setGames] = useState<any>(null);

  useEffect(() => {
    async function getGames() {
      const res = await fetch(
        `https://odevzdavani.tourdeapp.cz/mockbush/api/v1/games/`
      );
      if (!res.ok) throw new Error("Failed to fetch games");
      // TODO make this work with paging
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
  const currentLanguage: language = getCookie("language") || "CZ";
  return (
    <div className="container mx-auto pb-8 font-[family-name:var(--font-dosis-bold)]">
      <div className="flex mb-6 justify-center align-middle items-center w-full">
        <div
          className="text-4xl font-bold w-fit text-center p-8 "
          style={{
            color: "var(--defaultred)",
          }}
        >
          {TranslateText("PUZZLES_TO_SOLVE", currentLanguage)}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {games === null ? (
          <></>
        ) : (
          games.map((game: any) => <GameCard key={game.uuid} game={game} />)
        )}
      </div>
      <Pagination
        totalPages={1}
        currentPage={page}
        callback={handleChangePage}
      />
    </div>
  );
}
