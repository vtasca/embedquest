# EmbedQuest

A word similarity game built with Next.js, TypeScript, and Tailwind CSS. Test your understanding of word embeddings by finding the most semantically similar words.

## Features

- 🎮 Interactive word similarity game
- 📊 Real-time score tracking
- 🎯 Instant feedback with similarity scores
- 📱 Responsive mobile-first design
- 🎨 Clean, minimal UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
embedquest/
├── app/              # Next.js App Router pages
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
│   ├── similarity.ts # Cosine similarity calculations
│   ├── puzzle.ts     # Puzzle generation
│   └── words.ts      # Word loading utilities
├── types/            # TypeScript type definitions
│   └── index.ts
└── data/             # Data files
    └── embeddings.json # Word embeddings (mock data)
```

## Generating Embeddings

This project includes a script to generate word embeddings using the [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) model via `@xenova/transformers`.

### Generate embeddings from the word list:

```bash
npm run generate-embeddings
```

This will:
- Read all words from `data/google-10000-english-usa-no-swears-medium.txt`
- Generate 384-dimensional embeddings using all-MiniLM-L6-v2
- Save the results to `data/embeddings.json`
- Take approximately 2-5 minutes to process ~5,460 words

**Note:** The model will be downloaded automatically on first run (~90MB).

### Embedding Format

Each word in `data/embeddings.json` has:
- `name`: string (the word)
- `embedding`: number[] (384-dimensional vector)

The game automatically uses the embeddings from this file.

## How It Works

1. **Puzzle Generation**: The game randomly selects a starter word and finds two options with different similarity levels
2. **Similarity Calculation**: Uses cosine similarity to compare embedding vectors
3. **Scoring**: Players earn points for correct answers
4. **Feedback**: Shows similarity scores and correct/incorrect feedback after each choice

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React** - UI library

## License

MIT
