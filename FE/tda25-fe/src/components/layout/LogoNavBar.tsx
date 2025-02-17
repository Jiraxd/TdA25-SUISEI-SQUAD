"use client";

import { TranslateText } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../languageContext";

export const LogoNavBar = () => {
  const { language } = useLanguage();

  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };
  return (
    <div className="4xl:mr-96">
      <button
        className="flex flex-row p-2 lg:p-6 items-center"
        onClick={handleClick}
      >
        <div>
          <Image
            src="/logos/Think-different-Academy_LOGO_oficialni-bile.svg"
            alt="Logo"
            className="w-48 h-20 lg:w-60 lg:h-28 p-2 lg:p-6"
            width={240}
            height={112}
            priority
          />
        </div>
        <div className="text-2xl lg:text-3xl lg:flex hidden">
          {"| " + TranslateText("HOME", language)}
        </div>
      </button>
    </div>
  );
};
