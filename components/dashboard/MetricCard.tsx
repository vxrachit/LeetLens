'use client';

import { motion } from 'framer-motion';
import { MetricScore } from '@/lib/metrics';

interface MetricCardProps {
  metric: MetricScore;
  index: number;
  color: string;
}

const levelConfig = {
  low: { label: 'Low', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  medium: { label: 'Medium', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  high: { label: 'High', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export function MetricCard({ metric, index, color }: MetricCardProps) {
  const lvl = levelConfig[metric.level];
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (metric.score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="glass neon-card rounded-2xl p-5 border border-white/6 hover:border-white/10 transition-all duration-300 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white leading-tight">{metric.label}</h3>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{metric.description}</p>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${lvl.bg} ${lvl.text} ${lvl.border} ml-2 shrink-0`}>
          {lvl.label}
        </span>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <motion.circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ delay: index * 0.08 + 0.3, duration: 1, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.08 + 0.6 }}
              className="text-lg font-bold"
              style={{ color }}
            >
              {metric.score}
            </motion.span>
          </div>
        </div>

        {/* Bar visualization */}
        <div className="flex-1">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${metric.score}%` }}
              transition={{ delay: index * 0.08 + 0.4, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-600">0</span>
            <span className="text-[10px] text-slate-600">100</span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <p className="text-xs text-slate-400 leading-relaxed mt-auto border-t border-white/5 pt-3">
        {metric.insight}
      </p>
    </motion.div>
  );
}
