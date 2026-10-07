import React from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { Movie } from '../types';
import { getArtUrl } from '../utils/svgArt';

interface FeaturedPickProps {
  movie: Movie;
  isInMyList: boolean;
  onPlay: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
}

export const FeaturedPick: React.FC<FeaturedPickProps> = ({
  movie,
  isInMyList,
  onPlay,
  onToggleMyList,
}) => {
  return (
    <div className="relative mx-4 md:mx-12 my-12 rounded-xl overflow-hidden bg-gradient-to-r from-[#b20710] to-[#7d0a10] shadow-2xl border border-red-700/50">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
        {/* Left Information Panel */}
        <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90 mb-3">
            <span className="w-1.5 h-3.5 bg-white inline-block" />
            <span>Editor's Pick</span>
            <span className="bg-[#f5c518] text-black font-extrabold text-[11px] px-1.5 py-0.5 rounded font-sans ml-2">
              IMDb {movie.imdbRating}
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {movie.title}
          </h3>

          <p className="text-red-100 text-sm md:text-base leading-relaxed mb-6 max-w-md">
            {movie.description}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 bg-white text-[#e50914] hover:bg-neutral-100 font-bold px-6 py-3 rounded-md transition-all active:scale-95 shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch now</span>
            </button>

            <button
              onClick={() => onToggleMyList(movie)}
              className="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white font-medium px-5 py-3 rounded-md transition-all active:scale-95 backdrop-blur-xs cursor-pointer border border-white/20"
            >
              {isInMyList ? (
                <>
                  <Check className="w-4 h-4 text-green-300" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>My List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Artwork Panel */}
        <div className="md:col-span-6 relative min-h-[220px] md:min-h-full overflow-hidden">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getArtUrl(movie.sceneKey);
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#b20710] via-transparent to-transparent opacity-80" />
        </div>
      </div>
    </div>
  );
};
