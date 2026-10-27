import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthProvider.jsx';
import { useProfile } from '../hooks/useProfile.js';
import { useCourses } from '../hooks/useCourses.js';

function CourseTargetForm({ onSaved }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useCourses();

  const [courseId, setCourseId] = useState('');
  const [targetScore, setTargetScore] = useState('');
  const [dailyWords, setDailyWords] = useState('10');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setCourseId(profile.target_course_id ?? '');
      setTargetScore(profile.target_score != null ? String(profile.target_score) : '');
      setDailyWords(profile.daily_words != null ? String(profile.daily_words) : '10');
    }
  }, [profile]);

  if (profileLoading || coursesLoading) {
    return <div className="py-8 text-sm text-gray-500">Đang tải dữ liệu…</div>;
  }

  if (profileError || coursesError) {
    return (
      <div className="py-8 text-sm text-red-600">
        Không thể tải dữ liệu. Vui lòng thử lại sau.
      </div>
    );
  }

  function validate() {
    if (!courseId) return 'Vui lòng chọn Course mục tiêu.';
    if (targetScore !== '' && Number.isNaN(Number(targetScore))) {
      return 'Điểm mục tiêu phải là một số.';
    }
    const words = Number(dailyWords);
    if (!Number.isInteger(words) || words < 1 || words > 200) {
      return 'Số từ học mỗi ngày phải từ 1 đến 200.';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!supabase || !user) {
      setError('Chưa cấu hình đầy đủ. Vui lòng thử lại.');
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          target_course_id: courseId,
          target_score: targetScore === '' ? null : Number(targetScore),
          daily_words: Number(dailyWords),
        })
        .eq('id', user.id);

      if (updateError) {
        setError('Không thể lưu thay đổi. Vui lòng thử lại.');
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSuccess('Đã lưu thay đổi.');
      onSaved?.();
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {success && (
        <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</p>
      )}

      <div>
        <label htmlFor="target_course_id" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Course mục tiêu
        </label>
        <select
          id="target_course_id"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Chọn Course…</option>
          {(courses ?? []).map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="target_score" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Điểm mục tiêu (không bắt buộc)
        </label>
        <input
          id="target_score"
          type="number"
          step="any"
          value={targetScore}
          onChange={(e) => setTargetScore(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="daily_words" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Số từ học mỗi ngày
        </label>
        <input
          id="daily_words"
          type="number"
          min="1"
          max="200"
          step="1"
          value={dailyWords}
          onChange={(e) => setDailyWords(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? 'Đang lưu…' : 'Lưu'}
      </button>
    </form>
  );
}

export default CourseTargetForm;
