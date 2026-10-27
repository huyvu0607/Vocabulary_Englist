import { useMutation } from '@tanstack/react-query';
import { useToggleLearned } from '../hooks/useToggleLearned.js';

function WordCard({ wordItem, onToggle }) {
  const word = wordItem.words;
  const isLearned = word.user_vocabularies?.[0]?.is_learned ?? false;
  const { isPending: isSaving } = useToggleLearned(); // This is just for local state if needed, but we use mutation from parent

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-lg border transition-all ${
      isLearned ? 'bg-gray-50 border-gray-200 opacity-70 dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{word.word}</span>
            {word.part_of_speech && (
              <span className="text-xs italic text-gray-500">{word.part_of_speech}</span>
            )}
          </div>
          {word.phonetic && <span className="text-sm text-gray-400">{word.phonetic}</span>}
        </div>
        <button
          onClick={() => onToggle(word.id, !isLearned)}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            isLearned 
              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {isLearned ? '✓ Đã thuộc' : 'Chưa thuộc'}
        </button>
      </div>

      <div className="space-y-2">
        {word.meaning_vi && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {word.meaning_vi}
          </p>
        )}
        {(word.example_en || word.example_vi) && (
          <div className="rounded-md bg-gray-50 p-2 text-sm dark:bg-gray-800">
            {word.example_en && (
              <p className="text-gray-600 dark:text-gray-300">{word.example_en}</p>
            )}
            {word.example_vi && (
              <p className="text-xs italic text-gray-400">{word.example_vi}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WordCard;
