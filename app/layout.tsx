import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boutique Inventory",
  description: "Inventory management for your boutique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-100 text-neutral-900 antialiased">
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
            <Link href="/" className="font-bold text-xl">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Boutique
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
                Dashboard
              </Link>
              <Link href="/products/add">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                  Add Item
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}