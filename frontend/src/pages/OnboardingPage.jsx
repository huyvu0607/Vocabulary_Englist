import { useNavigate } from 'react-router-dom';
import CourseTargetForm from '../components/CourseTargetForm.jsx';

function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-xl font-semibold text-primary">Chọn Course mục tiêu</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Hãy chọn mục tiêu học của bạn để bắt đầu.
        </p>
        <CourseTargetForm onSaved={() => navigate('/')} />
      </div>
    </main>
  );
}

export default OnboardingPage;
