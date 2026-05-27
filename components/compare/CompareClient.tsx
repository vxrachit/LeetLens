'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Users, ChartBar as BarChart2, Minus, TrendingUp, Trophy, Flame, BookOpen, BadgeCheck } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { LeetCodeProfile } from '@/lib/leetcode/types';
import { BehavioralMetrics } from '@/lib/metrics';
import { Archetype } from '@/lib/archetypes';
import { UserMenu } from '@/components/auth/UserMenu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileData {
  profile: LeetCodeProfile;
  metrics: BehavioralMetrics;
  archetype: Archetype;
  insights: string[];
}

const METRIC_KEYS = [
  { key: 'comfortZoneScore', label: 'Comfort Zone', short: 'Comfort' },
  { key: 'growthEfficiency', label: 'Growth Efficiency', short: 'Growth' },
  { key: 'hardProblemCourage', label: 'Hard Courage', short: 'Courage' },
  { key: 'consistencyStability', label: 'Consistency', short: 'Consistency' },
  { key: 'contestResilience', label: 'Contest Resilience', short: 'Contest' },
] as const;

type ComparisonRow = {
  group: string;
  label: string;
  leftValue: number;
  rightValue: number;
  leftDisplay: string;
  rightDisplay: string;
  higherIsBetter: boolean;
  accent: string;
};

function compareHigher(leftValue: number, rightValue: number): 0 | 1 | 2 {
  if (leftValue > rightValue) return 1;
  if (rightValue > leftValue) return 2;
  return 0;
}

function compareLower(leftValue: number, rightValue: number): 0 | 1 | 2 {
  if (leftValue < rightValue) return 1;
  if (rightValue < leftValue) return 2;
  return 0;
}

function formatCount(value: number): string {
  return value.toLocaleString();
}

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

async function fetchProfile(username: string): Promise<ProfileData> {
  const res = await fetch(`/api/leetcode/${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export function CompareClient() {
  const router = useRouter();
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [data1, setData1] = useState<ProfileData | null>(null);
  const [data2, setData2] = useState<ProfileData | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [err1, setErr1] = useState('');
  const [err2, setErr2] = useState('');

  const load = async (which: 1 | 2) => {
    const username = which === 1 ? user1.trim() : user2.trim();
    if (!username) return;

    if (which === 1) { setLoading1(true); setErr1(''); }
    else { setLoading2(true); setErr2(''); }

    try {
      const d = await fetchProfile(username);
      if (which === 1) setData1(d);
      else setData2(d);
    } catch {
      if (which === 1) setErr1('Not found');
      else setErr2('Not found');
    } finally {
      if (which === 1) setLoading1(false);
      else setLoading2(false);
    }
  };

  const radarData = METRIC_KEYS.map(({ key, short }) => ({
    subject: short,
    [data1?.profile.username ?? 'User 1']: data1 ? (data1.metrics[key] as { score: number }).score : 0,
    [data2?.profile.username ?? 'User 2']: data2 ? (data2.metrics[key] as { score: number }).score : 0,
  }));

  const bothLoaded = data1 && data2;

  const comparisonRows: ComparisonRow[] = bothLoaded
    ? [
        {
          group: 'Overall',
          label: 'Overall Score',
          leftValue: data1.metrics.overallScore.score,
          rightValue: data2.metrics.overallScore.score,
          leftDisplay: `${data1.metrics.overallScore.score}/100`,
          rightDisplay: `${data2.metrics.overallScore.score}/100`,
          higherIsBetter: true,
          accent: '#a78bfa',
        },
        {
          group: 'Practice',
          label: 'Total Solved',
          leftValue: data1.profile.problemStats.totalSolved,
          rightValue: data2.profile.problemStats.totalSolved,
          leftDisplay: formatCount(data1.profile.problemStats.totalSolved),
          rightDisplay: formatCount(data2.profile.problemStats.totalSolved),
          higherIsBetter: true,
          accent: '#00d4ff',
        },
        {
          group: 'Profile',
          label: 'Rank',
          leftValue: data1.profile.ranking || Number.MAX_SAFE_INTEGER,
          rightValue: data2.profile.ranking || Number.MAX_SAFE_INTEGER,
          leftDisplay: data1.profile.ranking ? `#${formatCount(data1.profile.ranking)}` : '—',
          rightDisplay: data2.profile.ranking ? `#${formatCount(data2.profile.ranking)}` : '—',
          higherIsBetter: false,
          accent: '#fbbf24',
        },
        {
          group: 'Profile',
          label: 'Reputation',
          leftValue: data1.profile.reputation,
          rightValue: data2.profile.reputation,
          leftDisplay: formatCount(data1.profile.reputation),
          rightDisplay: formatCount(data2.profile.reputation),
          higherIsBetter: true,
          accent: '#60a5fa',
        },
        {
          group: 'Profile',
          label: 'Star Rating',
          leftValue: data1.profile.starRating,
          rightValue: data2.profile.starRating,
          leftDisplay: formatCount(data1.profile.starRating),
          rightDisplay: formatCount(data2.profile.starRating),
          higherIsBetter: true,
          accent: '#22c55e',
        },
        {
          group: 'Practice',
          label: 'Acceptance Rate',
          leftValue: data1.profile.acceptanceRate,
          rightValue: data2.profile.acceptanceRate,
          leftDisplay: formatPercent(data1.profile.acceptanceRate),
          rightDisplay: formatPercent(data2.profile.acceptanceRate),
          higherIsBetter: true,
          accent: '#14b8a6',
        },
        {
          group: 'Practice',
          label: 'Streak Days',
          leftValue: data1.profile.streakDays,
          rightValue: data2.profile.streakDays,
          leftDisplay: formatCount(data1.profile.streakDays),
          rightDisplay: formatCount(data2.profile.streakDays),
          higherIsBetter: true,
          accent: '#f97316',
        },
        {
          group: 'Practice',
          label: 'Active Days',
          leftValue: data1.profile.activeDays,
          rightValue: data2.profile.activeDays,
          leftDisplay: formatCount(data1.profile.activeDays),
          rightDisplay: formatCount(data2.profile.activeDays),
          higherIsBetter: true,
          accent: '#ef4444',
        },
        {
          group: 'Behavior',
          label: 'Comfort Zone',
          leftValue: data1.metrics.comfortZoneScore.score,
          rightValue: data2.metrics.comfortZoneScore.score,
          leftDisplay: `${data1.metrics.comfortZoneScore.score}/100`,
          rightDisplay: `${data2.metrics.comfortZoneScore.score}/100`,
          higherIsBetter: true,
          accent: '#00d4ff',
        },
        {
          group: 'Behavior',
          label: 'Growth Efficiency',
          leftValue: data1.metrics.growthEfficiency.score,
          rightValue: data2.metrics.growthEfficiency.score,
          leftDisplay: `${data1.metrics.growthEfficiency.score}/100`,
          rightDisplay: `${data2.metrics.growthEfficiency.score}/100`,
          higherIsBetter: true,
          accent: '#00ff88',
        },
        {
          group: 'Behavior',
          label: 'Hard Courage',
          leftValue: data1.metrics.hardProblemCourage.score,
          rightValue: data2.metrics.hardProblemCourage.score,
          leftDisplay: `${data1.metrics.hardProblemCourage.score}/100`,
          rightDisplay: `${data2.metrics.hardProblemCourage.score}/100`,
          higherIsBetter: true,
          accent: '#ffd700',
        },
        {
          group: 'Behavior',
          label: 'Consistency',
          leftValue: data1.metrics.consistencyStability.score,
          rightValue: data2.metrics.consistencyStability.score,
          leftDisplay: `${data1.metrics.consistencyStability.score}/100`,
          rightDisplay: `${data2.metrics.consistencyStability.score}/100`,
          higherIsBetter: true,
          accent: '#ff6b35',
        },
        {
          group: 'Behavior',
          label: 'Contest Resilience',
          leftValue: data1.metrics.contestResilience.score,
          rightValue: data2.metrics.contestResilience.score,
          leftDisplay: `${data1.metrics.contestResilience.score}/100`,
          rightDisplay: `${data2.metrics.contestResilience.score}/100`,
          higherIsBetter: true,
          accent: '#60a5fa',
        },
        {
          group: 'Coverage',
          label: 'Topic Coverage',
          leftValue: data1.metrics.topicAvoidance.score,
          rightValue: data2.metrics.topicAvoidance.score,
          leftDisplay: `${data1.metrics.topicAvoidance.score}/100`,
          rightDisplay: `${data2.metrics.topicAvoidance.score}/100`,
          higherIsBetter: true,
          accent: '#a78bfa',
        },
        {
          group: 'Coverage',
          label: 'Contest Count',
          leftValue: data1.profile.contestHistory.length,
          rightValue: data2.profile.contestHistory.length,
          leftDisplay: formatCount(data1.profile.contestHistory.length),
          rightDisplay: formatCount(data2.profile.contestHistory.length),
          higherIsBetter: true,
          accent: '#f97316',
        },
        {
          group: 'Coverage',
          label: 'Language Diversity',
          leftValue: data1.profile.languageStats?.length ?? 0,
          rightValue: data2.profile.languageStats?.length ?? 0,
          leftDisplay: formatCount(data1.profile.languageStats?.length ?? 0),
          rightDisplay: formatCount(data2.profile.languageStats?.length ?? 0),
          higherIsBetter: true,
          accent: '#22c55e',
        },
        {
          group: 'Coverage',
          label: 'Badges',
          leftValue: data1.profile.badges?.length ?? 0,
          rightValue: data2.profile.badges?.length ?? 0,
          leftDisplay: formatCount(data1.profile.badges?.length ?? 0),
          rightDisplay: formatCount(data2.profile.badges?.length ?? 0),
          higherIsBetter: true,
          accent: '#e879f9',
        },
      ]
    : [];

  const summary = comparisonRows.reduce(
    (acc, row) => {
      const winner = row.higherIsBetter
        ? compareHigher(row.leftValue, row.rightValue)
        : compareLower(row.leftValue, row.rightValue);

      if (winner === 1) acc.left += 1;
      else if (winner === 2) acc.right += 1;
      else acc.ties += 1;

      return acc;
    },
    { left: 0, right: 0, ties: 0 }
  );

  return (
    <div className="min-h-screen bg-[#060a18] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/4 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-emerald-500/4 rounded-full blur-[120px]" />
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
              <span className="hidden sm:inline">Home</span>
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm">LeetLens</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            Compare Profiles
          </div>
          <UserMenu />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Head-to-Head Analysis</h1>
          <p className="text-slate-400 text-sm mb-10">Compare behavioral profiles of two LeetCode users.</p>
        </motion.div>

        {/* Input row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {([1, 2] as const).map((which) => {
            const val = which === 1 ? user1 : user2;
            const setVal = which === 1 ? setUser1 : setUser2;
            const loading = which === 1 ? loading1 : loading2;
            const err = which === 1 ? err1 : err2;
            const data = which === 1 ? data1 : data2;
            const color = which === 1 ? '#00d4ff' : '#00ff88';

            return (
              <div key={which}>
                <label className="block text-xs text-slate-500 mb-2">
                  Player {which}
                </label>
                <div
                  className="flex items-center rounded-xl glass border border-white/8 overflow-hidden"
                  style={data ? { borderColor: `${color}30` } : undefined}
                >
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && load(which)}
                    placeholder={`Username ${which}...`}
                    className="flex-1 bg-transparent px-4 py-3 text-sm outline-none text-white placeholder-slate-600"
                  />
                  <button
                    onClick={() => load(which)}
                    disabled={!val.trim() || loading}
                    className="mr-2 px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-40 transition-all active:scale-95"
                    style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {err && <p className="text-xs text-red-400 mt-1">{err}</p>}
                {data && (
                  <p className="text-xs mt-1.5" style={{ color: `${color}80` }}>
                    {data.archetype.name} · {data.profile.problemStats.totalSolved} solved
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {bothLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Match summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: data1.profile.username, value: summary.left, tone: 'text-cyan-300', accent: '#00d4ff' },
                  { label: 'Ties', value: summary.ties, tone: 'text-slate-300', accent: '#64748b' },
                  { label: data2.profile.username, value: summary.right, tone: 'text-emerald-300', accent: '#00ff88' },
                ].map((item) => (
                  <Card key={item.label} className="border-white/6 bg-white/5 shadow-none">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-xs uppercase tracking-wide text-slate-500">Comparison score</CardDescription>
                      <CardTitle className={`text-3xl ${item.tone}`}>{item.value}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ background: item.accent, width: `${Math.max(12, item.value * 10)}%` }} />
                      </div>
                      <p className="mt-3 text-sm text-slate-400">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Major factors */}
              <div className="glass rounded-2xl p-6 border border-white/6">
                <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-white text-lg">Major Factors</h2>
                    <p className="text-sm text-slate-400">Profile, practice, contest, and coverage signals compared side by side.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Overall', 'Practice', 'Behavior', 'Coverage'].map((group) => (
                      <Badge key={group} variant="outline" className="border-white/10 bg-white/5 text-slate-300">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {comparisonRows.map((row) => {
                    const winner = row.higherIsBetter
                      ? compareHigher(row.leftValue, row.rightValue)
                      : compareLower(row.leftValue, row.rightValue);
                    const isLeft = winner === 1;
                    const isRight = winner === 2;

                    return (
                      <Card key={`${row.group}-${row.label}`} className="border-white/6 bg-[#08111f] shadow-none">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardDescription className="text-xs uppercase tracking-wide text-slate-500">{row.group}</CardDescription>
                              <CardTitle className="text-lg text-white">{row.label}</CardTitle>
                            </div>
                            <Badge variant={winner === 0 ? 'outline' : 'secondary'} className={winner === 0 ? 'border-white/10 bg-white/5 text-slate-300' : isLeft ? 'bg-cyan-500/15 text-cyan-200' : 'bg-emerald-500/15 text-emerald-200'}>
                              {winner === 0 ? 'Tie' : isLeft ? data1.profile.username : data2.profile.username}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className={`rounded-xl border p-3 ${isLeft ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-white/6 bg-white/5'}`}>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-400 truncate">{data1.profile.username}</span>
                                <span className={`text-sm font-bold ${isLeft ? 'text-cyan-300' : 'text-white'}`}>{row.leftDisplay}</span>
                              </div>
                            </div>
                            <div className={`rounded-xl border p-3 ${isRight ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/6 bg-white/5'}`}>
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-400 truncate">{data2.profile.username}</span>
                                <span className={`text-sm font-bold ${isRight ? 'text-emerald-300' : 'text-white'}`}>{row.rightDisplay}</span>
                              </div>
                            </div>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: row.accent }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(18, Math.abs(row.leftValue - row.rightValue) ? 72 : 50)}%` }}
                              transition={{ duration: 0.7, ease: 'easeOut' }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{row.higherIsBetter ? 'Higher is better' : 'Lower is better'}</span>
                            <span>{isLeft || isRight ? `Lead by ${Math.abs(row.leftValue - row.rightValue).toLocaleString()}` : 'Even match'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Radar comparison */}
              <div className="glass rounded-2xl p-6 border border-white/6">
                <h2 className="font-semibold text-white mb-5">Behavioral Fingerprint Comparison</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Radar
                        name={data1.profile.username}
                        dataKey={data1.profile.username}
                        stroke="#00d4ff"
                        fill="#00d4ff"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Radar
                        name={data2.profile.username}
                        dataKey={data2.profile.username}
                        stroke="#00ff88"
                        fill="#00ff88"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(6,10,24,0.95)',
                          border: '1px solid rgba(0,212,255,0.2)',
                          borderRadius: '10px',
                          fontSize: '12px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Metric-by-metric comparison */}
              <div className="glass rounded-2xl p-6 border border-white/6">
                <h2 className="font-semibold text-white mb-5">Metric Breakdown</h2>
                <div className="space-y-4">
                  {METRIC_KEYS.map(({ key, label }) => {
                    const s1 = (data1.metrics[key] as { score: number }).score;
                    const s2 = (data2.metrics[key] as { score: number }).score;
                    const diff = s1 - s2;
                    const winner = diff > 2 ? 1 : diff < -2 ? 2 : 0;

                    return (
                      <div key={key} className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                        {/* User 1 bar */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 truncate">{data1.profile.username}</span>
                            <span className={`text-xs font-bold ${winner === 1 ? 'text-cyan-400' : 'text-slate-500'}`}>{s1}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-cyan-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${s1}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Label */}
                        <div className="text-center w-28">
                          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
                          {winner !== 0 && (
                            <div className={`text-[10px] mt-0.5 ${winner === 1 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                              {winner === 1 ? `+${diff}` : `+${Math.abs(diff)}`} {winner === 1 ? '←' : '→'}
                            </div>
                          )}
                          {winner === 0 && <Minus className="w-3 h-3 text-slate-600 mx-auto mt-0.5" />}
                        </div>

                        {/* User 2 bar */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${winner === 2 ? 'text-emerald-400' : 'text-slate-500'}`}>{s2}</span>
                            <span className="text-xs text-slate-400 truncate text-right">{data2.profile.username}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex justify-end">
                            <motion.div
                              className="h-full rounded-full bg-emerald-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${s2}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side by side archetypes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { data: data1, color: '#00d4ff' },
                  { data: data2, color: '#00ff88' },
                ].map(({ data, color }) => (
                  <div
                    key={data.profile.username}
                    className="rounded-2xl p-5 border"
                    style={{ background: `${color}06`, borderColor: `${color}20` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                      >
                        {data.archetype.icon}
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color }}>{data.profile.username}</div>
                        <div className="text-xs text-slate-400">{data.archetype.name}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { label: 'Easy', val: data.profile.problemStats.easySolved },
                        { label: 'Med', val: data.profile.problemStats.mediumSolved },
                        { label: 'Hard', val: data.profile.problemStats.hardSolved },
                      ].map((s) => (
                        <div key={s.label} className="glass rounded-lg py-2">
                          <div className="text-sm font-bold" style={{ color }}>{s.val}</div>
                          <div className="text-[10px] text-slate-600">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                      {[
                        { label: 'Rank', value: data.profile.ranking ? `#${data.profile.ranking.toLocaleString()}` : '—' },
                        { label: 'Acceptance', value: `${Math.round(data.profile.acceptanceRate)}%` },
                        { label: 'Streak', value: `${data.profile.streakDays}d` },
                        { label: 'Languages', value: data.profile.languageStats?.length ?? 0 },
                      ].map((s) => (
                        <div key={s.label} className="glass rounded-lg py-2 px-2">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</div>
                          <div className="text-sm font-semibold" style={{ color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-3">
                      {data.archetype.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!bothLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 text-slate-600"
          >
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">Enter two usernames above to start comparing</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
