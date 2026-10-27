import { useParams, Link } from 'react-router-dom';
import { useCourseTree } from '../hooks/useCourseTree.js';
import QueryState from '../components/QueryState.jsx';

function CoursePage() {
  const { courseId } = useParams();
  const { data: course, isLoading, isError, refetch } = useCourseTree(courseId);

  if (!course) {
    return (
      <QueryState 
        query={{ data: course, isLoading, isError, queryKey: ['course-tree', courseId] }} 
        emptyMessage="Khóa học không tồn tại."
        errorAction={refetch}
      />
    );
  }

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{course.description}</p>

        <div className="mt-8 space-y-6">
          {course.units.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Khóa học này chưa có Unit nào.</p>
          ) : (
            course.units.map((unit) => (
              <section key={unit.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h2 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {unit.title}
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {unit.lessons.length === 0 ? (
                    <p className="text-xs text-gray-400">Không có bài học.</p>
                  ) : (
                    unit.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/lessons/${lesson.id}`}
                        className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <span>{lesson.title}</span>
                        <span className="text-xs text-gray-400">→</span>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default CoursePage;
