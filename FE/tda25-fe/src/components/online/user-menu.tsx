"use client";

import { useEffect, useState } from "react";
import { ChevronDown, User, LogOut, WrenchIcon } from "lucide-react";
import { useLanguage } from "../languageContext";
import { ClearLoginCookie, TranslateText } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/models/UserProfile";
import { AdminModal } from "./admin-modal";

type ProfileProps = {
  userProfile: UserProfile | null;
};

export default function UserMenu({ userProfile }: ProfileProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [adminMenuOpened, setAdminMenuOpened] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    setIsLoggedIn(userProfile !== null);
  }, [userProfile]);
  if (!isLoggedIn) {
    return (
      <div className="space-x-2 space-y-2 lg:space-y-0 flex-col lg:flex-row flex">
        <Button
          onClick={() => router.push("/login?redirect=/online")}
          className="px-4 py-2 bg-defaultred text-white rounded-lg text-xl hover:bg-red-700"
        >
          {TranslateText("LOG_IN", language)}
        </Button>
        <Button
          onClick={() => router.push("/register?redirect=/online")}
          className="px-4 py-2 bg-defaultblue text-white rounded-lg text-xl hover:bg-darkerblue"
        >
          {TranslateText("CREATE_ACCOUNT", language)}
        </Button>
      </div>
    );
  }
  function handleLogOut() {
    ClearLoginCookie();
    router.refresh();
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="font-dosis-medium flex items-center space-x-2 px-4 py-2 bg-darkerblue text-white rounded-lg text-xl hover:bg-darkerblue/80"
          >
            <img
              src={
                userProfile?.profilePicture || "/images/placeholder-avatar.png"
              }
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />
            <span>{userProfile?.username}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-defaultblue border-darkshade border"
          align="end"
          sideOffset={5}
        >
          <DropdownMenuItem
            className="flex items-center space-x-2 text-white hover:bg-darkerblue cursor-pointer"
            onClick={() => router.push(`/profile/${userProfile?.uuid || ""}`)}
          >
            <User className="h-4 w-4" />
            <span>{TranslateText("PROFILE", language)}</span>
          </DropdownMenuItem>
          {userProfile?.admin && (
            <DropdownMenuItem
              className="flex items-center space-x-2 text-white hover:bg-darkerblue cursor-pointer"
              onClick={() => setAdminMenuOpened(true)}
            >
              <WrenchIcon className="h-4 w-4" />
              <span>ADMIN</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="flex items-center space-x-2 text-white hover:bg-darkerblue cursor-pointer"
            onClick={handleLogOut}
          >
            <LogOut className="h-4 w-4" />
            <span>{TranslateText("LOG_OUT", language)}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AdminModal
        isOpen={adminMenuOpened}
        onClose={() => setAdminMenuOpened(false)}
        language={language}
      />
    </>
  );
}
