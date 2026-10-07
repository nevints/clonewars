/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Movie, GenreFilter, UserRating, DurationFilterOption, AppTheme } from './types';
import { MOVIES, DURATION_OPTIONS } from './data/movies';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryChips } from './components/CategoryChips';
import { DurationFilter } from './components/DurationFilter';
import { MovieRow } from './components/MovieRow';
import { FeaturedPick } from './components/FeaturedPick';
import { VideoModal } from './components/VideoModal';
import { SearchResults } from './components/SearchResults';
import { ReelsFeed } from './components/ReelsFeed';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('All');
  const [activeModalMovie, setActiveModalMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // App Theme: 'dark' or 'light'
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('streamly_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  // Save theme & apply to document
  useEffect(() => {
    try {
      localStorage.setItem('streamly_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    showToast(theme === 'dark' ? 'Switched to Light Mode' : 'Switched to Dark Mode');
  };

  // Duration Filter state
  const [selectedDurationId, setSelectedDurationId] = useState<string>('all');
  const [maxSliderMinutes, setMaxSliderMinutes] = useState<number>(180);
  const [isSliderActive, setIsSliderActive] = useState<boolean>(false);

  // Persistent My List stored in localStorage
  const [myListIds, setMyListIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('streamly_my_list');
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return new Set(['inception', 'interstellar', 'the-dark-knight', 'dune-part-two', 'spirited-away']);
  });

  // Persistent User Likes / Dislikes stored in localStorage
  const [ratings, setRatings] = useState<UserRating>(() => {
    try {
      const saved = localStorage.getItem('streamly_ratings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { 'inception': 'like', 'the-dark-knight': 'like', 'interstellar': 'like' };
  });

  useEffect(() => {
    try {
      localStorage.setItem('streamly_my_list', JSON.stringify(Array.from(myListIds)));
    } catch {}
  }, [myListIds]);

  useEffect(() => {
    try {
      localStorage.setItem('streamly_ratings', JSON.stringify(ratings));
    } catch {}
  }, [ratings]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleToggleMyList = (movie: Movie) => {
    setMyListIds((prev) => {
      const next = new Set(prev);
      if (next.has(movie.id)) {
        next.delete(movie.id);
        showToast(`Removed "${movie.title}" from My List`);
      } else {
        next.add(movie.id);
        showToast(`Added "${movie.title}" to My List`);
      }
      return next;
    });
  };

  const handleRate = (movieId: string, rating: 'like' | 'dislike') => {
    setRatings((prev) => {
      const current = prev[movieId];
      const movie = MOVIES.find((m) => m.id === movieId);
      const title = movie ? movie.title : 'title';

      if (current === rating) {
        const next = { ...prev };
        delete next[movieId];
        showToast(`Rating removed for "${title}"`);
        return next;
      } else {
        showToast(
          rating === 'like'
            ? `Marked "${title}" as Liked`
            : `Marked "${title}" as Not For You`
        );
        return { ...prev, [movieId]: rating };
      }
    });
  };

  const handleShare = (movie: Movie) => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast(`Copied streaming link for "${movie.title}" to clipboard!`);
        })
        .catch(() => {
          showToast(`Link ready: ${movie.title} on Streamly`);
        });
    } else {
      showToast(`Link ready: ${movie.title} on Streamly`);
    }
  };

  const handlePlayMovie = (movie: Movie) => {
    setActiveModalMovie(movie);
    setIsModalOpen(true);
  };

  const handleMoreInfo = (movie: Movie) => {
    setActiveModalMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duration Filter Handlers
  const handleSelectDuration = (opt: DurationFilterOption) => {
    setSelectedDurationId(opt.id);
    setIsSliderActive(false);
    if (opt.maxMinutes) {
      setMaxSliderMinutes(opt.maxMinutes);
    } else {
      setMaxSliderMinutes(180);
    }
    showToast(`Filtering: ${opt.label}`);
  };

  const handleSliderChange = (minutes: number) => {
    setMaxSliderMinutes(minutes);
    setIsSliderActive(true);
    setSelectedDurationId('custom');
  };

  const handleResetDuration = () => {
    setSelectedDurationId('all');
    setMaxSliderMinutes(180);
    setIsSliderActive(false);
    showToast('Reset duration filter');
  };

  // Main filter method for both genre and duration
  const filterMovies = (movieList: Movie[]) => {
    return movieList.filter((m) => {
      // 1. Genre filter
      const matchGenre =
        selectedGenre === 'All' ||
        m.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());

      // 2. Duration filter
      let matchDuration = true;
      if (isSliderActive) {
        matchDuration = m.durationMinutes <= maxSliderMinutes;
      } else if (selectedDurationId !== 'all') {
        const opt = DURATION_OPTIONS.find((o) => o.id === selectedDurationId);
        if (opt) {
          if (opt.maxMinutes && m.durationMinutes > opt.maxMinutes) matchDuration = false;
          if (opt.minMinutes && m.durationMinutes < opt.minMinutes) matchDuration = false;
        }
      }

      return matchGenre && matchDuration;
    });
  };

  // Featured movies for hero carousel
  const featuredMovies = useMemo(() => {
    return [MOVIES[0], MOVIES[1], MOVIES[2], MOVIES[3]];
  }, []);

  // Continue watching row items
  const continueWatchingMovies = useMemo(() => {
    const progs = [75, 40, 85, 20, 60, 50];
    const items = [MOVIES[0], MOVIES[3], MOVIES[6], MOVIES[1], MOVIES[8], MOVIES[12]];
    return items.map((m, idx) => ({
      ...m,
      progress: progs[idx],
    }));
  }, []);

  // Top 10 row items
  const top10Movies = useMemo(() => {
    return MOVIES.slice(0, 10);
  }, []);

  // Trending row items
  const trendingMovies = useMemo(() => {
    return [
      MOVIES[4],
      MOVIES[1],
      MOVIES[2],
      MOVIES[8],
      MOVIES[13],
      MOVIES[0],
      MOVIES[15],
      MOVIES[7],
      MOVIES[9],
      MOVIES[11],
    ];
  }, []);

  // Action row items
  const actionMovies = useMemo(() => {
    return MOVIES.filter((m) => m.genres.includes('Action'));
  }, []);

  // Sci-Fi & Fantasy row
  const sciFiMovies = useMemo(() => {
    return MOVIES.filter((m) => m.genres.includes('Sci-fi') || m.genres.includes('Animation'));
  }, []);

  // Drama & Romance row
  const dramaMovies = useMemo(() => {
    return MOVIES.filter((m) => m.genres.includes('Drama') || m.genres.includes('Romance'));
  }, []);

  // Comedy & Adventure row
  const comedyMovies = useMemo(() => {
    return MOVIES.filter((m) => m.genres.includes('Comedy') || m.genres.includes('Adventure'));
  }, []);

  // New releases row items
  const newReleaseMovies = useMemo(() => {
    return [MOVIES[3], MOVIES[4], MOVIES[7], MOVIES[13], MOVIES[14], MOVIES[16]];
  }, []);

  // My List movies
  const myListMovies = useMemo(() => {
    return MOVIES.filter((m) => myListIds.has(m.id));
  }, [myListIds]);

  // Overall schedule-matched movies
  const scheduleMatchedMovies = useMemo(() => {
    return filterMovies(MOVIES);
  }, [selectedGenre, selectedDurationId, isSliderActive, maxSliderMinutes]);

  // Search filter
  const searchFilteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.cast.some((c) => c.toLowerCase().includes(q)) ||
        m.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Editor's pick item
  const editorPickMovie = MOVIES[4]; // Dune: Part Two

  const isDurationFilterActive = selectedDurationId !== 'all' || isSliderActive;
  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col selection:bg-[#e50914] selection:text-white ${
        isLight ? 'bg-[#f8f9fa] text-neutral-900' : 'bg-[#141414] text-[#f2f2f2]'
      }`}
    >
      {/* Top Fixed Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        myListCount={myListIds.size}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenMyList={() => {
          const el = document.getElementById('mylist');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TikTok / Reels Mode */}
        {activeTab === 'reels' ? (
          <ReelsFeed
            movies={MOVIES}
            myListIds={myListIds}
            ratings={ratings}
            onToggleMyList={handleToggleMyList}
            onRate={handleRate}
            onPlayMovie={handlePlayMovie}
            onShare={handleShare}
            onExit={() => setActiveTab('home')}
          />
        ) : searchQuery.trim() ? (
          /* Live Search Results Grid */
          <SearchResults
            query={searchQuery}
            movies={searchFilteredMovies}
            myListIds={myListIds}
            ratings={ratings}
            onPlay={handlePlayMovie}
            onMoreInfo={handleMoreInfo}
            onToggleMyList={handleToggleMyList}
            onRate={handleRate}
            onClearSearch={() => setSearchQuery('')}
          />
        ) : (
          /* Normal Streaming Catalog View */
          <>
            {/* Featured Hero Carousel with 14s Progress Bars & Trailer Video */}
            <Hero
              featuredMovies={featuredMovies}
              onPlay={handlePlayMovie}
              onMoreInfo={handleMoreInfo}
              isModalOpen={isModalOpen}
            />

            {/* Content Feed Section - Clean, Un-scuffed Spacing Below Hero */}
            <div className="relative z-20 pt-8 pb-16">
              {/* Category Filter Chips Bar */}
              <CategoryChips
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
              />

              {/* Recommend Movies by Duration */}
              <DurationFilter
                selectedDurationId={selectedDurationId}
                onSelectDuration={handleSelectDuration}
                maxSliderMinutes={maxSliderMinutes}
                onSliderChange={handleSliderChange}
                isSliderActive={isSliderActive}
                onResetDuration={handleResetDuration}
                matchingCount={scheduleMatchedMovies.length}
              />

              {/* Dynamic Highlight Row: Recommended for Your Schedule */}
              {isDurationFilterActive && (
                <MovieRow
                  id="schedule-picks"
                  title={`⏱️ Recommended For Your Schedule (${scheduleMatchedMovies.length} Available)`}
                  movies={scheduleMatchedMovies}
                  variant="standard"
                  myListIds={myListIds}
                  ratings={ratings}
                  onPlay={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleMyList={handleToggleMyList}
                  onRate={handleRate}
                />
              )}

              {/* Continue Watching Row */}
              <MovieRow
                id="continue"
                title="Continue Watching"
                movies={filterMovies(continueWatchingMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* Top 10 Today Row */}
              <MovieRow
                id="top10"
                title="Top 10 Today"
                movies={filterMovies(top10Movies)}
                variant="top10"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* Trending Now Row */}
              <MovieRow
                id="trending"
                title="Trending Now"
                movies={filterMovies(trendingMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* Editor's Pick Banner (Dune: Part Two) */}
              <FeaturedPick
                movie={editorPickMovie}
                isInMyList={myListIds.has(editorPickMovie.id)}
                onPlay={handlePlayMovie}
                onToggleMyList={handleToggleMyList}
              />

              {/* Action & Adventure Row */}
              <MovieRow
                id="action"
                title="Action & Thrillers"
                movies={filterMovies(actionMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* Sci-Fi & Animation Row */}
              <MovieRow
                id="scifi"
                title="Sci-Fi & Animation Classics"
                movies={filterMovies(sciFiMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* Drama & Romance Row */}
              <MovieRow
                id="drama"
                title="Drama & Romance"
                movies={filterMovies(dramaMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* Comedy & Adventure Row */}
              <MovieRow
                id="comedy"
                title="Comedy & Quirky Adventures"
                movies={filterMovies(comedyMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* New Releases Row (Tall 2:3 Posters) */}
              <MovieRow
                id="new"
                title="New Releases & Special Editions"
                movies={filterMovies(newReleaseMovies)}
                variant="tall"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />

              {/* My List Row */}
              <MovieRow
                id="mylist"
                title={`My List ${myListMovies.length > 0 ? `(${myListMovies.length})` : ''}`}
                movies={filterMovies(myListMovies)}
                variant="standard"
                myListIds={myListIds}
                ratings={ratings}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleMyList={handleToggleMyList}
                onRate={handleRate}
              />
            </div>
          </>
        )}
      </main>

      {/* Floating Scroll To Top Button with Glow */}
      {showScrollTop && activeTab !== 'reels' && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-2xl hover:bg-[#b20710] hover:scale-110 transition-all cursor-pointer border border-red-400/30"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      {activeTab !== 'reels' && <Footer />}

      {/* Full-featured Video Player & Details Modal */}
      <VideoModal
        movie={activeModalMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isInMyList={activeModalMovie ? myListIds.has(activeModalMovie.id) : false}
        userRating={activeModalMovie ? ratings[activeModalMovie.id] || null : null}
        onToggleMyList={handleToggleMyList}
        onRate={handleRate}
        onShare={handleShare}
        onSelectMovie={(movie) => {
          setActiveModalMovie(movie);
        }}
        theme={theme}
      />

      {/* Toast Alert Banner */}
      <Toast message={toastMessage} />
    </div>
  );
}
