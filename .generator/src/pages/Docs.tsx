import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

import Layout from '@/components/Layout';

function Docs() {
  return (
    <Layout title="SSUFID API Docs">
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">SSUFID API Docs</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            SSUFID가 배포하는 전체 JSON/RSS feed를 통합 OpenAPI 문서로 제공합니다.
          </p>
          <a
            className="inline-flex rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            href="/openapi.json"
            rel="noopener noreferrer"
            target="_blank"
          >
            OpenAPI JSON 열기
          </a>
        </div>
      </div>

      <div className="bg-white">
        <ApiReferenceReact
          configuration={{
            url: '/openapi.json',
          }}
        />
      </div>
    </Layout>
  );
}

export default Docs;
