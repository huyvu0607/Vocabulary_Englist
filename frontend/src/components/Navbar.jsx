import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

function Navbar() {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (!supabase) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="font-bold text-primary">
          Vocabulary
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-xs font-medium text-gray-600 hover:text-primary dark:text-gray-300">Trang chủ</Link>
          <Link to="/courses" className="text-xs font-medium text-gray-600 hover:text-primary dark:text-gray-300">Khóa học</Link>
          <Link to="/settings" className="text-xs font-medium text-gray-600 hover:text-primary dark:text-gray-300">Cài đặt</Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200"
          >
            {signingOut ? '...' : 'Đăng xuất'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
