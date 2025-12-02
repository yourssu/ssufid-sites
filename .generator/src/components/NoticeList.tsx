import { useState } from 'react';

import NoticeItem from '@/components/NoticeItem';
import { NoticeItem as NoticeItemType } from '@/types';

interface NoticeListProps {
  items: NoticeItemType[];
}

type SortOption = 'created_asc' | 'created_desc' | 'updated_asc' | 'updated_desc';

function NoticeList({ items }: NoticeListProps) {
  const [sortOption, setSortOption] = useState<SortOption>('created_desc');

  const sortedItems = [...items].sort((a, b) => {
    switch (sortOption) {
      case 'created_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'created_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'updated_asc':
        return (
          new Date(a.updated_at || a.created_at).getTime() -
          new Date(b.updated_at || b.created_at).getTime()
        );
      case 'updated_desc':
        return (
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
        );
      default:
        return 0;
    }
  });

  // 월별로 그룹화
  const groupedByMonth: { [key: string]: NoticeItemType[] } = {};
  sortedItems.forEach((item) => {
    const date = new Date(
      sortOption.startsWith('updated') ? item.updated_at || item.created_at : item.created_at,
    );
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(item);
  });

  const monthKeys = Object.keys(groupedByMonth);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-700 p-4">
        <div className="text-sm text-gray-200">
          총 <span className="font-semibold text-gray-50">{items.length}</span>개의 공지사항
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-2t00 text-sm" htmlFor="sort-select">
            정렬:
          </label>
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            id="sort-select"
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            value={sortOption}
          >
            <option value="created_desc">생성일 (최신순)</option>
            <option value="created_asc">생성일 (오래된순)</option>
            <option value="updated_desc">수정일 (최신순)</option>
            <option value="updated_asc">수정일 (오래된순)</option>
          </select>
        </div>
      </div>
      {monthKeys.map((monthKey, index) => {
        const [year, month] = monthKey.split('-');
        return (
          <div key={monthKey}>
            {index > 0 && <div className="my-6 border-t border-gray-600" />}
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-300">
              <span>{year}년 {month}월</span>
              <span className="text-xs font-normal text-gray-400">
                ({groupedByMonth[monthKey].length}개)
              </span>
            </div>
            <div className="space-y-2">
              {groupedByMonth[monthKey].map((item) => (
                <NoticeItem item={item} key={item.id} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NoticeList;
