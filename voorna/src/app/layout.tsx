import type { Metadata } from "next";
import { Inter, Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voorna — Create Voting Experiences in Minutes",
  description:
    "Launch a branded voting website for your pageant, awards night, talent show, or community campaign — no code, no setup fees, and nothing to install.",
  openGraph: {
    title: "Voorna — Create Voting Experiences in Minutes",
    description:
      "Branded voting websites for pageants, awards, festivals and every contest in between. Free to start.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
