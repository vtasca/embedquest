#!/usr/bin/env node

/**
 * Generate word embeddings using @xenova/transformers
 * This script reads words from the word list and generates embeddings using the all-MiniLM-L6-v2 model
 */

const fs = require('fs').promises;
const path = require('path');

// Dynamic import for ES modules
async function generateEmbeddings() {
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
    console.log(`Embedding dimensions: ${results[0].embedding.length}`);

    // Save to embeddings.json
    const outputPath = path.join(__dirname, '../data/embeddings.json');
    const output = {
      words: results
    };

    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`\nEmbeddings saved to ${outputPath}`);
    console.log('✓ Done!');

  } catch (error) {
    console.error('Error generating embeddings:', error);
    process.exit(1);
  }
}

// Run the script
generateEmbeddings();
