import Layout from '@/components/Layout';
import sitesData from '@/sites.json';
import { SiteMetadata } from '@/types';

function Home() {
  const sites: SiteMetadata[] = sitesData;

  return (
    <Layout title="SSUFID - 숭실대학교 공지사항 피드">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-center text-4xl font-bold">SSUFID</h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          숭실대학교 공지사항을 빠르게 피드로 확인하세요
        </p>

        {sites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <a
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                href={`/${site.slug}/`}
                key={site.slug}
              >
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {site.title}
                </h2>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
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
