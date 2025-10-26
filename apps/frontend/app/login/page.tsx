'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isValidUsername } from '@/lib/auth';
import { saveUserSession } from '@/lib/storage';

/**
 * Login page for simple username-based authentication
 */
export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (): void => {
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername) {
      setError('Please enter a username');
      return;
    }

    if (!isValidUsername({ username: trimmedUsername })) {
      setError('Username not recognized');
      return;
    }

    saveUserSession({
      session: {
        timestamp: Date.now(),
        type: 'user',
        username: trimmedUsername,
      },
    });

    router.push('/');
  };

  const handleSkip = (): void => {
    saveUserSession({
      session: {
        timestamp: Date.now(),
        type: 'skip',
      },
    });

    router.push('/');
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

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
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Flashcards
        </h1>

        <p
          style={{
            color: '#999',
            fontSize: '1rem',
            textAlign: 'center',
          }}
        >
          Enter your username or skip to continue
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type='text'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            onKeyDown={handleKeyPress}
            placeholder='Username'
            style={{
              backgroundColor: '#2a2a2a',
              border: `2px solid ${error ? '#ff4444' : '#444'}`,
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '1.125rem',
              padding: '1rem',
            }}
          />

          {error && (
            <p
              style={{
                color: '#ff4444',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </p>
          )}

          <button
            type='button'
            onClick={handleLogin}
            style={{
              backgroundColor: '#4CAF50',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              padding: '1rem',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }}
          >
            Login
          </button>

          <button
            type='button'
            onClick={handleSkip}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #444',
              borderRadius: '8px',
              color: '#999',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '1rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#666';
              e.currentTarget.style.color = '#ccc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#444';
              e.currentTarget.style.color = '#999';
            }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
