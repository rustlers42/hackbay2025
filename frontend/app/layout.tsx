import Header from "@/components/header";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login - Rustlers",
  description: "Login to access your account",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <Providers>
          <Header />

            <main className="flex-1 flex flex-col">{children}</main>
          {/*<Footer />*/}
        </Providers>
      </body>
    </html>
  );
}
