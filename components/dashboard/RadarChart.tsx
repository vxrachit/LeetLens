'use client';

import { motion } from 'framer-motion';
import {
  RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { BehavioralMetrics } from '@/lib/metrics';

interface RadarChartProps {
  metrics: BehavioralMetrics;
  color?: string;
  username?: string;
}

export function MetricsRadarChart({ metrics, color = '#00d4ff', username }: RadarChartProps) {
  const data = [
    { subject: 'Comfort Zone', score: metrics.comfortZoneScore.score, fullMark: 100 },
    { subject: 'Contest', score: metrics.contestResilience.score, fullMark: 100 },
    { subject: 'Growth', score: metrics.growthEfficiency.score, fullMark: 100 },
    { subject: 'Hard Courage', score: metrics.hardProblemCourage.score, fullMark: 100 },
    { subject: 'Consistency', score: metrics.consistencyStability.score, fullMark: 100 },
    { subject: 'Topics', score: metrics.topicAvoidance.score, fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <h3 className="font-semibold text-white mb-1">
        {username ? `${username}'s` : 'Your'} Behavioral Profile
      </h3>
      <p className="text-xs text-slate-500 mb-5">6-axis behavioral fingerprint</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke={color}
              fill={color}
              fillOpacity={0.12}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(6,10,24,0.95)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '10px',
                fontSize: '12px',
              }}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
