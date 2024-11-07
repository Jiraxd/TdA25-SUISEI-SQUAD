"use client";

import { getCookie, language, TranslateText } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const LogoNavBar = () => {
  const currentLanguage: language = getCookie("language") || "CZ";
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };
  return (
    <>
      <button className="flex flex-row p-6 items-center" onClick={handleClick}>
        <div>
          <Image
            src="/logos/Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-60 h-28 p-6"
            width={240}
            height={112}
          />
        </div>
        <div className="text-3xl font-bold">
          {"| " + TranslateText("HOME", currentLanguage)}
        </div>
      </button>
    </>
  );
};
