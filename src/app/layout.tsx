import type { Metadata } from "next";

import RootContext from "@/context/RootContext";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Braime - Sharpen your Brain",
  description: "Improve your concentration and cognitive functioning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootContext>
      <html lang="en">
        <body className={`${inter.className} bg-slate-900`}>
          <main className="w-full h-full">
            <header>
              <div className="wrapper">
                <h1 className="text-4xl text-white">
                  <Link href="/">Braime</Link>
                </h1>
              </div>
            </header>
            {children}
          </main>
          <Toaster></Toaster>
        </body>
      </html>
    </RootContext>
  );
}
