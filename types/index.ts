// Type definitions for EmbedQuest

// Server-side Word type with embeddings
export interface Word {
  name: string;
  embedding: number[];
}

// Server-side Puzzle type (used internally)
export interface Puzzle {
  starter: Word;
  options: [Word, Word];
  correctAnswer: Word;
  similarityScores: {
    option1: number;
    option2: number;
  };
}

// Client-side Puzzle response (without embeddings)
export interface PuzzleResponse {
  starter: string;
  options: [string, string];
  correctAnswer: string;
  similarityScores: {
    option1: number;
    option2: number;
  };
}

// Client-side Puzzle type for game state
export interface ClientPuzzle {
  starter: string;
  options: [string, string];
  correctAnswer: string;
  similarityScores: {
    option1: number;
    option2: number;
  };
}

export interface GameState {
  score: number;
  currentPuzzle: ClientPuzzle | null;
  feedback: {
    isCorrect: boolean | null;
    message: string;
    similarityScore: number | null;
  } | null;
  puzzleCount: number;
  gameOver: boolean;
}
