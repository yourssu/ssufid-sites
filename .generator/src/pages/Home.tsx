import Layout from "@/components/Layout";
import { SiteMetadata } from "@/types";
import sitesData from "@/sites.json";

function Home() {
  const sites: SiteMetadata[] = sitesData;

  return (
    <Layout title="SSUFID - 숭실대학교 공지사항 피드">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">SSUFID</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          숭실대학교 공지사항을 빠르게 피드로 확인하세요
        </p>

        {sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <a
                key={site.slug}
                href={`/${site.slug}/`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {site.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {site.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400">
                    공지사항 {site.itemCount}개
                  </span>
                  <span className="text-gray-500 dark:text-gray-500">→</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            등록된 사이트가 없습니다.
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
