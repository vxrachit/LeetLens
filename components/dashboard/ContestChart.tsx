'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { ContestEntry } from '@/lib/leetcode/types';

interface ContestChartProps {
  contestHistory: ContestEntry[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ContestEntry }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isPositive = d.ratingChange >= 0;
  return (
    <div className="bg-[#0a0f1e]/95 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm backdrop-blur-xl">
      <p className="font-semibold text-white mb-1 text-xs">{d.contestTitle}</p>
      <p className="text-slate-400 text-xs">{d.date}</p>
      <p className="text-cyan-400 font-semibold mt-1">Rating: {d.rating}</p>
      <p className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{d.ratingChange} change
      </p>
      <p className="text-slate-500 text-xs">Solved: {d.problemsSolved}/{d.totalProblems}</p>
    </div>
  );
};

export function ContestChart({ contestHistory }: ContestChartProps) {
  if (contestHistory.length < 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border border-white/6 flex items-center justify-center h-48"
      >
        <p className="text-slate-500 text-sm">Not enough contest data</p>
      </motion.div>
    );
  }

  const recent = contestHistory.slice(-20);
  const avgRating = Math.round(recent.reduce((s, c) => s + c.rating, 0) / recent.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white">Contest Rating Trajectory</h3>
        <div className="text-right">
          <div className="text-xs text-slate-500">Current</div>
          <div className="font-bold text-cyan-400">{contestHistory[contestHistory.length - 1]?.rating ?? '—'}</div>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={recent} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
            <defs>
              <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#475569', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.slice(5)}
              interval={Math.floor(recent.length / 5)}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avgRating} stroke="rgba(0,212,255,0.2)" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#ratingGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#00d4ff', stroke: '#060a18', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span>Avg rating: <span className="text-slate-300">{avgRating}</span></span>
        <span>Contests: <span className="text-slate-300">{contestHistory.length}</span></span>
        <span>Peak: <span className="text-slate-300">{Math.max(...contestHistory.map(c => c.rating))}</span></span>
      </div>
    </motion.div>
  );
}
