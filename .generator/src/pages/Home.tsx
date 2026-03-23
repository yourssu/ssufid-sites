import type { SiteMetadata } from '@/types';

import Layout from '@/components/Layout';
import sitesData from '@/sites.json';

function Home() {
  const sites: SiteMetadata[] = sitesData;

  return (
    <Layout title="SSUFID - 숭실대학교 공지사항 피드">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-center text-4xl font-bold">SSUFID</h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          숭실대학교 공지사항을 빠르게 피드로 확인하세요
        </p>

        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">통합 API Docs</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            SSUFID가 배포하는 전체 JSON/RSS feed를 Scalar 기반 문서로 확인하세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              href="/docs/"
            >
              API Docs 보기
            </a>
            <a
              className="rounded-md border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/50"
              href="/openapi.json"
              rel="noopener noreferrer"
              target="_blank"
            >
              OpenAPI JSON
            </a>
          </div>
        </div>

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
