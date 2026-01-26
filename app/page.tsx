import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            EmbedQuest
          </h1>
          <p className="text-xl text-gray-600">
            Test your understanding of word similarity
          </p>
        </div>

        <div className="mb-8 space-y-4 text-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Play</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <p>
                You&apos;ll be shown a <strong>starter word</strong> and two word options.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <p>
                Choose which word is <strong>most similar</strong> to the starter word based on their semantic meaning.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <p>
                Get instant feedback with similarity scores and see how well you understand word relationships!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link
            href="/game"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Game
          </Link>
          <div>
            <Link
              href="/scores"
              className="inline-block text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              View High Scores
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Words are compared using cosine similarity of their embedding vectors.
            Higher similarity scores indicate words that are more semantically related.
          </p>
        </div>
      </div>
    </div>
  );
}
