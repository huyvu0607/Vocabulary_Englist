import { useParams, Link } from 'react-router-dom';
import { useLessonWords } from '../hooks/useLessonWords.js';
import { useLessonBreadcrumbs } from '../hooks/useLessonBreadcrumbs.js';
import { useToggleLearned } from '../hooks/useToggleLearned.js';
import QueryState from '../components/QueryState.jsx';
import WordCard from '../components/WordCard.jsx';

function LessonPage() {
  const { lessonId } = useParams();
  const { data: words, isLoading, isError, refetch } = useLessonWords(lessonId);
  const { data: breadcrumb, isLoading: breadLoading } = useLessonBreadcrumbs(lessonId);
  const { mutate: toggleLearned, isPending } = useToggleLearned();

  if (breadLoading) return <div className="px-4 py-8 text-sm text-gray-500">Đang tải…</div>;
  if (!breadcrumb) return <div className="px-4 py-8 text-center text-sm text-gray-500">Bài học không tồn tại.</div>;

  const totalWords = words?.length ?? 0;
  const learnedCount = words?.filter(item => item.words.user_vocabularies?.[0]?.is_learned).length ?? 0;

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to={`/courses/${breadcrumb.units.courses.id}`} className="hover:text-primary">
            {breadcrumb.units.courses.title}
          </Link>
          <span>&gt;</span>
          <Link to={`/courses/${breadcrumb.units.courses.id}`} className="hover:text-primary">
            {breadcrumb.units.title}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-gray-900 dark:text-white">{breadcrumb.title}</span>
        </nav>

        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{breadcrumb.title}</h1>
          <span className="text-sm font-medium text-gray-500">
            Đã thuộc {learnedCount}/{totalWords} từ
          </span>
        </div>

        <QueryState 
          query={{ data: words, isLoading, isError, queryKey: ['lesson-words', lessonId] }} 
          emptyMessage="Bài học này chưa có từ nào."
          errorAction={refetch}
        />

        <div className="grid grid-cols-1 gap-4">
          {words?.map((item) => (
            <WordCard 
              key={item.words.id} 
              wordItem={item} 
              onToggle={(wordId, isLearned) => {
                toggleLearned({ wordId, isLearned }, {
                  onError: (err) => alert('Có lỗi xảy ra khi lưu trạng thái từ. Vui lòng thử lại.')
                });
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default LessonPage;
