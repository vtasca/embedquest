import Link from 'next/link';
import GameBoard from '@/components/GameBoard';

export default function GamePage() {
  return (
    <div className="relative min-h-screen">
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
      >
        ← Home
      </Link>
      <GameBoard />
    </div>
  );
}
