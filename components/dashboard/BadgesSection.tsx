'use client';

import { motion } from 'framer-motion';
import { Badge as BadgeType, ActiveBadge } from '@/lib/leetcode/types';

interface BadgesSectionProps {
  badges?: BadgeType[];
  activeBadge?: ActiveBadge | null;
}

export function BadgesSection({ badges = [], activeBadge = null }: BadgesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Badges</h3>
        {activeBadge && (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <img src={activeBadge.icon} alt={activeBadge.displayName} className="w-6 h-6 rounded-full" />
            <span className="text-white font-medium">{activeBadge.displayName}</span>
          </div>
        )}
      </div>

      {badges.length === 0 ? (
        <div className="h-28 flex items-center justify-center text-slate-500">No badges available</div>
      ) : (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(110px,1fr))]">
          {badges.map((b) => (
            <div key={b.id || b.name} className="flex min-w-0 flex-col items-center text-center text-xs">
              <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/6">
                {b.icon ? (
                  // icon may be a URL or inline string
                  <img src={b.icon} alt={b.displayName || b.name} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="text-slate-400">🏅</div>
                )}
              </div>
              <div className="mt-2 min-h-8 w-full px-1 text-slate-300 leading-snug break-words whitespace-normal">
                {b.displayName || b.name}
              </div>
            </div>
          ))}
        </div>
      )}

    </motion.div>
  );
}
