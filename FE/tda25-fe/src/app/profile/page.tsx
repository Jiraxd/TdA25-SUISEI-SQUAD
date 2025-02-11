"use client";

import { useLanguage } from "@/components/languageContext";
import { TranslateText } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsProfile from "@/components/online/profile/settings-display";
import GameHistory from "@/components/online/profile/game-history";
import ProfileDisplay from "@/components/online/profile/profile-display";
import type { User } from "@/models/User";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const pathName = usePathname();
  const userId = pathName.split("/").pop();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUser({
        uuid: "testuuid",
        createdAt: new Date(),
        username: "J1R4",
        email: "",
        elo: 1251,
        wins: 34,
        draws: 5,
        losses: 22,
      });
      if (userId && userId === "profile") {
        // TODO: fetch current user based on cookies and redirect to /profile/UUID
        setIsCurrentUser(true);
      } else {
        const data = await fetch(`/api/v1/users/${userId}`);
        // if data.UUID === current user UUID, set isCurrentUser to true
        // setIsCurrentUser(true);
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  return (
    <div className="bg-whitelessbright min-w-full max-w-screen min-h-screen text-white font-dosis-medium p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto mt-4 sm:mt-6 bg-darkshade border-none">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-pink font-dosis-bold text-center sm:text-left">
            {loading ? (
              <Skeleton className="h-10 w-64 bg-gray-700" />
            ) : (
              TranslateText("PROFILE_PLAYER", language) + user?.username
            )}
          </CardTitle>
          {isCurrentUser && !loading && (
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
            {!loading && (
              <TabsList
                className={`grid h-full w-full ${
                  isCurrentUser ? "grid-cols-3" : "grid-cols-2"
                } bg-darkerblue rounded-sm`}
              >
                <TabsTrigger
                  value="profile"
                  className="text-white rounded-xl data-[state=active]:bg-defaultred data-[state=active]:text-white text-sm md:text-lg"
                >
                  {TranslateText("PROFILE", language)}
                </TabsTrigger>
                <TabsTrigger
                  value="game-history"
                  className="text-white rounded-xl data-[state=active]:bg-defaultred data-[state=active]:text-white text-sm md:text-lg"
                >
                  {TranslateText("GAME_HISTORY", language)}
                </TabsTrigger>
                {isCurrentUser && (
                  <TabsTrigger
                    value="settings"
                    className="text-white rounded-xl data-[state=active]:bg-defaultred data-[state=active]:text-white text-sm md:text-lg"
                  >
                    {TranslateText("SETTINGS", language)}
                  </TabsTrigger>
                )}
              </TabsList>
            )}
            <TabsContent
              value="profile"
              className="bg-black p-4 sm:p-6 rounded-b-lg mt-0"
            >
              {loading ? <ProfileSkeleton /> : <ProfileDisplay user={user!} />}
            </TabsContent>
            <TabsContent
              value="game-history"
              className="bg-black p-4 sm:p-6 rounded-b-lg mt-0"
            >
              {loading ? <GameHistorySkeleton /> : <GameHistory />}
            </TabsContent>
            {isCurrentUser && (
              <TabsContent
                value="settings"
                className="bg-black p-4 sm:p-6 rounded-b-lg mt-0"
              >
                {loading ? <SettingsSkeleton /> : <SettingsProfile />}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-1/2 bg-gray-700" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-700" />
        <Skeleton className="h-4 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-1/2 bg-gray-700" />
      </div>
    </div>
  );
}

function GameHistorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4 bg-gray-700" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-gray-700" />
        ))}
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3 bg-gray-700" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-700" />
        <Skeleton className="h-10 w-1/2 bg-gray-700" />
      </div>
    </div>
  );
}
