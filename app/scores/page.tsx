import Link from 'next/link';
import HighScoresDisplay from '@/components/HighScoresDisplay';

export const metadata = {
  title: 'High Scores - EmbedQuest',
  description: 'View your high scores and compete with yourself',
};

export default function ScoresPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">High Scores</h1>
          <p className="text-gray-600">Your device-local score history</p>
        </div>

        <HighScoresDisplay />
      </div>
    </div>
  );
}
