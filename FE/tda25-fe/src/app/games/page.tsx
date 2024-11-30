"use client";

import { useAlertContext } from "@/components/alertContext";
import { GameCard } from "@/components/games/GameCard";
import { Pagination } from "@/components/games/Pagination";
import { useLanguage } from "@/components/languageContext";
import { LoadingCircle } from "@/components/loadingCircle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DateModifiedSearchOptions,
  Difficulties,
  TranslateText,
} from "@/lib/utils";
import { Game } from "@/models/Game";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function Games() {
  const [page, setPage] = useState<number>(1);
  const [games, setGames] = useState<Game[] | null>(null);
  const { language } = useLanguage();
  const [search, setSearch] = useState<string>("");
  const [dateSearch, setDateSearch] = useState<string>("NONE");
  const [difficultySearch, setDifficultySearch] = useState<string[]>([]);
  const [currentGames, setCurrentGames] = useState<Game[]>([]);

  const { updateErrorMessage } = useAlertContext();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        filterGames();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [search, difficultySearch, dateSearch]);

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

    getGames().then((res: Game[]) => {
      setGames(res);

      const startIdx = (page - 1) * ITEMS_PER_PAGE;
      const endIdx = startIdx + ITEMS_PER_PAGE;
      const filtered = doFilterOnGames(res);
      const paged = (filtered ? filtered.slice(startIdx, endIdx) : []).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setCurrentGames(paged);
    });
  }, [page]);

  const totalPages = currentGames
    ? Math.ceil(currentGames.length / ITEMS_PER_PAGE)
    : 1;

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  function filterGames() {
    // filter should always start from page 1
    setPage(1);
    const startIdx = 0;
    const endIdx = ITEMS_PER_PAGE;

    const filtered = doFilterOnGames(games || []);
    const paged = (filtered ? filtered.slice(startIdx, endIdx) : []).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setCurrentGames(paged);
  }

  function doFilterOnGames(input: Game[]): Game[] {
    let filtered = structuredClone(input);
    if (search) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().startsWith(search.toLowerCase())
      );
    }
    if (dateSearch !== "NONE") {
      const now = new Date();
      let filteredDate = new Date(0);

      switch (dateSearch) {
        case "24h":
          filteredDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          filteredDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "1mo":
          filteredDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "3mo":
          filteredDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
      }

      filtered = filtered.filter(
        (game) => new Date(game.createdAt) >= filteredDate
      );
    }

    if (difficultySearch.length > 0) {
      filtered = filtered.filter((game) =>
        difficultySearch.includes(game.difficulty.toUpperCase())
      );
    }

    console.log(filtered);
    if (filtered.length === 0) {
      updateErrorMessage(TranslateText("ERROR_SEARCH", language));
    }
    return filtered;
  }

  return (
    <div className="container mx-auto pb-8 font-[family-name:var(--font-dosis-bold)]">
      <div className="flex flex-col mb-6 justify-center align-middle items-center w-full">
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
        <div className="flex flex-col lg:flex-row justify-center items-center p-4 gap-4">
          <Input
            className="text-white flex p-6 text-xl lg:p-4 lg:text-md"
            onInput={(e) => setSearch(e.currentTarget.value)}
            style={{
              backgroundColor: "var(--darkerblue)",
              color: "var(--whitelessbright)",
            }}
            placeholder={TranslateText("SEARCH", language)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  className="p-6 text-xl h-9 lg:p-4 lg:text-md"
                  style={{
                    backgroundColor: "var(--darkshade)",
                  }}
                >
                  {TranslateText("SEARCH_OPTIONS_DIFFICULTY", language)}
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 border-2 shadow-lg"
              style={{
                backgroundColor: "var(--darkshade)",
                borderColor: "var(--purple)",
              }}
            >
              <div className="grid gap-4 text-white">
                <div className="grid gap-2">
                  {Difficulties.map((difficulty) => (
                    <div
                      className="flex items-center space-x-2"
                      key={difficulty}
                    >
                      <Checkbox
                        checked={difficultySearch.includes(difficulty)}
                        id={difficulty}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            if (difficultySearch.includes(difficulty)) {
                              return;
                            } else {
                              setDifficultySearch([
                                ...difficultySearch,
                                difficulty,
                              ]);
                            }
                          } else {
                            setDifficultySearch(
                              difficultySearch.filter(
                                (diff) => diff !== difficulty
                              )
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={difficulty}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {TranslateText(difficulty, language)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  className="p-6 text-xl h-9 lg:p-4 lg:text-md"
                  style={{
                    backgroundColor: "var(--darkshade)",
                  }}
                >
                  {TranslateText("SEARCH_OPTIONS_DATE", language)}
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 border-2 shadow-lg"
              style={{
                backgroundColor: "var(--darkshade)",
                borderColor: "var(--purple)",
              }}
            >
              <div className="grid gap-4 text-white">
                <div className="grid gap-2">
                  <RadioGroup
                    defaultValue={dateSearch}
                    onValueChange={(value) => {
                      setDateSearch(value);
                    }}
                  >
                    {DateModifiedSearchOptions.map((date, index) => (
                      <div className="flex items-center space-x-2" key={date}>
                        <RadioGroupItem value={date} id={index.toString()} />
                        <label htmlFor={index.toString()}>
                          {TranslateText(date, language)}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={filterGames}
              className="p-6 text-xl h-9 lg:p-4 lg:text-md"
              style={{
                backgroundColor: "var(--defaultred)",
              }}
            >
              {TranslateText("SEARCH_BTN", language)}
            </Button>
          </motion.div>
        </div>
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
