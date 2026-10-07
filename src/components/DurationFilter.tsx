import React from 'react';
import { Clock, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { DurationFilterOption, Movie } from '../types';
import { DURATION_OPTIONS } from '../data/movies';

interface DurationFilterProps {
  selectedDurationId: string;
  onSelectDuration: (option: DurationFilterOption) => void;
  maxSliderMinutes: number;
  onSliderChange: (minutes: number) => void;
  isSliderActive: boolean;
  onResetDuration: () => void;
  matchingCount: number;
}

export const DurationFilter: React.FC<DurationFilterProps> = ({
  selectedDurationId,
  onSelectDuration,
  maxSliderMinutes,
  onSliderChange,
  isSliderActive,
  onResetDuration,
  matchingCount,
}) => {
  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? `${m}m` : ''}`;
  };

  return (
    <div className="mx-4 md:mx-12 mb-8 bg-[#1a1a1a]/85 dark:bg-[#1a1a1a]/85 light:bg-white border border-neutral-700/60 light:border-neutral-200 rounded-xl p-4 md:p-5 shadow-xl backdrop-blur-md">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>Find Movies by Duration</span>
              <span className="text-[11px] font-semibold text-[#e50914] bg-[#e50914]/15 px-2 py-0.5 rounded-full">
                New Feature
              </span>
            </h3>
            <p className="text-xs opacity-75">
              Pick your available time tonight — we'll tailor recommendations to fit your schedule.
            </p>
          </div>
        </div>

        {/* Status / Matching count badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-800/80 light:bg-neutral-100 border border-neutral-700 light:border-neutral-300">
            {matchingCount} {matchingCount === 1 ? 'movie fits' : 'movies fit'}
          </span>
          {(selectedDurationId !== 'all' || isSliderActive) && (
            <button
              onClick={onResetDuration}
              className="text-xs opacity-80 hover:opacity-100 flex items-center gap-1 p-1 hover:bg-neutral-800/50 light:hover:bg-neutral-100 rounded transition-colors cursor-pointer"
              title="Reset duration filter"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Buttons + Interactive Slider */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = selectedDurationId === opt.id && !isSliderActive;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectDuration(opt)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#e50914] border-[#e50914] text-white font-semibold shadow-md shadow-red-950/40'
                    : 'bg-neutral-900/90 light:bg-neutral-100 border-neutral-700/80 light:border-neutral-300 opacity-90 hover:opacity-100 hover:border-neutral-400'
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({opt.sublabel})</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-7 bg-neutral-700/50" />

        {/* Custom Duration Slider */}
        <div className="flex-1 flex items-center gap-3 bg-neutral-900/90 light:bg-neutral-100 border border-neutral-800 light:border-neutral-300 rounded-lg px-3.5 py-2">
          <SlidersHorizontal className="w-4 h-4 opacity-60 shrink-0" />
          <span className="text-xs whitespace-nowrap">
            Max time: <strong>{formatMinutes(maxSliderMinutes)}</strong>
          </span>
          <input
            type="range"
            min={85}
            max={180}
            step={5}
            value={maxSliderMinutes}
            onChange={(e) => onSliderChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-neutral-700 light:bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-[#e50914] focus:outline-none"
          />
          <span className="text-[11px] font-mono opacity-70 shrink-0">
            3h max
          </span>
        </div>
      </div>
    </div>
  );
};
