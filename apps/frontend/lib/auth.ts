import usersData from '@/data/users.json';
import type { FlashcardCollection } from '@/types/flashcard';
import type { UsersData } from '@/types/user';

const users = usersData as UsersData;

/**
 * Check if a user session is still valid
 */
export const isSessionValid = ({
  timestamp,
  type,
}: {
  /** Timestamp when session was created */
  timestamp: number;

  /** Type of session */
  type: 'user' | 'skip';
}): boolean => {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  if (type === 'skip') {
    const expiryMs = users.skipExpiryDays * dayInMs;
    return now - timestamp < expiryMs;
  }

  // User sessions don't expire
  return true;
};

/**
 * Check if a username exists in the users data
 */
export const isValidUsername = ({ username }: { username: string }): boolean => {
  return username.toLowerCase() in users.users;
};

/**
 * Get allowed collections for a user
 */
export const getAllowedCollections = ({
  allCollections,
  username,
}: {
  /** All available collections */
  allCollections: FlashcardCollection[];

  /** Username to check */
  username: string;
}): FlashcardCollection[] => {
  const userConfig = users.users[username.toLowerCase()];

  if (!userConfig) return [];

  if (userConfig.collections.includes('all')) {
    return allCollections;
  }

  return allCollections.filter((collection) => userConfig.collections.includes(collection.name));
};
