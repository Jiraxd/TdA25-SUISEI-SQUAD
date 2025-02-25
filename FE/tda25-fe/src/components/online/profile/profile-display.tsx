import { type UserProfile, getNameColor } from "@/models/UserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/components/languageContext";
import { byteArrayToImageUrl, TranslateText } from "@/lib/utils";
import { getNextRank, getRankByElo } from "@/models/Rank";

type ProfileDisplayProps = {
  user: UserProfile;
};

export default function ProfileDisplay({ user }: ProfileDisplayProps) {
  const { language } = useLanguage();
  if (!user) return null;
  const totalWonLostGames = user.wins + user.losses + user.draws;
  const winrate =
    totalWonLostGames > 0
      ? ((user.wins + user.draws / totalWonLostGames) * 100).toFixed(1)
      : "0.0";

  const currentRank = getRankByElo(user.elo);
  const nextRank = getNextRank(user.elo);
  const pointsNeeded = nextRank ? nextRank.minElo - user.elo : 0;
  return (
    <Card className=" text-black">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={byteArrayToImageUrl(null)} alt={user.username} />
          </Avatar>
          <div>
            <CardTitle
              className="text-2xl font-dosis-bold"
              style={{
                color: getNameColor(user),
              }}
            >
              {user.username}
            </CardTitle>
            <p className="text-lg text-black">
              {TranslateText("JOINED", language)}:{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-dosis-medium">
          <div className="space-y-2">
            <p className="text-2xl font-dosis-bold text-defaultblue">
              {TranslateText("ELO", language)}
            </p>
            <p className="text-2xl font-dosis-bold text-black">{user.elo}</p>
            <p className="text-lg text-black font-dosis-bold">
              {TranslateText("CURRENT_RANK", language)}:{" "}
              <span
                className="font-dosis-bold px-1"
                style={{
                  color: currentRank.color,
                }}
              >
                {currentRank.name}
              </span>
            </p>
            {nextRank && (
              <p className="text-lg font-dosis-bold  text-black">
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
              <p className="text-lg  text-black font-dosis-bold ">
                {TranslateText("POINTS_NEEDED", language)}:{" "}
                <span className="font-dosis-regular">{pointsNeeded}</span>
              </p>
            )}
          </div>
          <div className="space-y-2 font-dosis-bold">
            <p className="text-2xl text-defaultblue">
              {TranslateText("STATS", language)}
            </p>
            <p className="text-lg text-black">
              {TranslateText("WINS", language)}:{" "}
              <span className="font-dosis-regular">{user.wins}</span>
            </p>
            <p className="text-lg text-black">
              {TranslateText("DRAWS", language)}:{" "}
              <span className="font-dosis-regular">{user.draws}</span>
            </p>
            <p className="text-lg text-black">
              {TranslateText("LOSSES", language)}:{" "}
              <span className="font-dosis-regular">{user.losses}</span>
            </p>
            <p className="text-lg text-black">
              {TranslateText("GAMES_PLAYED", language)}:{" "}
              <span className="font-dosis-regular">{totalWonLostGames}</span>
            </p>
            <p className="text-lg  text-black">
              {TranslateText("WINRATE", language)}:{" "}
              <span className="font-dosis-regular">{winrate}%</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
