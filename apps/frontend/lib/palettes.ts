import type { ColorPalette } from '@/types/flashcard';

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  tropicalSunset: {
    name: 'Tropical Sunset Vibes',
    colors: ['#264653', '#2a9d8f', '#8ab17d', '#e9c46a', '#f4a261', '#e76f51'],
  },
  sunnyBeach: {
    name: 'Sunny Beach Retro Vibes',
    colors: ['#a8e8f9', '#00537a', '#013c58', '#f5a201', '#ffba42', '#ffd35b'],
  },
  earthyJewel: {
    name: 'Rich Earthy Jewel',
    colors: ['#361c0e', '#570211', '#7e3110', '#004540', '#032c4d', '#360825'],
  },
};

export const DARK_TEXT_COLORS = ['#264653', '#00537a', '#013c58'];

export const LIGHT_TEXT_COLORS = ['#361c0e', '#570211', '#7e3110', '#004540', '#032c4d', '#360825'];
