import { Routes, Route, useLocation } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import MouseRipple from "./components/MouseRipple";
import BackgroundStars from "./components/BackgroundStars";
import MouseBubbles from "./components/MouseBubbles";

function App() {
  const location = useLocation(); // 📍 獲取當前路徑

  return (
    <>
      {/* 根據路徑顯示不同動畫 */}
      {location.pathname === "/upload" ? (
        <MouseBubbles /> // 🫧 上傳頁面顯示滑鼠泡泡
      ) : (
        <>
          <BackgroundStars /> {/* ✨ 其他頁面顯示星星背景 */}
          <MouseRipple />     {/* 🖱️ 滑鼠漣漪效果 */}
        </>
      )}

      {/* 路由設定 */}
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </>
  );
}

export default App;
