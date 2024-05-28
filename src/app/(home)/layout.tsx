import type { Metadata } from "next";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Punsplash",
  description: "Welcome to Punsplash",
};

export default function RootLayout({
  children,
  authModal,
  photoModal,
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode;
  photoModal: React.ReactNode;
}>) {
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
          <Navbar />
          {authModal}
          {photoModal}
          {children}

          <Toaster richColors position="top-center" />
        </body>
      </Providers>
    </html>
  );
}
