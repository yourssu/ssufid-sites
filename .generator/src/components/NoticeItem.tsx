import { NoticeItem as NoticeItemType } from '@/types';

interface NoticeItemProps {
  item: NoticeItemType;
}

function NoticeItem({ item }: NoticeItemProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-start justify-between">
        <a
          className="flex-1 text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          href={item.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          {item.title}
        </a>
      </div>

      <div className="mb-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        {item.author && (
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {item.author}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          {formatDate(item.created_at)}
        </span>
      </div>

      {item.category && item.category.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {item.category.map((cat, idx) => (
            <span
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              key={idx}
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {item.content && (
        <div
          className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}

      {item.attachments && item.attachments.length > 0 && (
        <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            첨부파일 {item.attachments.length}개
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeItem;
