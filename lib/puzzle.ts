import type { Word, Puzzle } from '@/types';
import { wordSimilarity } from './similarity';

/**
 * Generate a puzzle from a list of words
 * Picks a random starter word and finds two options with appropriate similarity ranges
 * @param words Array of words with embeddings
 * @returns A puzzle with starter word, two options, and correct answer
 */
export function generatePuzzle(words: Word[]): Puzzle {
  if (words.length < 3) {
    throw new Error('Need at least 3 words to generate a puzzle');
  }

  // Pick a random starter word
  const starterIndex = Math.floor(Math.random() * words.length);
  const starter = words[starterIndex];

  // Calculate similarities for all other words
  const similarities = words
    .map((word, index) => ({
      word,
      index,
      similarity: index === starterIndex ? -1 : wordSimilarity(starter, word),
    }))
    .filter((item) => item.index !== starterIndex)
    .sort((a, b) => b.similarity - a.similarity);

  // Strategy: Pick one word with high similarity and one with lower similarity
  // The correct answer should be the more similar one
  const highSimilarityIndex = Math.floor(Math.random() * Math.min(3, similarities.length));
  const correctAnswer = similarities[highSimilarityIndex].word;
  const correctSimilarity = similarities[highSimilarityIndex].similarity;

  // Find a word with lower similarity (but not too low to make it interesting)
  const lowerSimilarityCandidates = similarities.filter(
    (item) => item.similarity < correctSimilarity - 0.1 && item.similarity > 0.3
  );

  let wrongAnswer: Word;
  if (lowerSimilarityCandidates.length > 0) {
    const randomIndex = Math.floor(Math.random() * lowerSimilarityCandidates.length);
    wrongAnswer = lowerSimilarityCandidates[randomIndex].word;
  } else {
    // Fallback: pick a random word from the lower half
    const lowerHalf = similarities.slice(Math.floor(similarities.length / 2));
    const randomIndex = Math.floor(Math.random() * lowerHalf.length);
    wrongAnswer = lowerHalf[randomIndex].word;
  }

  // Randomly assign which option is correct (left or right)
  const options: [Word, Word] = Math.random() < 0.5
    ? [correctAnswer, wrongAnswer]
    : [wrongAnswer, correctAnswer];

  const similarityScores = {
    option1: wordSimilarity(starter, options[0]),
    option2: wordSimilarity(starter, options[1]),
  };

  return {
    starter,
    options,
    correctAnswer,
    similarityScores,
  };
}
