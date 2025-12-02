import { ReactNode } from "react";
import Header from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  source?: string;
}

function Layout({ children, title, description, source }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title={title} description={description} source={source} />
      <main>{children}</main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>SSUFID - 숭실대학교 공지사항 피드 서비스</p>
          <p className="mt-1">
            <a
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              홈으로 돌아가기
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
