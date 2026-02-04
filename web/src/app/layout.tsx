import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "HiveFence - Distributed AI Security",
  description: "Collective defense system for AI agents. When one is attacked, all become immune.",
  keywords: ["AI security", "prompt injection", "collective immunity", "distributed defense"],
  authors: [{ name: "Simon Kim", url: "https://github.com/seojoonkim" }],
  openGraph: {
    title: "HiveFence - Distributed AI Security",
    description: "When one is attacked, all become immune.",
    type: "website",
    url: "https://hivefence.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "HiveFence - Distributed AI Security",
    description: "When one is attacked, all become immune.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐝</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
