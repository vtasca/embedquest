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
  const [showNameInput, setShowNameInput] = useState(false);

  const handleSaveWithName = async () => {
    try {
      setIsSaving(true);
      saveHighScore(finalScore, playerName || undefined);
      onSaveComplete();
    } catch (err) {
      console.error('Failed to save high score:', err);
      alert('Failed to save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAnonymous = async () => {
    try {
      setIsSaving(true);
      saveHighScore(finalScore);
      onSaveComplete();
    } catch (err) {
      console.error('Failed to save high score:', err);
      alert('Failed to save score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!showNameInput) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-800 mb-2">Game Over!</div>
            <div className="text-3xl text-purple-600 font-bold mb-4">{finalScore}</div>
            <div className="text-gray-600">
              You answered {finalScore} puzzle{finalScore !== 1 ? 's' : ''} correctly
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            <button
              onClick={() => setShowNameInput(true)}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50"
            >
              Save Score with Name
            </button>
            <button
              onClick={handleSaveAnonymous}
              disabled={isSaving}
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Save Anonymously
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</div>
          <div className="text-gray-600 mb-4">Score: {finalScore}</div>
          <div className="text-lg font-semibold text-gray-800 mb-4">
            Enter your name to save your score
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={50}
            disabled={isSaving}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors disabled:bg-gray-100"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveWithName();
              }
            }}
            autoFocus
          />

          <div className="flex gap-3">
            <button
              onClick={handleSaveWithName}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setShowNameInput(false)}
              disabled={isSaving}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
