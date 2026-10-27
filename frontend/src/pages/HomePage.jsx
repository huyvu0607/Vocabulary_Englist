import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

function HomePage() {
  const [status, setStatus] = useState('Đang kiểm tra kết nối…');

  useEffect(() => {
    let active = true;

    async function checkConnection() {
      if (!supabase) {
        if (active) {
          setStatus(
            'Lỗi: chưa cấu hình .env. Hãy điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY rồi khởi động lại.',
          );
        }
        return;
      }

      try {
        const { error } = await supabase.auth.getSession();
        if (active) {
          setStatus(
            error
              ? `Lỗi kết nối Supabase: ${error.message}`
              : 'Kết nối Supabase thành công',
          );
        }
      } catch (err) {
        if (active) {
          setStatus(`Lỗi kết nối Supabase: ${err.message}`);
        }
      }
    }

    checkConnection();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-4 py-6">
      <h1 className="text-xl font-semibold text-primary">Ôn từ vựng tiếng Anh</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{status}</p>
    </main>
  );
}

export default HomePage;
