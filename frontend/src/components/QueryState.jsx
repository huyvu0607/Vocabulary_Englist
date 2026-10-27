import { useIsFetching, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

function QueryState({ 
  query, 
  loadingMessage = 'Đang tải dữ liệu…', 
  emptyMessage = 'Không có dữ liệu.', 
  errorAction 
}) {
  const isFetching = useIsFetching({ queryKey: query?.queryKey });
  const isLoading = query?.isLoading;
  const isError = query?.isError;
  const data = query?.data;

  if (isLoading || (isFetching && !data)) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-500">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        {loadingMessage}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="mb-4 text-sm text-red-600">
          Không tải được dữ liệu. Kiểm tra kết nối mạng rồi thử lại.
        </p>
        {errorAction && (
          <button
            onClick={() => errorAction()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return null;
}

export default QueryState;
