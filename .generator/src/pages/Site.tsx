import { FileJson, Rss } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Layout from '@/components/Layout';
import NoticeList from '@/components/NoticeList';
import Skeleton from '@/components/Skeleton';
import { CalendarItem, SiteData } from '@/types';

function formatDate(dateString: string) {
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
}

function formatDateRange(item: CalendarItem) {
  const start = formatDate(item.starts_at);
  const end = formatDate(item.ends_at);

  return start === end ? start : `${start} ~ ${end}`;
}

function Site() {
  const [siteData, setSiteData] = useState<null | SiteData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    fetch('./data.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch data.json');
        }
        return res.json();
      })
      .then((data) => {
        setSiteData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const isCalendarFeed = useMemo(() => {
    if (!siteData) {
      return false;
    }

    return (
      window.location.pathname.includes('/calendar/') ||
      (siteData.items.length > 0 && 'starts_at' in siteData.items[0])
    );
  }, [siteData]);

  return (
    <Layout
      description={siteData?.description}
      source={siteData?.source}
      title={siteData?.title || 'Loading...'}
    >
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            {[...Array(5)].map((_, i) => (
              <Skeleton className="h-24" key={i} />
            ))}
          </div>
        )}

        {error && <div className="text-center text-red-600 dark:text-red-400">{error}</div>}

        {!loading && !error && siteData && (
          <>
            <div className="mb-8">
              <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
                {siteData.title}
              </h1>
              {siteData.description && (
                <p className="mb-2 text-gray-600 dark:text-gray-400">{siteData.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                {siteData.source && (
                  <a
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    href={siteData.source}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    원본 사이트 방문 →
                  </a>
                )}
                <div className="flex items-center gap-2">
                  {isCalendarFeed ? (
                    <>
                      <a
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                        href="./calendar.ics"
                        rel="noopener noreferrer"
                        target="_blank"
                        title="iCalendar Feed"
                      >
                        <span>ICS</span>
                      </a>
                      <span className="text-gray-400">|</span>
                    </>
                  ) : (
                    <>
                      <a
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
                        href="./rss.xml"
                        rel="noopener noreferrer"
                        target="_blank"
                        title="RSS Feed"
                      >
                        <Rss className="h-4 w-4" />
                        <span>RSS</span>
                      </a>
                      <span className="text-gray-400">|</span>
                    </>
                  )}
                  <a
                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    href="./data.json"
                    rel="noopener noreferrer"
                    target="_blank"
                    title="JSON Data"
                  >
                    <FileJson className="h-4 w-4" />
                    <span>JSON</span>
                  </a>
                </div>
              </div>
            </div>

            {isCalendarFeed ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-700 p-4 text-sm text-gray-200">
                  총 <span className="font-semibold text-gray-50">{siteData.items.length}</span>개의 일정
                </div>
                {siteData.items.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400">등록된 일정이 없습니다.</div>
                ) : (
                  (siteData.items as CalendarItem[]).map((item) => (
                    <div
                      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                      key={item.id}
                    >
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <a
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                          href={item.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.title}
                        </a>
                        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          {formatDateRange(item)}
                        </span>
                      </div>
                      {item.description && (
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      )}
                      {item.location && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">장소: {item.location}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <>
                <NoticeList items={siteData.items} />
                {siteData.items.length === 0 && (
                  <div className="text-center text-gray-600 dark:text-gray-400">공지사항이 없습니다.</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Site;
