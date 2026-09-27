"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bot, FileSearch, Briefcase, Map, GraduationCap, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: Sparkles },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/resume-analyzer", label: "Resume Analyzer", icon: FileSearch },
  { href: "/job-match", label: "Job Match", icon: Briefcase },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/courses", label: "Courses", icon: GraduationCap },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/10 bg-[#020617]/85 backdrop-blur-xl">
      <nav aria-label="Primary" className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="UpskillHub AI home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white shadow-lg shadow-cyan-500/30">
            U
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Upskill<span className="glow-text">Hub AI</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-cyan-400/15 text-cyan-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <l.icon className="h-4 w-4" aria-hidden />
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden lg:block">
          <Link
            href="/assistant"
            className="btn-glow rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Ask AI Mentor
          </Link>
        </div>
        <button
          className="rounded-lg p-2 text-slate-200 hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/10 px-4 py-3 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium",
                    pathname === l.href ? "bg-cyan-400/15 text-cyan-300" : "text-slate-200"
                  )}
                >
                  <l.icon className="h-4 w-4" aria-hidden />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
