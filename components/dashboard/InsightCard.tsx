'use client';

import { motion } from 'framer-motion';
import { Lightbulb, CircleAlert as AlertCircle } from 'lucide-react';

interface InsightCardProps {
  insights: string[];
}

export function InsightCard({ insights }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
        </div>
        <h3 className="font-semibold text-white">Behavioral Insights</h3>
      </div>

      <ul className="space-y-3">
        {insights.map((insight, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-white/2 border border-white/4 hover:bg-white/4 transition-colors"
          >
            <AlertCircle className="w-4 h-4 text-yellow-400/70 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
