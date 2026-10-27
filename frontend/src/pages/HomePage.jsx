import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider.jsx';
import { useProfile } from '../hooks/useProfile.js';
import { useCourses } from '../hooks/useCourses.js';
import { useCourseProgress } from '../hooks/useCourseProgress.js';
import ProgressBar from '../components/ProgressBar.jsx';

function HomePage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: courses } = useCourses();
  const targetCourse = courses?.find(c => c.id === profile?.target_course_id);
  const courseProgress = useCourseProgress(targetCourse?.id ?? '');

  if (profileLoading) {
    return <div className="px-4 py-8 text-sm text-gray-500">Đang tải…</div>;
  }

  // Lấy progress Course mục tiêu
  const cp = courseProgress?.data?.find(p => p.level === 'course') ?? {};
  const cpTotal = cp.total_words ?? 0;
  const cpLearned = cp.learned_words ?? 0;

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Xin chào, {profile?.display_name || 'bạn'}! 👋
        </h1>
        
        <div className="mt-6">
          {targetCourse ? (
            <div className="flex flex-col items-center gap-3">
              <ProgressBar learned={cpLearned} total={cpTotal} />
              <Link
                to={`/courses/${targetCourse.id}`}
                className="w-full max-w-xs rounded-2xl bg-primary py-4 text-center text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
              >
                Tiếp tục học
              </Link>
            </div>
          ) : (
            <Link
              to="/onboarding"
              className="w-full max-w-xs rounded-2xl bg-primary py-4 text-center text-lg font-bold text-white shadow-lg transition-transform active:scale-95"
            >
              Thiết lập mục tiêu
            </Link>
          )}
        </div>
        
        <Link 
          to="/courses" 
          className="mt-4 text-sm font-medium text-gray-500 hover:text-primary"
        >
          Xem tất cả khóa học
        </Link>
      </div>
    </main>
  );
}

export default HomePage;