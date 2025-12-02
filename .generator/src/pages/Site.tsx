import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import NoticeList from "@/components/NoticeList";
import Skeleton from "@/components/Skeleton";
import { SiteData } from "@/types";

function Site() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 현재 경로에서 ./data.json을 fetch
    fetch("./data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data.json");
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
      title={siteData?.title || "Loading..."}
      description={siteData?.description}
      source={siteData?.source}
    >
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && siteData && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {siteData.title}
              </h1>
              {siteData.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {siteData.description}
                </p>
              )}
              {siteData.source && (
                <a
                  href={siteData.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  원본 사이트 방문 →
                </a>
              )}
            </div>

            <NoticeList items={siteData.items} />
          </>
        )}

        {!loading && !error && siteData && siteData.items.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            공지사항이 없습니다.
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Site;
