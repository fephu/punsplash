import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Punsplash | Blog",
  description: "Welcome to Punsplash",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        GeistSans.className
      )}
    >
      <Providers>
        <body className="min-h-screen bg-slate-50 antialiased">
          {children}

          <Toaster richColors position="top-center" />
        </body>
      </Providers>
    </html>
  );
}
