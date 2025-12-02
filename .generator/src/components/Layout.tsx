import { ReactNode } from 'react';

import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
  description?: string;
  source?: string;
  title?: string;
}

function Layout({ children, title, description, source }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header description={description} source={source} title={title} />
      <main>{children}</main>
      <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>SSUFID - 숭실대학교 공지사항 피드 서비스</p>
          <p className="mt-1">
            <a className="text-blue-600 hover:underline dark:text-blue-400" href="/">
              홈으로 돌아가기
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
