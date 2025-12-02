import { FileJson, Rss } from 'lucide-react';
import { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
import NoticeList from '@/components/NoticeList';
import Skeleton from '@/components/Skeleton';
import { SiteData } from '@/types';

function Site() {
  const [siteData, setSiteData] = useState<null | SiteData>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    // 현재 경로에서 ./data.json을 fetch
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

            <NoticeList items={siteData.items} />
          </>
        )}

        {!loading && !error && siteData && siteData.items.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400">공지사항이 없습니다.</div>
        )}
      </div>
    </Layout>
  );
}

export default Site;
