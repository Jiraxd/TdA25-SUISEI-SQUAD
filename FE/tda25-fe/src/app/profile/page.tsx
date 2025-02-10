"use client";
import { useLanguage } from "@/components/languageContext";
import UserMenu from "@/components/online/user-menu";
import { TranslateText } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const pathName = usePathname();
  const userId = pathName.split("/").pop();
  useEffect(() => {
    async function fetchData() {
      if (userId && userId === "profile") {
        // TODO fetch current user
        return;
      }
      const data = await fetch(`/api/v1/users/${userId}`);
    }
    fetchData();
  }, []);
  const { language } = useLanguage();
  return (
    <div
      className="p-6 text-[#F6F6F6] font-dosis-regular min-w-full max-w-screen h-[calc(100vh-5rem)]"
      style={{ backgroundColor: "var(--whitelessbright)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-8 items-center">
          <h1 className="text-3xl lg:text-4xl  text-[#AB2E58] font-dosis-bold">
            {TranslateText("PROFILE_PLAYER", language) + " NAME"}
          </h1>
          <UserMenu />
        </div>
        {/* TODO navbar for profile with settings if it's your profile*/}
        {/* TODO profile info*/}
      </div>
    </div>
  );
}
