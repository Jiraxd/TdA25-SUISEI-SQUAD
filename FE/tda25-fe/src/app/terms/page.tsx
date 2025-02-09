"use client";
import { useLanguage } from "@/components/languageContext";
import { TranslateText } from "@/lib/utils";

export default function TermsPage() {
  const { language } = useLanguage();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-dosis-bold mb-6 text-black">
        {TranslateText("TERMS_OF_USE", language)}
      </h1>
      <div className="text-2xl max-w-none font-dosis-regular text-black">
        <p className="whitespace-pre-line">
          {TranslateText("TERMS_OF_USE_TEXT", language)}
        </p>
      </div>
    </div>
  );
}
