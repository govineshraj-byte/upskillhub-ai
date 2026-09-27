import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "UpskillHub AI — Career Guidance, Resume Analyzer & Learning Platform",
  description:
    "AI-powered career guidance, resume analyzer with score, job matching, courses, roadmaps and interview prep.",
  keywords: ["career guidance", "resume analyzer", "job match", "courses", "AI mentor"],
  openGraph: {
    title: "UpskillHub AI",
    description: "AI Career Guidance + Resume Analyzer + Learning Platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-cyan-500 focus:px-4 focus:py-2 focus:text-slate-950"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
