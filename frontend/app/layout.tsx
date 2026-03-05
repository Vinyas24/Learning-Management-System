import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnFlow — Learning Management System",
  description:
    "A modern, minimalist LMS with structured video courses, progress tracking, and sequential learning paths.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}
        style={{ background: '#fef6ee' /* warm amber-cream base */ }}>

        {/* ── Global background: grid + orbs (fixed, z=0) ── */}
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Line grid – very subtle */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'linear-gradient(to right,rgba(249,115,22,0.06) 1px,transparent 1px),' +
              'linear-gradient(to bottom,rgba(249,115,22,0.06) 1px,transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
          {/* Large orange-peach orb – top left, dominant */}
          <div style={{ position: 'absolute', top: '-25%', left: '-15%', width: '70%', height: '90%', background: 'radial-gradient(ellipse,#fb923c,#fde68a)', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.35 }} />
          {/* Soft coral/pink orb – top right */}
          <div style={{ position: 'absolute', top: '-10%', right: '-20%', width: '60%', height: '80%', background: 'radial-gradient(ellipse,#fb7185,#fdba74)', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.25 }} />
          {/* Warm golden orb – bottom right */}
          <div style={{ position: 'absolute', bottom: '-20%', right: '5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse,#f97316,#fbbf24)', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.22 }} />
          {/* Soft amber orb – bottom left */}
          <div style={{ position: 'absolute', bottom: '-15%', left: '5%', width: '45%', height: '60%', background: 'radial-gradient(ellipse,#fde68a,#fef3c7)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.3 }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Header />
          <main className="main-content">{children}</main>
        </div>

      </body>
    </html>
  );
}
