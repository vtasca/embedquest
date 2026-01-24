'use client';

interface WordChoiceProps {
  word: string;
  onClick: () => void;
  disabled?: boolean;
  isCorrect?: boolean | null;
  similarityScore?: number | null;
}

export default function WordChoice({
  word,
  onClick,
  disabled = false,
  isCorrect = null,
  similarityScore = null,
}: WordChoiceProps) {
  const getButtonStyles = () => {
    if (disabled && isCorrect === null) {
      return 'bg-gray-200 text-gray-500 cursor-not-allowed';
    }
    if (isCorrect === true) {
      return 'bg-green-500 text-white hover:bg-green-600';
    }
    if (isCorrect === false) {
      return 'bg-red-500 text-white hover:bg-red-600';
    }
    return 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getButtonStyles()}
        px-8 py-6 rounded-lg text-2xl font-semibold
        transition-all duration-200 transform
        disabled:transform-none
        active:scale-95
        shadow-lg hover:shadow-xl
        min-w-[200px]
      `}
    >
      <div className="flex flex-col items-center gap-2">
        <span>{word}</span>
        {similarityScore !== null && (
          <span className="text-sm opacity-90">
            {(similarityScore * 100).toFixed(1)}% similar
          </span>
        )}
      </div>
    </button>
  );
}
