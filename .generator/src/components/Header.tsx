interface HeaderProps {
  title?: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            className="text-xl font-bold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
            href="/"
          >
            SSUFID
          </a>
          {title && (
            <div className="text-right">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h2>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
