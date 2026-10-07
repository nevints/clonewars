import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Plus,
  Check,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
  Tv,
  Film,
  ExternalLink,
} from 'lucide-react';
import { Movie, UserRating, AppTheme } from '../types';
import { getVideoUrl, MOVIES } from '../data/movies';
import { getArtUrl } from '../utils/svgArt';

interface VideoModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  isInMyList: boolean;
  userRating: 'like' | 'dislike' | null;
  onToggleMyList: (movie: Movie) => void;
  onRate: (movieId: string, rating: 'like' | 'dislike') => void;
  onShare: (movie: Movie) => void;
  onSelectMovie: (movie: Movie) => void;
  theme?: AppTheme;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  movie,
  isOpen,
  onClose,
  isInMyList,
  userRating,
  onToggleMyList,
  onRate,
  onShare,
  onSelectMovie,
  theme = 'dark',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player mode: 'youtube' (official trailer) or 'direct' (html5 video preview)
  const [playerMode, setPlayerMode] = useState<'youtube' | 'direct'>('youtube');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Video playback initialization when modal opens or movie changes
  useEffect(() => {
    if (isOpen && movie) {
      // Default to official YouTube trailer
      setPlayerMode('youtube');

      if (videoRef.current) {
        videoRef.current.src = getVideoUrl(movie.videoFile);
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = playbackRate;
      }
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [isOpen, movie]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
      );
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen || !movie) return null;

  // Recommendations / More like this
  const similarMovies = MOVIES.filter((m) => m.id !== movie.id).slice(0, 3);
  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal-content-anim relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl border flex flex-col ${
          isLight
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-[#181818] border-neutral-800 text-white'
        }`}
      >
        {/* Top Header Row above player */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-[#111111] text-white">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm truncate max-w-xs sm:max-w-md">{movie.title}</span>
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700/80 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => {
                  setPlayerMode('youtube');
                  if (videoRef.current) videoRef.current.pause();
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  playerMode === 'youtube'
                    ? 'bg-[#e50914] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>YouTube 4K Trailer</span>
              </button>

              <button
                onClick={() => {
                  setPlayerMode('direct');
                  if (videoRef.current) {
                    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                  }
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  playerMode === 'direct'
                    ? 'bg-[#e50914] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Direct Stream</span>
              </button>
            </div>
          </div>

          {/* Close Button - Cleanly positioned away from anything else */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-[#e50914] text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md shrink-0 ml-3"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative bg-black aspect-video w-full overflow-hidden select-none"
        >
          {playerMode === 'youtube' ? (
            /* Real Official YouTube 4K Theatrical Trailer Embed */
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${movie.youtubeTrailerId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={`${movie.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            /* Direct HTML5 Video Player with Custom Controls */
            <>
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                playsInline
                poster={movie.backdropUrl || movie.posterUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Center Big Play Button if paused (completely decoupled from bottom bar) */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
                >
                  <button
                    className="w-16 h-16 rounded-full bg-[#e50914] hover:bg-[#b20710] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Play video"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>
              )}

              {/* Bottom Controls Bar strictly anchored to the bottom */}
              <div
                className={`absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-4 space-y-2.5 transition-opacity duration-300 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress Scrubber Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-300 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-[#e50914] focus:outline-none"
                  />
                  <span className="text-xs font-mono text-neutral-300 w-10">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Bottom Buttons Bar */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1.5 text-white hover:text-[#e50914] transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={() => skipSeconds(-10)}
                      className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => skipSeconds(10)}
                      className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Forward 10s"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-neutral-600 rounded cursor-pointer accent-[#e50914]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() => {
                        const speeds = [1, 1.25, 1.5];
                        const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
                        const nextSpeed = speeds[nextIdx];
                        setPlaybackRate(nextSpeed);
                        if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
                      }}
                      className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white font-mono"
                      title="Playback speed"
                    >
                      {playbackRate}x
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                      title="Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Info Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Primary Details (Left 8 Cols) */}
            <div className="md:col-span-8 space-y-4">
              <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                {movie.title}
              </h3>

              {/* Meta tags with IMDb */}
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="bg-[#f5c518] text-black font-extrabold text-xs px-2 py-0.5 rounded font-sans tracking-tight shadow">
                  IMDb {movie.imdbRating}
                </span>
                <span className="text-[#6fcf7f] font-bold">{movie.matchScore}% Match</span>
                <span className="text-neutral-400">·</span>
                <span className={isLight ? 'text-neutral-600' : 'text-neutral-300'}>{movie.year}</span>
                <span className="border border-neutral-500/50 px-1.5 py-0.5 rounded text-xs font-semibold">
                  {movie.ageRating}
                </span>
                <span className={isLight ? 'text-neutral-600' : 'text-neutral-300'}>{movie.duration}</span>
                <span className="border border-neutral-500/50 px-1.5 py-0.5 rounded text-xs font-semibold">
                  4K Ultra HD
                </span>
              </div>

              {/* Interactive Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap pt-2">
                <button
                  onClick={() => {
                    if (playerMode === 'youtube') {
                      setPlayerMode('direct');
                      if (videoRef.current) videoRef.current.play();
                    } else {
                      togglePlay();
                    }
                  }}
                  className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b20710] text-white font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-md text-sm"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{playerMode === 'youtube' ? 'Stream Movie' : isPlaying ? 'Pause' : 'Resume Play'}</span>
                </button>

                <button
                  onClick={() => onRate(movie.id, 'like')}
                  className={`flex items-center gap-1.5 border px-4 py-2.5 rounded-full transition-all cursor-pointer text-sm ${
                    userRating === 'like'
                      ? 'bg-neutral-900 text-[#e50914] border-[#e50914] font-bold'
                      : isLight
                      ? 'border-neutral-300 text-neutral-700 hover:border-black hover:bg-neutral-100'
                      : 'border-neutral-600 text-white hover:border-white hover:bg-neutral-800'
                  }`}
                  title="Like"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>

                <button
                  onClick={() => onRate(movie.id, 'dislike')}
                  className={`flex items-center gap-1.5 border px-4 py-2.5 rounded-full transition-all cursor-pointer text-sm ${
                    userRating === 'dislike'
                      ? 'bg-neutral-900 text-[#e50914] border-[#e50914] font-bold'
                      : isLight
                      ? 'border-neutral-300 text-neutral-700 hover:border-black hover:bg-neutral-100'
                      : 'border-neutral-600 text-white hover:border-white hover:bg-neutral-800'
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>Dislike</span>
                </button>

                <button
                  onClick={() => onToggleMyList(movie)}
                  className={`flex items-center gap-1.5 border px-4 py-2.5 rounded-full transition-all cursor-pointer text-sm ${
                    isInMyList
                      ? 'bg-[#e50914] text-white border-[#e50914] font-semibold'
                      : isLight
                      ? 'border-neutral-300 text-neutral-700 hover:border-black hover:bg-neutral-100'
                      : 'border-neutral-600 text-white hover:border-white hover:bg-neutral-800'
                  }`}
                  title={isInMyList ? 'In My List' : 'Add to My List'}
                >
                  {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isInMyList ? 'In My List' : 'My List'}</span>
                </button>

                <button
                  onClick={() => onShare(movie)}
                  className={`flex items-center gap-1.5 border px-4 py-2.5 rounded-full transition-all cursor-pointer text-sm ${
                    isLight
                      ? 'border-neutral-300 text-neutral-700 hover:border-black hover:bg-neutral-100'
                      : 'border-neutral-600 text-white hover:border-white hover:bg-neutral-800'
                  }`}
                  title="Share movie"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Full Description */}
              <p className={`leading-relaxed text-sm md:text-base pt-2 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                {movie.description}
              </p>
            </div>

            {/* Sidebar Metadata (Right 4 Cols) */}
            <div
              className={`md:col-span-4 space-y-3 text-xs md:text-sm border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 ${
                isLight ? 'border-neutral-200 text-neutral-600' : 'border-neutral-800 text-neutral-400'
              }`}
            >
              <div>
                <span className="font-semibold block mb-0.5 text-neutral-500">Cast:</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{movie.cast.join(', ')}</span>
              </div>

              {movie.directors && (
                <div>
                  <span className="font-semibold block mb-0.5 text-neutral-500">Director:</span>
                  <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{movie.directors}</span>
                </div>
              )}

              <div>
                <span className="font-semibold block mb-0.5 text-neutral-500">Genres:</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>{movie.genres.join(', ')}</span>
              </div>

              <div>
                <span className="font-semibold block mb-0.5 text-neutral-500">Audio &amp; Subtitles:</span>
                <span className={isLight ? 'text-neutral-800' : 'text-neutral-200'}>English [Original 5.1], Dolby Atmos</span>
              </div>

              <div>
                <span className="font-semibold block mb-0.5 text-neutral-500">Official YouTube ID:</span>
                <a
                  href={`https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e50914] font-mono hover:underline inline-flex items-center gap-1"
                >
                  <span>{movie.youtubeTrailerId}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* More Like This / Episodes Section */}
          <div className={`border-t pt-6 ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`}>
            <h4 className={`text-lg font-bold mb-4 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
              More Like This
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarMovies.map((similar, idx) => (
                <div
                  key={similar.id}
                  onClick={() => onSelectMovie(similar)}
                  className={`group rounded-lg p-3 transition-all cursor-pointer border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100'
                      : 'bg-[#212121] border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="font-bold text-neutral-400 text-lg w-5">{idx + 1}</span>
                    <img
                      src={similar.backdropUrl || similar.posterUrl}
                      alt={similar.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getArtUrl(similar.sceneKey);
                      }}
                      className="w-28 h-16 rounded object-cover shrink-0 border border-neutral-700/60 group-hover:scale-105 transition-transform"
                    />
                    <div className="overflow-hidden">
                      <p className={`font-semibold text-xs truncate group-hover:text-[#e50914] transition-colors ${
                        isLight ? 'text-neutral-900' : 'text-white'
                      }`}>
                        {similar.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-[#f5c518] text-black font-extrabold text-[9px] px-1 py-0.2 rounded font-sans">
                          ★ {similar.imdbRating}
                        </span>
                        <span className="text-[11px] text-neutral-400">{similar.duration}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-snug">
                    {similar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
