'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllowedCollections, getSkipUserCollections } from '@/lib/auth';
import { getAllCollections } from '@/lib/collections';
import { COLOR_PALETTES } from '@/lib/palettes';
import { loadConfig, loadUserSession, saveConfig } from '@/lib/storage';
import type { CollectionInterval, FlashcardCollection, SlideshowConfig } from '@/types/flashcard';

/**
 * Main configuration page for setting up the flashcards slideshow
 */
export default function HomePage(): React.ReactElement {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [collections, setCollections] = useState<FlashcardCollection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<CollectionInterval[]>([]);
  const [paletteTheme, setPaletteTheme] = useState<string>('earth');

  useEffect(() => {
    // Check for valid user session
    const session = loadUserSession();

    if (!session) {
      router.push('/login');
      return;
    }

    // Check if session is still valid
    const { isSessionValid } = require('@/lib/auth');
    if (!isSessionValid({ timestamp: session.timestamp, type: session.type })) {
      router.push('/login');
      return;
    }

    // Load collections based on user
    const allCollections = getAllCollections();
    let allowedCollections = allCollections;

    if (session.type === 'skip') {
      // Skip users see all collections except restricted ones
      allowedCollections = getSkipUserCollections({ allCollections });
    } else if (session.type === 'user' && session.username) {
      // Logged in users see collections based on their permissions
      allowedCollections = getAllowedCollections({
        allCollections,
        username: session.username,
      });
    }

    setCollections(allowedCollections);
    setIsCheckingAuth(false);

    // Load saved config
    const config = loadConfig();
    if (config) {
      // Handle backward compatibility: convert old format to new format
      let collectionsToUse: CollectionInterval[] = [];

      if (config.collections && Array.isArray(config.collections)) {
        // New format: filter saved collections to only include those user has access to
        collectionsToUse = config.collections.filter((c) =>
          allowedCollections.some((ac) => ac.name === c.collectionName)
        );
      } else if ('collectionName' in config && 'intervalSeconds' in config) {
        // Old format: convert to new format
        const hasAccess = allowedCollections.some((c) => c.name === config.collectionName);
        if (hasAccess) {
          collectionsToUse = [
            {
              collectionName: config.collectionName as string,
              intervalSeconds: config.intervalSeconds as number,
            },
          ];
        }
      }

      if (collectionsToUse.length > 0) {
        setSelectedCollections(collectionsToUse);
      } else if (allowedCollections[0]) {
        // Default to first collection if no saved config is accessible
        setSelectedCollections([
          { collectionName: allowedCollections[0].name, intervalSeconds: 5 },
        ]);
      }
      setPaletteTheme(config.paletteTheme);
    } else if (allowedCollections[0]) {
      // Default to first collection
      setSelectedCollections([{ collectionName: allowedCollections[0].name, intervalSeconds: 5 }]);
    }
  }, [router]);

  const handleToggleCollection = ({ collectionName }: { collectionName: string }): void => {
    const exists = selectedCollections.find((c) => c.collectionName === collectionName);
    if (exists) {
      setSelectedCollections(
        selectedCollections.filter((c) => c.collectionName !== collectionName)
      );
    } else {
      setSelectedCollections([...selectedCollections, { collectionName, intervalSeconds: 5 }]);
    }
  };

  const handleIntervalChange = ({
    collectionName,
    intervalSeconds,
  }: {
    collectionName: string;
    intervalSeconds: number;
  }): void => {
    setSelectedCollections(
      selectedCollections.map((c) =>
        c.collectionName === collectionName ? { ...c, intervalSeconds } : c
      )
    );
  };

  const handleStart = (): void => {
    if (selectedCollections.length === 0) return;
    const config: SlideshowConfig = {
      collections: selectedCollections,
      paletteTheme,
    };
    saveConfig({ config });
    router.push('/slideshow');
  };

  if (isCheckingAuth) {
    return <div />;
  }

  if (collections.length === 0) {
    return (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ fontSize: '1.5rem' }}>No collections available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        width: '100vw',
      }}
    >
      {/* Navigation buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          position: 'fixed',
          right: '1.5rem',
          top: '1.5rem',
          zIndex: 1000,
        }}
      >
        <button
          type='button'
          style={{
            alignItems: 'center',
            backgroundColor: '#2a9d8f',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            gap: '0.375rem',
            padding: '0.5rem 0.75rem',
          }}
        >
          settings
        </button>
        <button
          type='button'
          onClick={() => router.push('/list')}
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
          list
        </button>
      </div>

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              Choose Collections
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {collections.map((collection) => {
                const isSelected = selectedCollections.some(
                  (c) => c.collectionName === collection.name
                );
                return (
                  <div
                    key={collection.name}
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                  >
                    <button
                      type='button'
                      onClick={() => handleToggleCollection({ collectionName: collection.name })}
                      style={{
                        alignItems: 'center',
                        backgroundColor: isSelected ? '#2a9d8f' : '#2a2a2a',
                        border: `2px solid ${isSelected ? '#2a9d8f' : '#444'}`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        fontSize: '1.125rem',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>{collection.name}</span>
                      <span>{isSelected ? '✓' : ''}</span>
                    </button>
                    {isSelected && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          paddingLeft: '1rem',
                        }}
                      >
                        <label
                          htmlFor={`interval-${collection.name}`}
                          style={{
                            color: '#ccc',
                            fontSize: '1rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Interval (seconds):
                        </label>
                        <input
                          id={`interval-${collection.name}`}
                          type='number'
                          min='1'
                          max='60'
                          value={
                            selectedCollections.find((c) => c.collectionName === collection.name)
                              ?.intervalSeconds || 5
                          }
                          onChange={(e) =>
                            handleIntervalChange({
                              collectionName: collection.name,
                              intervalSeconds: Number(e.target.value),
                            })
                          }
                          style={{
                            backgroundColor: '#2a2a2a',
                            border: '2px solid #444',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontSize: '1rem',
                            padding: '0.5rem',
                            width: '80px',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      justifyContent: 'center',
                    }}
                  >
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
          disabled={selectedCollections.length === 0}
          style={{
            backgroundColor: selectedCollections.length === 0 ? '#666' : '#4CAF50',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: selectedCollections.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            opacity: selectedCollections.length === 0 ? 0.5 : 1,
            padding: '1.5rem',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            if (selectedCollections.length > 0) {
              e.currentTarget.style.backgroundColor = '#45a049';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCollections.length > 0) {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }
          }}
        >
          Start Slideshow
        </button>
      </div>
    </div>
  );
}
