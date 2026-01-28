'use client';

import { useState } from 'react';
import { saveHighScore } from '@/lib/high-scores';

interface HighScoreSaveModalProps {
  finalScore: number;
  onSaveComplete: () => void;
}

export default function HighScoreSaveModal({
  finalScore,
  onSaveComplete,
}: HighScoreSaveModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      setError(null);
      setIsSaving(true);
      await saveHighScore(finalScore, playerName.trim());
      onSaveComplete();
    } catch (err) {
      console.error('Failed to save high score:', err);
      setError('Failed to save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-2">Game Over!</div>
          <div className="text-3xl text-purple-600 font-bold mb-4">{finalScore}</div>
          <div className="text-gray-600 mb-4">
            You answered {finalScore} puzzle{finalScore !== 1 ? 's' : ''} correctly
          </div>
          <div className="text-lg font-semibold text-gray-800">
            Enter your name to save your score
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError(null);
            }}
            placeholder="Your name"
            maxLength={50}
            disabled={isSaving}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors disabled:bg-gray-100 ${
              error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-purple-500'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
            autoFocus
          />

          {error && (
            <div className="text-sm text-red-600 text-center">{error}</div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
