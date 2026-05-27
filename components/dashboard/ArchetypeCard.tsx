'use client';

import { motion } from 'framer-motion';
import { Archetype } from '@/lib/archetypes';
import { CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle } from 'lucide-react';

interface ArchetypeCardProps {
  archetype: Archetype;
}

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl p-8 relative overflow-hidden border neon-card"
      style={{
        background: `linear-gradient(135deg, ${archetype.color}08 0%, transparent 60%)`,
        borderColor: `${archetype.color}25`,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
        style={{ background: archetype.color }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `${archetype.color}15`, border: `1px solid ${archetype.color}30` }}
          >
            {archetype.icon}
          </div>
          <div>
            <div className="text-xs font-medium mb-1.5" style={{ color: `${archetype.color}90` }}>
              YOUR ARCHETYPE
            </div>
            <h2 className="text-2xl font-bold" style={{ color: archetype.color }}>
              {archetype.name}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5 italic">&ldquo;{archetype.tagline}&rdquo;</p>
          </div>
        </div>

        <p className="text-[15px] text-slate-300 leading-relaxed mb-6">
          {archetype.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-emerald-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" /> Strengths
            </div>
            <ul className="space-y-1.5">
              {archetype.strengths.map((s) => (
                <li key={s} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-400/60 mt-1.5 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-orange-400 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Blindspots
            </div>
            <ul className="space-y-1.5">
              {archetype.blindspots.map((b) => (
                <li key={b} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-orange-400/60 mt-1.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="rounded-xl p-4 text-sm text-slate-300 border"
          style={{ background: `${archetype.color}08`, borderColor: `${archetype.color}20` }}
        >
          <span className="font-semibold" style={{ color: archetype.color }}>Coach advice: </span>
          {archetype.advice}
        </div>
      </div>
    </motion.div>
  );
}
