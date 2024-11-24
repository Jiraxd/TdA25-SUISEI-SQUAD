"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { useAlertContext } from "../alertContext";
import { useEffect } from "react";

export default function ErrorDisplay() {
  const { alertMessage, updateErrorMessage, alertType } = useAlertContext();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        updateErrorMessage("");
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage, updateErrorMessage]);

  if (alertMessage === "") return <></>;
  return (
    <Button
      className="flex flex-row fixed bottom-4 right-0 items-center w-fit font-[family-name:var(--font-dosis-bold)] bg-transparent"
      onClick={() => {
        updateErrorMessage("");
      }}
      variant={"ghost"}
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
    </Button>
  );
}
