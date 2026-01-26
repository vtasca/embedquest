'use client';

import { useState, useEffect } from 'react';
import { getHighScores, clearHighScores, formatDate, type HighScore } from '@/lib/high-scores';

export default function HighScoresDisplay() {
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const scores = getHighScores();
    setHighScores(scores);
    setIsLoading(false);
  }, []);

  const handleClearScores = () => {
    try {
      clearHighScores();
      setHighScores([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Failed to clear scores:', err);
      alert('Failed to clear scores. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading high scores...</div>
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
                    key={index}
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
                        {score.name || '(Anonymous)'}
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

          <div className="p-4 bg-gray-50 border-t">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              Clear All Scores
            </button>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full">
            <div className="text-xl font-bold text-gray-800 mb-4">Clear All Scores?</div>
            <div className="text-gray-600 mb-6">
              This action cannot be undone. All your saved high scores will be permanently deleted.
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClearScores}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
