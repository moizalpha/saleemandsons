import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saleem & Sons — Built on Tradition",
  description: "Considered objects for the everyday. Built on tradition, crafted for the modern era.",
  applicationName: "Saleem & Sons Store",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
