"use client";

import {  TranslateText } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../languageContext";

export const ButtonsNavBar = () => {
  const { language } = useLanguage();
  const router = useRouter();

  const handleClickGames = () => {
    router.push("/games");
  };

  const handleClickPlay = () => {
    router.push("/game");
  };

  return (
    <>
      <button
        className="flex flex-row mr-20 p-6 items-center"
        onClick={handleClickGames}
      >
        <Image
          src="/icons/zarivka_idea_bile.svg"
          alt="puzzle_logo"
          className="w-12 h-12"
          width={48}
          height={48}
        />
        <div className="text_bold ml-2">
          {TranslateText("PUZZLES", language)}
        </div>
      </button>
      <button
        className="flex flex-row mr-20 p-6 items-center"
        onClick={handleClickPlay}
      >
        <Image
          src="/icons/zarivka_playing_bile.svg"
          alt="Play_logo"
          className="w-12 h-12"
          width={48}
          height={48}
        />
        <div className="text_bold ml-2">{TranslateText("PLAY", language)}</div>
      </button>
    </>
  );
};
