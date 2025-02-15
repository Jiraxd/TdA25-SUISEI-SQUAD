"use client";

import { Badge } from "@/components/ui/badge";
import { useAlertContext } from "../alertContext";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function AlertDisplay() {
  const { alertMessage, updateErrorMessage, alertType } = useAlertContext();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        updateErrorMessage("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage, updateErrorMessage]);

  return (
    <AnimatePresence mode="wait">
      {alertMessage && (
        <motion.button
          key="alert"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.3,
          }}
          className="flex flex-row fixed bottom-16 right-4 items-center w-fit font-[family-name:var(--font-dosis-bold)] bg-transparent z-50"
          onClick={() => {
            updateErrorMessage("");
          }}
        >
          <Badge
            className="flex flex-row gap-2 p-2 items-center rounded-[20px]"
            style={{
              backgroundColor:
                alertType === "error" ? "var(--defaultred)" : "var(--purple)",
            }}
          >
            <div className="bg-transparent text-base pr-2">{alertMessage}</div>
          </Badge>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
