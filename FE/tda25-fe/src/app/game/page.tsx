"use client";

import { usePathname } from "next/navigation";

export default function Game() {
  const pathName = usePathname();
  const gameId = pathName.split("/").pop();
  return (
    <div className="font-[family-name:var(--font-dosis-bold)]">
      <div>{"Will be available soon :)"}</div>
      <div>{gameId}</div>
    </div>
  );
}
