import React from 'react';
import { Movie, UserRating } from '../types';
import { MovieCard } from './MovieCard';
import { SearchX } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  movies: Movie[];
  myListIds: Set<string>;
  ratings: UserRating;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
  onRate: (movieId: string, rating: 'like' | 'dislike') => void;
  onClearSearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  movies,
  myListIds,
  ratings,
  onPlay,
  onMoreInfo,
  onToggleMyList,
  onRate,
  onClearSearch,
}) => {
  return (
    <div className="pt-28 px-4 md:px-12 pb-20 min-h-screen">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-700/50">
        <div>
          <h2 className="text-2xl font-bold">
            Search Results for <span className="text-[#e50914]">"{query}"</span>
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Found {movies.length} {movies.length === 1 ? 'title' : 'titles'}
          </p>
        </div>

        <button
          onClick={onClearSearch}
          className="text-xs uppercase font-semibold tracking-wider opacity-80 hover:opacity-100 px-3 py-1.5 rounded border border-neutral-600/50 hover:border-neutral-400 transition-colors cursor-pointer"
        >
          Clear search
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="py-24 text-center text-neutral-400 flex flex-col items-center">
          <SearchX className="w-16 h-16 text-neutral-600 mb-4 stroke-1" />
          <p className="text-lg font-medium text-neutral-300">
            No matching titles, genres, or cast members found for "{query}".
          </p>
          <p className="text-sm text-neutral-500 mt-2 max-w-md">
            Try searching for another keyword like "coast", "heist", "romance", "thriller", or actor names.
          </p>
          <button
            onClick={onClearSearch}
            className="mt-6 bg-[#e50914] text-white font-semibold px-5 py-2 rounded-md hover:bg-[#b20710] transition-colors cursor-pointer text-sm"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="w-full">
              <MovieCard
                movie={movie}
                variant="standard"
                isInMyList={myListIds.has(movie.id)}
                userRating={ratings[movie.id] || null}
                onPlay={onPlay}
                onMoreInfo={onMoreInfo}
                onToggleMyList={onToggleMyList}
                onRate={onRate}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
