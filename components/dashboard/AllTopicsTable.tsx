'use client';

import { motion } from 'framer-motion';
import { TopicStats } from '@/lib/leetcode/types';
import { useState } from 'react';

interface AllTopicsTableProps {
  topicStats: TopicStats[];
}

type SortKey = 'topic' | 'solved' | 'percentage';

export function AllTopicsTable({ topicStats }: AllTopicsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('percentage');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = topicStats.filter(t =>
    t.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    if (sortKey === 'topic') {
      aVal = a.topic;
      bVal = b.topic;
    } else if (sortKey === 'solved') {
      aVal = a.solved;
      bVal = b.solved;
    } else {
      aVal = a.percentage;
      bVal = b.percentage;
    }

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }

    return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const stats = {
    totalTopics: topicStats.length,
    topicsWithProgress: topicStats.filter(t => t.solved > 0).length,
    totalQuestionsAttempted: topicStats.reduce((sum, t) => sum + t.solved, 0),
    totalQuestionsAvailable: topicStats.reduce((sum, t) => sum + t.total, 0),
    averageCompletion: Math.round(
      topicStats.reduce((sum, t) => sum + t.percentage, 0) / topicStats.length
    ),
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 50) return 'bg-cyan-500';
    if (percentage >= 25) return 'bg-amber-500';
    if (percentage > 0) return 'bg-orange-500';
    return 'bg-slate-700';
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 75) return 'text-emerald-400';
    if (percentage >= 50) return 'text-cyan-400';
    if (percentage >= 25) return 'text-amber-400';
    if (percentage > 0) return 'text-orange-400';
    return 'text-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6 border border-white/6"
    >
      <h3 className="font-semibold text-white mb-6">All Topics Coverage</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-slate-400 mb-1">Total Topics</p>
          <p className="text-lg font-bold text-cyan-400">{stats.totalTopics}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-slate-400 mb-1">With Progress</p>
          <p className="text-lg font-bold text-emerald-400">{stats.topicsWithProgress}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-slate-400 mb-1">Questions Done</p>
          <p className="text-lg font-bold text-amber-400">{stats.totalQuestionsAttempted}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-slate-400 mb-1">Total Available</p>
          <p className="text-lg font-bold text-slate-300">{stats.totalQuestionsAvailable}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-xs text-slate-400 mb-1">Avg Completion</p>
          <p className="text-lg font-bold text-cyan-400">{stats.averageCompletion}%</p>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
        <div className="flex gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="percentage">Sort by Completion %</option>
            <option value="solved">Sort by Questions Done</option>
            <option value="topic">Sort by Topic Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* Topics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Topic</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Solved</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Total</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Progress</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">%</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                  No topics found
                </td>
              </tr>
            ) : (
              sorted.map((topic) => (
                <tr key={topic.topic} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{topic.topic}</td>
                  <td className="py-3 px-4 text-right text-cyan-400">{topic.solved}</td>
                  <td className="py-3 px-4 text-right text-slate-400">{topic.total}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end">
                      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(topic.percentage)} transition-all`}
                          style={{ width: `${Math.max(topic.percentage, 2)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${getTextColor(topic.percentage)}`}>
                    {topic.percentage}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">{stats.totalQuestionsAttempted}</span> questions completed out of{' '}
          <span className="text-slate-300 font-semibold">{stats.totalQuestionsAvailable}</span> available across all topics
        </p>
      </div>
    </motion.div>
  );
}
