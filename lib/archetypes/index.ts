import { BehavioralMetrics } from '../metrics';

export type ArchetypeId = 'grinder' | 'contest_specialist' | 'risk_avoider' | 'streak_addict' | 'deep_diver' | 'balanced_builder';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  blindspots: string[];
  color: string;
  gradient: string;
  icon: string;
  advice: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  grinder: {
    id: 'grinder',
    name: 'The Grinder',
    tagline: 'Volume is my strategy',
    description: 'You believe in the power of repetition. High solve count, consistent daily practice, broad topic coverage. You outpace peers through sheer volume.',
    strengths: ['Exceptional consistency', 'Broad topic exposure', 'Strong pattern recognition from volume'],
    blindspots: ['May plateau without tackling harder problems', 'Risk of solving without deeply understanding'],
    color: '#00d4ff',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    icon: '⚙',
    advice: 'Shift 20% of your time to Hard problems. Quality over quantity at this stage.',
  },
  contest_specialist: {
    id: 'contest_specialist',
    name: 'The Contest Specialist',
    tagline: 'I thrive under pressure',
    description: 'Competitive by nature. You train specifically for contests, excelling at timed problem-solving and algorithmic thinking under pressure.',
    strengths: ['Strong algorithmic intuition', 'Thrives under time pressure', 'High rating ceiling'],
    blindspots: ['May neglect real-world coding practices', 'Inconsistent daily solving'],
    color: '#ffd700',
    gradient: 'from-yellow-500/20 to-orange-500/20',
    icon: '⚡',
    advice: 'Apply your contest skills to system design. The combination is rare and highly valued.',
  },
  risk_avoider: {
    id: 'risk_avoider',
    name: 'The Risk Avoider',
    tagline: 'Safety first, always',
    description: 'You gravitate toward problems you\'re comfortable solving. High acceptance rate, low variance — but your growth curve has plateaued.',
    strengths: ['Reliable acceptance rate', 'Strong fundamentals in familiar topics', 'Low frustration tolerance pays off in Easy/Medium'],
    blindspots: ['Avoids Hard problems systematically', 'Limited exposure to advanced algorithms', 'Interview readiness may lag behind peers'],
    color: '#ff6b35',
    gradient: 'from-orange-500/20 to-red-500/20',
    icon: '🛡',
    advice: 'Schedule 2 Hard problems per week. Discomfort is the only path to growth.',
  },
  streak_addict: {
    id: 'streak_addict',
    name: 'The Streak Addict',
    tagline: 'The chain must not break',
    description: 'Consistency is your superpower — but also your cage. You prioritize maintaining streaks over challenging yourself, leading to surface-level growth.',
    strengths: ['Exceptional consistency metrics', 'Strong habit formation', 'Never stops showing up'],
    blindspots: ['Optimizes for the streak, not the skill', 'Tends to solve easy problems to maintain streak', 'Growth may be slower than volume suggests'],
    color: '#00ff88',
    gradient: 'from-green-500/20 to-emerald-500/20',
    icon: '🔥',
    advice: 'Break the easy problem habit. A day spent on 1 Hard problem beats 5 Easy problems.',
  },
  deep_diver: {
    id: 'deep_diver',
    name: 'The Deep Diver',
    tagline: 'Master one thing completely',
    description: 'You spend disproportionate time mastering specific topics. Deep expertise in a narrow domain, with significant gaps elsewhere.',
    strengths: ['Expert-level mastery in chosen topics', 'Solves niche hard problems with ease', 'Valued for specialized knowledge'],
    blindspots: ['Significant topic avoidance', 'May be blindsided in breadth-first interviews', 'Rating ceiling limited by weak areas'],
    color: '#a855f7',
    gradient: 'from-violet-500/20 to-purple-500/20',
    icon: '🔬',
    advice: 'Map your weak topics and dedicate 30% of practice to them. Balance amplifies your strengths.',
  },
  balanced_builder: {
    id: 'balanced_builder',
    name: 'The Balanced Builder',
    tagline: 'Steady, intentional, relentless',
    description: 'You approach LeetCode with intention. Balanced difficulty distribution, consistent topic coverage, sustainable practice habits.',
    strengths: ['Well-rounded skill set', 'Sustainable growth trajectory', 'Interview-ready across all domains'],
    blindspots: ['May lack a distinctive edge', 'Risk of being good at everything, great at nothing'],
    color: '#60a5fa',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    icon: '🏗',
    advice: 'You\'re interview-ready. Consider specializing in 1–2 areas to stand out from other balanced candidates.',
  },
};

export function determineArchetype(metrics: BehavioralMetrics): ArchetypeId {
  const {
    comfortZoneScore,
    contestResilience,
    growthEfficiency,
    hardProblemCourage,
    consistencyStability,
    topicAvoidance,
  } = metrics;

  const scores = {
    grinder: 0,
    contest_specialist: 0,
    risk_avoider: 0,
    streak_addict: 0,
    deep_diver: 0,
  };

  // Grinder: high consistency + medium growth + medium comfort zone
  scores.grinder += consistencyStability.score * 0.4;
  scores.grinder += comfortZoneScore.score * 0.3;
  scores.grinder += (100 - growthEfficiency.score) * 0.1;

  // Contest specialist: high contest resilience + high hard courage
  scores.contest_specialist += contestResilience.score * 0.4;
  scores.contest_specialist += hardProblemCourage.score * 0.4;
  scores.contest_specialist += growthEfficiency.score * 0.2;

  // Risk avoider: low hard courage + high comfort zone (low variety)
  scores.risk_avoider += (100 - hardProblemCourage.score) * 0.5;
  scores.risk_avoider += (100 - comfortZoneScore.score) * 0.3;
  scores.risk_avoider += topicAvoidance.topics.length * 4;

  // Streak addict: very high consistency + low growth efficiency
  scores.streak_addict += consistencyStability.score * 0.5;
  scores.streak_addict += (100 - growthEfficiency.score) * 0.3;
  scores.streak_addict += (100 - hardProblemCourage.score) * 0.2;

  // Deep diver: low comfort zone score + high topic avoidance
  scores.deep_diver += (100 - comfortZoneScore.score) * 0.4;
  scores.deep_diver += topicAvoidance.topics.length * 8;
  scores.deep_diver += hardProblemCourage.score * 0.2;

  const allMetricScores = [
    comfortZoneScore.score,
    contestResilience.score,
    growthEfficiency.score,
    hardProblemCourage.score,
    consistencyStability.score,
  ];
  const avgScore = allMetricScores.reduce((sum, value) => sum + value, 0) / allMetricScores.length;
  const variance = allMetricScores.reduce((sum, value) => sum + Math.pow(value - avgScore, 2), 0) / allMetricScores.length;
  const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [winner, topScore] = sortedScores[0] as [Exclude<ArchetypeId, 'balanced_builder'>, number];
  const secondScore = sortedScores[1]?.[1] ?? 0;

  // Balanced builder should be a fallback for genuinely even profiles, not a default winner.
  const balancedFit =
    avgScore >= 45 &&
    avgScore <= 72 &&
    variance <= 180 &&
    topScore < 58 &&
    topScore - secondScore < 8 &&
    comfortZoneScore.score >= 40 &&
    contestResilience.score >= 35 &&
    growthEfficiency.score >= 40 &&
    hardProblemCourage.score >= 35 &&
    consistencyStability.score >= 35;

  if (balancedFit) {
    return 'balanced_builder';
  }

  return winner;
}

export function generateBehavioralInsights(metrics: BehavioralMetrics, archetype: ArchetypeId): string[] {
  const insights: string[] = [];
  const { comfortZoneScore, contestResilience, growthEfficiency, hardProblemCourage, consistencyStability, topicAvoidance } = metrics;

  if (hardProblemCourage.score < 30) {
    insights.push('You systematically avoid Hard problems — this is the #1 predictor of slow growth.');
  } else if (hardProblemCourage.score > 70) {
    insights.push('Your Hard problem ratio puts you in the top 15% of active users.');
  }

  if (comfortZoneScore.score < 35) {
    insights.push('Your topic spread suggests comfort-seeking over challenge-seeking behavior.');
  }

  if (topicAvoidance.topics.length >= 3) {
    insights.push(`Critical gap detected: ${topicAvoidance.topics.slice(0, 2).join(' and ')} are near-zero in your history.`);
  }

  if (consistencyStability.score > 75) {
    insights.push('Your consistency is elite — this compounds into massive advantages over 6–12 months.');
  } else if (consistencyStability.score < 30) {
    insights.push('Irregular practice resets your retention curve, making each session less efficient.');
  }

  if (contestResilience.score < 35) {
    insights.push('Your contest performance is volatile — bad contests appear to derail your momentum.');
  }

  if (growthEfficiency.score < 40) {
    insights.push('Your difficulty distribution suggests you\'re optimizing for volume, not growth.');
  } else if (growthEfficiency.score > 75) {
    insights.push('Your difficulty progression is textbook-optimal for skill development.');
  }

  if (archetype === 'streak_addict') {
    insights.push('Streak psychology detected: you prioritize not breaking the chain over challenging yourself.');
  }

  if (archetype === 'contest_specialist' && consistencyStability.score < 50) {
    insights.push('You\'re a burst performer — peak preparation before contests with gaps between them.');
  }

  return insights.slice(0, 6);
}
