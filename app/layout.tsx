import type { Metadata } from "next";
import type { ReactNode } from "react";
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
        {children}
      </body>
    </html>
  );
}