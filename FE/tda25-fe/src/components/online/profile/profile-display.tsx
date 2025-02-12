import {
  type UserProfile,
  getNameColor,
  getProfilePicture,
} from "@/models/UserProfile"; // Adjust the import path as needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/languageContext";
import { TranslateText } from "@/lib/utils";
import { getNextRank, getRankByElo } from "@/models/Rank";

type ProfileDisplayProps = {
  user: UserProfile;
};

export default function ProfileDisplay({ user }: ProfileDisplayProps) {
  const { language } = useLanguage();
  if (!user) return null;
  const totalWonLostGames = user.wins + user.losses;
  const winrate =
    totalWonLostGames > 0
      ? ((user.wins / totalWonLostGames) * 100).toFixed(1)
      : "0.0";

  const currentRank = getRankByElo(user.elo);
  const nextRank = getNextRank(user.elo);
  const pointsNeeded = nextRank ? nextRank.minElo - user.elo : 0;
  return (
    <Card
      className="bg-black text-white"
      style={{ borderColor: "var(--purple)", borderWidth: "2px" }}
    >
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={getProfilePicture(user)} alt={user.username} />
          </Avatar>
          <div>
            <CardTitle
              className="text-2xl font-dosis-bold"
              style={{ color: getNameColor(user) }}
            >
              {user.username}
            </CardTitle>
            <p className="text-sm text-whitelessbright">
              {TranslateText("JOINED", language)}:{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 font-dosis-medium">
          <div className="space-y-2">
            <p className="text-lg font-dosis-bold text-defaultblue">
              {TranslateText("ELO", language)}
            </p>
            <p className="text-2xl font-dosis-bold text-white">{user.elo}</p>
            <p className="text-lg text-whitelessbright">
              {TranslateText("CURRENT_RANK", language)}:{" "}
              <span
                className="font-dosis-bold "
                style={{ color: currentRank.color }}
              >
                {currentRank.name}
              </span>
            </p>
            {nextRank && (
              <p className="text-lg text-whitelessbright">
                {TranslateText("NEXT_RANK", language)}:{" "}
                <span
                  className="font-dosis-bold "
                  style={{ color: nextRank.color }}
                >
                  {nextRank.name}
                </span>
              </p>
            )}
            {nextRank && (
              <p className="text-lg text-whitelessbright ">
                {TranslateText("POINTS_NEEDED", language)}: {pointsNeeded}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-dosis-bold text-defaultblue">
              {TranslateText("STATS", language)}
            </p>
            <p className="text-xl font-dosis-bold">
              <span className="text-green-500">{user.wins}W</span> {" - "}
              <span className="text-yellow-500">{user.draws}D</span>
              {" - "}
              <span className="text-defaultred">{user.losses}L</span>
            </p>
            <p className="text-lg text-whitelessbright">
              {TranslateText("GAMES_PLAYED", language)}:{" "}
              {totalWonLostGames + user.draws}
            </p>
            <p className="text-lg text-whitelessbright">
              {TranslateText("WINRATE", language)}: {winrate}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
