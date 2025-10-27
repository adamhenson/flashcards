'use client';

import { PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getCollectionByName } from '@/lib/collections';
import { COLOR_PALETTES, DARK_TEXT_COLORS, LIGHT_TEXT_COLORS } from '@/lib/palettes';
import { loadConfig, loadLastColor, saveLastColor } from '@/lib/storage';
import type { CollectionInterval, FlashcardItem } from '@/types/flashcard';

/**
 * Parse markdown bold syntax (**text**) and convert to React elements
 */
const parseMarkdownBold = ({ text }: { text: string }): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <b key={content}>{content}</b>;
    }
    return part;
  });
};

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
  const [collectionIntervals, setCollectionIntervals] = useState<CollectionInterval[]>([]);
  const [shuffledCardsByCollection, setShuffledCardsByCollection] = useState<
    Map<string, FlashcardItem[]>
  >(new Map());
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
  const [currentCardIndexByCollection, setCurrentCardIndexByCollection] = useState<
    Map<string, number>
  >(new Map());
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const config = loadConfig();
    console.log('Loaded config:', config);
    if (!config || !config.collections || config.collections.length === 0) {
      router.push('/');
      return;
    }

    // Load and shuffle cards for each collection
    const cardsByCollection = new Map<string, FlashcardItem[]>();
    const indexByCollection = new Map<string, number>();

    for (const collectionConfig of config.collections) {
      const collection = getCollectionByName({ name: collectionConfig.collectionName });
      console.log('Loading collection:', collectionConfig.collectionName, collection);
      if (collection) {
        const shuffled = [...collection.items].sort(() => Math.random() - 0.5);
        cardsByCollection.set(collectionConfig.collectionName, shuffled);
        indexByCollection.set(collectionConfig.collectionName, 0);
      }
    }

    console.log('Cards by collection:', Array.from(cardsByCollection.keys()));

    if (cardsByCollection.size === 0) {
      router.push('/');
      return;
    }

    setCollectionIntervals(config.collections);
    setShuffledCardsByCollection(cardsByCollection);
    setCurrentCardIndexByCollection(indexByCollection);

    // Set up colors
    const palette = COLOR_PALETTES[config.paletteTheme];
    setColors(palette.colors);

    // Initialize first card from first collection
    const firstCollectionName = config.collections[0].collectionName;
    const firstCards = cardsByCollection.get(firstCollectionName);
    if (firstCards?.[0]) {
      const firstColor =
        savedColor || palette.colors[Math.floor(Math.random() * palette.colors.length)];
      setCurrentColor(firstColor);
      setCurrentCard(firstCards[0]);
      setCurrentCollectionIndex(0);
    }
  }, [router, savedColor]);

  useEffect(() => {
    if (collectionIntervals.length === 0 || shuffledCardsByCollection.size === 0 || isPaused)
      return;

    const currentCollectionConfig = collectionIntervals[currentCollectionIndex];
    if (!currentCollectionConfig) return;

    console.log(
      `Setting timeout for ${currentCollectionConfig.intervalSeconds}s for collection:`,
      currentCollectionConfig.collectionName
    );

    const timeout = setTimeout(() => {
      // Move to next collection first
      const nextCollectionIndex = (currentCollectionIndex + 1) % collectionIntervals.length;
      const nextCollectionConfig = collectionIntervals[nextCollectionIndex];

      console.log('Moving to next collection:', nextCollectionConfig.collectionName);

      // Get next collection's cards
      const nextCards = shuffledCardsByCollection.get(nextCollectionConfig.collectionName);
      if (!nextCards) {
        console.log('No cards found for collection:', nextCollectionConfig.collectionName);
        return;
      }

      // Get current index for next collection
      const currentCardIndex =
        currentCardIndexByCollection.get(nextCollectionConfig.collectionName) || 0;

      // Get the card to show
      const card = nextCards[currentCardIndex];

      // Move to next card index for this collection
      const nextCardIndex = (currentCardIndex + 1) % nextCards.length;

      const color = colors[Math.floor(Math.random() * colors.length)];

      // Fade out
      setIsVisible(false);

      // Wait for fade out, then swap content and fade in
      setTimeout(() => {
        setCurrentCard(card);
        setCurrentColor(color);
        setCurrentCollectionIndex(nextCollectionIndex);

        // Update the index for next collection
        setCurrentCardIndexByCollection((prev) => {
          const newMap = new Map(prev);
          newMap.set(nextCollectionConfig.collectionName, nextCardIndex);
          return newMap;
        });

        saveLastColor({ color });

        // Fade in
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 200);
    }, currentCollectionConfig.intervalSeconds * 1000);

    return () => clearTimeout(timeout);
  }, [
    collectionIntervals,
    shuffledCardsByCollection,
    currentCollectionIndex,
    currentCardIndexByCollection,
    colors,
    isPaused,
  ]);

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
              marginTop: '-4rem',
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
            {currentCard.subs.map((sub) => (
              <p
                key={sub}
                style={{
                  borderBottom: `0.1875rem solid currentColor`,
                  fontSize: 'clamp(1rem, 2.5vw, 2rem)',
                  fontWeight:
                    'clamp(400, calc(400 + (900 - 400) * ((100vw - 20rem) / (100 - 20))), 900)',
                  lineHeight: 1.2,
                  paddingBottom: '0.75rem',
                }}
              >
                {parseMarkdownBold({ text: sub })}
              </p>
            ))}
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
