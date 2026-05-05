import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Orto | Tournament Tracker",
  description: "Ubah hobi jadi profesional!",
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
