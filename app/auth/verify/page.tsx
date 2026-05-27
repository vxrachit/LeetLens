import Link from 'next/link';
import { AlertTriangle, ArrowRight, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { REQUIRED_REPO_URL, sanitizeNextPath } from '@/lib/github-auth';

interface VerifyPageProps {
  searchParams?: { next?: string; error?: string };
}

const errorCopy: Record<string, string> = {
  not_starred: 'Repo is not starred yet. Star the repository and try again.',
};

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const nextPath = sanitizeNextPath(searchParams?.next);
  const startHref = nextPath === '/' ? '/api/auth/github/start' : `/api/auth/github/start?next=${encodeURIComponent(nextPath)}`;
  const error = searchParams?.error ? errorCopy[searchParams.error] ?? null : null;

  return (
    <main className="min-h-screen bg-[#060a18] text-white flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-amber-500/8 rounded-full blur-[140px]" />
      </div>

      <section className="relative z-10 w-full max-w-xl glass-strong rounded-3xl border border-white/8 p-8 md:p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Verification required</p>
            <h1 className="text-2xl font-bold">Star the repo to unlock access</h1>
          </div>
        </div>

        <p className="text-slate-400 leading-relaxed mb-6">
          Your GitHub account is authenticated, but this project only opens for users who have starred the repository.
          Star it, then sign in again and we will verify it automatically.
        </p>

        {error ? (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-cyan-500 text-[#060a18] hover:bg-cyan-400 rounded-xl px-5 py-3 font-semibold">
            <a href={startHref}>
              <Github className="w-4 h-4" />
              Recheck with GitHub
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-5 py-3 border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Link href={REQUIRED_REPO_URL} target="_blank" rel="noreferrer">
              <Star className="w-4 h-4" />
              Open repo
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-slate-500 flex items-center gap-2">
          <ArrowRight className="w-3.5 h-3.5" />
          Once starred, return here and reconnect.
        </p>
      </section>
    </main>
  );
}