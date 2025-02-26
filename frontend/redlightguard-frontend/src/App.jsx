import { Routes, Route, useLocation } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar"; // 🏠 導覽列
import StarButton from "./components/StarButton"; // ⭐️ 小星星按鈕
import MouseRipple from "./components/MouseRipple";
import BackgroundStars from "./components/BackgroundStars";
import MouseBubbles from "./components/MouseBubbles";

function App() {
  const location = useLocation(); // 📍 獲取當前路徑

  // 🛡️ 導覽列不顯示於動畫頁
  const hideNavbarOnPages = ["/"];

  // ⭐️ 小星星顯示於所有頁面（包含登入頁）
  const showStarButtonOnPages = ["/login", "/upload", "/admin-login", "/admin"];

  return (
    <>
      {/* 🏠 導覽列（除了動畫頁外都顯示） */}
      {!hideNavbarOnPages.includes(location.pathname) && <Navbar />}

      {/* 🌟 小星星按鈕（在指定頁面顯示） */}
      {showStarButtonOnPages.includes(location.pathname) && <StarButton />}

      {/* 🖱️ 背景動畫切換 */}
      {location.pathname === "/upload" ? (
        <MouseBubbles /> // 🫧 上傳頁顯示滑鼠泡泡
      ) : location.pathname !== "/" ? (
        <>
          <BackgroundStars /> {/* ✨ 其他頁面顯示星星背景 */}
          <MouseRipple />     {/* 🖱️ 滑鼠漣漪效果 */}
        </>
      ) : null}

      {/* 🗺️ 路由設定 */}
      <Routes>
        <Route path="/" element={<SplashScreen />} />       {/* 🌠 動畫頁 */}
        <Route path="/login" element={<LoginPage />} />     {/* 🔑 登入頁（有小星星） */}
        <Route path="/upload" element={<UploadPage />} />   {/* 📤 上傳頁（有泡泡 & 小星星） */}
        <Route path="/admin-login" element={<AdminLoginPage />} /> {/* 🛡️ 管理員登入頁（有小星星） */}
        <Route path="/admin" element={<AdminPage />} />     {/* 🗂️ 管理員頁（有小星星） */}
      </Routes>
    </>
  );
}

export default App;
