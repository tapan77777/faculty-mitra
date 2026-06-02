import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FacultyMitra — AI Teaching Assistant on WhatsApp",
  description:
    "Paste your syllabus. Get what's outdated, what industry wants, and ready-to-use assignments — instantly. In any language.",
  keywords: ["FacultyMitra", "AI teaching assistant", "WhatsApp", "Indian colleges", "faculty", "syllabus audit"],
  openGraph: {
    title: "FacultyMitra — AI Teaching Assistant on WhatsApp",
    description:
      "Paste your syllabus. Get what's outdated, what industry wants, and ready-to-use assignments — instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
