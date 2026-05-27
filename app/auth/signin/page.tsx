import Link from 'next/link';
import { ArrowRight, BarChart3, Github, Shield, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_REPO_URL } from '@/lib/env';
import { REQUIRED_REPO_URL, sanitizeNextPath } from '@/lib/github-auth';

interface SignInPageProps {
  searchParams?: { error?: string; next?: string };
}

const errorCopy: Record<string, string> = {
  oauth: 'GitHub did not complete the OAuth handshake. Try again.',
  github: 'GitHub login failed. Check your OAuth app settings and retry.',
  config: 'GitHub OAuth is not configured in your local environment. Add the env values to .env.local and restart.',
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  const error = searchParams?.error ? errorCopy[searchParams.error] ?? 'Sign-in failed.' : null;
  const nextPath = sanitizeNextPath(searchParams?.next);
  const startHref = nextPath === '/' ? '/api/auth/github/start' : `/api/auth/github/start?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="min-h-screen bg-[#060a18] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute top-0 left-1/2 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[480px] w-[480px] rounded-full bg-emerald-500/6 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              GitHub-gated access
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Behavioral analysis for
              <span className="gradient-text block">LeetCode minds.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              LeetLens unlocks only for GitHub users who have starred the repository. After authentication, we verify your star automatically and open the full experience.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['GitHub authentication', 'Star verification', 'Profile-backed access'].map((item) => (
                <div key={item} className="glass rounded-2xl border border-white/8 px-4 py-4 text-sm text-slate-300">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                    <Shield className="h-4 w-4" />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <BarChart3 className="h-4 w-4 text-cyan-300" />
                Pro-grade dashboard
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <Star className="h-4 w-4 text-amber-300" />
                Access backed by repo star
              </div>
            </div>
          </section>

          <section className="glass-strong rounded-[2rem] border border-white/10 p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Authentication</p>
                <h2 className="mt-1 text-2xl font-bold">Continue with GitHub</h2>
              </div>
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                <Github className="h-5 w-5" />
              </div>
            </div>

            <p className="mb-6 text-sm leading-6 text-slate-400">
              Sign in once, then we check whether your GitHub account has starred <span className="text-slate-200">{REQUIRED_REPO_URL}</span>.
            </p>

            {error ? (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="space-y-3">
              <Button asChild className="h-12 w-full rounded-xl bg-cyan-500 font-semibold text-[#060a18] hover:bg-cyan-400">
                <a href={startHref}>
                  <Github className="h-4 w-4" />
                  Continue with GitHub
                </a>
              </Button>

              <Button asChild variant="outline" className="h-12 w-full rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
                  <Star className="h-4 w-4" />
                  Star repo first
                </Link>
              </Button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-4 text-xs text-slate-400">
              Tip: if GitHub shows only a permissions screen, that is expected. The repo-star check happens on our server after OAuth completes.
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Required repository: <span className="text-slate-300">{REQUIRED_REPO_URL}</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}