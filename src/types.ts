export interface Movie {
  id: string;
  title: string;
  sceneKey: 'coast' | 'mountain' | 'ocean' | 'city' | 'cafe' | 'desert' | 'lab' | 'forest' | 'stage' | 'harbor';
  tag: string;
  videoFile: string;
  youtubeTrailerId: string;
  description: string;
  duration: string;
  durationMinutes: number;
  genres: string[];
  year: string;
  ageRating: string;
  matchScore: number;
  imdbRating: number;
  posterUrl: string;
  backdropUrl: string;
  cast: string[];
  directors?: string;
  progress?: number; // for continue watching (0-100)
}

export type GenreFilter = 'All' | 'Action' | 'Sci-fi' | 'Drama' | 'Comedy' | 'Thriller' | 'Animation' | 'Romance' | 'Western' | 'Crime' | 'Adventure' | 'Horror' | 'Documentary';

export type AppTheme = 'dark' | 'light';

export interface DurationFilterOption {
  id: string;
  label: string;
  sublabel: string;
  maxMinutes: number | null;
  minMinutes?: number;
}

export interface UserRating {
  [movieId: string]: 'like' | 'dislike' | null;
}
