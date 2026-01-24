import type { Word } from '@/types';
import embeddingsData from '@/data/embeddings.json';

/**
 * Load words from embeddings data
 */
export function loadWords(): Word[] {
  return (embeddingsData as { words: Word[] }).words;
}
