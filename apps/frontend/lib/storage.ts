import type { SlideshowConfig } from '@/types/flashcard';

const STORAGE_KEY = 'flashcards_config';
const LAST_COLOR_KEY = 'flashcards_last_color';

/**
 * Save slideshow configuration to localStorage
 */
export const saveConfig = ({ config }: { config: SlideshowConfig }): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

/**
 * Load slideshow configuration from localStorage
 */
export const loadConfig = (): SlideshowConfig | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as SlideshowConfig;
  } catch {
    return null;
  }
};

/**
 * Save last used background color to localStorage
 */
export const saveLastColor = ({ color }: { color: string }): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_COLOR_KEY, color);
};

/**
 * Load last used background color from localStorage
 */
export const loadLastColor = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LAST_COLOR_KEY);
};
