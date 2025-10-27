import fancyWordsAi from '@/data/fancy-words-ai.json';
import fancyWordsGeneric from '@/data/fancy-words-generic.json';
import fancyWordsSoftwareEngineers from '@/data/fancy-words-software-engineers.json';
import fancyWordsSystemDesign from '@/data/fancy-words-system-design-and-architecture.json';
import jobExperiences from '@/data/job-experiences.json';
import me from '@/data/me.json';
import type { FlashcardCollection } from '@/types/flashcard';

/**
 * Get all available flashcard collections
 */
export const getAllCollections = (): FlashcardCollection[] => {
  return [
    me as FlashcardCollection,
    fancyWordsGeneric as FlashcardCollection,
    fancyWordsAi as FlashcardCollection,
    fancyWordsSoftwareEngineers as FlashcardCollection,
    fancyWordsSystemDesign as FlashcardCollection,
    jobExperiences as FlashcardCollection,
  ];
};

/**
 * Get a specific collection by name
 */
export const getCollectionByName = ({
  name,
}: {
  name: string;
}): FlashcardCollection | undefined => {
  const collections = getAllCollections();
  return collections.find((c) => c.name === name);
};
