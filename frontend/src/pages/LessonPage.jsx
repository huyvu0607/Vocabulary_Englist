import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLessonWords } from '../hooks/useLessonWords.js';
import { useToggleLearned } from '../hooks/useToggleLearned.js';
import WordCard from '../components/WordCard.jsx';

function LessonPage() {
  const { lessonId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all';
  const { data: words, isLoading, isError, refetch } = useLessonWords(lessonId);
  const { mutate: toggleLearned } = useToggleLearned();
  const [searchValue, setSearchValue] = useState(q);
  const [filterValue, setFilterValue] = useState(filter);

  useEffect(() => {
    setSearchParams((params) => {
      params.set('q', searchValue);
      params.set('filter', filterValue);
      return params;
    }, { replace: true });
  }, [filterValue, searchValue, setSearchParams]);

  let displayWords = words ?? [];
  if (searchValue) {
    const normalized = searchValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    displayWords = displayWords.filter((item) => {
      const word = (item.words.word || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const meaning = (item.words.meaning_vi || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return word.includes(normalized) || meaning.includes(normalized);
    });
  }

  const learnFilter = filterValue === 'learned'
    ? (item) => item.words.user_vocabularies?.[0]?.is_learned
    : filterValue === 'unlearned'
      ? (item) => !item.words.user_vocabularies?.[0]?.is_learned
      : () => true;
  const displayWordsFinal = displayWords.filter(learnFilter);
  const totalCount = displayWordsFinal.length;
  const learnedCount = displayWordsFinal.filter(
    (item) => item.words.user_vocabularies?.[0]?.is_learned,
  ).length;

  function handleToggle(wordId, isLearned) {
    toggleLearned(
      { wordId, isLearned },
      { onError: () => alert('Lỗi lưu trạng thái') },
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="sr-only">Từ vựng</h2>
        <span className="text-sm font-medium text-muted">
          Đã thuộc {learnedCount}/{totalCount} từ
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-line bg-surface p-3 shadow-sm">
        <div className="flex gap-2">
          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm từ hoặc nghĩa…"
            className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-main outline-none focus:border-primary"
          />
          {searchValue && (
            <button type="button" onClick={() => setSearchValue('')} className="min-h-11 rounded-lg px-3 text-sm text-muted hover:bg-primary/10">
              Xóa
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[['all', 'Tất cả'], ['unlearned', 'Chưa thuộc'], ['learned', 'Đã thuộc']].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterValue(value)}
              className={`min-h-11 rounded-full px-3 py-1 text-xs font-medium ${
                filterValue === value ? 'bg-primary text-white' : 'border border-line bg-surface text-muted hover:bg-primary/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-line bg-surface p-4 text-center text-sm text-muted">
          Không tải được danh sách từ vựng.
          <button type="button" onClick={() => refetch()} className="ml-2 font-semibold text-primary underline">
            Thử lại
          </button>
        </div>
      ) : isLoading ? (
        <div className="py-10 text-center text-sm text-muted">Đang tải từ vựng…</div>
      ) : (
        <div className="grid gap-4">
          {displayWordsFinal.map((item) => (
            <WordCard key={item.words.id} wordItem={item} onToggle={handleToggle} />
          ))}
          {totalCount === 0 && (
            <p className="py-8 text-center text-sm text-muted">Lesson này chưa có từ</p>
          )}
        </div>
      )}
    </section>
  );
}

export default LessonPage;
