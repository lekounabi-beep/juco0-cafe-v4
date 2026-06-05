import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juco — Fresh Juices & Quality Coffee",
  description: "Juco Coffee & Juice Bar in Nafpaktos — fresh juices, specialty coffee, smoothies & snacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-stone-950 text-stone-100 min-h-screen font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-stone-950 text-stone-100 min-h-screen font-sans">{children}</body>
    </html>
  );
}
