"use client";

import { TranslateText } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../languageContext";

interface ButtonsNavBarProps {
  orientation?: "horizontal" | "vertical";
}

export const ButtonsNavBar = ({
  orientation = "horizontal",
}: ButtonsNavBarProps) => {
  const { language } = useLanguage();
  const router = useRouter();

  const handleClickGames = () => {
    router.push("/games");
  };

  const handleClickPlay = () => {
    router.push("/game");
  };

  const handleClickOnline = () => {
    router.push("/online");
  };

  const buttonClass =
    orientation === "vertical"
      ? "flex flex-row p-4 items-center w-full justify-center"
      : "flex flex-row mr-8 p-6 items-center";

  return (
    <div
      className={
        orientation === "vertical" ? "flex flex-col w-full" : "flex flex-row"
      }
    >
      <button className={buttonClass} onClick={handleClickGames}>
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
      <button className={buttonClass} onClick={handleClickPlay}>
        <Image
          src="/icons/zarivka_playing_bile.svg"
          alt="Play_logo"
          className="w-14 h-14"
          width={48}
          height={48}
        />
        <div className="text_bold ml-2">{TranslateText("PLAY", language)}</div>
      </button>
      <button className={buttonClass} onClick={handleClickOnline}>
        <Image
          src="/icons/zarivka_thinking_bile.svg"
          alt="Play_logo"
          className="w-10 h-10"
          width={48}
          height={48}
        />
        <div className="text_bold ml-2">
          {TranslateText("ONLINE_PLAY", language)}
        </div>
      </button>
    </div>
  );
};
