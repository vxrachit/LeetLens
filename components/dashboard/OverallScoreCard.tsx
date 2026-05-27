'use client';

import { motion } from 'framer-motion';
import { MetricScore } from '@/lib/metrics';

interface OverallScoreCardProps {
  metric: MetricScore;
  color: string;
}

const weightBreakdown = [
  { label: 'Consistency', weight: 25 },
  { label: 'Growth', weight: 20 },
  { label: 'Hard Courage', weight: 20 },
  { label: 'Contest', weight: 15 },
  { label: 'Topic Breadth', weight: 10 },
  { label: 'Topic Coverage', weight: 10 },
];

export function OverallScoreCard({ metric, color }: OverallScoreCardProps) {
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (metric.score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass neon-card rounded-2xl p-6 border border-white/6 futuristic-bg scanlines"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <motion.circle
                cx="48"
                cy="48"
                r="44"
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 10px ${color}50)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold" style={{ color }}>{metric.score}</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Overall</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: `${color}aa` }}>
              Weighted Composite
            </div>
            <h3 className="mt-1 text-xl font-semibold text-white">{metric.label}</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-400 leading-relaxed">{metric.description}</p>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">{metric.insight}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-0 lg:max-w-[420px]">
          {weightBreakdown.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/6 bg-white/5 px-3 py-2 text-xs">
              <div className="text-slate-400">{item.label}</div>
              <div className="mt-0.5 font-semibold text-white">{item.weight}%</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
