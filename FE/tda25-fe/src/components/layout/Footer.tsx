"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";
import { useState } from "react";

type DialogContent = {
  title: string;
  content: string;
};

export function Footer() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<DialogContent | null>(
    null
  );

  const handleClick = (type: string) => {
    setDialogContent({
      title: TranslateText(type, language),
      content: TranslateText(`${type}_TEXT`, language),
    });
    setIsOpen(true);
  };

  const footerItems = [
    "COPYRIGHT",
    "CONTACT",
    "TERMS_OF_USE",
    "PRIVACY_POLICY",
  ];

  return (
    <>
      <footer className="flex flex-row fixed bottom-4 right-4 items-center w-fit font-dosis-bold bg-transparent">
        <Badge
          className="flex flex-row gap-2 px-4 h-10 items-center rounded-[20px]"
          style={{ backgroundColor: "var(--defaultblue)" }}
        >
          <div className="flex flex-wrap justify-center gap-4 text-base text-white">
            {footerItems.map((item) => (
              <button
                key={item}
                className="hover:text-gray-300"
                onClick={() => handleClick(item)}
              >
                {TranslateText(item, language)}
              </button>
            ))}
          </div>
        </Badge>
      </footer>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="text-black bg-gray-200 p-6">
          <DialogHeader>
            <DialogTitle className="font-dosis-bold text-3xl">
              {dialogContent?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4  font-dosis-regular text-2xl overflow-y-auto pr-6 max-h-52 lg:max-h-96">
            {dialogContent?.content.split("\n").map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
