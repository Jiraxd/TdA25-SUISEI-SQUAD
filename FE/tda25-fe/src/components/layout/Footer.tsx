"use client";
import { Badge } from "@/components/ui/badge";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import Link from "next/link";

export function Footer() {
  const { language } = useLanguage();

  const footerItems = [
    { key: "COPYRIGHT", path: "/copyright" },
    { key: "CONTACT", path: "/contact" },
    { key: "TERMS_OF_USE", path: "/terms" },
    { key: "PRIVACY_POLICY", path: "/privacy" },
  ];

  return (
    <footer className="flex flex-row fixed bottom-4 right-4 items-center w-fit font-dosis-bold bg-transparent">
      <Badge
        className="flex flex-row gap-2 px-4 h-10 items-center rounded-[20px]"
        style={{ backgroundColor: "var(--defaultblue)" }}
      >
        <div className="flex flex-wrap justify-center gap-4 text-base text-white">
          {footerItems.map((item) => (
            <Link
              key={item.key}
              href={item.path}
              className="hover:text-gray-300 transition-colors"
            >
              {TranslateText(item.key, language)}
            </Link>
          ))}
        </div>
      </Badge>
    </footer>
  );
}
