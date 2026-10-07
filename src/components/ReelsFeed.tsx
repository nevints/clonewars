import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Plus,
  Check,
  Share2,
  Volume2,
  VolumeX,
  Play,
  X,
  ChevronUp,
  ChevronDown,
  Music2,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import { Movie, UserRating } from '../types';
import { getVideoUrl } from '../data/movies';
import { getArtUrl } from '../utils/svgArt';

interface ReelsFeedProps {
  movies: Movie[];
  myListIds: Set<string>;
  ratings: UserRating;
  onToggleMyList: (movie: Movie) => void;
  onRate: (movieId: string, rating: 'like' | 'dislike') => void;
  onPlayMovie: (movie: Movie) => void;
  onShare: (movie: Movie) => void;
  onExit: () => void;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({
  movies,
  myListIds,
  ratings,
  onToggleMyList,
  onRate,
  onPlayMovie,
  onShare,
  onExit,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedDesc, setExpandedDesc] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll snap detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < movies.length) {
      setActiveIndex(newIndex);
      setExpandedDesc(false);
    }
  };

  // Keyboard navigation (Arrow keys, Spacebar, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === 'Escape') {
        onExit();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, movies.length, onExit]);

  // Video play/pause on index change
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIndex) {
        vid.muted = isMuted;
        vid.currentTime = 0;
        vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        vid.pause();
      }
    });
  }, [activeIndex, isMuted]);

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= movies.length || !containerRef.current) return;
    const height = containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: index * height,
      behavior: 'smooth',
    });
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;
    if (currentVideo.paused) {
      currentVideo.play().then(() => setIsPlaying(true));
    } else {
      currentVideo.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden">
      {/* Top Floating Controls */}
      <div className="absolute top-4 inset-x-0 z-40 px-4 md:px-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-700/60 shadow-lg">
          <Sparkles className="w-4 h-4 text-[#e50914] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-white uppercase">Streamly Reels</span>
          <span className="text-neutral-500">·</span>
          <span className="text-xs text-neutral-300 font-medium">Trailer Feed</span>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Mute button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-neutral-700/60 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>

          {/* Close/Exit button */}
          <button
            onClick={onExit}
            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-neutral-700/60 text-white flex items-center justify-center hover:bg-[#e50914] transition-colors shadow-lg cursor-pointer"
            title="Back to Home"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Vertical Navigation Chevrons (Desktop) */}
      <div className="hidden md:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => scrollToIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="w-11 h-11 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-white flex items-center justify-center hover:bg-[#e50914] disabled:opacity-30 disabled:hover:bg-neutral-900/80 transition-all cursor-pointer shadow-xl"
          title="Previous trailer (Arrow Up)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <button
          onClick={() => scrollToIndex(activeIndex + 1)}
          disabled={activeIndex === movies.length - 1}
          className="w-11 h-11 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-white flex items-center justify-center hover:bg-[#e50914] disabled:opacity-30 disabled:hover:bg-neutral-900/80 transition-all cursor-pointer shadow-xl"
          title="Next trailer (Arrow Down)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Main Vertical Snap Feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {movies.map((movie, index) => {
          const isLiked = ratings[movie.id] === 'like';
          const isInList = myListIds.has(movie.id);

          return (
            <div
              key={movie.id}
              className="relative w-full h-[100dvh] snap-start flex items-center justify-center overflow-hidden bg-black"
            >
              {/* Blurred Ambient Backdrop Glow */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-125"
                style={{ backgroundImage: `url("${movie.backdropUrl || movie.posterUrl}")` }}
              />

              {/* Central Video Frame (9:16 or centered cinematic view) */}
              <div
                onClick={togglePlayPause}
                className="relative w-full max-w-[480px] h-full sm:h-[95vh] sm:rounded-2xl overflow-hidden shadow-2xl border sm:border-neutral-800 bg-neutral-950 flex items-center justify-center cursor-pointer group"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={getVideoUrl(movie.videoFile)}
                  loop
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />

                {/* Pause icon overlay if paused */}
                {!isPlaying && activeIndex === index && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                )}

                {/* Dark Gradients for Readability */}
                <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

                {/* Right Floating Actions (TikTok style) */}
                <div
                  className="absolute right-3.5 bottom-24 z-30 flex flex-col items-center gap-5 text-white pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Studio/Poster Mini Avatar with quick add */}
                  <div className="relative group/avatar cursor-pointer" onClick={() => onPlayMovie(movie)}>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getArtUrl(movie.sceneKey);
                      }}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xl"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMyList(movie);
                      }}
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isInList ? 'bg-emerald-500 text-white' : 'bg-[#e50914] text-white'
                      }`}
                    >
                      {isInList ? '✓' : '+'}
                    </button>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => onRate(movie.id, isLiked ? 'dislike' : 'like')}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-75 shadow-lg ${
                        isLiked
                          ? 'bg-[#e50914] text-white scale-110'
                          : 'bg-black/50 backdrop-blur-md border border-neutral-700/80 text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-300">
                      {isLiked ? 'Liked' : `${movie.matchScore}%`}
                    </span>
                  </button>

                  {/* Add to My List */}
                  <button
                    onClick={() => onToggleMyList(movie)}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-75 shadow-lg ${
                        isInList
                          ? 'bg-white text-black font-bold scale-110'
                          : 'bg-black/50 backdrop-blur-md border border-neutral-700/80 text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-300">
                      {isInList ? 'Saved' : 'List'}
                    </span>
                  </button>

                  {/* Watch Full Movie button */}
                  <button
                    onClick={() => onPlayMovie(movie)}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#e50914] hover:bg-[#b20710] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-300">Watch</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => onShare(movie)}
                    className="flex flex-col items-center gap-1 group/btn cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-neutral-700/80 text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-lg">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-300">Share</span>
                  </button>

                  {/* Rotating Music Disc */}
                  <div className="relative mt-2 animate-spin duration-3000">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 rounded-full bg-[#e50914]" />
                    </div>
                  </div>
                </div>

                {/* Bottom Left Information Card */}
                <div
                  className="absolute left-4 right-18 bottom-6 z-20 text-white pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Tag and IMDb Badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-[#f5c518] text-black font-extrabold text-[11px] px-1.5 py-0.5 rounded font-sans tracking-tight shadow">
                      IMDb {movie.imdbRating}
                    </span>
                    <span className="text-xs font-semibold text-neutral-300">
                      {movie.year}
                    </span>
                    <span className="text-neutral-500">·</span>
                    <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#e50914]" />
                      {movie.duration}
                    </span>
                    <span className="border border-neutral-600 px-1.5 py-0.2 rounded text-[10px] text-neutral-300">
                      {movie.ageRating}
                    </span>
                  </div>

                  {/* Movie Title */}
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-md mb-1.5">
                    {movie.title}
                  </h3>

                  {/* Director & Cast */}
                  {movie.directors && (
                    <p className="text-xs text-neutral-300 mb-1">
                      <span className="text-neutral-400">Dir.</span> {movie.directors}
                      <span className="text-neutral-500 mx-1.5">·</span>
                      <span className="text-neutral-400">Starring:</span> {movie.cast.slice(0, 2).join(', ')}
                    </p>
                  )}

                  {/* Synopsis with toggle */}
                  <div className="text-xs text-neutral-300 mb-2 leading-relaxed">
                    <p className={expandedDesc ? '' : 'line-clamp-2'}>
                      {movie.description}
                    </p>
                    <button
                      onClick={() => setExpandedDesc(!expandedDesc)}
                      className="text-[#e50914] font-bold text-[11px] mt-0.5 hover:underline cursor-pointer"
                    >
                      {expandedDesc ? 'Show less' : 'Read more...'}
                    </button>
                  </div>

                  {/* Genres */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-neutral-400">
                    {movie.genres.map((g) => (
                      <span key={g} className="bg-neutral-800/80 px-2 py-0.5 rounded-full text-neutral-300 border border-neutral-700/60">
                        #{g}
                      </span>
                    ))}
                  </div>

                  {/* Sound track marquee */}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                    <Music2 className="w-3.5 h-3.5 text-[#e50914] shrink-0" />
                    <span className="truncate">Original Motion Picture Soundtrack · Official Audio</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
