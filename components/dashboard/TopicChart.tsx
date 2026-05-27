'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TopicStats } from '@/lib/leetcode/types';

interface TopicChartProps {
  topicStats: TopicStats[];
  avoidedTopics: string[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TopicStats }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0a0f1e]/95 border border-cyan-500/20 rounded-xl px-4 py-3 text-sm backdrop-blur-xl">
      <p className="font-semibold text-white mb-1">{d.topic}</p>
      <p className="text-slate-400">{d.solved} / {d.total} solved</p>
      <p className="text-cyan-400">{d.percentage}% completion</p>
    </div>
  );
};

export function TopicChart({ topicStats, avoidedTopics }: TopicChartProps) {
  // Filter out topics with 0 solved problems, then show top 15
  const filtered = topicStats.filter(t => t.solved > 0);
  const sorted = [...filtered].sort((a, b) => b.solved - a.solved).slice(0, 15);

  // Transform data to show percentage on chart
  const chartData = sorted.map(t => ({
    ...t,
    displayValue: t.percentage,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-white">Topic Distribution</h3>
        <div className="flex items-center gap-3">
          {avoidedTopics.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-orange-400">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              {avoidedTopics.length} avoided topics
            </div>
          )}
          <div className="text-xs text-slate-400 flex gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> &gt;50%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: '#00d4ff99'}} /> 25-50%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background: '#00d4ff66'}} /> &lt;25%</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        {sorted.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Topic data not available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }} barSize={10}>
              <XAxis
                dataKey="topic"
                tick={{ fill: '#64748b', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                label={{ value: 'Completion %', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 12 } }}
                tick={{ fill: '#64748b', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="displayValue" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => {
                  const isAvoided = avoidedTopics.includes(entry.topic);
                  return (
                    <Cell
                      key={entry.topic}
                      fill={isAvoided ? '#ff6b35' : entry.percentage > 50 ? '#00d4ff' : entry.percentage > 25 ? '#00d4ff99' : '#00d4ff66'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {avoidedTopics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">Avoided:</span>
          {avoidedTopics.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">Chart shows:</span> Completion percentage for each topic. Hover over bars to see solved problems count.
        </p>
      </div>
    </motion.div>
  );
}
