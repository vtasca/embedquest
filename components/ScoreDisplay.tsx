'use client';

interface ScoreDisplayProps {
  score: number;
  puzzleCount: number;
}

export default function ScoreDisplay({ score, puzzleCount }: ScoreDisplayProps) {
  return (
    <div className="flex justify-between items-center w-full max-w-2xl mb-8 px-4">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Score</div>
        <div className="text-3xl font-bold text-blue-600">{score}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Puzzles</div>
        <div className="text-3xl font-bold text-gray-800">{puzzleCount}</div>
      </div>
    </div>
  );
}
