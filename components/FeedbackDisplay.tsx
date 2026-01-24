'use client';

interface FeedbackDisplayProps {
  feedback: {
    isCorrect: boolean | null;
    message: string;
    similarityScore: number | null;
  } | null;
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  if (!feedback || feedback.isCorrect === null) {
    return null;
  }

  return (
    <div
      className={`
        mt-6 p-6 rounded-lg text-center
        transition-all duration-300
        ${
          feedback.isCorrect
            ? 'bg-green-100 text-green-800 border-2 border-green-300'
            : 'bg-red-100 text-red-800 border-2 border-red-300'
        }
      `}
    >
      <div className="text-2xl font-bold mb-2">
        {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      <div className="text-lg mb-2">{feedback.message}</div>
      {feedback.similarityScore !== null && (
        <div className="text-sm opacity-75">
          Similarity: {(feedback.similarityScore * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
