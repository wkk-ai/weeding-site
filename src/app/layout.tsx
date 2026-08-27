import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NossoCasamento — Site de casamento simples e barato",
    template: "%s | NossoCasamento",
  },
  description:
    "Crie seu site de casamento em 5 minutos. Templates lindos, RSVP, lista de presentes com taxa a partir de 1,99%.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
