#!/usr/bin/env node

/**
 * Generate word embeddings using @xenova/transformers and store in SQLite
 * This script reads words from the word list and generates embeddings using the all-MiniLM-L6-v2 model
 */

const fs = require('fs').promises;
const path = require('path');
const Database = require('better-sqlite3');

// Dynamic import for ES modules
async function generateEmbeddings() {
  let db;
  
  try {
    console.log('Loading @xenova/transformers...');
    const { pipeline } = await import('@xenova/transformers');

    // Initialize the feature extraction pipeline with the all-MiniLM-L6-v2 model
    console.log('Loading all-MiniLM-L6-v2 model (this may take a moment on first run)...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Model loaded successfully!\n');

    // Read words from the text file
    const wordsPath = path.join(__dirname, '../data/google-10000-english-usa-no-swears-medium.txt');
    const wordsText = await fs.readFile(wordsPath, 'utf-8');
    const words = wordsText
      .trim()
      .split('\n')
      .filter(word => word.trim().length > 0);

    console.log(`Found ${words.length} words to process\n`);

    // Create SQLite database
    const dbPath = path.join(__dirname, '../data/embeddings.db');
    
    // Remove existing database if it exists
    try {
      await fs.unlink(dbPath);
      console.log('Removed existing database\n');
    } catch (err) {
      // File doesn't exist, that's fine
    }

    db = new Database(dbPath);
    console.log('Created new SQLite database\n');

    // Create schema
    db.exec(`
      CREATE TABLE models (
        model_id TEXT PRIMARY KEY,
        model_name TEXT NOT NULL,
        dimensions INTEGER NOT NULL,
        description TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE embeddings (
        word TEXT NOT NULL,
        model_id TEXT NOT NULL,
        embedding BLOB NOT NULL,
        PRIMARY KEY (word, model_id),
        FOREIGN KEY (model_id) REFERENCES models(model_id)
      );

      CREATE INDEX idx_embeddings_model ON embeddings(model_id);
      CREATE INDEX idx_embeddings_word ON embeddings(word);
    `);
    console.log('Created database schema\n');

    // Process words in batches for efficiency
    const BATCH_SIZE = 32;
    const results = [];
    const totalBatches = Math.ceil(words.length / BATCH_SIZE);

    for (let i = 0; i < words.length; i += BATCH_SIZE) {
      const batch = words.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      
      console.log(`Processing batch ${batchNum}/${totalBatches} (words ${i + 1}-${Math.min(i + BATCH_SIZE, words.length)})...`);

      // Generate embeddings for the batch
      const embeddings = await extractor(batch, { pooling: 'mean', normalize: true });

      // Convert tensors to arrays and store results
      for (let j = 0; j < batch.length; j++) {
        const embedding = Array.from(embeddings[j].data);
        results.push({
          name: batch[j],
          embedding: embedding
        });
      }
    }

    console.log(`\nSuccessfully generated embeddings for ${results.length} words`);
    const dimensions = results[0].embedding.length;
    console.log(`Embedding dimensions: ${dimensions}\n`);

    // Insert model metadata
    const modelId = 'all-MiniLM-L6-v2';
    const insertModel = db.prepare(`
      INSERT INTO models (model_id, model_name, dimensions, description)
      VALUES (?, ?, ?, ?)
    `);
    
    insertModel.run(
      modelId,
      'all-MiniLM-L6-v2',
      dimensions,
      'Sentence-transformers model for semantic similarity'
    );
    console.log('Inserted model metadata\n');

    // Insert embeddings in batches
    console.log('Inserting embeddings into database...');
    const insertEmbedding = db.prepare(`
      INSERT INTO embeddings (word, model_id, embedding)
      VALUES (?, ?, ?)
    `);

    const insertMany = db.transaction((words) => {
      for (const word of words) {
        // Convert embedding array to Float32Array, then to Buffer
        const embeddingArray = new Float32Array(word.embedding);
        const embeddingBuffer = Buffer.from(embeddingArray.buffer);
        insertEmbedding.run(word.name, modelId, embeddingBuffer);
      }
    });

    insertMany(results);
    console.log(`Inserted ${results.length} embeddings\n`);

    // Get database size
    const stats = await fs.stat(dbPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Database size: ${sizeMB} MB`);
    console.log(`Database saved to ${dbPath}`);
    console.log('✓ Done!');

  } catch (error) {
    console.error('Error generating embeddings:', error);
    process.exit(1);
  } finally {
    if (db) {
      db.close();
    }
  }
}

// Run the script
generateEmbeddings();
