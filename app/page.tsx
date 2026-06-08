'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Brain,
  ChevronRight,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

const METRICS = [
  { icon: Brain, label: 'Comfort zone', desc: 'See whether your practice stays too safe.', color: '#4f8cff' },
  { icon: TrendingUp, label: 'Growth balance', desc: 'Track whether difficulty is progressing well.', color: '#23c483' },
  { icon: Zap, label: 'Hard-problem courage', desc: 'Measure how often you attempt tougher work.', color: '#f4b740' },
  { icon: Target, label: 'Contest resilience', desc: 'Understand how you respond under pressure.', color: '#f97316' },
  { icon: Shield, label: 'Topic blind spots', desc: 'Spot patterns in areas you avoid repeatedly.', color: '#8b5cf6' },
  { icon: Users, label: 'Peer comparison', desc: 'Benchmark your habits against other users.', color: '#0ea5e9' },
];

const HIGHLIGHTS = [
  'GitHub OAuth access control',
  'LeetCode profile and contest analysis',
  'Side-by-side compare view',
  'Professional dashboard reporting',
];

const EXAMPLE_USERNAMES = ['neal_wu', 'tourist', 'jiangly', 'Um_nik'];

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleAnalyze = (name?: string) => {
    const target = (name || username).trim();
    if (!target) return;
    setIsLoading(true);
    router.push(`/analyze/${encodeURIComponent(target)}`);
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(35,196,131,0.12),transparent_24%),linear-gradient(180deg,#07111f_0%,#050b15_100%)]" />
        <div className="grid-bg absolute inset-0 opacity-[0.35]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[980px] h-[620px] bg-cyan-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[520px] h-[520px] bg-emerald-500/6 rounded-full blur-[140px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#07111f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">LeetLens</div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Behavioral analysis for LeetCode</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <a
            href="#features"
            className="hidden rounded-xl px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hidden rounded-xl px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
          >
            How it works
          </a>
          <a
            href="/compare"
            className="hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:flex"
          >
            <Users className="h-3.5 w-3.5" />
            Compare
          </a>
          <button
            onClick={() => handleAnalyze()}
            className="rounded-xl border border-cyan-400/25 bg-cyan-400/8 px-4 py-2 text-sm font-medium text-cyan-200 transition-all hover:border-cyan-300/40 hover:bg-cyan-400/12"
          >
            Analyze
          </button>
          <UserMenu />
        </motion.div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8 lg:pb-20">
        <section className="grid items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Behavioral analysis for LeetCode, built for serious users
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Understand how you solve problems, not just how many you solve.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              LeetLens turns LeetCode activity into a clean professional dashboard: practice habits,
              contest resilience, topic blind spots, and side-by-side comparison in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                onClick={() => router.push('/auth/signin')}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-200"
              >
                Sign in to start
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => router.push('/compare')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/8"
              >
                Compare users
                <ChevronRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 grid gap-3 sm:grid-cols-2"
            >
              {HIGHLIGHTS.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-sm text-slate-300 backdrop-blur">
                  <Star className="h-4 w-4 text-cyan-300" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.27 }}
              className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400"
            >
              <span className="uppercase tracking-[0.22em] text-slate-500">Built for</span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">analysis</span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">comparison</span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">progress tracking</span>
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">GitHub access</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 max-w-2xl"
            >
              <div className={`relative flex items-center overflow-hidden rounded-2xl border bg-slate-950/50 shadow-2xl transition-all duration-300 ${focused ? 'border-cyan-300/40 ring-1 ring-cyan-300/20' : 'border-white/10'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_45%)]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Enter a LeetCode username"
                  className="relative z-10 flex-1 bg-transparent px-5 py-4 text-base text-white outline-none placeholder:text-slate-500"
                />
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!username.trim() || isLoading}
                  className="relative z-10 m-2 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
                      Loading
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Analyze
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <span className="text-slate-500">Examples:</span>
                {EXAMPLE_USERNAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleAnalyze(name)}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-slate-300 transition-colors hover:border-cyan-300/30 hover:text-cyan-200"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.16 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-cyan-400/8 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <div className="text-sm font-medium text-white">Profile snapshot</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">Example dashboard preview</div>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Ready to analyze
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Consistency', value: '82', tone: 'text-cyan-200' },
                  { label: 'Contest rank', value: 'Top 28%', tone: 'text-emerald-200' },
                  { label: 'Hard courage', value: '61', tone: 'text-amber-200' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-slate-950/35 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                    <div className={`mt-3 text-3xl font-semibold ${item.tone}`}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Growth balance</span>
                    <span className="text-emerald-200">Healthy</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    The profile suggests a steady practice curve with room to push into harder territory.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-slate-950/30 p-4">
                  <div className="text-sm font-medium text-white">Key signals</div>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                      <span>Topic focus</span>
                      <span className="text-cyan-200">Balanced</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                      <span>Streak stability</span>
                      <span className="text-emerald-200">Strong</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                      <span>Blind spots</span>
                      <span className="text-amber-200">Visible</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/8 bg-gradient-to-r from-cyan-400/10 via-white/5 to-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Shield className="h-4 w-4 text-cyan-200" />
                  GitHub sign-in required for full dashboard access
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Sign in to unlock personalized reports, comparison mode, and the full analysis experience.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="grid gap-4 pb-16 sm:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/8 bg-white/[0.035] p-5 backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${metric.color}14`, color: metric.color }}>
                <metric.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-base font-medium text-white">{metric.label}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{metric.desc}</p>
            </motion.div>
          ))}
        </section>

        <section id="how-it-works" className="pb-8">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                  <Star className="h-3.5 w-3.5 text-cyan-300" />
                  Designed for a clean first impression before sign-in
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Professional reporting that feels more like product analytics than a hobby project.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  The homepage now gives visitors a clear explanation of what LeetLens does, how access works,
                  and why the dashboard is worth signing into.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/8"
                >
                  Open compare view
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/8 bg-[#050b15]/60 px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BarChart3 className="h-4 w-4 text-cyan-300/80" />
              LeetLens
            </div>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
              A professional LeetCode analytics dashboard for understanding practice habits,
              tracking progress, and comparing users with clarity.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Product</div>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a href="/compare" className="block transition-colors hover:text-white">Compare users</a>
              <a href="/auth/signin" className="block transition-colors hover:text-white">Sign in</a>
              <a href="#features" className="block transition-colors hover:text-white">Features</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Access</div>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div>GitHub OAuth</div>
              <div>Repo star gating</div>
              <div>LeetCode analysis</div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/8 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Behavioral insights powered by LeetCode data.</p>
          <p>Built for a clearer, more professional landing experience.</p>
        </div>
      </footer>
    </div>
  );
}
