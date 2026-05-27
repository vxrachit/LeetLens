'use client';

import { motion } from 'framer-motion';
import { RecentSubmission, LanguageStat } from '@/lib/leetcode/types';

interface LanguagesSectionProps {
  recentSubmissions?: RecentSubmission[];
  languageStats?: LanguageStat[];
}

const LANGUAGE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  python3: { bg: '#3776ab', text: '#ffffff', icon: '🐍' },
  cpp: { bg: '#00599c', text: '#ffffff', icon: '⚙️' },
  java: { bg: '#ed8936', text: '#ffffff', icon: '☕' },
  javascript: { bg: '#f7df1e', text: '#000000', icon: '⚡' },
  typescript: { bg: '#3178c6', text: '#ffffff', icon: '📘' },
  csharp: { bg: '#239120', text: '#ffffff', icon: '🎯' },
  go: { bg: '#00add8', text: '#ffffff', icon: '🚀' },
  rust: { bg: '#ce422b', text: '#ffffff', icon: '🦀' },
  kotlin: { bg: '#7f52ff', text: '#ffffff', icon: '🔮' },
  swift: { bg: '#fa7343', text: '#ffffff', icon: '🍎' },
  mysql: { bg: '#00758f', text: '#ffffff', icon: '🗄️' },
  sql: { bg: '#cc2927', text: '#ffffff', icon: '📊' },
  default: { bg: '#64748b', text: '#ffffff', icon: '💻' },
};

export function LanguagesSection({ recentSubmissions = [], languageStats }: LanguagesSectionProps) {
  // If aggregated languageStats provided by server, prefer it
  let computed: { lang: string; count: number; percentage: number }[] = [];

  if (languageStats && languageStats.length > 0) {
    const total = languageStats.reduce((s, l) => s + l.count, 0) || 1;
    computed = languageStats.map(l => ({ lang: l.lang, count: l.count, percentage: Math.round((l.count / total) * 100) }));
  } else if (recentSubmissions && recentSubmissions.length > 0) {
    const counts: Record<string, number> = {};
    for (const sub of recentSubmissions) {
      const l = (sub.lang || 'unknown').toLowerCase();
      counts[l] = (counts[l] || 0) + 1;
    }
    const total = recentSubmissions.length || 1;
    computed = Object.entries(counts).map(([lang, count]) => ({ lang, count, percentage: Math.round((count / total) * 100) }));
  }

  // Sort and take top 8
  const topLanguages = computed.sort((a, b) => b.count - a.count).slice(0, 8);
  const total = (languageStats && languageStats.length > 0)
    ? (languageStats.reduce((s, l) => s + l.count, 0) || 0)
    : recentSubmissions.length;

  if (topLanguages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 border border-white/6"
      >
        <h3 className="font-semibold text-white mb-4">Programming Languages</h3>
        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
          No submission data available
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <h3 className="font-semibold text-white mb-6">Programming Languages</h3>

      <div className="space-y-4">
        {topLanguages.map((entry, idx) => {
          const lang = entry.lang;
          const count = entry.count;
          const percentage = entry.percentage;
          const colors = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default;

          return (
            <motion.div
              key={lang}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">{colors.icon}</span>
                <span className="text-white font-medium capitalize flex-1">{lang}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-cyan-400">{percentage}%</span>
                  <span className="text-xs text-slate-500">({count} submissions)</span>
                </div>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: colors.bg }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.5 + idx * 0.05, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">Total submissions analyzed:</span> {total} recent solutions
        </p>
      </div>
    </motion.div>
  );
}
