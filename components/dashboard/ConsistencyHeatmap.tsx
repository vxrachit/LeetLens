'use client';

import { motion } from 'framer-motion';
import { SubmissionCalendar } from '@/lib/leetcode/types';

interface ConsistencyHeatmapProps {
  submissionCalendar: SubmissionCalendar;
  streakDays: number;
  activeDays: number;
}

function getIntensity(count: number): string {
  if (count === 0) return 'bg-white/4';
  if (count <= 2) return 'bg-cyan-500/25';
  if (count <= 5) return 'bg-cyan-500/50';
  if (count <= 9) return 'bg-cyan-500/75';
  return 'bg-cyan-500';
}

export function ConsistencyHeatmap({ submissionCalendar, streakDays, activeDays }: ConsistencyHeatmapProps) {
  const now = Math.floor(Date.now() / 1000);
  const weeks = 26;
  const days = weeks * 7;

  const cells: { ts: number; count: number; date: string }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const ts = now - i * 86400;
    const dayStart = ts - (ts % 86400);
    const count = submissionCalendar[dayStart.toString()] || submissionCalendar[ts.toString()] || 0;
    const date = new Date(ts * 1000).toISOString().split('T')[0];
    cells.push({ ts, count, date });
  }

  const weekColumns: typeof cells[] = [];
  for (let w = 0; w < weeks; w++) {
    weekColumns.push(cells.slice(w * 7, (w + 1) * 7));
  }

  const totalSubmissions = Object.values(submissionCalendar).reduce((s, v) => s + v, 0);
  const last30Days = cells.slice(-30).filter(c => c.count > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white">Consistency Heatmap</h3>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Streak: <span className="text-cyan-400 font-semibold">{streakDays}d</span></span>
          <span>Active: <span className="text-cyan-400 font-semibold">{activeDays}</span></span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px] min-w-max">
          {weekColumns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date}: ${day.count} submissions`}
                  className={`w-3.5 h-3.5 rounded-sm transition-all ${getIntensity(day.count)} hover:ring-1 hover:ring-cyan-400/50 cursor-default`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span>Less</span>
          {['bg-white/4', 'bg-cyan-500/25', 'bg-cyan-500/50', 'bg-cyan-500/75', 'bg-cyan-500'].map((cls) => (
            <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
        <div className="text-xs text-slate-500">
          <span className="text-slate-300">{last30Days}</span> active days last 30
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Total Submissions', value: totalSubmissions.toLocaleString() },
          { label: 'Active Days', value: activeDays },
          { label: 'Current Streak', value: `${streakDays}d` },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-sm font-bold text-cyan-400">{s.value}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
