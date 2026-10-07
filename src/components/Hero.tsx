import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Movie } from '../types';
import { getArtUrl } from '../utils/svgArt';
import { getVideoUrl } from '../data/movies';

interface HeroProps {
  featuredMovies: Movie[];
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  isModalOpen: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  featuredMovies,
  onPlay,
  onMoreInfo,
  isModalOpen,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const trailerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  // Handle slide transition
  const goToSlide = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setIsSwapping(true);
    setIsVideoPlaying(false);

    if (trailerTimerRef.current) {
      clearTimeout(trailerTimerRef.current);
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }

    setTimeout(() => {
      const len = featuredMovies.length;
      setCurrentIndex(((newIndex % len) + len) % len);
      setIsSwapping(false);
    }, 280);
  };

  // Video trailer auto-play on 2.2s delay
  useEffect(() => {
    if (isModalOpen || isPaused) {
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    if (trailerTimerRef.current) {
      clearTimeout(trailerTimerRef.current);
    }

    trailerTimerRef.current = setTimeout(() => {
      if (videoRef.current && currentMovie && !isModalOpen) {
        videoRef.current.src = getVideoUrl(currentMovie.videoFile);
        videoRef.current.play().then(() => {
          setIsVideoPlaying(true);
        }).catch(() => {
          // autoplay policy catch
          setIsVideoPlaying(false);
        });
      }
    }, 2200);

    return () => {
      if (trailerTimerRef.current) clearTimeout(trailerTimerRef.current);
    };
  }, [currentIndex, isModalOpen, isPaused, currentMovie]);

  // Pause video if modal is opened
  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      videoRef.current.pause();
    } else if (!isModalOpen && isVideoPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isModalOpen, isVideoPlaying]);

  // Progress bar auto advance
  useEffect(() => {
    if (isModalOpen || isPaused) return;

    const timer = setTimeout(() => {
      goToSlide(currentIndex + 1);
    }, 14000);

    return () => clearTimeout(timer);
  }, [currentIndex, isModalOpen, isPaused, featuredMovies.length]);

  const [scrollY, setScrollY] = useState(0);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="top"
      className={`relative h-[85vh] min-h-[580px] max-h-[880px] overflow-hidden flex items-end pb-28 md:pb-32 select-none ${
        isPaused ? 'hero-paused' : ''
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media Container with Parallax */}
      <div
        className="absolute inset-0 z-0 bg-[#181818] will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0)` }}
      >
        {/* Real Movie Backdrop with SVG fallback */}
        <img
          src={currentMovie.backdropUrl || currentMovie.posterUrl}
          alt={currentMovie.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = getArtUrl(currentMovie.sceneKey);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 scale-105 ${
            isSwapping ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Video Trailer Overlay */}
        <video
          ref={videoRef}
          muted={isMuted}
          playsInline
          loop
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoPlaying && !isSwapping ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dark Vignette / Gradient overlays for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-black/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/40 to-transparent z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#141414] to-transparent z-[2]" />
      </div>

      {/* Hero Content */}
      <div
        className={`relative z-10 px-4 md:px-12 max-w-2xl transition-all duration-300 ${
          isSwapping ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Category Tag */}
        <div className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-neutral-200 mb-3">
          <span className="w-1.5 h-4 bg-[#e50914] rounded-xs inline-block" />
          <span>{currentMovie.tag || 'Featured Film'}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-md leading-none">
          {currentMovie.title}
        </h1>

        {/* Meta badges with IMDb Rating */}
        <div className="flex items-center gap-3 text-xs md:text-sm text-neutral-300 mb-4 flex-wrap">
          <span className="bg-[#f5c518] text-black font-extrabold text-xs px-2 py-0.5 rounded font-sans tracking-tight shadow-sm">
            IMDb {currentMovie.imdbRating}
          </span>
          <span className="text-[#6fcf7f] font-bold">{currentMovie.matchScore}% Match</span>
          <span className="text-neutral-400">·</span>
          <span>{currentMovie.year}</span>
          <span className="border border-neutral-500 px-1.5 py-0.5 rounded text-[11px] font-semibold text-neutral-300">
            {currentMovie.ageRating}
          </span>
          <span>{currentMovie.duration}</span>
          <span className="border border-neutral-500 px-1.5 py-0.5 rounded text-[11px] font-semibold text-neutral-300">
            4K HDR
          </span>
        </div>

        {/* Description */}
        <p className="text-neutral-200 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 max-w-xl drop-shadow">
          {currentMovie.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <button
            onClick={() => onPlay(currentMovie)}
            className="flex items-center gap-2.5 bg-[#e50914] hover:bg-[#b20710] text-white font-bold px-6 py-3 rounded-md transition-all active:scale-95 shadow-lg shadow-red-950/40 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="text-sm md:text-base">Play</span>
          </button>

          <button
            onClick={() => onMoreInfo(currentMovie)}
            className="flex items-center gap-2.5 bg-neutral-600/70 hover:bg-neutral-600/90 text-white font-bold px-6 py-3 rounded-md transition-all active:scale-95 backdrop-blur-sm cursor-pointer"
          >
            <Info className="w-5 h-5" />
            <span className="text-sm md:text-base">More info</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls: Chevrons + 14s Progress Bars */}
      <div className="absolute left-4 md:left-12 bottom-8 md:bottom-10 z-20 flex items-center gap-3.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
        <button
          onClick={() => goToSlide(currentIndex - 1)}
          className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white/80 hover:text-black hover:bg-white hover:border-white transition-all cursor-pointer"
          aria-label="Previous featured movie"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {featuredMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="h-4 w-10 sm:w-14 flex items-center cursor-pointer group p-0"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden group-hover:bg-white/50 transition-colors">
                {idx < currentIndex ? (
                  <div className="h-full w-full bg-[#e50914]" />
                ) : idx === currentIndex ? (
                  <div
                    key={`active-${currentIndex}`}
                    className="h-full bg-[#e50914] hero-bar-active"
                  />
                ) : (
                  <div className="h-full w-0 bg-[#e50914]" />
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => goToSlide(currentIndex + 1)}
          className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white/80 hover:text-black hover:bg-white hover:border-white transition-all cursor-pointer"
          aria-label="Next featured movie"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Controls: Sound Mute Toggle + Age Badge */}
      <div className="absolute right-0 bottom-8 md:bottom-10 z-20 flex items-center">
        <button
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            if (videoRef.current) videoRef.current.muted = nextMuted;
          }}
          className="w-9 h-9 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all mr-3 cursor-pointer shadow-md bg-black/40 backdrop-blur-xs"
          aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
          title={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="bg-neutral-800/90 border-l-4 border-white text-white text-xs md:text-sm font-semibold py-1.5 px-4 md:px-7 tracking-wider">
          {currentMovie.ageRating}
        </div>
      </div>
    </header>
  );
};
