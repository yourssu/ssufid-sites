import Docs from '@/pages/Docs';
import Home from '@/pages/Home';
import Site from '@/pages/Site';

function App() {
  const path = window.location.pathname;
  const isRoot = path === '/' || path === '/index.html';
  const isDocs = path === '/docs' || path === '/docs/' || path === '/docs/index.html';

  if (isRoot) {
    return <Home />;
  }

  if (isDocs) {
    return <Docs />;
  }

  return <Site />;
}

export default App;
