'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Brain, Target, TrendingUp, Shield, Activity, ChevronRight, ChartBar as BarChart2, Users, Star } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

const METRICS = [
  { icon: Brain, label: 'Comfort Zone Score', desc: 'Are you avoiding difficult territory?', color: '#00d4ff' },
  { icon: TrendingUp, label: 'Growth Efficiency', desc: 'Is your difficulty progression optimal?', color: '#00ff88' },
  { icon: Zap, label: 'Hard Problem Courage', desc: 'Do you face hard problems or flee?', color: '#ffd700' },
  { icon: Activity, label: 'Consistency Stability', desc: 'Volume spiker or steady practitioner?', color: '#ff6b35' },
  { icon: Target, label: 'Contest Resilience', desc: 'How do you handle competitive loss?', color: '#60a5fa' },
  { icon: Shield, label: 'Topic Avoidance', desc: 'What blind spots haunt your history?', color: '#a78bfa' },
];

const ARCHETYPES = [
  { name: 'The Grinder', desc: 'Volume is their weapon', color: '#00d4ff', icon: '⚙' },
  { name: 'The Contest Specialist', desc: 'Born to compete under pressure', color: '#ffd700', icon: '⚡' },
  { name: 'The Risk Avoider', desc: 'Safety first, growth never', color: '#ff6b35', icon: '🛡' },
  { name: 'The Streak Addict', desc: 'The chain must never break', color: '#00ff88', icon: '🔥' },
];

const EXAMPLE_USERNAMES = ['neal_wu', 'tourist', 'jiangly', 'Um_nik'];

export default function LandingPage() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

  const handleAnalyze = (name?: string) => {
    const target = (name || username).trim();
    if (!target) return;
    setIsLoading(true);
    router.push(`/analyze/${encodeURIComponent(target)}`);
  };

  return (
    <div className="min-h-screen bg-[#060a18] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-70" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/3 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">LeetLens</span>
          <span className="text-[10px] font-mono text-cyan-400/60 border border-cyan-400/20 px-1.5 py-0.5 rounded-full ml-0.5">BETA</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <a
            href="/compare"
            className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <Users className="w-3.5 h-3.5" />
            Compare
          </a>
          <button
            onClick={() => handleAnalyze()}
            className="text-sm px-4 py-2 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            Analyze
          </button>
          <UserMenu />
        </motion.div>
      </nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-28 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 text-xs text-cyan-400 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Behavioral analysis engine — not a stats viewer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
        >
          Your LeetCode
          <br />
          <span className="gradient-text">psychology, exposed.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-400 max-w-2xl mb-14 leading-relaxed"
        >
          LeetLens goes beyond solved counts. We analyze your behavioral patterns, identify
          cognitive blind spots, and reveal the archetype that defines your practice.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-lg mb-5"
        >
          <div className={`relative flex items-center rounded-2xl transition-all duration-300 ${
            focused
              ? 'glass-strong border border-cyan-500/50 glow-cyan'
              : 'glass border border-white/8'
          }`}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter LeetCode username..."
              className="flex-1 bg-transparent px-5 py-4 text-base outline-none text-white placeholder-slate-600"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={!username.trim() || isLoading}
              className="mr-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#060a18] font-bold text-sm transition-all active:scale-95"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#060a18]/40 border-t-[#060a18] rounded-full animate-spin" />
              ) : (
                <> Analyze <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className="text-xs text-slate-600">Examples:</span>
            {EXAMPLE_USERNAMES.map((name) => (
              <button
                key={name}
                onClick={() => handleAnalyze(name)}
                className="text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono px-2 py-0.5 rounded hover:bg-cyan-400/8"
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-8 mt-2"
        >
          {[
            { value: '6', label: 'Metrics' },
            { value: '4+', label: 'Archetypes' },
            { value: '100+', label: 'Insights' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold text-cyan-400">{s.value}</div>
              <div className="text-xs text-slate-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Metrics section */}
      <section className="relative z-10 px-4 py-24 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Six lenses into your coding mind</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-[15px]">
            We compute behavioral metrics that reveal patterns you cannot see from raw statistics alone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                style={{ background: `${metric.color}12`, border: `1px solid ${metric.color}28` }}
              >
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
              </div>
              <h3 className="font-semibold text-white mb-1.5 text-[15px]">{metric.label}</h3>
              <p className="text-sm text-slate-500">{metric.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Archetypes */}
      <section className="relative z-10 px-4 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Which archetype are you?</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-[15px]">
            Your behavioral fingerprint maps to a distinct coding personality with unique strengths and blindspots.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCHETYPES.map((arch, i) => (
            <motion.div
              key={arch.name}
              initial={{ opacity: 0, scale: 0.93 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 text-center cursor-default"
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                style={{ background: `${arch.color}12`, border: `1px solid ${arch.color}30` }}
              >
                {arch.icon}
              </div>
              <h3 className="font-bold text-sm mb-1.5" style={{ color: arch.color }}>{arch.name}</h3>
              <p className="text-xs text-slate-500">{arch.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-10 text-center border border-white/8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 mb-6">
            <Star className="w-3 h-3" />
            GitHub sign-in required.
          </div>
          <h2 className="text-3xl font-bold mb-3">Ready to see the truth?</h2>
          <p className="text-slate-400 text-sm mb-8">Most developers discover something surprising about their practice habits after unlocking the dashboard.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 text-sm text-slate-400">
            {['Enter your username', 'We analyze patterns', 'Get your full report'].map((step, i) => (
              <div key={step} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <span className="text-slate-300">{step}</span>
                {i < 2 && <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-slate-600" />}
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push('/auth/signin')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#060a18] font-bold transition-all active:scale-95 text-sm"
          >
            Sign in to unlock dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart2 className="w-3.5 h-3.5 text-cyan-400/40" />
          <span className="text-sm font-semibold text-slate-500">LeetLens</span>
        </div>
        <p className="text-xs text-slate-700">Behavioral insights powered by Leetcode data .</p>
      </footer>
    </div>
  );
}
