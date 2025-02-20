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

export default function OnlinePage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [privateGameId, setPrivateGameId] = useState("");
  const router = useRouter();
  const { updateErrorMessage } = useAlertContext();
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

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
        credentials: "include",
      });

      if (data.ok) {
        const user = await data.json();
        setUser(user);
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
    const data = await fetch(`/api/v1/onlineGame/join-private`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: privateGameId,
      }),
    });
    if (data.ok) {
      router.push(`/onlineGame/${privateGameId}`);
    } else {
      updateErrorMessage(TranslateText("PRIVATE_GAME_NOT_FOUND", language));
    }
  };

  return (
    <>
      <title>{TranslateText("ONLINE_PAGE_TITLE", language)}</title>
      <div
        className="p-6 text-[#F6F6F6] font-dosis-regular min-w-full max-w-screen h-[calc(100vh-5rem)]"
        style={{ backgroundColor: "var(--whitelessbright)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-8 items-center">
            <h1 className="text-3xl lg:text-4xl  text-defaultred font-dosis-bold">
              {TranslateText("WELCOME_ONLINE", language)}
            </h1>
            <UserMenu userProfile={user} />
          </div>
          <EloDisplay loading={loading} userProfile={user} />
          <GameOptions user={user} />
          <form
            onSubmit={joinPrivateGame}
            className="text-center mt-8 p-4 flex w-full justify-center gap-4 font-dosis-medium border border-darkshade rounded-lg"
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
        </div>
      </div>
    </>
  );
}
