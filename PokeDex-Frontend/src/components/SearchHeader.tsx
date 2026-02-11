import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toLowerCase());
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-center pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl pointer-events-auto"
      >
        <form 
          onSubmit={handleSubmit}
          className="relative group"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pokémon (e.g., Mewtwo, 150)"
            className="w-full pl-12 pr-4 py-4 bg-[#161B22]/60 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl focus:shadow-blue-500/10 focus:bg-[#1C2128]/80 focus:outline-none transition-all duration-300 text-lg font-light tracking-tight placeholder:text-gray-500 text-white"
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              <div className="w-5 h-5 border-2 border-white/10 border-t-blue-400 rounded-full animate-spin" />
            </div>
          )}
        </form>
      </motion.div>
    </header>
  );
};
