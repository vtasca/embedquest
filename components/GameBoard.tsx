'use client';

import { useState, useEffect } from 'react';
import type { Puzzle, GameState } from '@/types';
import { generatePuzzle } from '@/lib/puzzle';
import { loadWords } from '@/lib/words';
import { wordSimilarity } from '@/lib/similarity';
import ScoreDisplay from './ScoreDisplay';
import WordChoice from './WordChoice';
import FeedbackDisplay from './FeedbackDisplay';

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentPuzzle: null,
    feedback: null,
    puzzleCount: 0,
  });
  const [words, setWords] = useState<typeof import('@/types').Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load words on mount
    const loadedWords = loadWords();
    setWords(loadedWords);
    setIsLoading(false);
    
    // Generate first puzzle
    if (loadedWords.length >= 3) {
      const puzzle = generatePuzzle(loadedWords);
      setGameState((prev) => ({
        ...prev,
        currentPuzzle: puzzle,
      }));
    }
  }, []);

  const handleWordChoice = (selectedWord: typeof import('@/types').Word) => {
    if (!gameState.currentPuzzle || gameState.feedback !== null) {
      return;
    }

    const isCorrect = selectedWord.name === gameState.currentPuzzle.correctAnswer.name;
    const similarity = wordSimilarity(
      gameState.currentPuzzle.starter,
      selectedWord
    );

    const feedback = {
      isCorrect,
      message: isCorrect
        ? `Great! "${selectedWord.name}" is more similar to "${gameState.currentPuzzle.starter.name}"`
        : `Not quite. The correct answer was "${gameState.currentPuzzle.correctAnswer.name}"`,
      similarityScore: similarity,
    };

    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      feedback,
    }));
  };

  const handleNextPuzzle = () => {
    if (words.length < 3) {
      return;
    }

    const puzzle = generatePuzzle(words);
    setGameState((prev) => ({
      ...prev,
      currentPuzzle: puzzle,
      feedback: null,
      puzzleCount: prev.puzzleCount + 1,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading game...</div>
      </div>
    );
  }

  if (!gameState.currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Error: Not enough words to generate puzzles
        </div>
      </div>
    );
  }

  const { starter, options } = gameState.currentPuzzle;
  const isOption1Correct =
    gameState.feedback?.isCorrect !== null &&
    options[0].name === gameState.currentPuzzle.correctAnswer.name;
  const isOption2Correct =
    gameState.feedback?.isCorrect !== null &&
    options[1].name === gameState.currentPuzzle.correctAnswer.name;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        <ScoreDisplay score={gameState.score} puzzleCount={gameState.puzzleCount} />

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-600 mb-2">Which word is most similar to:</div>
            <div className="text-4xl font-bold text-gray-900">{starter.name}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <WordChoice
              word={options[0].name}
              onClick={() => handleWordChoice(options[0])}
              disabled={gameState.feedback !== null}
              isCorrect={
                gameState.feedback !== null
                  ? isOption1Correct
                  : null
              }
              similarityScore={
                gameState.feedback !== null
                  ? gameState.currentPuzzle.similarityScores.option1
                  : null
              }
            />
            <div className="text-gray-400 font-bold text-xl">or</div>
            <WordChoice
              word={options[1].name}
              onClick={() => handleWordChoice(options[1])}
              disabled={gameState.feedback !== null}
              isCorrect={
                gameState.feedback !== null
                  ? isOption2Correct
                  : null
              }
              similarityScore={
                gameState.feedback !== null
                  ? gameState.currentPuzzle.similarityScores.option2
                  : null
              }
            />
          </div>

          <FeedbackDisplay feedback={gameState.feedback} />

          {gameState.feedback !== null && (
            <div className="mt-6 text-center">
              <button
                onClick={handleNextPuzzle}
                className="bg-purple-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Next Puzzle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
