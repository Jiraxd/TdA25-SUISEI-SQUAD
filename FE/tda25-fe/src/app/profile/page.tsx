"use client";

import { useLanguage } from "@/components/languageContext";
import { TranslateText } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsProfile from "@/components/online/profile/settings-display";
import GameHistory from "@/components/online/profile/game-history";
import ProfileDisplay from "@/components/online/profile/profile-display";

export default function ProfilePage() {
  const pathName = usePathname();
  const userId = pathName.split("/").pop();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      if (userId && userId === "profile") {
        // TODO: fetch current user based on cookies
        setIsCurrentUser(true);
        return;
      }
      const data = await fetch(`/api/v1/users/${userId}`);
      // TODO: Check if the fetched user is the current user
      // setIsCurrentUser(data.isCurrentUser);
    }
    fetchData();
  }, [userId]);

  return (
    <div className="bg-whitelessbright min-w-full max-w-screen min-h-screen text-white font-dosis-medium p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto mt-4 sm:mt-6 bg-darkshade border-none">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-pink font-dosis-bold text-center sm:text-left">
            {TranslateText("PROFILE_PLAYER", language) + " NAME"}
          </CardTitle>
          {isCurrentUser && (
            <Button
              variant="destructive"
              className="bg-defaultred hover:bg-pink w-full sm:w-auto"
              onClick={() => {
                setIsCurrentUser(false);
              }}
            >
              {TranslateText("LOGOUT", language)}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList
              className={`grid h-full w-full ${
                isCurrentUser ? "grid-cols-3" : "grid-cols-2"
              } bg-darkerblue rounded-sm`}
            >
              <TabsTrigger
                value="profile"
                className="text-white rounded-xl data-[state=active]:bg-defaultred data-[state=active]:text-white text-xs sm:text-sm md:text-lg"
              >
                {TranslateText("PROFILE", language)}
              </TabsTrigger>
              <TabsTrigger
                value="game-history"
                className="text-white  rounded-xl data-[state=active]:bg-defaultred data-[state=active]:text-white text-xs sm:text-sm md:text-lg"
              >
                {TranslateText("GAME_HISTORY", language)}
              </TabsTrigger>
              {isCurrentUser && (
                <TabsTrigger
                  value="settings"
                  className="text-white  rounded-xl data-[state=active]:bg-defaultred data-[state=active]:text-white text-xs sm:text-sm md:text-lg"
                >
                  {TranslateText("SETTINGS", language)}
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent
              value="profile"
              className="bg-black p-4 sm:p-6 rounded-b-lg mt-0"
            >
              <ProfileDisplay />
            </TabsContent>
            <TabsContent
              value="game-history"
              className="bg-black p-4 sm:p-6 rounded-b-lg mt-0"
            >
              <GameHistory />
            </TabsContent>
            {isCurrentUser && (
              <TabsContent
                value="settings"
                className="bg-black p-4 sm:p-6 rounded-b-lg mt-0"
              >
                <SettingsProfile />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
