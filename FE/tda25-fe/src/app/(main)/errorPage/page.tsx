"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ErrorPage() {
  return (
    <div
      className="font-[family-name:var(--font-dosis-bold)] flex flex-col mt-20 justify-center align-middle items-center"
      style={{
        color: "var(--darkshade)",
      }}
    >
      <div>{"This is an error page!"}</div>
      <Suspense>
        <ErrorCode />
      </Suspense>
    </div>
  );
}

function ErrorCode() {
  const params = useSearchParams();
  let error = params.get("code");
  if (error == null) error = "500";
  return <div>{error + " error code"}</div>;
}
