import { NextResponse } from 'next/server';
import { getRandomWords } from '@/lib/embeddings-db';
import { generatePuzzle } from '@/lib/puzzle';
import type { PuzzleResponse } from '@/types';

/**
 * GET /api/puzzle
 * Generate a new puzzle by querying random words from SQLite and returning
 * only the word names and similarity scores (no embeddings)
 */
export async function GET() {
  try {
    // Query 30 random words with embeddings from the database
    // This is enough for the puzzle generation algorithm to work with
    const words = getRandomWords(30);

    if (words.length < 3) {
      return NextResponse.json(
        { error: 'Not enough words in database to generate puzzle' },
        { status: 500 }
      );
    }

    // Generate puzzle using server-side logic
    const puzzle = generatePuzzle(words);

    // Convert to client-side format (remove embeddings)
    const response: PuzzleResponse = {
      starter: puzzle.starter.name,
      options: [puzzle.options[0].name, puzzle.options[1].name],
      correctAnswer: puzzle.correctAnswer.name,
      similarityScores: puzzle.similarityScores,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating puzzle:', error);
    
    // Check if it's a database error
    if (error instanceof Error && error.message.includes('SQLITE')) {
      return NextResponse.json(
        { error: 'Database error - please ensure embeddings.db exists. Run: npm run generate-embeddings' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate puzzle' },
      { status: 500 }
    );
  }
}
