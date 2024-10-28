import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
        className={`${dosisRegular.variable} ${dosisBold.variable} ${dosisLight.variable} ${dosisMedium.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
