import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Rule Learning Lab | Symbolic Synthesis vs. BDH-CQ Frontier Architecture",
  description:
    "An interactive educational laboratory demonstrating how AI learns transformation rules from ARC-AGI demonstrations through symbolic program synthesis vs. BDH-CQ recurrent latent memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
