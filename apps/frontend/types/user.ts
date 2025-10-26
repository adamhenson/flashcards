/**
 * User configuration type
 */
export type UserConfig = {
  /** List of collection names the user can access, or "all" for all collections */
  collections: string[];
};

/**
 * Users data structure
 */
export type UsersData = {
  /** Skip expiry in days */
  skipExpiryDays: number;

  /** Map of username to user configuration */
  users: Record<string, UserConfig>;
};

/**
 * Stored user session
 */
export type UserSession = {
  /** Timestamp when session was created */
  timestamp: number;

  /** Type of session */
  type: 'user' | 'skip';

  /** Username if logged in */
  username?: string;
};
