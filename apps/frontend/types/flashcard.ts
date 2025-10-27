/**
 * Type definitions for flashcard data structures
 */

/**
 * Individual flashcard item with main text and sub-items
 */
export type FlashcardItem = {
  /** Main header text for the flashcard */
  main: string;

  /** Sub-text lines displayed below the main text */
  subs: string[];

  /** Optional tags to categorize the flashcard */
  tags?: string[];
};

/**
 * Complete flashcard collection
 */
export type FlashcardCollection = {
  /** Display name of the collection */
  name: string;

  /** Array of flashcard items in the collection */
  items: FlashcardItem[];
};

/**
 * Collection with interval configuration
 */
export type CollectionInterval = {
  /** Name of the collection */
  collectionName: string;

  /** Interval in seconds for this collection */
  intervalSeconds: number;
};

/**
 * User configuration for the slideshow
 */
export type SlideshowConfig = {
  /** Array of collections with their intervals */
  collections: CollectionInterval[];

  /** Selected color palette theme */
  paletteTheme: string;
};

/**
 * Color palette theme definition
 */
export type ColorPalette = {
  /** Array of background colors (hex format) */
  colors: string[];

  /** Display name for the palette */
  name: string;
};
