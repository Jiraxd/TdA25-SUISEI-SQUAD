"use client";

import { useLanguage } from "@/components/languageContext";
import { GetLoginCookie, TranslateText } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import SettingsProfile from "@/components/online/profile/settings-display";
import GameHistory from "@/components/online/profile/game-history";
import ProfileDisplay from "@/components/online/profile/profile-display";
import { getNameColor, type UserProfile } from "@/models/UserProfile";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const pathName = usePathname();
  const userId = pathName.split("/").pop();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const loginToken = GetLoginCookie();
      if (!loginToken) {
        router.push("/login?redirect=/profile");

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

        if (userId && userId === "profile") {
          setIsCurrentUser(true);
        } else {
          const data = await fetch(`/api/v1/users/${userId}`);
          const profile = await data.json();
          if (profile?.id === user.id) setIsCurrentUser(true);
        }
      } else {
        router.push("/login?redirect=/profile");
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  return (
    <div className="bg-whitelessbright min-w-full max-w-screen min-h-screen text-white font-dosis-medium p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto mt-4 sm:mt-6 bg-darkshade border-none">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-whitelessbright font-dosis-bold text-center sm:text-left">
            {loading ? (
              <Skeleton className="h-10 w-64 bg-gray-700" />
            ) : (
              <span>
                {TranslateText("PROFILE_PLAYER", language)}
                <span style={{ color: getNameColor(user) }}>
                  {user?.username}
                </span>
              </span>
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
          {!isCurrentUser && !loading && (
            <div className="space-x-2">
              <Button
                onClick={() => router.push("/login?redirect=/profile")}
                className="px-4 py-2 bg-darkerblue text-white rounded-lg text-xl hover:bg-defaultblue"
              >
                {TranslateText("LOG_IN", language)}
              </Button>
              <Button
                onClick={() => router.push("/register?redirect=/profile")}
                className="px-4 py-2 bg-defaultred text-white rounded-lg text-xl hover:bg-pink"
              >
                {TranslateText("CREATE_ACCOUNT", language)}
              </Button>
            </div>
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
