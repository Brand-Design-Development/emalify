import "@emalify/styles/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@emalify/trpc/react";
import ClientLayout from "@emalify/app/layout-client";

export const metadata: Metadata = {
  title: "Emalify - Lead Management System",
  description: "Dashboard for managing leads and conversions",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <ClientLayout>{children}</ClientLayout>
        </TRPCReactProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
