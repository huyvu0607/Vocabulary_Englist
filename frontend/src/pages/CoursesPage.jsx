import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses.js';
import { useProfile } from '../hooks/useProfile.js';
import QueryState from '../components/QueryState.jsx';

function CoursesPage() {
  const { data: courses, isLoading, isError, refetch } = useCourses();
  const { data: profile } = useProfile();

  const sortedCourses = (courses ?? []).sort((a, b) => {
    if (a.id === profile?.target_course_id) return -1;
    if (b.id === profile?.target_course_id) return 1;
    return a.position - b.position;
  });

  return (
    <main className="px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-primary">Khóa học</h1>
      
      <QueryState 
        query={{ data: sortedCourses, isLoading, isError, queryKey: ['courses'] }} 
        emptyMessage="Hiện chưa có khóa học nào."
        errorAction={refetch}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sortedCourses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all hover:border-primary hover:shadow-md ${
              course.id === profile?.target_course_id 
                ? 'border-primary bg-rose-50 dark:bg-rose-950/20' 
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
            }`}
          >
            <div>
              {course.id === profile?.target_course_id && (
                <span className="mb-2 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  Mục tiêu của bạn
                </span>
              )}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary">
                {course.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {course.description}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-primary">
              Xem chi tiết →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default CoursesPage;
