import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Site from "@/pages/Site";

function App() {
  const [isRoot, setIsRoot] = useState(false);

  useEffect(() => {
    // 경로 기반 라우팅: 루트 경로인지 확인
    const path = window.location.pathname;
    setIsRoot(path === "/" || path === "/index.html");
  }, []);

  return isRoot ? <Home /> : <Site />;
}

export default App;
