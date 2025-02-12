"use client";

import { useEffect, useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
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

type ProfileProps = {
  userProfile: UserProfile | null;
};

export default function UserMenu({ userProfile }: ProfileProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { language } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    setIsLoggedIn(userProfile !== null);
  }, [userProfile]);
  if (!isLoggedIn) {
    return (
      <div className="space-x-2">
        <Button
          onClick={() => router.push("/login?redirect=/online")}
          className="px-4 py-2 bg-darkerblue text-white rounded-lg text-xl hover:bg-defaultblue"
        >
          {TranslateText("LOG_IN", language)}
        </Button>
        <Button
          onClick={() => router.push("/register?redirect=/online")}
          className="px-4 py-2 bg-defaultred text-white rounded-lg text-xl hover:bg-pink"
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="font-dosis-medium flex items-center space-x-2 px-4 py-2 bg-darkerblue text-white rounded-lg text-xl hover:bg-darkerblue/80"
        >
          <img
            src="/images/placeholder-avatar.png"
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
          <span>{"TODO NAME"}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-darkshade border-defaultblue"
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
        <DropdownMenuItem
          className="flex items-center space-x-2 text-white hover:bg-darkerblue cursor-pointer"
          onClick={handleLogOut}
        >
          <LogOut className="h-4 w-4" />
          <span>{TranslateText("LOG_OUT", language)}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
