import React from 'react';

function ProgressBar({ learned, total }) {
  if (total === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span role="progressbar" aria-disabled="true" aria-valuenow="0" aria-valuemin="0" aria-valuemax="0">
          Chưa có từ
        </span>
      </div>
    );
  }

  const percent = Math.round((learned / total) * 100);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span role="progressbar"
        aria-valuenow={learned}
        aria-valuemin={0}
        aria-valuemax={total}
        className="sr-only"
      >
        {learned} / {total}
      </span>
      <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-gray-600 dark:text-gray-300 ml-2">
        {percent}%
      </span>
    </div>
  );
}

export default ProgressBar;