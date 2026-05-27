'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Code as Code2, ChartBar as BarChart2, Users, ExternalLink, TrendingUp, Zap, Brain, Activity, Target, Shield } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ArchetypeCard } from './ArchetypeCard';
import { BadgesSection } from './BadgesSection';
import { InsightCard } from './InsightCard';
import { OverallScoreCard } from './OverallScoreCard';
import { TopicChart } from './TopicChart';
import { AllTopicsTable } from './AllTopicsTable';
import { ContestChart } from './ContestChart';
import { LanguagesSection } from './LanguagesSection';
import { ConsistencyHeatmap } from './ConsistencyHeatmap';
import { MetricsRadarChart } from './RadarChart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LEETCODE_BASE_URL } from '@/lib/env';
import { LeetCodeProfile } from '@/lib/leetcode/types';
import { BehavioralMetrics } from '@/lib/metrics';
import { Archetype } from '@/lib/archetypes';

interface DashboardData {
  profile: LeetCodeProfile;
  metrics: BehavioralMetrics;
  archetype: Archetype;
  insights: string[];
}

const METRIC_COLORS = ['#00d4ff', '#00ff88', '#ffd700', '#ff6b35', '#60a5fa', '#a78bfa'];
const METRIC_ICONS = [Brain, TrendingUp, Zap, Activity, Target, Shield];

export function DashboardClient({ username }: { username: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/leetcode/${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch {
        setError('Could not load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  if (loading) return <LoadingState username={username} />;
  if (error || !data) return <ErrorState error={error} onBack={() => router.push('/')} />;

  const { profile, metrics, archetype, insights } = data;
  const metricList = [
    metrics.comfortZoneScore,
    metrics.growthEfficiency,
    metrics.hardProblemCourage,
    metrics.consistencyStability,
    metrics.contestResilience,
    {
      score: metrics.topicAvoidance.score,
      label: 'Topic Coverage',
      description: metrics.topicAvoidance.topics.length > 0 
        ? `${metrics.topicAvoidance.topics.length} topics to work on`
        : 'Diverse topic coverage',
      insight: metrics.topicAvoidance.insight,
      level: (metrics.topicAvoidance.score >= 80 ? 'high' : metrics.topicAvoidance.score >= 50 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
    },
  ];

  const diffTotal = profile.problemStats.easySolved + profile.problemStats.mediumSolved + profile.problemStats.hardSolved;

  return (
    <div className="min-h-screen bg-[#060a18] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div
          className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full blur-[100px] opacity-15"
          style={{ background: archetype.color }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#060a18]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm tracking-tight">LeetLens</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/compare"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Users className="w-3.5 h-3.5" />
              Compare
            </a>
            <a
              href={`${LEETCODE_BASE_URL}/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              LeetCode
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Profile hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center gap-5"
        >
          <Avatar
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{ background: `${archetype.color}15`, border: `2px solid ${archetype.color}30`, color: archetype.color }}
          >
            <AvatarImage src={profile.avatar} alt={`${username} avatar`} className="object-cover" />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{username}</h1>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ background: `${archetype.color}15`, borderColor: `${archetype.color}30`, color: archetype.color }}
              >
                {archetype.name}
              </span>
            </div>
            <div className="flex items-center gap-5 mt-2 text-sm text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                Rank #{profile.ranking.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                {profile.problemStats.totalSolved} solved
              </span>
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                {profile.streakDays}d streak
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            {[
              { label: 'Easy', val: profile.problemStats.easySolved, color: '#00ff88' },
              { label: 'Medium', val: profile.problemStats.mediumSolved, color: '#ffd700' },
              { label: 'Hard', val: profile.problemStats.hardSolved, color: '#ff4444' },
            ].map((s) => (
              <div key={s.label} className="text-center px-4 py-3 glass rounded-xl border border-white/6">
                <div className="text-lg font-bold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Difficulty distribution bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 glass rounded-2xl p-5 border border-white/6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-400">Problem Distribution</span>
            <span className="text-sm font-semibold text-white">{diffTotal} total</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex">
            {[
              { val: profile.problemStats.easySolved, color: '#00ff88' },
              { val: profile.problemStats.mediumSolved, color: '#ffd700' },
              { val: profile.problemStats.hardSolved, color: '#ff4444' },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="h-full"
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(s.val / diffTotal) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              { label: 'Easy', pct: Math.round((profile.problemStats.easySolved / diffTotal) * 100), color: '#00ff88' },
              { label: 'Medium', pct: Math.round((profile.problemStats.mediumSolved / diffTotal) * 100), color: '#ffd700' },
              { label: 'Hard', pct: Math.round((profile.problemStats.hardSolved / diffTotal) * 100), color: '#ff4444' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-slate-500">{s.label}</span>
                <span className="font-medium" style={{ color: s.color }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main layout grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: archetype + insights */}
          <div className="xl:col-span-1 space-y-5">
            <ArchetypeCard archetype={archetype} />
            <BadgesSection badges={profile.badges} activeBadge={profile.activeBadge} />
            <InsightCard insights={insights} />
          </div>

          {/* Right: metrics + charts */}
          <div className="xl:col-span-2 space-y-5">
            <OverallScoreCard metric={metrics.overallScore} color={archetype.color} />

            {/* Metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metricList.map((metric, i) => (
                <MetricCard key={metric.label} metric={metric} index={i} color={METRIC_COLORS[i]} />
              ))}
            </div>

            {/* Radar */}
            <MetricsRadarChart metrics={metrics} color={archetype.color} username={username} />

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TopicChart topicStats={profile.topicStats} avoidedTopics={metrics.topicAvoidance.topics} />
              <ContestChart contestHistory={profile.contestHistory} />
            </div>

            {/* Languages Section */}
            <LanguagesSection recentSubmissions={profile.recentSubmissions} languageStats={profile.languageStats} />

            {/* All Topics Coverage Table */}
            <AllTopicsTable topicStats={profile.topicStats} />

            {/* Heatmap */}
            <ConsistencyHeatmap
              submissionCalendar={profile.submissionCalendar}
              streakDays={profile.streakDays}
              activeDays={profile.activeDays}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingState({ username }: { username: string }) {
  return (
    <div className="min-h-screen bg-[#060a18] flex flex-col items-center justify-center text-white">
      <div className="grid-bg fixed inset-0 opacity-40 pointer-events-none" />
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-bold mb-2">Analyzing <span className="text-cyan-400">{username}</span></h2>
        <p className="text-slate-500 text-sm">Computing behavioral metrics...</p>
        <div className="mt-6 flex items-center gap-2 justify-center">
          {['Fetching profile', 'Computing metrics', 'Identifying archetype'].map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-1.5 text-xs text-slate-500"
            >
              <div className="w-1 h-1 rounded-full bg-cyan-400/50 animate-pulse" style={{ animationDelay: `${i * 300}ms` }} />
              {step}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onBack }: { error: string | null; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#060a18] flex items-center justify-center text-white px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">
          ⚠
        </div>
        <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
        <p className="text-slate-400 text-sm mb-6">{error || 'Something went wrong.'}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm"
        >
          Try another username
        </button>
      </div>
    </div>
  );
}
