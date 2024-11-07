"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { TranslateText } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLanguage } from "../languageContext";

export default function LanguageDisplay() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <Button
      className="flex flex-row fixed bottom-4 left-0 items-center w-fit font-[family-name:var(--font-dosis-bold)] bg-transparent"
      onClick={() => {
        toggleLanguage();
      }}
      variant={"ghost"}
    >
      <Badge
        className="flex flex-row gap-2 items-center rounded-[20px]"
        style={{ backgroundColor: "var(--defaultblue)" }}
      >
        <Image
          src="/images/globe.svg"
          alt="globe"
          className="w-8 h-8"
          width={32}
          height={32}
        />
        <div className="bg-transparent text-base pr-2">
          {TranslateText(language, language)}
        </div>
      </Badge>
    </Button>
  );
}
