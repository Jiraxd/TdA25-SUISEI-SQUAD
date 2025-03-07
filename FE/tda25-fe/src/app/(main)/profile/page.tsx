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
import { BanIcon, WrenchIcon } from "lucide-react";
import SEOMetaTags from "@/components/online/SEOMetaTags";

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
      if (!loginToken && userId === "profile") {
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

        const data = await fetch(`/api/v1/auth/verify`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${loginToken}`,
          },
        });

        if (data.ok) {
          const usertmp = await data.json();
          setUser(usertmp);
          if (userProfile.uuid === usertmp.uuid) setIsCurrentUser(true);
        } else {
          setIsCurrentUser(false);
        }
      } else {
        updateErrorMessage(TranslateText("USER_NOT_FOUND", language));
      }
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const handleDeleteProfile = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }

    try {
      const response = await fetch(`/api/v1/users/${user?.uuid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${GetLoginCookie()}`,
        },
      });

      if (response.ok) {
        ClearLoginCookie();
        router.push("/online");
      } else {
        updateErrorMessage(TranslateText("DELETE_ACCOUNT_FAILED", language));
      }
    } catch (error) {
      updateErrorMessage(TranslateText("DELETE_ACCOUNT_FAILED", language));
    }
  };

  return (
    <>
      <SEOMetaTags
        type="profile"
        profileOwner={profileOwner}
        profileId={userId as string}
      />
      <div className="bg-whitelessbright text-white font-dosis-medium min-h-screen overflow-x-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
          <Card className="mt-4 sm:mt-6 bg-whitelessbright text-darkshade border-2 border-darkshade">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl text-whitelessbright font-dosis-bold text-center sm:text-left">
                {loading ? (
                  <Skeleton className="h-10 w-64 bg-gray-700" />
                ) : (
                  <div className="text-darkerblue flex-col flex justify-start items-start">
                    <span>
                      {TranslateText("PROFILE_PLAYER", language)}
                      <span style={{ color: getNameColor(profileOwner) }}>
                        {profileOwner?.username}
                      </span>
                    </span>
                    {profileOwner?.banned && (
                      <div className="flex items-center space-x-2">
                        <BanIcon className="w-6 h-6" />
                        <span className="text-defaultred">
                          {" "}
                          {TranslateText("BANNED_USER", language)}
                        </span>
                      </div>
                    )}
                    {profileOwner?.admin && (
                      <div className="flex items-center space-x-2">
                        <WrenchIcon className="w-6 h-6" />
                        <span className="text-defaultred">
                          {" "}
                          {TranslateText("ADMIN", language)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardTitle>
              {isCurrentUser && !loading && (
                <Button
                  variant="destructive"
                  className="bg-defaultred text-lg hover:bg-pink w-full sm:w-auto"
                  onClick={async () => {
                    await fetch("/api/v1/auth/logout", {
                      headers: {
                        Authorization: `${GetLoginCookie()}`,
                      },
                    });
                    ClearLoginCookie();
                    setUser(null);
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
                    onClick={() =>
                      router.push("/login?redirect=/profile/" + userId)
                    }
                    className="px-4 py-2 bg-defaultred text-white rounded-lg text-xl hover:bg-red-700"
                  >
                    {TranslateText("LOG_IN", language)}
                  </Button>
                  <Button
                    onClick={() =>
                      router.push("/register?redirect=/profile/" + userId)
                    }
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
                      <>
                        <SettingsProfile user={profileOwner} />
                        {isCurrentUser && (
                          <div className="mt-8 border-t border-darkshade pt-8">
                            <Button
                              variant="destructive"
                              className={`w-full ${
                                deleteConfirmation
                                  ? "bg-red-700 hover:bg-red-800"
                                  : "bg-defaultred hover:bg-red-700"
                              } text-white text-lg`}
                              onClick={handleDeleteProfile}
                              onMouseLeave={() => setDeleteConfirmation(false)}
                            >
                              {TranslateText(
                                deleteConfirmation
                                  ? "ARE_YOU_SURE"
                                  : "DELETE_ACCOUNT",
                                language
                              )}
                            </Button>
                          </div>
                        )}
                      </>
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
