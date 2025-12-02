interface HeaderProps {
  title?: string;
  description?: string;
  source?: string;
}

function Header({ title, description, source }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            SSUFID
          </a>
          {title && (
            <div className="text-right">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </h2>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
