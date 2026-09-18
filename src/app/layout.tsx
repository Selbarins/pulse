import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulses",
  description: "Single-player life RPG / personal performance system",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pulses",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased bg-[#0B0D10] text-white">
        {children}
      </body>
    </html>
  );
}
