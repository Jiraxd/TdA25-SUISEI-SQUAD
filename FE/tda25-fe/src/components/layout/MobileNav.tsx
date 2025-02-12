"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonsNavBar } from "./ButtonsNavBar";
import { motion, AnimatePresence } from "framer-motion";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "../languageContext";
import { useRouter } from "next/navigation";
import LanguageDisplay from "./LanguageDisplay";

export const MobileNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();

  const handleClickHome = () => {
    router.push("/");
  };

  return (
    <>
      <div
        className="lg:hidden flex items-center justify-end flex-1"
        style={{
          backgroundColor: "var(--defaultblue)",
        }}
      >
        <Button
          variant="ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white pr-4"
        >
          {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </Button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-20 left-0 right-0 z-50"
            style={{
              background:
                "linear-gradient(to bottom, var(--pink), var(--defaultred))",
              borderTop: "4px solid var(--purple)",
            }}
          >
            <div className="py-4">
              <button
                className="flex flex-row p-4 items-center w-full justify-center"
                onClick={handleClickHome}
              >
                <div className="text-2xl ml-2">
                  {TranslateText("HOME_PAGE", language)}
                </div>
              </button>
              <ButtonsNavBar orientation="vertical" />

              <LanguageDisplay />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
