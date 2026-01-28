'use client';

import { useState, useEffect } from 'react';
import { getHighScores, formatDate, type HighScore } from '@/lib/high-scores';

export default function HighScoresDisplay() {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScores = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const scores = await getHighScores();
        setHighScores(scores);
      } catch (err) {
        console.error('Failed to load high scores:', err);
        setError('Failed to load high scores. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading high scores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      {highScores.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-gray-600 mb-4">
            No high scores yet. Start playing to record your first score!
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="px-4 py-3 text-left font-semibold">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold">Player</th>
                  <th className="px-4 py-3 text-right font-semibold">Score</th>
                  <th className="px-4 py-3 text-right font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {highScores.map((score, index) => (
                  <tr
                    key={score.id || index}
                    className={`border-b transition-colors ${
                      index < 3
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50'
                        : index % 2 === 0
                          ? 'bg-white hover:bg-gray-50'
                          : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-lg">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index >= 3 && <span className="text-gray-600">#{index + 1}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">
                        {score.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-bold text-purple-600 text-lg">{score.score}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm text-gray-600">{formatDate(score.date)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
