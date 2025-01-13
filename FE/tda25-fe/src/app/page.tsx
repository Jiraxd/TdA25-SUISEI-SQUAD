"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Rocket } from "lucide-react";
import Image from "next/image";
import { TranslateText } from "@/lib/utils";
import { useLanguage } from "@/components/languageContext";

export default function Home() {
  const { language } = useLanguage();
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    if (firstSectionRef.current) {
      firstSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [ref1, inView1] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <div className=" h-[calc(100vh-5rem)] overflow-y-scroll snap-y snap-mandatory min-w-full max-w-screen font-[family-name:var(--font-dosis-bold)]">
      <section
        className=" h-[calc(100vh-5rem)] snap-start flex flex-col justify-center gap-8 md:gap-16 items-center relative bg-[---whitelessbright] text-[--darkshade] "
        ref={firstSectionRef}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl md:text-8xl font-bold mb-8 text-center"
        >
          {TranslateText("WELCOME", language)}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="relative flex mb-12 flex-col items-center"
        >
          <Image
            src="/logos/Think-different-Academy_LOGO_oficialni-cerne2.svg"
            alt="Logo"
            className="w-56 h-56 md:w-72 md:h-72 p-6"
            width={288}
            height={288}
          />
        </motion.div>
        <motion.div
          className={`fixed bottom-10 ${inView2 ? "hidden" : "block"} ${
            inView1 ? "text-[--whitelessbright]" : "text-[--darkshade]"
          }`}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <p className="text-lg">{TranslateText("SCROLL_LEARN", language)}</p>
        </motion.div>
      </section>

      <section
        ref={ref}
        className="h-[calc(100vh-5rem)]  snap-start flex flex-col justify-center items-center p-8 bg-[--whitelessbright] text-[--darkshade] whitespace-pre-line"
      >
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-col items-center mb-36 h-full md:mb-32 justify-center"
        >
          <Image
            src="/logos/Think-different-Academy_LOGO_oficialni.svg"
            alt="Logo"
            className=" w-48 h-48 md:w-72 md:h-72 p-6"
            width={288}
            height={288}
          />

          <p className="text-lg md:text-2xl text-center max-w-2xl">
            {TranslateText("WHO_ARE_WE", language)}
          </p>
        </motion.div>
      </section>
      <section
        ref={ref1}
        className="h-[calc(100vh-5rem)]  snap-start flex flex-col justify-center items-center p-8 bg-[--darkshade] text-[--whitelessbright] whitespace-pre-line"
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={inView1 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center">
            {TranslateText("HOW_TO_PLAY_TITLE", language)}
          </h2>
          <p className="text-xl md:text-2xl text-center max-w-2xl">
            {TranslateText("HOW_TO_PLAY", language)}
          </p>
        </motion.div>
      </section>

      <section
        ref={ref2}
        className="h-[calc(100vh-5rem)]  snap-start flex flex-col justify-center items-center p-8 bg-[--pink] text-[--whitelessbright] whitespace-pre-line"
      >
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={inView2 ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center">
            {TranslateText("WHY_PLAY", language)}
          </h2>
          <ul className="text-xl md:text-2xl text-center max-w-2xl list-disc list-inside">
            {TranslateText("WHY_PLAY_LIST", language)
              .split(";")
              .map((item) => (
                <li key={item}>{item}</li>
              ))}
          </ul>
        </motion.div>
      </section>

      <AnimatePresence>
        {
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8  text-[#F6F6F6] p-4 rounded-full shadow-lg"
            style={{ backgroundColor: "var(--darkerblue)" }}
            aria-label="Scroll to top"
          >
            <Rocket className="w-6 h-6" />
          </motion.button>
        }
      </AnimatePresence>
    </div>
  );
}
