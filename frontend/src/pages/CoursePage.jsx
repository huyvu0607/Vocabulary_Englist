import { Link, useParams } from 'react-router-dom';
import { useCourseTree } from '../hooks/useCourseTree.js';
import { useCourseProgress } from '../hooks/useCourseProgress.js';
import QueryState from '../components/QueryState.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

function CoursePage() {
  const { courseId } = useParams();
  const courseQuery = useCourseTree(courseId);
  const progressQuery = useCourseProgress(courseId);
  const { data: course } = courseQuery;
  const { data: progress } = progressQuery;

  if (!course) {
    return (
      <main className="px-4 py-8">
        <div className="mx-auto max-w-xl">
          <QueryState
            query={{
              data: course,
              isLoading: courseQuery.isLoading,
              isError: courseQuery.isError,
              queryKey: ['course-tree', courseId],
            }}
            emptyMessage="Khóa học không tồn tại."
            errorAction={courseQuery.refetch}
          />
        </div>
      </main>
    );
  }

  const courseTitle = course?.title ?? 'Khóa học';
  const courseDesc = course?.description ?? '';
  const cp = progress?.find((p) => p.level === 'course') ?? {};
  const courseTotal = cp.total_words ?? 0;
  const courseLearned = cp.learned_words ?? 0;

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <Link
          to="/courses"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Tất cả khóa học
        </Link>

        <div className="mt-4 rounded-2xl bg-primary p-6 text-white shadow-sm">
          <h1 className="text-2xl font-bold">{courseTitle}</h1>
          {courseDesc && <p className="mt-2 text-sm text-rose-100">{courseDesc}</p>}
          <div className="mt-5 flex items-center gap-3">
            <ProgressBar learned={courseLearned} total={courseTotal} />
            <span className="text-sm text-rose-100">
              {courseTotal > 0 ? `${courseLearned}/${courseTotal} từ` : 'Chưa có từ'}
            </span>
          </div>
        </div>

        {progressQuery.isError && (
          <p className="mt-3 text-xs text-gray-500">
            Chưa tải được tiến độ học, nhưng bạn vẫn có thể mở bài học.
          </p>
        )}

        <div className="mt-8 space-y-5">
          {course.units.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Khóa học này chưa có Unit nào.</p>
          ) : (
            course.units.map((unit, unitIndex) => {
              const up = progress?.find((p) => p.level === 'unit' && p.ref_id === unit.id) ?? {};
              const unitTotal = up.total_words ?? 0;
              const unitLearned = up.learned_words ?? 0;

              return (
                <section
                  key={unit.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        Unit {unitIndex + 1}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                        {unit.title}
                      </h2>
                    </div>
                    <ProgressBar learned={unitLearned} total={unitTotal} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {unit.lessons.length === 0 ? (
                      <p className="text-xs text-gray-400">Không có bài học.</p>
                    ) : (
                      unit.lessons.map((lesson, lessonIndex) => (
                        <Link
                          key={lesson.id}
                          to={`/lessons/${lesson.id}`}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-700 transition-colors hover:bg-rose-50 hover:text-primary dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-rose-950/30"
                        >
                          <span>
                            <span className="mr-2 text-xs text-gray-400">
                              {unitIndex + 1}.{lessonIndex + 1}
                            </span>
                            {lesson.title}
                          </span>
                          <span className="text-primary">→</span>
                        </Link>
                      ))
                    )}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default CoursePage;