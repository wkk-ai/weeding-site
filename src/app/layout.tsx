import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Geist,
  Great_Vibes,
  Libre_Baskerville,
  Outfit,
} from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const cinzel = Cinzel({
  variable: "--font-cinzel-face",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const baskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit-face",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "NossoCasamento — Site de casamento simples e barato",
    template: "%s | NossoCasamento",
  },
  description:
    "Crie seu site de casamento em 5 minutos. Templates lindos, RSVP, lista de presentes com taxa a partir de 1,99%.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${cormorant.variable} ${greatVibes.variable} ${cinzel.variable} ${baskerville.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
