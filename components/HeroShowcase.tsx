'use client';

import { motion } from 'framer-motion';

export default function HeroShowcase() {
  return (
    <div className="mt-8 hidden md:flex items-center justify-center gap-6 pointer-events-none">
      <motion.div
        initial={{ y: 10, opacity: 0, rotate: -6 }}
        animate={{ y: -8, opacity: 1, rotate: -2 }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 6, ease: 'easeInOut' }}
        className="showcase-card neon-card"
        style={{ transformOrigin: '50% 60%' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400">Comfort Zone</div>
          <div className="text-sm font-bold text-cyan-400">72</div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full" style={{ width: '72%', background: 'linear-gradient(90deg,#00d4ff,#00ff88)' }} />
        </div>
        <div className="text-[12px] text-slate-500">Stable practice pattern</div>
      </motion.div>

      <motion.div
        initial={{ y: -6, opacity: 0, rotate: 4, scale: 0.98 }}
        animate={{ y: 6, opacity: 1, rotate: 2, scale: 1 }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 5, ease: 'easeInOut', delay: 0.2 }}
        className="showcase-card neon-card"
        style={{ transformOrigin: '50% 40%' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400">Hard Courage</div>
          <div className="text-sm font-bold text-yellow-400">54</div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full" style={{ width: '54%', background: 'linear-gradient(90deg,#ffd700,#ff6b35)' }} />
        </div>
        <div className="text-[12px] text-slate-500">Needs more bold attempts</div>
      </motion.div>

      <motion.div
        initial={{ y: 4, opacity: 0, rotate: -2 }}
        animate={{ y: -4, opacity: 1, rotate: 0 }}
        transition={{ repeat: Infinity, repeatType: 'mirror', duration: 6.5, ease: 'easeInOut', delay: 0.5 }}
        className="showcase-card neon-card"
        style={{ transformOrigin: '50% 50%' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-slate-400">Contest Resilience</div>
          <div className="text-sm font-bold text-indigo-300">61</div>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full" style={{ width: '61%', background: 'linear-gradient(90deg,#60a5fa,#a78bfa)' }} />
        </div>
        <div className="text-[12px] text-slate-500">Average under pressure</div>
      </motion.div>
    </div>
  );
}
