import React from 'react';
import { motion } from 'motion/react';

interface Stat {
  name: string;
  value: number;
}

interface StatsVisualizerProps {
  stats: Stat[];
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SP. ATK',
  'special-defense': 'SP. DEF',
  speed: 'SPD',
};

export const StatsVisualizer: React.FC<StatsVisualizerProps> = ({ stats }) => {
  const getStatColor = (name: string) => {
    if (name === 'attack' || name === 'special-attack') return '#F87171'; // Lighter Red for dark mode
    if (name === 'defense' || name === 'special-defense') return '#60A5FA'; // Lighter Blue for dark mode
    return '#94A3B8';
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
      {stats.map((stat, index) => {
        const percentage = Math.min((stat.value / 180) * 100, 100);
        const color = getStatColor(stat.name);
        return (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex justify-between items-end px-0.5">
              <span className="text-[10px] font-bold tracking-[0.05em] text-gray-500 uppercase">
                {STAT_LABELS[stat.name] || stat.name}
              </span>
              <span className="text-sm font-semibold tabular-nums text-white/90">{stat.value}</span>
            </div>
            <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
