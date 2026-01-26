// High score management utilities using browser localStorage

export interface HighScore {
  name: string;
  score: number;
  date: string; // ISO string
}

const HIGH_SCORES_KEY = 'embedquest_high_scores';

/**
 * Get all saved high scores from localStorage, sorted by score (descending)
 */
export function getHighScores(): HighScore[] {
  if (typeof window === 'undefined') {
    // Server-side execution (Next.js SSR)
    return [];
  }

  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    if (!stored) {
      return [];
    }

    const scores: HighScore[] = JSON.parse(stored);
    // Sort by score descending, then by date descending (newest first)
    return scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (err) {
    console.error('Failed to parse high scores:', err);
    return [];
  }
}

/**
 * Save a new high score to localStorage
 * Name is required
 */
export function saveHighScore(score: number, name: string): HighScore {
  if (typeof window === 'undefined') {
    throw new Error('Cannot save high score outside of browser environment');
  }

  if (!name || !name.trim()) {
    throw new Error('Player name is required to save a high score');
  }

  const newScore: HighScore = {
    name: name.trim(),
    score,
    date: new Date().toISOString(),
  };

  try {
    const existing = getHighScores();
    const updated = [newScore, ...existing];
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(updated));
    return newScore;
  } catch (err) {
    console.error('Failed to save high score:', err);
    throw err;
  }
}

/**
 * Clear all saved high scores from localStorage
 */
export function clearHighScores(): void {
  if (typeof window === 'undefined') {
    throw new Error('Cannot clear high scores outside of browser environment');
  }

  try {
    localStorage.removeItem(HIGH_SCORES_KEY);
  } catch (err) {
    console.error('Failed to clear high scores:', err);
    throw err;
  }
}

/**
 * Format a date for display (e.g., "Jan 26, 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (err) {
    return dateString;
  }
}
