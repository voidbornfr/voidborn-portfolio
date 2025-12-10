import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import AudioController from "@/components/layout/AudioController";
import VoidAI from "@/components/ui/VoidAI";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VOIDBORN | Rishab",
  description: "Rishab's Multiverse Portfolio - Full Stack Developer",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-void text-text-main overflow-x-hidden selection:bg-white selection:text-black`}
      >
        <SmoothScroll />
        <AudioController />
        {children}
        <VoidAI />
      </body>
    </html>
  );
}
