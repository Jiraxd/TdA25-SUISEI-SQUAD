"use client";

import { Button } from "@/components/ui/button";
import { getCookie, language, TranslateText } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  totalPages,
  currentPage,
  callback,
}: {
  totalPages: number;
  currentPage: number;
  callback: (page: number) => void;
}) {
  const handlePageChange = (newPage: number) => {
    callback(newPage);
  };
  const currentLanguage: language = getCookie("language") || "CZ";
  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        style={{
          color: "var(--defaultred)",
        }}
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span
        className="text-sm "
        style={{
          color: "var(--defaultred)",
        }}
      >
        {TranslateText("PAGE", currentLanguage) +
          " " +
          currentPage +
          " " +
          TranslateText("OF", currentLanguage) +
          " " +
          totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        style={{
          color: "var(--defaultred)",
        }}
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
