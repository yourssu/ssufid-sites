import Home from '@/pages/Home';
import Site from '@/pages/Site';

function App() {
  const path = window.location.pathname;
  const isRoot = path === '/' || path === '/index.html';

  return isRoot ? <Home /> : <Site />;
}

export default App;
