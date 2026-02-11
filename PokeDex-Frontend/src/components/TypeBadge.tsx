import React from 'react';

interface TypeBadgeProps {
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  water: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  grass: 'bg-green-500/10 text-green-400 border-green-500/20',
  electric: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ice: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  fighting: 'bg-red-500/10 text-red-400 border-red-500/20',
  poison: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  ground: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  flying: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  psychic: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  bug: 'bg-lime-500/10 text-lime-400 border-lime-500/20',
  rock: 'bg-stone-500/10 text-stone-400 border-stone-500/20',
  ghost: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  dragon: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  dark: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  steel: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  fairy: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  normal: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  return (
    <span className={`px-4 py-1 rounded-full border text-xs font-semibold tracking-wide uppercase ${TYPE_COLORS[type] || 'bg-gray-50 text-gray-500'}`}>
      {type}
    </span>
  );
};

export const getTypeAccentColor = (type: string): string => {
  const colors: Record<string, string> = {
    fire: '#FF4422',
    water: '#3399FF',
    grass: '#77CC55',
    electric: '#FFCC33',
    ice: '#66CCFF',
    fighting: '#BB5544',
    poison: '#AA5599',
    ground: '#DDBB55',
    flying: '#8899FF',
    psychic: '#FF5599',
    bug: '#AABB22',
    rock: '#BBAA66',
    ghost: '#6666BB',
    dragon: '#7766EE',
    dark: '#775544',
    steel: '#AAAABB',
    fairy: '#EE99EE',
    normal: '#AAAA99',
  };
  return colors[type] || '#000000';
};
