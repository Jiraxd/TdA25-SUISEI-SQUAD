"use client";

import React from "react";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] items-center justify-center text-center p-4 font-dosis-bold">
      <img
        src="/images/notfound.jpg"
        alt={"not found"}
        className="mb-4 max-w-md"
      />
      <h1 className="text-4xl font-bold mb-2 text-black font-dosis-medium">
        {TranslateText("PAGE_NOT_FOUND", language)}
      </h1>
      <button
        onClick={() => router.push("/")}
        className="mt-4 text-white text-2xl font-semibold py-2 px-4 rounded"
        style={{ backgroundColor: "var(--defaultblue)" }}
      >
        {TranslateText("BACK_HOME", language)}
      </button>
    </div>
  );
}
