import React, { useState } from 'react';
import { Play, Plus, Check, ThumbsUp, ThumbsDown, ChevronDown, Star } from 'lucide-react';
import { Movie, UserRating } from '../types';
import { getArtUrl } from '../utils/svgArt';

interface MovieCardProps {
  movie: Movie;
  variant?: 'standard' | 'tall' | 'top10';
  rank?: number;
  isInMyList: boolean;
  userRating: 'like' | 'dislike' | null;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
  onRate: (movieId: string, rating: 'like' | 'dislike') => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  variant = 'standard',
  rank,
  isInMyList,
  userRating,
  onPlay,
  onMoreInfo,
  onToggleMyList,
  onRate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isTall = variant === 'tall';
  const defaultImageUrl = isTall ? movie.posterUrl : (movie.backdropUrl || movie.posterUrl);
  const [imgSrc, setImgSrc] = useState<string>(defaultImageUrl);

  const handleImageError = () => {
    setImgSrc(getArtUrl(movie.sceneKey));
  };

  // If Top 10 variant
  if (variant === 'top10' && rank !== undefined) {
    return (
      <div
        className="top10-card relative shrink-0 flex items-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
        style={{ width: '270px', height: '170px' }}
        onClick={() => onMoreInfo(movie)}
      >
        <span className="top10-num shrink-0 -mr-6 md:-mr-8 z-10">{rank}</span>
        <div className="relative w-36 h-full rounded-md overflow-hidden bg-neutral-800 shadow-lg border border-neutral-800 group-hover:border-neutral-600 transition-colors">
          <img
            src={imgSrc}
            alt={movie.title}
            onError={handleImageError}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <p className="text-white text-xs font-bold truncate">{movie.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="bg-[#f5c518] text-black font-extrabold text-[9px] px-1 py-0.2 rounded font-sans">
                ★ {movie.imdbRating}
              </span>
              <span className="text-[10px] text-[#6fcf7f] font-semibold">{movie.matchScore}%</span>
            </div>
          </div>

          {/* Quick play overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="w-10 h-10 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
              title="Play"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 group select-none rounded-md transition-all duration-300 ${
        isTall ? 'w-44 md:w-48 aspect-[2/3]' : 'w-56 md:w-64 aspect-video'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Card Poster */}
      <div
        onClick={() => onMoreInfo(movie)}
        className="relative w-full h-full rounded-md overflow-hidden bg-neutral-800 shadow-md border border-neutral-800/80 cursor-pointer group-hover:border-neutral-600 transition-all duration-300 group-hover:shadow-2xl"
      >
        <img
          src={imgSrc}
          alt={movie.title}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Title Bar at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 flex items-end justify-between gap-2">
          <p className="text-white text-xs md:text-sm font-bold truncate">{movie.title}</p>
          <span className="bg-[#f5c518] text-black font-extrabold text-[10px] px-1 py-0.2 rounded font-sans tracking-tight shrink-0">
            ★ {movie.imdbRating}
          </span>
        </div>

        {/* Watch progress indicator if available */}
        {movie.progress !== undefined && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30 overflow-hidden">
            <div
              className="h-full bg-[#e50914] transition-all"
              style={{ width: `${movie.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Floating Popover on Hover (Desktop) */}
      <div
        className={`hidden md:block absolute left-0 right-0 top-full z-40 bg-[#1e1e1e] rounded-b-md p-3.5 shadow-2xl border-t-2 border-[#e50914] border-x border-b border-neutral-700/80 transition-all duration-200 ${
          isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 mb-2.5">
          {/* Quick Play */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(movie);
            }}
            className="w-8 h-8 rounded-full bg-[#e50914] hover:bg-[#b20710] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow"
            title="Play"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>

          {/* Toggle My List */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMyList(movie);
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              isInMyList
                ? 'bg-white text-black border-white hover:bg-neutral-200'
                : 'border-neutral-500 text-white hover:border-white hover:bg-neutral-800'
            }`}
            title={isInMyList ? 'Remove from My List' : 'Add to My List'}
          >
            {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>

          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRate(movie.id, 'like');
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              userRating === 'like'
                ? 'bg-white text-[#e50914] border-white'
                : 'border-neutral-500 text-white hover:border-white hover:bg-neutral-800'
            }`}
            title="I like this"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          {/* Dislike */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRate(movie.id, 'dislike');
            }}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              userRating === 'dislike'
                ? 'bg-white text-[#e50914] border-white'
                : 'border-neutral-500 text-white hover:border-white hover:bg-neutral-800'
            }`}
            title="Not for me"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          {/* More Info */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreInfo(movie);
            }}
            className="w-8 h-8 rounded-full border border-neutral-500 text-white hover:border-white hover:bg-neutral-800 flex items-center justify-center ml-auto transition-transform hover:scale-110 cursor-pointer"
            title="More info"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Metadata info */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-300 mb-1.5 flex-wrap">
          <span className="bg-[#f5c518] text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded font-sans tracking-tight">
            IMDb {movie.imdbRating}
          </span>
          <span className="text-[#6fcf7f] font-bold">{movie.matchScore}% Match</span>
          <span className="border border-neutral-600 px-1 py-0.2 rounded text-[10px] text-neutral-400">
            {movie.ageRating}
          </span>
          <span>{movie.duration}</span>
        </div>

        {/* Genres */}
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 truncate">
          {movie.genres.map((g, i) => (
            <React.Fragment key={g}>
              <span className="hover:text-white transition-colors">{g}</span>
              {i < movie.genres.length - 1 && <span className="text-neutral-600">·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
