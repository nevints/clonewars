import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, UserRating } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  id?: string;
  title: string;
  movies: Movie[];
  variant?: 'standard' | 'tall' | 'top10';
  myListIds: Set<string>;
  ratings: UserRating;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
  onRate: (movieId: string, rating: 'like' | 'dislike') => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  id,
  title,
  movies,
  variant = 'standard',
  myListIds,
  ratings,
  onPlay,
  onMoreInfo,
  onToggleMyList,
  onRate,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75;
      trackRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      const scrollAmount = trackRef.current.clientWidth * 0.75;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section id={id} className="relative mb-10 group/row">
      {/* Row Header */}
      <div className="flex items-baseline justify-between px-4 md:px-12 mb-3">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-3">
          <span>{title}</span>
          <span className="text-xs font-semibold text-[#e50914] opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer hover:underline">
            Explore All
          </span>
        </h2>
      </div>

      {/* Row Carousel Track Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-[#e50914] text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer backdrop-blur-xs disabled:opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={trackRef}
          className="flex items-center gap-2.5 md:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-12 py-2"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              variant={variant}
              rank={variant === 'top10' ? index + 1 : undefined}
              isInMyList={myListIds.has(movie.id)}
              userRating={ratings[movie.id] || null}
              onPlay={onPlay}
              onMoreInfo={onMoreInfo}
              onToggleMyList={onToggleMyList}
              onRate={onRate}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 md:w-12 bg-black/60 hover:bg-[#e50914] text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer backdrop-blur-xs"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};
