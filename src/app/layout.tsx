import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/config/brand";
import { DemoProvider } from "@/state/demo-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${brand.name} · ${brand.tagline}`,
  description: brand.description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
