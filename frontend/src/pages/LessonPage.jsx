import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthProvider.jsx';
import { useLessonWords } from '../hooks/useLessonWords.js';
import { useLessonBreadcrumbs } from '../hooks/useLessonBreadcrumbs.js';
import { useToggleLearned } from '../hooks/useToggleLearned.js';
import { useSpeech } from '../hooks/useSpeech.js';
import QueryState from '../components/QueryState.jsx';
import WordCard from '../components/WordCard.jsx';

function LessonPage() {
  const lessonId = useParams().lessonId;
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all';

  const { data: words, isLoading, isError, refetch } = useLessonWords(lessonId);
  const { data: breadcrumb, isLoading: breadLoading } = useLessonBreadcrumbs(lessonId);
  const { mutate: toggleLearned, isPending } = useToggleLearned();
  const { supported, speak, speakingText } = useSpeech();

  const [searchValue, setSearchValue] = useState(q);
  const [filterValue, setFilterValue] = useState(filter);

  useEffect(() => {
    setSearchParams((ps) => {
      ps.set('q', searchValue);
      ps.set('filter', filterValue);
      return ps;
    }, false);
  }, [searchValue, filterValue]);

  // Filter client-side
  let displayWords = words ?? [];
  if (searchValue) {
    const normalized = searchValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    displayWords = (words ?? []).filter((item) => {
      const w = (item.words.word || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const m = (item.words.meaning_vi || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return w.includes(normalized) || m.includes(normalized);
    });
  }

  const learnFilter = filterValue === 'learned'
    ? (item) => item.words.user_vocabularies?.[0]?.is_learned
    : filterValue === 'unlearned'
      ? (item) => !item.words.user_vocabularies?.[0]?.is_learned
      : () => true;

  const displayWordsFinal = displayWords.filter(learnFilter);
  const totalCount = displayWordsFinal.length;
  const learnedCount = displayWordsFinal.filter((item) => item.words.user_vocabularies?.[0]?.is_learned).length;

  if (breadLoading) {
    return <div className="flex min-h-[240px] items-center justify-center text-sm text-gray-500">Đang tải…</div>;
  }
  if (!breadcrumb) {
    return <div className="px-4 py-8 text-center text-sm text-gray-500">Bài học không tồn tại.</div>;
  }

  function handleToggle(wordId, isLearned) {
    toggleLearned({ wordId, isLearned }, { onError: () => alert('Lỗi lưu trạng thái') });
  }

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
      <Link
        to={`/courses/${breadcrumb.units.courses.id}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        ← Quay lại khóa học
      </Link>

      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link
          to={`/courses/${breadcrumb.units.courses.id}`}
          className="hover:text-primary hover:underline"
        >
          {breadcrumb.units.courses.title}
        </Link>
        <span>›</span>
        <Link
          to={`/courses/${breadcrumb.units.courses.id}`}
          className="hover:text-primary hover:underline"
        >
          {breadcrumb.units.title}
        </Link>
        <span>›</span>
        <span className="font-medium text-gray-900 dark:text-white">{breadcrumb.title}</span>
      </nav>

      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{breadcrumb.title}</h1>
        <span className="text-sm font-medium text-gray-500">
          Đã thuộc {learnedCount}/{totalCount} từ
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex gap-2">
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm từ hoặc nghĩa…"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Xóa
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ['all', 'Tất cả'],
            ['unlearned', 'Chưa thuộc'],
            ['learned', 'Đã thuộc'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilterValue(value)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filterValue === value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-700">
          Không tải được danh sách từ vựng.
          <button type="button" onClick={() => refetch()} className="ml-2 font-semibold underline">
            Thử lại
          </button>
        </div>
      ) : isLoading ? (
        <div className="py-10 text-center text-sm text-gray-500">Đang tải từ vựng…</div>
      ) : (
        <div className="grid gap-4">
          {displayWordsFinal.map((item) => (
            <WordCard key={item.words.id} wordItem={item} onToggle={handleToggle} />
          ))}
          {totalCount === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">Không có từ nào khớp.</p>
          )}
        </div>
      )}
      </div>
    </main>
  );
}

export default LessonPage;