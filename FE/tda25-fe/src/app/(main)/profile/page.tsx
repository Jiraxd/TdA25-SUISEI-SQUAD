"use client";

import { useLanguage } from "@/components/languageContext";
import { ClearLoginCookie, GetLoginCookie, TranslateText } from "@/lib/utils";
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
import { useAlertContext } from "@/components/alertContext";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileOwner, setProfileOwner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const pathName = usePathname();
  const userId = pathName.split("/").pop();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();

  const { updateErrorMessage, updateSuccessMessage } = useAlertContext();
  const handleBanUnbanUser = async (userId: string, isBanned: boolean) => {
    try {
      const response = await fetch(
        `/api/v1/users/${isBanned ? "unban" : "ban"}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${GetLoginCookie()}`,
          },
        }
      );

      if (response.ok) {
        updateSuccessMessage(
          TranslateText(
            isBanned ? "USER_UNBANNED_SUCCESS" : "USER_BANNED_SUCCESS",
            language
          )
        );
      } else {
        updateErrorMessage(TranslateText("USER_ACTION_FAILED", language));
      }
    } catch (error) {
      updateErrorMessage(TranslateText("USER_ACTION_FAILED", language));
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const loginToken = GetLoginCookie();
      if (!loginToken) {
        router.push("/login?redirect=/profile");
        /*setUser({
          uuid: "testuuid",
          createdAt: new Date(),
          username: "J1R4",
          email: "test",
          elo: 1251,
          wins: 34,
          draws: 5,
          losses: 22,
          nameColor: "#AB2E58",
          banned: false,
          admin: true,
        });
        setIsCurrentUser(true);
        setLoading(false);
*/
        return;
      }
      const profile = await fetch(`/api/v1/users/${userId}`);

      if (profile.ok) {
        const userProfile = await profile.json();
        setProfileOwner(userProfile);
      } else {
        updateErrorMessage(TranslateText("USER_NOT_FOUND", language));
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
          router.push(`/profile/${user.id}`);
        } else {
          const userProfile: UserProfile = await profile.json();
          if (userProfile.uuid === user.uuid) setIsCurrentUser(true);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  return (
    <>
      <title>{TranslateText("PROFILE_PAGE_TITLE", language)}</title>
      <div className="bg-whitelessbright text-white font-dosis-medium min-h-screen overflow-x-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="mt-4 sm:mt-6 bg-whitelessbright text-darkshade border-2 border-darkshade">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-whitelessbright font-dosis-bold text-center sm:text-left">
                {loading ? (
                  <Skeleton className="h-10 w-64 bg-gray-700" />
                ) : (
                  <span className="text-darkerblue">
                    {TranslateText("PROFILE_PLAYER", language)}
                    <span style={{ color: getNameColor(profileOwner) }}>
                      {profileOwner?.username}
                    </span>
                  </span>
                )}
              </CardTitle>
              {isCurrentUser && !loading && (
                <Button
                  variant="destructive"
                  className="bg-defaultred text-lg hover:bg-pink w-full sm:w-auto"
                  onClick={() => {
                    ClearLoginCookie();
                    router.refresh();
                  }}
                >
                  {TranslateText("LOGOUT", language)}
                </Button>
              )}
              {!isCurrentUser && profileOwner && user && (
                <div className="space-x-2">
                  {user.admin && (
                    <Button
                      onClick={() =>
                        handleBanUnbanUser(
                          profileOwner.uuid,
                          profileOwner.banned
                        )
                      }
                      className="px-4 py-2 bg-defaultred text-white rounded-lg text-xl hover:bg-red-700"
                    >
                      {TranslateText(
                        profileOwner.banned ? "UNBAN_USER" : "BAN_USER",
                        language
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() => router.push("/profile/" + user.uuid)}
                    className="px-4 py-2 bg-defaultblue text-white rounded-lg text-xl hover:bg-darkerblue"
                  >
                    {TranslateText("YOUR_PROFILE", language)}
                  </Button>
                </div>
              )}
              {!isCurrentUser && !user && (
                <div className="space-x-2">
                  <Button
                    onClick={() => router.push("/login?redirect=/profile")}
                    className="px-4 py-2 bg-defaultred text-white rounded-lg text-xl hover:bg-red-700"
                  >
                    {TranslateText("LOG_IN", language)}
                  </Button>
                  <Button
                    onClick={() => router.push("/register?redirect=/profile")}
                    className="px-4 py-2 bg-defaultblue text-white rounded-lg text-xl hover:bg-darkerblue"
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
                    } bg-whitelessbright border-2 border-darkshade rounded-none rounded-t-lg`}
                  >
                    <TabsTrigger
                      value="profile"
                      className="text-black rounded-xl data-[state=active]:bg-defaultblue data-[state=active]:text-white text-sm md:text-lg"
                    >
                      {TranslateText("PROFILE", language)}
                    </TabsTrigger>
                    <TabsTrigger
                      value="game-history"
                      className="text-black rounded-xl data-[state=active]:bg-defaultblue data-[state=active]:text-white text-sm md:text-lg"
                    >
                      {TranslateText("GAME_HISTORY", language)}
                    </TabsTrigger>
                    {isCurrentUser && (
                      <TabsTrigger
                        value="settings"
                        className="text-black rounded-xl data-[state=active]:bg-defaultblue data-[state=active]:text-white text-sm md:text-lg"
                      >
                        {TranslateText("SETTINGS", language)}
                      </TabsTrigger>
                    )}
                  </TabsList>
                )}
                <TabsContent
                  value="profile"
                  className="bg-white border border-t-0 border-darkshade p-4 sm:p-6 rounded-b-lg mt-0"
                >
                  {loading ? (
                    <ProfileSkeleton />
                  ) : (
                    <ProfileDisplay user={profileOwner!} />
                  )}
                </TabsContent>
                <TabsContent
                  value="game-history"
                  className="bg-white border border-t-0 border-darkshade p-4 sm:p-6 rounded-b-lg mt-0"
                >
                  {loading ? (
                    <GameHistorySkeleton />
                  ) : (
                    <GameHistory userProfile={profileOwner} />
                  )}
                </TabsContent>
                {isCurrentUser && (
                  <TabsContent
                    value="settings"
                    className="bg-white border border-t-0 border-darkshade p-4 sm:p-6 rounded-b-lg mt-0"
                  >
                    {loading ? (
                      <SettingsSkeleton />
                    ) : (
                      <SettingsProfile user={profileOwner} />
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
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
