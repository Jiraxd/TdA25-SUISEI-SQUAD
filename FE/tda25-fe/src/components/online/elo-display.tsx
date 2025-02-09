import { TranslateText } from "@/lib/utils";
import { useLanguage } from "../languageContext";
import { Progress } from "@/components/ui/progress";

type EloDisplayProps = {
  currentElo: number;
  nextRankElo: number;
  nextRankName: string;
};

export default function EloDisplay({
  currentElo,
  nextRankElo,
  nextRankName,
}: EloDisplayProps) {
  const { language } = useLanguage();
  const progress = ((currentElo - 1000) / (nextRankElo - 1000)) * 100;

  return (
    <div className="mb-8 p-6 bg-darkshade rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-dosis-medium mb-4 text-pink">
        {TranslateText("ELO_RATING", language)}
      </h2>
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl font-dosis-medium text-white">
          {currentElo}
        </span>
        <span className="text-white font-dosis-medium text-xl">
          {TranslateText("NEXT_RANK", language)}: {nextRankElo} {"- "}
          {nextRankName}
        </span>
      </div>
      <div className="w-full rounded-full h-4 overflow-hidden">
        <Progress
          value={progress}
          className="h-full transition-all"
          style={{
            backgroundColor: "var(--black)",
          }}
        />
      </div>
      <p className="mt-2 text-whitelessbright font-dosis-medium">
        {nextRankElo - currentElo} {TranslateText("POINTS_NEEDED", language)}
      </p>
    </div>
  );
}
