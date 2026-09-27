import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { SessionProvider } from "@/components/session-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: {
    default: "Vibe",
    template: "%s — Vibe",
  },
  description:
    "Найди людей с похожим вкусом. Музыка, аниме и игры собираются из сервисов, которыми ты уже пользуешься.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        <SessionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
