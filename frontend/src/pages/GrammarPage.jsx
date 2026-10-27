import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useLessonGrammar } from '../hooks/useLessonGrammar.js';
import QueryState from '../components/QueryState.jsx';
import SafeMarkdown from '../components/SafeMarkdown.jsx';

function GrammarPage() {
  const { lessonId } = useParams();
  const grammarQuery = useLessonGrammar(lessonId);
  const grammarPoints = grammarQuery.data ?? [];
  const [openIndexes, setOpenIndexes] = useState(new Set([0]));

  if (grammarQuery.isLoading) {
    return <div className="py-8 text-center text-sm text-muted">Đang tải ngữ pháp…</div>;
  }

  if (grammarQuery.isError) {
    return (
      <QueryState
        query={{
          data: grammarQuery.data,
          isLoading: grammarQuery.isLoading,
          isError: grammarQuery.isError,
          queryKey: ['grammar', lessonId],
        }}
        errorAction={grammarQuery.refetch}
      />
    );
  }

  if (grammarPoints.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6 text-center">
        <p className="text-sm text-muted">Lesson này chưa có ngữ pháp.</p>
        <Link
          to={`/lessons/${lessonId}`}
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Quay lại Từ vựng
        </Link>
      </div>
    );
  }

  return (
    <section aria-labelledby="grammar-heading">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="grammar-heading" className="text-lg font-semibold text-main">
          Ngữ pháp
        </h2>
        {grammarPoints.length >= 2 && (
          <button
            type="button"
            onClick={() => {
              setOpenIndexes((current) =>
                current.size === grammarPoints.length
                  ? new Set()
                  : new Set(grammarPoints.map((_, index) => index)),
              );
            }}
            className="min-h-11 rounded-lg border border-line px-3 py-2 text-sm font-medium text-primary hover:bg-rose-50"
          >
            {openIndexes.size === grammarPoints.length ? 'Thu gọn tất cả' : 'Mở tất cả'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {grammarPoints.map((point, index) => (
          <details
            key={point.id}
            open={openIndexes.has(index)}
            onToggle={(event) => {
              const nextOpen = new Set(openIndexes);
              if (event.currentTarget.open) nextOpen.add(index);
              else nextOpen.delete(index);
              setOpenIndexes(nextOpen);
            }}
            className="group rounded-xl border border-line bg-surface shadow-sm"
          >
            <summary className="min-h-14 cursor-pointer list-none px-4 py-4 font-semibold text-main [&::-webkit-details-marker]:hidden">
              <span className="mr-3 text-primary" aria-hidden="true">
                {openIndexes.has(index) ? '−' : '+'}
              </span>
              {point.title}
            </summary>
            <div className="border-t border-line px-4 py-4">
              <SafeMarkdown content={point.content} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default GrammarPage;
