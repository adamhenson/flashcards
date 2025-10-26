'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllCollections } from '@/lib/collections';
import { COLOR_PALETTES } from '@/lib/palettes';
import { loadConfig, saveConfig } from '@/lib/storage';
import type { SlideshowConfig } from '@/types/flashcard';

/**
 * Main configuration page for setting up the flashcards slideshow
 */
export default function HomePage(): React.ReactElement {
  const router = useRouter();
  const collections = getAllCollections();

  const [collectionName, setCollectionName] = useState<string>(collections[0].name);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(5);
  const [paletteTheme, setPaletteTheme] = useState<string>('earth');

  useEffect(() => {
    const config = loadConfig();
    if (config) {
      setCollectionName(config.collectionName);
      setIntervalSeconds(config.intervalSeconds);
      setPaletteTheme(config.paletteTheme);
    }
  }, []);

  const handleStart = (): void => {
    const config: SlideshowConfig = {
      collectionName,
      intervalSeconds,
      paletteTheme,
    };
    saveConfig({ config });
    router.push('/slideshow');
  };

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        padding: '2rem',
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Flashcards
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label
              htmlFor='collection-select'
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              Choose a Collection
            </label>
            <select
              id='collection-select'
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              style={{
                backgroundColor: '#2a2a2a',
                border: '2px solid #444',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '1.25rem',
                padding: '1rem',
              }}
            >
              {collections.map((collection) => (
                <option key={collection.name} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label
              htmlFor='interval-input'
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              Interval (seconds)
            </label>
            <input
              id='interval-input'
              type='number'
              min='1'
              max='60'
              value={intervalSeconds}
              onChange={(e) => setIntervalSeconds(Number(e.target.value))}
              style={{
                backgroundColor: '#2a2a2a',
                border: '2px solid #444',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '1.25rem',
                padding: '1rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              Color Palette
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
                <button
                  key={key}
                  type='button'
                  onClick={() => setPaletteTheme(key)}
                  style={{
                    alignItems: 'center',
                    backgroundColor: paletteTheme === key ? '#444' : '#2a2a2a',
                    border: `2px solid ${paletteTheme === key ? '#666' : '#444'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {palette.colors.map((color) => (
                      <div
                        key={color}
                        style={{
                          backgroundColor: color,
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '4px',
                          height: '40px',
                          width: '40px',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ color: '#ffffff', fontSize: '1.125rem' }}>{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type='button'
          onClick={handleStart}
          style={{
            backgroundColor: '#4CAF50',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            padding: '1.5rem',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
          }}
        >
          Start Slideshow
        </button>
      </div>
    </div>
  );
}
