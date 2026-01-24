# EmbedQuest

A word similarity game built with Next.js, TypeScript, and Tailwind CSS. Test your understanding of word embeddings by finding the most semantically similar words.

## Features

- 🎮 Interactive word similarity game
- 📊 Real-time score tracking
- 🎯 Instant feedback with similarity scores
- 📱 Responsive mobile-first design
- 🎨 Clean, minimal UI with Tailwind CSS
- 🚀 Efficient API-based architecture with SQLite storage
- ⚡ Fast loading - no large downloads for players

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate embeddings database (required before running the app):
```bash
npm run generate-embeddings
```

This will create `data/embeddings.db` containing word embeddings. See the [Generating Embeddings](#generating-embeddings) section for details.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Architecture

EmbedQuest uses a modern API-based architecture to efficiently serve word similarity puzzles:

- **Client**: React components fetch puzzles from API (< 1KB per request)
- **API**: Next.js API routes generate puzzles server-side
- **Database**: SQLite stores 5,459 word embeddings (~8.4MB)
- **Embeddings**: 384-dimensional vectors from all-MiniLM-L6-v2 model

This architecture reduces client download from 60MB (JSON) to ~500 bytes per puzzle!

## Project Structure

```
embedquest/
├── app/              # Next.js App Router pages
│   ├── api/
│   │   └── puzzle/   # Puzzle generation API endpoint
│   ├── page.tsx      # Homepage
│   ├── game/         # Game page
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── GameBoard.tsx
│   ├── WordChoice.tsx
│   ├── ScoreDisplay.tsx
│   └── FeedbackDisplay.tsx
├── lib/              # Utility functions
│   ├── embeddings-db.ts # SQLite database utilities
│   ├── similarity.ts    # Cosine similarity calculations
│   └── puzzle.ts        # Puzzle generation (server-side)
├── scripts/
│   └── generate-embeddings.js # Embedding generation script
├── types/            # TypeScript type definitions
│   └── index.ts
└── data/             # Data files
    ├── embeddings.db # SQLite database with embeddings
    └── google-10000-english-usa-no-swears-medium.txt
```

## Generating Embeddings

This project includes a script to generate word embeddings using the [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) model via `@xenova/transformers` and store them in a SQLite database.

### Generate embeddings database:

```bash
npm run generate-embeddings
```

This will:
- Read all words from `data/google-10000-english-usa-no-swears-medium.txt`
- Generate 384-dimensional embeddings using all-MiniLM-L6-v2
- Store embeddings as BLOBs in `data/embeddings.db` (SQLite)
- Take approximately 2-5 minutes to process ~5,460 words

**Note:** The model will be downloaded automatically on first run (~90MB).

### Database Schema

The SQLite database uses the following schema:

```sql
-- Model metadata
CREATE TABLE models (
  model_id TEXT PRIMARY KEY,
  model_name TEXT NOT NULL,
  dimensions INTEGER NOT NULL,
  description TEXT,
  created_at INTEGER
);

-- Word embeddings (stored as BLOBs)
CREATE TABLE embeddings (
  word TEXT NOT NULL,
  model_id TEXT NOT NULL,
  embedding BLOB NOT NULL,
  PRIMARY KEY (word, model_id),
  FOREIGN KEY (model_id) REFERENCES models(model_id)
);
```

### Storage Format

- Embeddings are stored as `Float32Array` serialized to BLOBs
- 384 floats × 4 bytes = 1,536 bytes per embedding
- Total database size: ~8.4MB (vs 60MB JSON)
- Database is accessed server-side only, never sent to client

## How It Works

1. **Client Request**: Player loads game, client fetches puzzle from `/api/puzzle`
2. **Database Query**: API retrieves 30 random words with embeddings from SQLite
3. **Puzzle Generation**: Server runs puzzle generation algorithm to select starter word and two options
4. **Response**: API sends puzzle data (word names + similarity scores) to client (~500 bytes)
5. **Similarity Calculation**: Uses cosine similarity to compare embedding vectors (server-side)
6. **Scoring**: Players earn points for correct answers, game continues until wrong answer
7. **Feedback**: Shows similarity scores and correct/incorrect feedback after each choice

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React** - UI library
- **better-sqlite3** - Fast, synchronous SQLite library
- **@xenova/transformers** - Run ML models in Node.js (for embedding generation)

## API Endpoints

### GET `/api/puzzle`

Generate a new puzzle with random words.

**Response:**
```json
{
  "starter": "happy",
  "options": ["joyful", "sad"],
  "correctAnswer": "joyful",
  "similarityScores": {
    "option1": 0.85,
    "option2": 0.42
  }
}
```

## Performance

- **Client Download**: 60MB → ~500 bytes per puzzle (99.999% reduction!)
- **Server Query**: < 10ms to fetch random words from SQLite
- **Puzzle Generation**: < 1ms server-side processing
- **Total Response Time**: Typically 10-20ms

## License

MIT
