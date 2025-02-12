import { TranslateText } from "@/lib/utils";
import { useLanguage } from "../languageContext";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProfile } from "@/models/UserProfile";
import { getNextRank, getRankByElo } from "@/models/Rank";

type EloDisplayProps = {
  userProfile: UserProfile | null;
  loading: boolean;
};

export default function EloDisplay({ userProfile, loading }: EloDisplayProps) {
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="mb-4 sm:mb-8 p-4 sm:p-6 bg-darkshade rounded-lg shadow-md text-white">
        <Skeleton className="h-6 sm:h-8 w-32 sm:w-48 mb-2 sm:mb-4 bg-gray-700" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <Skeleton className="h-8 sm:h-10 w-16 sm:w-20 bg-gray-700 mb-2 sm:mb-0" />
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-700" />
        </div>
        <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
        <Skeleton className="h-4 w-32 sm:w-40 bg-gray-700" />
      </div>
    );
  }

  const elo = userProfile?.elo ?? 0;
  const nextRank = getNextRank(elo);
  const currentRank = getRankByElo(elo);
  const progress = ((elo - 1000) / (nextRank?.minElo || 0 - 1000)) * 100;

  return (
    <div className="mb-4 sm:mb-8 p-4 sm:p-6 bg-darkshade rounded-lg shadow-md text-white">
      <h2 className="text-xl sm:text-2xl font-dosis-medium mb-2 sm:mb-4 text-pink">
        {TranslateText("ELO_RATING", language)}
      </h2>
      <div className="flex flex-row items-center justify-between mb-2">
        <span className="text-3xl sm:text-4xl font-dosis-medium text-white mb-1 sm:mb-0">
          {elo} {" - "}{" "}
          <span style={{ color: currentRank?.color ?? "#FFFFFF" }}>
            {currentRank?.name}
          </span>
        </span>
        <span className="text-sm sm:text-xl text-white font-dosis-medium">
          {TranslateText("NEXT_RANK", language)}: {nextRank?.minElo ?? 0} {"- "}
          <span style={{ color: nextRank?.color ?? "#FFFFFF" }}>
            {nextRank?.name ?? "UNRANKED"}
          </span>
        </span>
      </div>
      <div className="w-full rounded-full h-3 sm:h-4 overflow-hidden">
        <Progress
          value={progress}
          className="h-full transition-all"
          style={{
            backgroundColor: "var(--black)",
          }}
        />
      </div>
      <p className="mt-2 text-sm sm:text-base text-whitelessbright font-dosis-medium">
        {nextRank?.minElo ?? 0} {TranslateText("POINTS_NEEDED", language)}
      </p>
    </div>
  );
}
