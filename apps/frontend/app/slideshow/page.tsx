'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCollectionByName } from '@/lib/collections';
import { COLOR_PALETTES, DARK_TEXT_COLORS, LIGHT_TEXT_COLORS } from '@/lib/palettes';
import { loadConfig } from '@/lib/storage';
import type { FlashcardItem } from '@/types/flashcard';

/**
 * Slideshow page that displays flashcards with cross-fade animations
 */
export default function SlideshowPage(): React.ReactElement {
  const router = useRouter();
  const [currentCard, setCurrentCard] = useState<FlashcardItem | null>(null);
  const [nextCard, setNextCard] = useState<FlashcardItem | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#264653');
  const [nextColor, setNextColor] = useState<string>('#2a9d8f');
  const [isTransitioning, setIsTransitioning] = useState(false);
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

    // Initialize first card
    const firstColor = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    setCurrentColor(firstColor);
    setCurrentCard(shuffled[0]);
    setCurrentIndex(0);
  }, [router]);

  useEffect(() => {
    if (shuffledCards.length === 0 || isPaused) return;

    const config = loadConfig();
    if (!config) return;

    const interval = setInterval(
      () => {
        const nextIndex = (currentIndex + 1) % shuffledCards.length;
        const card = shuffledCards[nextIndex];
        const color = colors[Math.floor(Math.random() * colors.length)];

        setNextCard(card);
        setNextColor(color);
        setIsTransitioning(true);

        setTimeout(() => {
          setCurrentCard(card);
          setCurrentColor(color);
          setIsTransitioning(false);
          setCurrentIndex(nextIndex);
        }, 1000);
      },
      config.intervalSeconds * 1000
    );

    return () => clearInterval(interval);
  }, [shuffledCards, currentIndex, colors, isPaused]);

  const handleExit = (): void => {
    router.push('/');
  };

  const togglePause = (): void => {
    setIsPaused(!isPaused);
  };

  const getTextColor = (bgColor: string): string => {
    if (DARK_TEXT_COLORS.includes(bgColor)) return '#ffffff';
    if (LIGHT_TEXT_COLORS.includes(bgColor)) return '#ffffff';
    return '#000000';
  };

  if (!currentCard) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh', position: 'relative', width: '100vw' }}>
      {/* Current Card */}
      <div
        style={{
          alignItems: 'center',
          backgroundColor: currentColor,
          color: getTextColor(currentColor),
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          left: 0,
          opacity: isTransitioning ? 0 : 1,
          padding: '2rem',
          position: 'absolute',
          top: 0,
          transition: 'opacity 1s ease-in-out',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            maxWidth: '1200px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 'bold',
              lineHeight: 1.2,
            }}
          >
            {currentCard.main}
          </h1>
          {currentCard.subs.map((sub, index) => (
            <p
              key={index}
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 2.5rem)',
                lineHeight: 1.5,
              }}
            >
              {sub}
            </p>
          ))}
        </div>
      </div>

      {/* Next Card (for transition) */}
      {isTransitioning && nextCard && (
        <div
          style={{
            alignItems: 'center',
            backgroundColor: nextColor,
            color: getTextColor(nextColor),
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            left: 0,
            opacity: 1,
            padding: '2rem',
            position: 'absolute',
            top: 0,
            transition: 'opacity 1s ease-in-out',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              maxWidth: '1200px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 'bold',
                lineHeight: 1.2,
              }}
            >
              {nextCard.main}
            </h1>
            {nextCard.subs.map((sub, index) => (
              <p
                key={index}
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 2.5rem)',
                  lineHeight: 1.5,
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

