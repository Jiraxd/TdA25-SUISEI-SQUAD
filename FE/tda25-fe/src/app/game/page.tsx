"use client";

import { usePathname } from "next/navigation";

export default function Game() {
  const pathName = usePathname();
  const gameId = pathName.split("/").pop();
  return (
    <>
      <div>{"Will be available soon :)"}</div>
      <div>{gameId}</div>
    </>
  );
}
