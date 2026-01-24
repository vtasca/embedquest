import type { Word } from '@/types';
import embeddingsData from '@/data/embeddings.json';

/**
 * Load words from embeddings data
 * In the future, this will load from embeddings.json
 */
export function loadWords(): Word[] {
  return embeddingsData.words as Word[];
}
