import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import { SearchHeader } from './components/SearchHeader';
import { StatsVisualizer } from './components/StatsVisualizer';
import { TypeBadge, getTypeAccentColor } from './components/TypeBadge';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

interface PokemonData {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  weight: number;
  height: number;
}

export default function App() {
  const [currentPokemon, setCurrentPokemon] = useState<PokemonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<number[]>([]);

  const fetchPokemon = async (query: string | number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      if (!response.ok) throw new Error('Pokemon not found');
      const data = await response.json();
      setCurrentPokemon(data);
    } catch (error) {
      toast.error('Pokemon Not Found', {
        description: 'Check the spelling or ID and try again.',
        duration: 3000,
        className: 'bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl p-4',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(1); // Start with Bulbasaur
  }, []);

  const handleNext = () => {
    if (currentPokemon) fetchPokemon(currentPokemon.id + 1);
  };

  const handlePrev = () => {
    if (currentPokemon && currentPokemon.id > 1) fetchPokemon(currentPokemon.id - 1);
  };

  const accentColor = currentPokemon 
    ? getTypeAccentColor(currentPokemon.types[0].type.name) 
    : '#000000';

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden relative">
      <Toaster theme="dark" position="bottom-center" />
      
      {/* Background Gradient Layer mimicking the light ray */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Central Vertical Ray */}
        <div 
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[600px] opacity-20 pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse at center, #293753 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        {/* Subtle overall center glow */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            background: 'radial-gradient(circle at 50% 50%, #1A2230 0%, #0B0E14 100%)'
          }}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={accentColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ 
              background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 60%)` 
            }}
          />
        </AnimatePresence>
      </div>

      <SearchHeader onSearch={fetchPokemon} isLoading={isLoading} />

      <main className="relative pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
          {isLoading ? (
            <LoadingSkeleton />
          ) : currentPokemon ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              {/* Main Product Card - Dark Glassmorphism */}
              <div className="bg-[#161B22]/40 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[40px] overflow-hidden">
                <div className="flex flex-col md:flex-row min-h-[500px]">
                  {/* Left Side: Artwork */}
                  <div className="w-full md:w-[45%] bg-white/[0.01] flex items-center justify-center p-12 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
                    <div className="absolute top-8 left-8">
                      <span className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                        #{String(currentPokemon.id).padStart(3, '0')}
                      </span>
                    </div>
                    
                    {/* Background Glow for Artwork */}
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{ 
                        background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)` 
                      }}
                    />

                    <motion.div
                      key={currentPokemon.id}
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative z-10 w-full aspect-square drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                    >
                      <ImageWithFallback
                        src={currentPokemon.sprites.other['official-artwork'].front_default}
                        alt={currentPokemon.name}
                        className="w-full h-full object-contain p-4"
                      />
                    </motion.div>
                  </div>

                  {/* Right Side: Info & Stats */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight capitalize mb-2 text-white">
                        {currentPokemon.name}
                      </h1>
                      <div className="flex gap-2 mb-8">
                        {currentPokemon.types.map((t) => (
                          <TypeBadge key={t.type.name} type={t.type.name} />
                        ))}
                      </div>
                      
                      <div className="h-px w-full bg-white/5 mb-8" />

                      <div className="space-y-8">
                        <div>
                          <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-6">Performance Profile</h3>
                          <StatsVisualizer 
                            stats={currentPokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat }))} 
                          />
                        </div>

                        <div className="flex gap-12">
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Height</p>
                            <p className="text-xl font-medium text-white/90">{currentPokemon.height / 10}m</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Weight</p>
                            <p className="text-xl font-medium text-white/90">{currentPokemon.weight / 10}kg</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation inside card */}
                    <div className="mt-12 flex items-center gap-6 pt-8 border-t border-white/5">
                      <button
                        onClick={handlePrev}
                        disabled={currentPokemon.id <= 1}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors disabled:opacity-30 group"
                      >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Prev
                      </button>
                      <div className="flex-1 h-px bg-white/5" />
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors group"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-12 flex flex-col items-center gap-4 opacity-30 select-none pointer-events-none">
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-4 rounded-full border-2 border-black" />
          <span className="font-bold tracking-widest text-[10px] uppercase">Designed for PokéDex OS</span>
        </div>
        <p className="text-[10px] font-medium tracking-tight">© 2026 FIGMA MAKE LABS. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
