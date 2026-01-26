import Database from 'better-sqlite3';
import path from 'path';
import type { Word } from '@/types';

let db: Database.Database | null = null;

/**
 * Get or create database connection
 */
function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'embeddings.db');
    db = new Database(dbPath, { readonly: true });
  }
  return db;
}

/**
 * Deserialize embedding from BLOB to number array
 */
export function deserializeEmbedding(blob: Buffer): number[] {
  const float32Array = new Float32Array(
    blob.buffer,
    blob.byteOffset,
    blob.byteLength / 4
  );
  return Array.from(float32Array);
}

/**
 * Get random words with their embeddings from the database
 * @param count Number of words to retrieve
 * @param modelId Model ID to use (defaults to 'all-MiniLM-L6-v2')
 * @returns Array of words with embeddings
 */
export function getRandomWords(count: number, modelId: string = 'all-MiniLM-L6-v2'): Word[] {
  const database = getDb();

  // Random seed
  database.exec(`SELECT randomblob(16);`);
  
  const stmt = database.prepare(`
    SELECT word, embedding
    FROM embeddings
    WHERE model_id = ?
    ORDER BY RANDOM()
    LIMIT ?
  `);
  
  const rows = stmt.all(modelId, count) as Array<{ word: string; embedding: Buffer }>;
  
  return rows.map(row => ({
    name: row.word,
    embedding: deserializeEmbedding(row.embedding)
  }));
}

/**
 * Get all words from the database (use sparingly)
 * @param modelId Model ID to use (defaults to 'all-MiniLM-L6-v2')
 * @returns Array of words with embeddings
 */
export function getAllWords(modelId: string = 'all-MiniLM-L6-v2'): Word[] {
  const database = getDb();
  
  const stmt = database.prepare(`
    SELECT word, embedding
    FROM embeddings
    WHERE model_id = ?
  `);
  
  const rows = stmt.all(modelId) as Array<{ word: string; embedding: Buffer }>;
  
  return rows.map(row => ({
    name: row.word,
    embedding: deserializeEmbedding(row.embedding)
  }));
}

/**
 * Get word count in the database
 * @param modelId Model ID to use (defaults to 'all-MiniLM-L6-v2')
 * @returns Number of words in the database
 */
export function getWordCount(modelId: string = 'all-MiniLM-L6-v2'): number {
  const database = getDb();
  
  const stmt = database.prepare(`
    SELECT COUNT(*) as count
    FROM embeddings
    WHERE model_id = ?
  `);
  
  const result = stmt.get(modelId) as { count: number };
  return result.count;
}

/**
 * Close the database connection (call on app shutdown)
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
