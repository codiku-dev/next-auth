import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextIntlClientProvider, useMessages } from "next-intl";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "App",
  description: "Application",
};

export default function RootLayout(p: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages() as IntlMessages;
  return (
    <ReactQueryProvider>
      <NextIntlClientProvider messages={messages}>
        <SessionProvider>
          <html lang={p.params.locale}>
            <body className={`${inter.className} h-screen p-16`}>
              <Toaster richColors position="top-right" />
              {p.children}
              <ReactQueryDevtools />
            </body>
          </html>
        </SessionProvider>
      </NextIntlClientProvider>
    </ReactQueryProvider>
  );
}
// CHIIIILLL 2
