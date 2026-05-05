import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Americano Pro Tracker",
  description: "Track your Americano Padel matches with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <body className="bg-app-bg text-app-text font-sans selection:bg-primary selection:text-surface antialiased">
        <Providers>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <Navigation />
            <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-28 md:pb-10">
              <div className="max-w-4xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
