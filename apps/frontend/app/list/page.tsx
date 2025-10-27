'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAllowedCollections, getSkipUserCollections } from '@/lib/auth';
import { getAllCollections } from '@/lib/collections';
import { loadUserSession } from '@/lib/storage';
import type { FlashcardCollection } from '@/types/flashcard';

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
 * List page for viewing all items in a collection
 */
export default function ListPage(): React.ReactElement {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [collections, setCollections] = useState<FlashcardCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

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
      allowedCollections = getSkipUserCollections({ allCollections });
    } else if (session.type === 'user' && session.username) {
      allowedCollections = getAllowedCollections({
        allCollections,
        username: session.username,
      });
    }

    setCollections(allowedCollections);
    setSelectedCollection(allowedCollections[0]?.name || '');
    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return <div />;
  }

  const currentCollection = collections.find((c) => c.name === selectedCollection);

  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh',
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
          onClick={() => router.push('/')}
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
          [settings]
        </button>
        <button
          type='button'
          style={{
            alignItems: 'center',
            backgroundColor: '#2a9d8f',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#ffffff',
            cursor: 'default',
            display: 'flex',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            gap: '0.375rem',
            padding: '0.5rem 0.75rem',
          }}
        >
          [list]
        </button>
      </div>

      <div
        style={{
          margin: '0 auto',
          maxWidth: '1200px',
          paddingTop: '4rem',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
          }}
        >
          Collection List
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <label
            htmlFor='collection-select'
            style={{
              display: 'block',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.75rem',
            }}
          >
            Select Collection
          </label>
          <select
            id='collection-select'
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            style={{
              backgroundColor: '#2a2a2a',
              border: '2px solid #444',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '1.125rem',
              padding: '0.75rem',
              width: '100%',
            }}
          >
            {collections.map((collection) => (
              <option key={collection.name} value={collection.name}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        {currentCollection && (
          <div>
            {currentCollection.items.map((item, index) => (
              <div key={`${item.main}-${index}`}>
                <div
                  style={{
                    paddingBottom: '2rem',
                    paddingTop: index === 0 ? '0' : '2rem',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                    }}
                  >
                    {item.main}
                  </h2>
                  <ul
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      listStylePosition: 'outside',
                      paddingLeft: '1.5rem',
                    }}
                  >
                    {item.subs.map((sub) => (
                      <li
                        key={sub}
                        style={{
                          fontSize: '1.125rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {parseMarkdownBold({ text: sub })}
                      </li>
                    ))}
                  </ul>
                  {item.tags && item.tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginTop: '1rem',
                      }}
                    >
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: 'transparent',
                            border: '0.125rem solid #666',
                            borderRadius: '0.5rem',
                            color: '#ccc',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            padding: '0.25rem 0.5rem',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {index < currentCollection.items.length - 1 && (
                  <hr
                    style={{
                      border: 'none',
                      borderTop: '2px solid #444',
                      margin: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
