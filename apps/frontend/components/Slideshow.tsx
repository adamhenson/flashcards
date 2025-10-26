'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getCollectionByName } from '@/lib/collections';
import { COLOR_PALETTES, DARK_TEXT_COLORS, LIGHT_TEXT_COLORS } from '@/lib/palettes';
import { loadConfig, loadLastColor, saveLastColor } from '@/lib/storage';
import type { FlashcardItem } from '@/types/flashcard';

/**
 * Slideshow component that displays flashcards with cross-fade animations
 */
export default function Slideshow(): React.ReactElement {
  const router = useRouter();

  // Load saved color immediately since we're client-only
  const savedColor = loadLastColor();
  const initialColor = savedColor || '#264653';

  const [currentCard, setCurrentCard] = useState<FlashcardItem | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(initialColor);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const config = loadConfig();
    if (!config) {
      router.push('/');
      return;
    }

    const collection = getCollectionByName({ name: config.collectionName });
    if (!collection) {
      router.push('/');
      return;
    }

    // Shuffle cards
    const shuffled = [...collection.items].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);

    // Set up colors
    const palette = COLOR_PALETTES[config.paletteTheme];
    setColors(palette.colors);

    // Initialize first card - use saved color if available
    const firstColor =
      savedColor || palette.colors[Math.floor(Math.random() * palette.colors.length)];
    setCurrentColor(firstColor);
    setCurrentCard(shuffled[0]);
    setCurrentIndex(0);
  }, [router, savedColor]);

  useEffect(() => {
    if (shuffledCards.length === 0 || isPaused) return;

    const config = loadConfig();
    if (!config) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % shuffledCards.length;
      const card = shuffledCards[nextIndex];
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Fade out
      setIsVisible(false);

      // Wait for fade out, then swap content and fade in
      setTimeout(() => {
        setCurrentCard(card);
        setCurrentColor(color);
        setCurrentIndex(nextIndex);
        saveLastColor({ color });

        // Fade in
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 200);
    }, config.intervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [shuffledCards, currentIndex, colors, isPaused]);

  const handleExit = useCallback((): void => {
    router.push('/');
  }, [router]);

  const togglePause = (): void => {
    setIsPaused(!isPaused);
  };

  const getTextColor = (bgColor: string): string => {
    if (DARK_TEXT_COLORS.includes(bgColor)) return '#ffffff';
    if (LIGHT_TEXT_COLORS.includes(bgColor)) return '#ffffff';
    return '#000000';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      const key = event.key.toLowerCase();

      if (key === 'e') {
        handleExit();
      } else if (key === 'p') {
        if (!isPaused) {
          setIsPaused(true);
        }
      } else if (key === 'r') {
        if (isPaused) {
          setIsPaused(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPaused, handleExit]);

  return (
    <div
      style={{
        backgroundColor: currentColor,
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        width: '100vw',
      }}
    >
      {/* Single Card */}
      {currentCard && (
        <div
          style={{
            alignItems: 'center',
            color: getTextColor(currentColor),
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            opacity: isVisible ? 1 : 0,
            padding: '2rem',
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxWidth: '100rem',
              textAlign: 'left',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)',
                fontWeight: 'bold',
                lineHeight: 1.1,
                marginBottom: '0.5rem',
              }}
            >
              {currentCard.main}
            </h1>
            {currentCard.subs.map((sub) => (
              <p
                key={sub}
                style={{
                  borderBottom: `0.1875rem solid currentColor`,
                  fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                  lineHeight: 1.2,
                  paddingBottom: '0.75rem',
                }}
              >
                {sub}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          bottom: '2rem',
          display: 'flex',
          gap: '1rem',
          left: '50%',
          position: 'fixed',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <button
          type='button'
          onClick={togglePause}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            padding: '1rem 2rem',
            transition: 'all 0.2s',
          }}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type='button'
          onClick={handleExit}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            padding: '1rem 2rem',
            transition: 'all 0.2s',
          }}
        >
          Exit
        </button>
      </div>
    </div>
  );
}
