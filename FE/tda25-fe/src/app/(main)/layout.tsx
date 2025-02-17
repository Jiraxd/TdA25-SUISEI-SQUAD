import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { ButtonsNavBar } from "@/components/layout/ButtonsNavBar";
import { LogoNavBar } from "@/components/layout/LogoNavBar";
import LanguageDisplay from "@/components/layout/LanguageDisplay";
import { LanguageProvider } from "@/components/languageContext";
import { AlertProvider } from "@/components/alertContext";
import AlertDisplay from "@/components/layout/AlertDisplay";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

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
        className={`${dosisRegular.variable} ${dosisBold.variable} ${dosisLight.variable} ${dosisMedium.variable} antialiased flex flex-col overflow-x-hidden`}
      >
        <AlertProvider>
          <LanguageProvider>
            <div className=" w-full mx-auto">
              <div className="flex flex-row sticky top-0 min-w-full justify-between font-[family-name:var(--font-dosis-bold)] z-50">
                <div
                  className="flex flex-row top-0 max-h-20 items-center min-w-full 4xl:justify-end"
                  style={{
                    backgroundColor: "var(--darkerblue)",
                    minWidth: "50%",
                  }}
                >
                  <LogoNavBar />
                </div>
                <div
                  className="lg:flex flex-row top-0 max-h-20 items-center justify-end 4xl:justify-start hidden"
                  style={{
                    backgroundColor: "var(--defaultblue)",
                    minWidth: "50%",
                  }}
                >
                  <ButtonsNavBar />
                </div>
                <MobileNav />
              </div>
            </div>
            {children}
            <div className="hidden lg:block">
              <LanguageDisplay />
              <Footer />
            </div>

            <AlertDisplay />
          </LanguageProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
