import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech.js';

function WordCard({ wordItem, onToggle }) {
  const word = wordItem.words;
  const isLearned = word.user_vocabularies?.[0]?.is_learned ?? false;
  const { supported, speak, speakingText } = useSpeech();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readingExample, setReadingExample] = useState(false);

  const toggleLearn = () => {
    onToggle(word.id, !isLearned);
  };

  const readWord = () => {
    if (!supported) return;
    setIsSpeaking(true);
    speak(word.word).finally(() => setIsSpeaking(false));
  };

  const readExample = () => {
    if (!supported) return;
    setReadingExample(true);
    const example = word.example_en || word.example_vi || '';
    if (example) {
      speak(example).finally(() => setReadingExample(false));
    } else {
      setReadingExample(false);
    }
  };

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-lg border transition-all ${
      isLearned ? 'bg-gray-50 border-gray-200 opacity-70 dark:bg-gray-800 dark:border-gray-700' : 'bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{word.word}</span>
            {word.part_of_speech && (
              <span className="text-xs italic text-gray-500 dark:text-gray-400">
                {word.part_of_speech}
              </span>
            )}
          </div>
          {word.phonetic && (
            <span className="text-sm text-gray-400 dark:text-gray-300">
              {word.phonetic}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={readWord}
            className={`rounded-full p-2 transition-colors ${
              isSpeaking ? 'bg-primary text-white' : 'hover:bg-primary/10 text-primary'
            }`}
            aria-label={speakingText ? 'Ngừng đọc' : `Nghe phát âm từ ${word.word}`}
            disabled={!supported}
          >
            {isSpeaking ? '⏸' : '🔊'}
          </button>
          <button
            onClick={readExample}
            className={`rounded-full p-1.5 transition-colors hover:bg-primary/10 text-primary`
            }
            aria-label="Nghe phát âm câu ví dụ"
            disabled={!supported}
          >
            {readingExample ? '⏸' : '🔊'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {word.meaning_vi && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {word.meaning_vi}
          </p>
        )}
        {(word.example_en || word.example_vi) && (
          <div className="rounded-md p-2 text-xs text-gray-600 dark:text-gray-300">
            {word.example_en && (
              <p>{word.example_en}</p>
            )}
            {word.example_vi && (
              <p className="mt-1 text-xs italic text-gray-400">{word.example_vi}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WordCard;