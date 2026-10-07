import React from 'react';
import { GenreFilter } from '../types';
import { Film } from 'lucide-react';

interface CategoryChipsProps {
  selectedGenre: GenreFilter;
  onSelectGenre: (genre: GenreFilter) => void;
}

const GENRES: GenreFilter[] = [
  'All',
  'Action',
  'Sci-fi',
  'Drama',
  'Thriller',
  'Comedy',
  'Adventure' as GenreFilter,
  'Documentary',
  'Romance',
  'Western',
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedGenre,
  onSelectGenre,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 md:px-12 py-2 mb-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mr-1 shrink-0">
        <Film className="w-3.5 h-3.5 text-[#e50914]" />
        <span>Genre:</span>
      </div>
      {GENRES.map((genre) => {
        const isSelected = selectedGenre === genre;
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer border ${
              isSelected
                ? 'bg-[#e50914] border-[#e50914] text-white font-semibold shadow-md shadow-red-950/50'
                : 'bg-neutral-900/80 border-neutral-700/80 text-neutral-300 hover:border-neutral-500 hover:text-white'
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
};
