import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ButtonsNavBar } from "@/components/layout/ButtonsNavBar";
import { LogoNavBar } from "@/components/layout/LogoNavBar";
import LanguageDisplay from "@/components/layout/LanguageDisplay";
import { LanguageProvider } from "@/components/languageContext";
import { ErrorProvider } from "@/components/errorContext";
import ErrorDisplay from "@/components/layout/ErrorDisplay";
import { MobileNav } from "@/components/layout/MobileNav";

const dosisBold = localFont({
  src: "./fonts/Dosis-Bold.ttf",
  variable: "--font-dosis-bold",
  weight: "100 900",
});

const dosisLight = localFont({
  src: "./fonts/Dosis-Light.ttf",
  variable: "--font-dosis-light",
  weight: "100 900",
});

const dosisRegular = localFont({
  src: "./fonts/Dosis-Regular.ttf",
  variable: "--font-dosis-regular",
  weight: "100 900",
});

const dosisMedium = localFont({
  src: "./fonts/Dosis-Medium.ttf",
  variable: "--font-dosis-medium",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Piškvorky",
  description: "Hra piškvorky ve webovém rozhraní",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dosisRegular.variable} ${dosisBold.variable} ${dosisLight.variable} ${dosisMedium.variable} antialiased flex flex-col min-h-screen`}
      >
        <ErrorProvider>
          <LanguageProvider>
            <div className="flex flex-row sticky top-0 min-w-full justify-between font-[family-name:var(--font-dosis-bold)] z-50">
              <div
                className="flex flex-row top-0 max-h-20 items-center min-w-full"
                style={{
                  backgroundColor: "var(--darkerblue)",
                  minWidth: "50%",
                }}
              >
                <LogoNavBar />
              </div>
              <div
                className="lg:flex flex-row top-0 max-h-20 items-center justify-end hidden"
                style={{
                  backgroundColor: "var(--defaultblue)",
                  minWidth: "50%",
                }}
              >
                <ButtonsNavBar />
              </div>
              <MobileNav />
            </div>
            {children}
            <div className="hidden lg:block">
              <LanguageDisplay />
            </div>
            <ErrorDisplay />
          </LanguageProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
