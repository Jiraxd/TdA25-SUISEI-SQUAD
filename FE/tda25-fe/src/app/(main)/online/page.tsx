"use client";

import { useAlertContext } from "@/components/alertContext";
import { useLanguage } from "@/components/languageContext";
import EloDisplay from "@/components/online/elo-display";
import GameOptions from "@/components/online/game-options";
import UserMenu from "@/components/online/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetLoginCookie, TranslateText } from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import SEOMetaTags from "@/components/online/SEOMetaTags";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function OnlinePage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [privateGameId, setPrivateGameId] = useState("");
  const router = useRouter();
  const { updateErrorMessage } = useAlertContext();
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 15;
  const totalPages = Math.ceil(leaderboard.length / entriesPerPage);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const leaderBoardData = await fetch(`/api/v1/users`);
      if (leaderBoardData.ok) {
        const leaderboard = await leaderBoardData.json();
        setLeaderboard(
          (leaderboard as UserProfile[]).toSorted((a, b) => b.elo - a.elo)
        );
      }
      const loginToken = GetLoginCookie();
      if (!loginToken) {
        setLoading(false);
        return;
      }
      const data = await fetch(`/api/v1/auth/verify`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loginToken}`,
        },
      });

      if (data.ok) {
        const user = await data.json();
        setUser(user);
      }

      const currentGame = await fetch(`/api/v1/currentLiveGame`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${loginToken}`,
        },
      });

      if (currentGame.ok) {
        const game = await currentGame.json();
        router.push(`/onlineGame/${game.uuid}`);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const joinPrivateGame = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!privateGameId) {
      updateErrorMessage(TranslateText("ENTER_PRIVATE_GAME_ID", language));
      return;
    }
    const data = await fetch(`/api/v1/join-private/` + privateGameId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.ok) {
      const uuid = await data.text();
      router.push(`/onlineGame/${uuid}`);
    } else {
      updateErrorMessage(TranslateText("PRIVATE_GAME_NOT_FOUND", language));
    }
  };

  const lastEntry = currentPage * entriesPerPage;
  const firstEntry = lastEntry - entriesPerPage;
  const currentEntries = leaderboard.slice(firstEntry, lastEntry);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };
  return (
    <>
      <SEOMetaTags type="online" />
      <div
        className="p-6 text-[#F6F6F6] font-dosis-regular min-w-full max-w-screen h-[calc(100vh-5rem)] max-w-[100vw]"
        style={{ backgroundColor: "var(--whitelessbright)" }}
      >
        <div className="max-w-4xl mx-auto pb-20">
          {user?.banned && (
            <div className="text-2xl lg:text-3xl w-full text-center  text-defaultred font-dosis-bold">
              {TranslateText("YOU_BAN", language)}
            </div>
          )}
          <div className="flex justify-between mb-8 items-center">
            <h1 className="text-3xl lg:text-4xl  text-defaultred font-dosis-bold">
              {TranslateText("WELCOME_ONLINE", language)}
            </h1>
            <UserMenu userProfile={user} setUserProfile={setUser} />
          </div>
          <EloDisplay loading={loading} userProfile={user} />
          <GameOptions user={user} />
          <form
            onSubmit={joinPrivateGame}
            className="text-center mt-8 p-4 flex flex-col lg:flex-row w-full justify-center gap-4 font-dosis-medium border border-darkshade rounded-lg"
          >
            <Input
              placeholder={TranslateText("ENTER_PRIVATE_GAME_ID", language)}
              className="bg-white placeholder:text-gray-500 text-black border border-darkshade text-lg"
              value={privateGameId}
              onChange={(e) => setPrivateGameId(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-defaultred hover:bg-red-700 font-dosis-bold text-lg"
            >
              {TranslateText("JOIN_PRIVATE_GAME", language)}
            </Button>
          </form>
          <div className="mt-8 border border-darkshade rounded-lg p-4">
            <Table>
              <TableHeader className="font-dosis-bold">
                <TableRow>
                  <TableHead
                    colSpan={4}
                    className="text-left text-darkerblue text-2xl pb-4"
                  >
                    {TranslateText("LEADERBOARD", language)}
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>{TranslateText("USERNAME", language)}</TableHead>
                  <TableHead>{TranslateText("ELO", language)}</TableHead>
                  <TableHead className="w-[100px]">
                    {TranslateText("WINRATE", language)}
                  </TableHead>
                  <TableHead className="text-right">
                    {TranslateText("GAMES_PLAYED", language)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-darkshade font-dosis-regular">
                {loading
                  ? [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="w-32 h-4 bg-gray-400" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-16 h-4 bg-gray-400" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-16 h-4 bg-gray-400" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="w-16 h-4 ml-auto bg-gray-400" />
                        </TableCell>
                      </TableRow>
                    ))
                  : currentEntries.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.elo}</TableCell>
                        <TableCell>
                          {user.wins > 0
                            ? (
                                ((user.wins + user.draws) /
                                  (user.wins + user.losses + user.draws)) *
                                100
                              ).toFixed(1)
                            : 0}
                          %
                        </TableCell>
                        <TableCell className="text-right">
                          {user.wins + user.losses + user.draws}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="bg-white text-darkshade border-darkshade"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-white text-darkshade border-darkshade"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="mx-2 text-darkshade">
                  {TranslateText("PAGE", language)} {currentPage}{" "}
                  {TranslateText("OF", language)} {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-white text-darkshade border-darkshade"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="bg-white text-darkshade border-darkshade"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
