// Type definitions for EmbedQuest

export interface Word {
  name: string;
  embedding: number[];
}

export interface Puzzle {
  starter: Word;
  options: [Word, Word];
  correctAnswer: Word;
  similarityScores: {
    option1: number;
    option2: number;
  };
}

export interface GameState {
  score: number;
  currentPuzzle: Puzzle | null;
  feedback: {
    isCorrect: boolean | null;
    message: string;
    similarityScore: number | null;
  } | null;
  puzzleCount: number;
}
