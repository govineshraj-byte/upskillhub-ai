import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#060d24]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="text-lg font-bold text-white">
            Upskill<span className="glow-text">Hub AI</span>
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            AI-powered career guidance, resume analysis, job matching and personalized learning
            roadmaps. Set <code className="text-cyan-300">OPENAI_API_KEY</code> in Vercel / .env to
            enable live AI.
          </p>
        </div>
        <nav aria-label="Product">
          <p className="text-sm font-semibold text-slate-200">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-cyan-300" href="/assistant">AI Assistant</Link></li>
            <li><Link className="hover:text-cyan-300" href="/resume-analyzer">Resume Analyzer</Link></li>
            <li><Link className="hover:text-cyan-300" href="/job-match">Job Match</Link></li>
            <li><Link className="hover:text-cyan-300" href="/roadmap">Career Roadmap</Link></li>
          </ul>
        </nav>
        <nav aria-label="Learn">
          <p className="text-sm font-semibold text-slate-200">Learn</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-cyan-300" href="/courses">All career fields</Link></li>
            <li><Link className="hover:text-cyan-300" href="/courses?field=ai-ml">AI / ML</Link></li>
            <li><Link className="hover:text-cyan-300" href="/courses?field=data-analytics">Data Analytics</Link></li>
            <li><Link className="hover:text-cyan-300" href="/courses?field=cybersecurity">Cybersecurity</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        UpskillHub AI v2 — deploy-ready on Vercel. No API key is ever exposed to the browser.
      </div>
    </footer>
  );
}
