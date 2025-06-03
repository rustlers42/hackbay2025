import Footer from "@/components/footer";
import Header from "@/components/header";
import { AuthProvider } from "@/lib/auth-context";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Login - Rustlers",
  description: "Login to access your account",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />

          <main className={`flex flex-1 flex-col`}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
