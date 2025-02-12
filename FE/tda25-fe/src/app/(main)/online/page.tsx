"use client";

import { useLanguage } from "@/components/languageContext";
import EloDisplay from "@/components/online/elo-display";
import GameOptions from "@/components/online/game-options";
import UserMenu from "@/components/online/user-menu";
import { GetLoginCookie, TranslateText } from "@/lib/utils";
import { UserProfile } from "@/models/UserProfile";
import { useEffect, useState } from "react";

export default function OnlinePage() {
  const { language } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = TranslateText("ONLINE_PAGE_TITLE", language);
  }, [language]);
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
          <UserMenu userProfile={user} />
        </div>
        <EloDisplay loading={loading} userProfile={user} />
        <GameOptions />
      </div>
    </div>
  );
}
