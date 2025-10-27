'use client';

import { PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
                fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
                fontWeight: 'bold',
                lineHeight: 1.1,
                marginBottom: 0,
              }}
            >
              {currentCard.main}
            </h1>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                listStylePosition: 'outside',
                paddingLeft: '1.5rem',
              }}
            >
              {currentCard.subs.map((sub) => (
                <li
                  key={sub}
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                    fontWeight:
                      'clamp(400, calc(400 + (900 - 400) * ((100vw - 20rem) / (100 - 20))), 900)',
                    lineHeight: 1.2,
                  }}
                >
                  {sub}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tags */}
      {currentCard?.tags && currentCard.tags.length > 0 && (
        <div
          style={{
            bottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            left: '1.5rem',
            position: 'fixed',
            zIndex: 1000,
          }}
        >
          {currentCard.tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: 'transparent',
                border: `0.1875rem solid ${getTextColor(currentColor)}`,
                borderRadius: '0.5rem',
                color: getTextColor(currentColor),
                fontSize: 'clamp(0.875rem, 1.5vw, 1.25rem)',
                fontWeight:
                  'clamp(700, calc(700 + (900 - 700) * ((100vw - 20rem) / (100 - 20))), 900)',
                padding: '0.5rem 0.75rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          bottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem',
          position: 'fixed',
          right: '1.5rem',
          zIndex: 1000,
        }}
      >
        <button
          type='button'
          onClick={togglePause}
          style={{
            alignItems: 'center',
            backgroundColor: '#000000',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            gap: '0.375rem',
            padding: '0.5rem 0.75rem',
            transition: 'all 0.2s',
          }}
        >
          {isPaused ? (
            <>
              <span>[r]</span>
              <PlayIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            </>
          ) : (
            <>
              <span>[p]</span>
              <PauseIcon style={{ height: '1.25rem', width: '1.25rem' }} />
            </>
          )}
        </button>
        <button
          type='button'
          onClick={handleExit}
          style={{
            alignItems: 'center',
            backgroundColor: '#000000',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            gap: '0.375rem',
            padding: '0.5rem 0.75rem',
            transition: 'all 0.2s',
          }}
        >
          <span>[e]</span>
          <XMarkIcon style={{ height: '1.25rem', width: '1.25rem' }} />
        </button>
      </div>
    </div>
  );
}
