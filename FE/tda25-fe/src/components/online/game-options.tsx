import { Users, Swords, Lock } from "lucide-react";
import { useLanguage } from "../languageContext";
import { TranslateText } from "@/lib/utils";

export default function GameOptions() {
  const { language } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="p-6 bg-defaultblue rounded-lg hover:bg-darkerblue transition-colors flex flex-col items-center justify-center space-y-4">
        <Users size={48} className="text-white" />
        <span className="text-2xl font-dosis-bold">
          {TranslateText("RANDOM_GAME", language)}
        </span>
      </button>
      <button className="p-6 bg-defaultblue rounded-lg hover:bg-darkerblue  transition-colors flex flex-col items-center justify-center space-y-4">
        <Swords size={48} className="text-white" />
        <span className="text-2xl font-dosis-bold">
          {TranslateText("RANKED_RANDOM_GAME", language)}
        </span>
      </button>
      <button className="p-6 bg-defaultblue rounded-lg hover:bg-darkerblue  transition-colors flex flex-col items-center justify-center space-y-4">
        <Lock size={48} className="text-white" />
        <span className="text-2xl font-dosis-bold">
          {TranslateText("PRIVATE_GAME", language)}
        </span>
      </button>
    </div>
  );
}
