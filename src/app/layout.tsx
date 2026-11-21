import type { Metadata } from "next";
import { Antic_Didone, Lato } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Loader } from "@/components/layout/loader";

// Self-hosted at build time by next/font
const didone = Antic_Didone({ subsets: ["latin"], weight: "400", variable: "--font-didone", display: "swap" });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-lato", display: "swap" });

export const metadata: Metadata = {
  title: "TMJ Pain, TMD & Headaches in Sydney | Sydney Centre for TMJ & Sleep Therapy",
  description:
    "Jaw pain, headaches and neck tension can occur together. Individualised assessment and management of TMJ pain, TMD and headaches in Sydney.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${didone.variable} ${lato.variable}`}>
      <body>
        <SmoothScroll>
          <Loader />
          <Header />
          <main className="pb-3">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
