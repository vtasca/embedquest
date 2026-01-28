// High score management utilities using Supabase database

import { supabase } from './supabase';

export interface HighScore {
  id?: number;
  player_id: string;
  name: string;
  score: number;
  created_at: string; // ISO string (timestamptz from database)
  date: string; // Alias for created_at for backward compatibility
}

/**
 * Get all saved high scores from Supabase, sorted by score (descending)
 */
export async function getHighScores(): Promise<HighScore[]> {
  try {
    const { data, error } = await supabase
      .from('games')
      .select('id, player_id, name, score, created_at')
      .order('score', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch high scores:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Map database records to HighScore interface, adding date alias
    return data.map((record) => ({
      id: record.id,
      player_id: record.player_id,
      name: record.name,
      score: record.score,
      created_at: record.created_at,
      date: record.created_at, // Alias for backward compatibility
    }));
  } catch (err) {
    console.error('Failed to fetch high scores:', err);
    throw err;
  }
}

/**
 * Save a new high score to Supabase
 * Name is required
 */
export async function saveHighScore(score: number, name: string): Promise<HighScore> {
  if (!name || !name.trim()) {
    throw new Error('Player name is required to save a high score');
  }

  // Generate UUID for player_id
  const playerId = crypto.randomUUID();

  try {
    const { data, error } = await supabase
      .from('games')
      .insert({
        player_id: playerId,
        name: name.trim(),
        score: score,
      })
      .select('id, player_id, name, score, created_at')
      .single();

    if (error) {
      console.error('Failed to save high score:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from database');
    }

    // Return HighScore with date alias
    return {
      id: data.id,
      player_id: data.player_id,
      name: data.name,
      score: data.score,
      created_at: data.created_at,
      date: data.created_at, // Alias for backward compatibility
    };
  } catch (err) {
    console.error('Failed to save high score:', err);
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
