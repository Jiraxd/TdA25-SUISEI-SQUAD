"use client";

import { useLanguage } from "@/components/languageContext";
import EloDisplay from "@/components/online/elo-display";
import GameOptions from "@/components/online/game-options";
import UserMenu from "@/components/online/user-menu";
import { TranslateText } from "@/lib/utils";

export default function OnlinePage() {
  const { language } = useLanguage();
  return (
    <div
      className="p-6 text-[#F6F6F6] font-dosis-regular min-w-full max-w-screen h-[calc(100vh-5rem)]"
      style={{ backgroundColor: "var(--whitelessbright)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8 items-center">
          <h1 className="text-3xl lg:text-4xl  text-[#AB2E58] font-dosis-bold">
            {TranslateText("WELCOME_ONLINE", language)}
          </h1>
          <UserMenu />
        </div>
        <EloDisplay currentElo={0} nextRankElo={500} nextRankName={"BRONZE"} />
        <GameOptions />
      </div>
    </div>
  );
}
