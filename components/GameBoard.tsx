'use client';

import { useState, useEffect } from 'react';
import type { GameState, PuzzleResponse } from '@/types';
import ScoreDisplay from './ScoreDisplay';
import WordChoice from './WordChoice';
import FeedbackDisplay from './FeedbackDisplay';
import HighScoreSaveModal from './HighScoreSaveModal';

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentPuzzle: null,
    feedback: null,
    puzzleCount: 0,
    gameOver: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Fetch a new puzzle from the API
  const fetchPuzzle = async () => {
    try {
      setError(null);
      const response = await fetch('/api/puzzle');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch puzzle');
      }
      
      const puzzle: PuzzleResponse = await response.json();
      return puzzle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load puzzle';
      setError(errorMessage);
      throw err;
    }
  };

  // Load initial puzzle on mount
  useEffect(() => {
    const loadInitialPuzzle = async () => {
      try {
        const puzzle = await fetchPuzzle();
        setGameState((prev) => ({
          ...prev,
          currentPuzzle: puzzle,
        }));
      } catch (err) {
        console.error('Failed to load initial puzzle:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPuzzle();
  }, []);

  const handleWordChoice = (selectedWord: string) => {
    if (!gameState.currentPuzzle || gameState.feedback !== null) {
      return;
    }

    const isCorrect = selectedWord === gameState.currentPuzzle.correctAnswer;
    
    // Get the similarity score for the selected word
    const similarity = selectedWord === gameState.currentPuzzle.options[0]
      ? gameState.currentPuzzle.similarityScores.option1
      : gameState.currentPuzzle.similarityScores.option2;

    const feedback = {
      isCorrect,
      message: isCorrect
        ? `Great! "${selectedWord}" is more similar to "${gameState.currentPuzzle.starter}"`
        : `Not quite. The correct answer was "${gameState.currentPuzzle.correctAnswer}"`,
      similarityScore: similarity,
    };

    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      feedback,
      gameOver: !isCorrect,
    }));
  };

  const handleNextPuzzle = async () => {
    try {
      const puzzle = await fetchPuzzle();
      setGameState((prev) => ({
        ...prev,
        currentPuzzle: puzzle,
        feedback: null,
        puzzleCount: prev.puzzleCount + 1,
      }));
    } catch (err) {
      console.error('Failed to load next puzzle:', err);
    }
  };

  const handlePlayAgain = async () => {
    try {
      const puzzle = await fetchPuzzle();
      setGameState({
        score: 0,
        currentPuzzle: puzzle,
        feedback: null,
        puzzleCount: 0,
        gameOver: false,
      });
      setShowSaveModal(false);
    } catch (err) {
      console.error('Failed to load puzzle for new game:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading game...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="text-xl text-red-600 mb-4">Error: {error}</div>
          <p className="text-gray-600 mb-4">
            Make sure you have generated the embeddings database by running:
          </p>
          <code className="bg-gray-100 px-4 py-2 rounded block">
            npm run generate-embeddings
          </code>
        </div>
      </div>
    );
  }

  if (!gameState.currentPuzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Error: Failed to load puzzle
        </div>
      </div>
    );
  }

  const { starter, options, correctAnswer } = gameState.currentPuzzle;
  const isOption1Correct =
    gameState.feedback?.isCorrect !== null &&
    options[0] === correctAnswer;
  const isOption2Correct =
    gameState.feedback?.isCorrect !== null &&
    options[1] === correctAnswer;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        <ScoreDisplay score={gameState.score} puzzleCount={gameState.puzzleCount} />

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-600 mb-2">Which word is most similar to:</div>
            <div className="text-4xl font-bold text-gray-900">{starter}</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <WordChoice
              word={options[0]}
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
              word={options[1]}
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

          {gameState.gameOver && (
            <div className="mt-6 text-center">
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300">
                <div className="text-3xl font-bold text-gray-800 mb-2">Game Over!</div>
                <div className="text-xl text-gray-700 mb-1">Final Score: {gameState.score}</div>
                <div className="text-sm text-gray-600">
                  You answered {gameState.score} puzzle{gameState.score !== 1 ? 's' : ''} correctly
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handlePlayAgain}
                  className="bg-purple-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Save Score
                </button>
              </div>
            </div>
          )}

          {gameState.feedback !== null && !gameState.gameOver && (
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

      {showSaveModal && (
        <HighScoreSaveModal
          finalScore={gameState.score}
          onSaveComplete={handlePlayAgain}
        />
      )}
    </div>
  );
}
