import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KnowCode Academy — Learn Coding, Design, Gaming & More",
  description:
    "KnowCode Academy: skill development in coding, design, gaming and vibe-coding. Build real products with AI-powered tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
