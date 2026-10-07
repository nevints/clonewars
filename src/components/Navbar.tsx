import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, X, User, Check, Film, Tv, Sparkles, Bookmark, Flame, Sun, Moon } from 'lucide-react';
import { AppTheme } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  myListCount: number;
  onSelectCategory?: (category: string) => void;
  onOpenMyList?: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  myListCount,
  onOpenMyList,
  theme,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentProfile, setCurrentProfile] = useState('Alex');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Film },
    { id: 'reels', label: 'Reels / Shorts', icon: Flame, badge: 'NEW' },
    { id: 'series', label: 'Series', icon: Tv },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'new', label: 'New & Popular', icon: Sparkles },
    { id: 'mylist', label: `My List ${myListCount > 0 ? `(${myListCount})` : ''}`, icon: Bookmark },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center gap-6 px-4 md:px-12 ${
        isScrolled
          ? isLight
            ? 'bg-white/95 backdrop-blur-md py-3 border-b-2 border-[#e50914] shadow-md text-neutral-800'
            : 'bg-[#141414]/95 backdrop-blur-md py-3 border-b-2 border-[#e50914] shadow-xl text-white'
          : isLight
          ? 'bg-gradient-to-b from-white/95 via-white/50 to-transparent py-4 border-b-2 border-transparent text-neutral-800'
          : 'bg-gradient-to-b from-[#141414]/90 via-[#141414]/40 to-transparent py-4 border-b-2 border-transparent text-white'
      }`}
    >
      {/* Mobile Burger Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className={`md:hidden p-1 transition-colors ${isLight ? 'text-neutral-800' : 'text-white'}`}
        aria-label="Toggle navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Brand Logo */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          setActiveTab('home');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-2xl md:text-3xl font-extrabold tracking-wider text-[#e50914] select-none hover:brightness-110 transition-transform active:scale-95"
      >
        STREAMLY
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              setActiveTab(link.id);
              if (link.id === 'mylist' && onOpenMyList) {
                onOpenMyList();
              } else if (link.id !== 'reels') {
                const target = document.getElementById(link.id === 'home' ? 'top' : link.id);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className={`transition-all font-medium cursor-pointer relative flex items-center gap-1.5 ${
              activeTab === link.id
                ? isLight
                  ? 'text-neutral-900 font-bold'
                  : 'text-white font-semibold'
                : isLight
                ? 'text-neutral-600 hover:text-neutral-900'
                : 'text-neutral-300 hover:text-white'
            } ${link.id === 'reels' ? 'text-[#ff4e50] hover:text-[#ff6b6b]' : ''}`}
          >
            {link.id === 'reels' && <Flame className="w-3.5 h-3.5 text-[#e50914] inline animate-pulse" />}
            <span>{link.label}</span>
            {link.badge && (
              <span className="text-[9px] font-black bg-[#e50914] text-white px-1.5 py-0.2 rounded-full leading-tight">
                {link.badge}
              </span>
            )}
            {activeTab === link.id && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#e50914] rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Right Tools (Theme, Search, Notifications, Profile) */}
      <div className="flex items-center gap-3.5">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-full transition-colors cursor-pointer border ${
            isLight
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
              : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle dark/light theme"
        >
          {isLight ? <Moon className="w-4 h-4 text-neutral-700" /> : <Sun className="w-4 h-4 text-amber-300" />}
        </button>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <div
            className={`flex items-center border rounded-md transition-all duration-300 ${
              isLight ? 'bg-neutral-100/90 border-neutral-300 text-neutral-900' : 'bg-black/60 border-neutral-700/60 text-white'
            } ${
              searchQuery ? 'w-44 sm:w-60' : 'focus-within:w-44 sm:focus-within:w-60 w-9 sm:w-9'
            } overflow-hidden px-2 py-1.5`}
          >
            <Search
              className={`w-4 h-4 shrink-0 cursor-pointer ${isLight ? 'text-neutral-500' : 'text-neutral-300'}`}
              onClick={() => searchInputRef.current?.focus()}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Titles, genres, cast..."
              className={`bg-transparent border-none outline-none text-xs sm:text-sm ml-2 w-full ${
                isLight ? 'text-neutral-900 placeholder-neutral-500' : 'text-white placeholder-neutral-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-neutral-400 hover:text-white shrink-0 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`p-1 relative cursor-pointer ${isLight ? 'text-neutral-700 hover:text-black' : 'text-neutral-300 hover:text-white'}`}
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#e50914] rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-3 w-80 rounded-lg shadow-2xl p-4 text-xs z-50 border ${
                isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#1c1c1c] border-neutral-700 text-white'
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-2 mb-3 ${isLight ? 'border-neutral-200' : 'border-neutral-700'}`}>
                <span className="font-bold uppercase tracking-wider text-[11px]">Notifications</span>
                <span className="text-neutral-400 text-[10px]">3 New</span>
              </div>
              <div className="space-y-3">
                <div className={`p-2 rounded cursor-pointer transition-colors ${isLight ? 'bg-neutral-100 hover:bg-neutral-200' : 'bg-neutral-800/80 hover:bg-neutral-800'}`}>
                  <p className="font-semibold">Dune: Part Two is now streaming</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Denis Villeneuve's sci-fi epic is now available in 4K HDR.</p>
                  <span className="text-[10px] text-neutral-500 mt-1 block">2 hours ago</span>
                </div>
                <div className={`p-2 rounded cursor-pointer transition-colors ${isLight ? 'bg-neutral-100 hover:bg-neutral-200' : 'bg-neutral-800/80 hover:bg-neutral-800'}`}>
                  <p className="font-semibold">Oppenheimer added to Streamly</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Academy Award-winning masterpiece by Christopher Nolan.</p>
                  <span className="text-[10px] text-neutral-500 mt-1 block">Yesterday</span>
                </div>
                <div className={`p-2 rounded cursor-pointer transition-colors ${isLight ? 'bg-neutral-100 hover:bg-neutral-200' : 'bg-neutral-800/80 hover:bg-neutral-800'}`}>
                  <p className="font-semibold">Resume Watching: Inception</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">You have 45 minutes left in this movie.</p>
                  <span className="text-[10px] text-neutral-500 mt-1 block">3 days ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded bg-[#e50914] flex items-center justify-center font-bold text-xs text-white hover:brightness-110 transition-all cursor-pointer shadow-md"
            aria-label="Profile menu"
          >
            {currentProfile.charAt(0)}
          </button>

          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-3 w-56 rounded-lg shadow-2xl p-2 text-xs z-50 border ${
                isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#181818] border-neutral-700 text-white'
              }`}
            >
              <div className={`px-3 py-2 border-b mb-1 ${isLight ? 'border-neutral-200' : 'border-neutral-700/80'}`}>
                <p className="text-neutral-400 text-[11px]">Signed in as</p>
                <p className="font-bold text-sm truncate">{currentProfile}</p>
              </div>

              <div className="py-1">
                <p className="px-3 py-1 text-[10px] uppercase font-semibold text-neutral-400">Profiles</p>
                {['Alex', 'Taylor', 'Kids Mode'].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setCurrentProfile(p);
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-left ${
                      isLight ? 'hover:bg-neutral-100 text-neutral-800' : 'hover:bg-neutral-800 text-neutral-200 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-neutral-700 flex items-center justify-center font-bold text-[10px] text-white">
                        {p.charAt(0)}
                      </span>
                      <span>{p}</span>
                    </div>
                    {currentProfile === p && <Check className="w-3.5 h-3.5 text-[#e50914]" />}
                  </button>
                ))}
              </div>

              <div className={`border-t pt-1 mt-1 space-y-0.5 ${isLight ? 'border-neutral-200' : 'border-neutral-700/80'}`}>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className={`w-full text-left px-3 py-1.5 rounded ${isLight ? 'hover:bg-neutral-100 text-neutral-700' : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'}`}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className={`w-full text-left px-3 py-1.5 rounded ${isLight ? 'hover:bg-neutral-100 text-neutral-700' : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'}`}
                >
                  Help Centre
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className={`fixed inset-0 z-50 flex flex-col p-6 md:hidden ${isLight ? 'bg-white text-neutral-900' : 'bg-black/95 text-white'}`}>
          <div className={`flex items-center justify-between mb-8 border-b pb-4 ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`}>
            <span className="text-2xl font-black text-[#e50914]">STREAMLY</span>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setShowMobileMenu(false);
                    if (link.id === 'mylist' && onOpenMyList) {
                      onOpenMyList();
                    } else if (link.id !== 'reels') {
                      const target = document.getElementById(link.id === 'home' ? 'top' : link.id);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className={`flex items-center gap-3 py-2 text-left transition-colors ${
                    activeTab === link.id ? 'text-[#e50914] font-bold' : isLight ? 'text-neutral-700' : 'text-neutral-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`mt-auto border-t pt-6 ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#e50914] flex items-center justify-center font-bold text-white">
                  {currentProfile.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{currentProfile}</p>
                  <p className="text-xs text-neutral-400">Streamly Premium</p>
                </div>
              </div>

              <button
                onClick={onToggleTheme}
                className="p-2 rounded-full border border-neutral-700 flex items-center gap-1.5 text-xs font-semibold"
              >
                {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-300" />}
                <span>{isLight ? 'Dark' : 'Light'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
