import { Link, NavLink, Outlet, useParams } from 'react-router-dom';
import { useLessonBreadcrumbs } from '../hooks/useLessonBreadcrumbs.js';
import { useLessonGrammar } from '../hooks/useLessonGrammar.js';

function LessonLayout() {
  const { lessonId } = useParams();
  const { data: breadcrumb, isLoading: breadcrumbLoading } = useLessonBreadcrumbs(lessonId);
  const { data: grammarPoints, isLoading: grammarLoading, isError: grammarError } =
    useLessonGrammar(lessonId);

  if (breadcrumbLoading) {
    return <div className="flex min-h-[240px] items-center justify-center text-sm text-muted">Đang tải…</div>;
  }

  if (!breadcrumb) {
    return <div className="px-4 py-8 text-center text-sm text-muted">Bài học không tồn tại.</div>;
  }

  const course = breadcrumb.units?.courses;
  const unit = breadcrumb.units;
  const grammarAvailable = !grammarLoading && !grammarError && grammarPoints?.length > 0;

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link
          to={`/courses/${course.id}`}
          className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          ← Quay lại khóa học
        </Link>

        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link to={`/courses/${course.id}`} className="hover:text-primary hover:underline">
            {course.title}
          </Link>
          <span aria-hidden="true">›</span>
          <Link to={`/courses/${course.id}`} className="hover:text-primary hover:underline">
            {unit.title}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-medium text-main">{breadcrumb.title}</span>
        </nav>

        <h1 className="mb-4 text-2xl font-bold text-main">{breadcrumb.title}</h1>

        <div className="mb-6 flex border-b border-line" role="tablist" aria-label="Nội dung bài học">
          <NavLink
            end
            to={`/lessons/${lessonId}`}
            role="tab"
            className={({ isActive }) =>
              `min-h-11 flex-1 border-b-2 px-3 py-3 text-center text-sm font-medium ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:border-line hover:text-main'
              }`
            }
          >
            Từ vựng
          </NavLink>
          {grammarAvailable && (
            <NavLink
              to={`/lessons/${lessonId}/grammar`}
              role="tab"
              className={({ isActive }) =>
                `min-h-11 flex-1 border-b-2 px-3 py-3 text-center text-sm font-medium ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:border-line hover:text-main'
                }`
              }
            >
              Ngữ pháp ({grammarPoints.length})
            </NavLink>
          )}
        </div>

        <Outlet context={{ breadcrumb }} />
      </div>
    </main>
  );
}

export default LessonLayout;
