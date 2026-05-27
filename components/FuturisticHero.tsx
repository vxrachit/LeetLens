'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroShowcase from './HeroShowcase';
import { useRouter } from 'next/navigation';

export default function FuturisticHero({ examples = ['neal_wu', 'tourist'] }: { examples?: string[] }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useTransform(mx, (v) => `${v / 20}px`);
  const ty = useTransform(my, (v) => `${v / 20}px`);

  const handleAnalyze = useCallback((name?: string) => {
    const target = (name || username).trim();
    if (!target) return;
    setIsLoading(true);
    router.push(`/analyze/${encodeURIComponent(target)}`);
  }, [username, router]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onMove(e: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx.set(e.clientX - cx);
      my.set(e.clientY - cy);
    }
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // Canvas particles
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const context2d = canvas.getContext('2d');
    if (!context2d) return;
    const ctx: CanvasRenderingContext2D = context2d;
    let w = (canvas.width = canvas.clientWidth * devicePixelRatio);
    let h = (canvas.height = canvas.clientHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 0.5 + Math.random() * 1.6,
      alpha: 0.1 + Math.random() * 0.25,
    }));

    let raf = 0;
    function resize() {
      w = (canvas.width = canvas.clientWidth * devicePixelRatio);
      h = (canvas.height = canvas.clientHeight * devicePixelRatio);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.clientWidth + 10;
        if (p.x > canvas.clientWidth + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.clientHeight + 10;
        if (p.y > canvas.clientHeight + 10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section ref={containerRef} className="relative z-10 max-w-6xl mx-auto px-4 py-24">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 w-full h-full" />

      <div className="relative z-20">
        <motion.div style={{ x: tx, y: ty }} className="text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-4">
            <span className="block">Discover your</span>
            <span className="block gradient-text">coding behavior, decoded.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-2xl mx-auto mb-8">
            LeetLens analyzes patterns in your problem solving to reveal strengths, blindspots, and a personalized growth plan.
          </motion.p>

          <div className="max-w-2xl mx-auto">
            <div className={`relative flex items-center rounded-3xl transition-all duration-300 holo-input ${focused ? 'glass-strong glow-cyan' : 'glass'}`}>
              <div className="glint" />
              <input value={username} onChange={(e) => setUsername(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()} placeholder="Enter LeetCode username" className="flex-1 bg-transparent px-6 py-4 text-lg outline-none placeholder-slate-600 text-white" />
              <button onClick={() => handleAnalyze()} disabled={!username.trim() || isLoading} className={`ml-4 mr-2 px-5 py-3 rounded-2xl font-semibold neon-cta ${isLoading ? '' : 'pulse'}`}>
                {isLoading ? '...' : (<><span className="mr-2">Analyze</span><ArrowRight className="inline-block w-4 h-4"/></>)}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
              {examples.map((e) => (
                <button key={e} onClick={() => handleAnalyze(e)} className="font-mono px-2 py-1 rounded hover:text-cyan-300 transition-colors">{e}</button>
              ))}
            </div>
          </div>
        </motion.div>

        <HeroShowcase />
      </div>
    </section>
  );
}
