'use client';

import dynamic from 'next/dynamic';

/**
 * Slideshow page wrapper that disables SSR to prevent hydration mismatches with localStorage
 */
const SlideshowPage = dynamic(() => import('@/components/Slideshow'), {
  ssr: false,
});

export default SlideshowPage;
