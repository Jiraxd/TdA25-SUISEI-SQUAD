import { Metadata } from "next";
import localFont from "next/font/local";
import type React from "react";
import "../globals.css";

export const metadata: Metadata = {
  title: "Piškvorky - Přihlášení",
  description: "Přihlášení do webového rozhraní TdA piškvorek",
};

const dosisBold = localFont({
  src: "../fonts/Dosis-Bold.ttf",
  variable: "--font-dosis-bold",
  weight: "100 900",
});

const dosisLight = localFont({
  src: "../fonts/Dosis-Light.ttf",
  variable: "--font-dosis-light",
  weight: "100 900",
});

const dosisRegular = localFont({
  src: "../fonts/Dosis-Regular.ttf",
  variable: "--font-dosis-regular",
  weight: "100 900",
});

const dosisMedium = localFont({
  src: "../fonts/Dosis-Medium.ttf",
  variable: "--font-dosis-medium",
  weight: "100 900",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dosisRegular.variable} ${dosisBold.variable} ${dosisLight.variable} ${dosisMedium.variable}`}
    >
      <body className="min-h-screen bg-darkshade">
        <main className="flex items-center justify-center min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
