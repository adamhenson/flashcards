import type { SlideshowConfig } from '@/types/flashcard';

const STORAGE_KEY = 'flashcards_config';

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
