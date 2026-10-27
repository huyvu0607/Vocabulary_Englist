import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../contexts/AuthProvider.jsx';

function RegisterPage() {
  const { session, loading: authLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Đang tải…
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  function validate() {
    if (!displayName.trim()) return 'Vui lòng nhập tên hiển thị.';
    if (!email.trim()) return 'Vui lòng nhập email.';
    if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
    if (password !== confirmPassword) return 'Mật khẩu nhập lại không khớp.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!supabase) {
      setError('Chưa cấu hình .env. Vui lòng điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: displayName.trim() },
        },
      });

      if (authError) {
        setError(mapSignUpError(authError));
      } else if (data?.session) {
        // Có session: onAuthStateChange cập nhật trạng thái, route guard chuyển vào ứng dụng.
      } else {
        setInfo('Kiểm tra email để xác nhận tài khoản.');
      }
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-primary">Đăng ký</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {info && <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">{info}</p>}

          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tên hiển thị
            </label>
            <input
              id="display_name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nhập lại mật khẩu
            </label>
            <input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Đang đăng ký…' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-primary">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}

function mapSignUpError(error) {
  const message = (error?.message || '').toLowerCase();
  if (message.includes('already registered') || message.includes('already exists')) {
    return 'Email này đã được đăng ký.';
  }
  if (message.includes('password')) {
    return 'Mật khẩu phải có ít nhất 8 ký tự.';
  }
  if (message.includes('rate limit')) {
    return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.';
  }
  return 'Đăng ký thất bại. Vui lòng thử lại.';
}

export default RegisterPage;
