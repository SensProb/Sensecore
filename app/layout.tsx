import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SenseCore | Industrial Monitor",
  description: "Real-time motor health monitoring dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
