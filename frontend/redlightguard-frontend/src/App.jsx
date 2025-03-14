import { Routes, Route, useLocation } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // 🆕 新增註冊頁面
import UploadPage from "./pages/UploadPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import ErrorLogs from "./pages/ErrorLogs";
import UserDetail from "./pages/UserDetail"; // 🆕 用戶詳情頁
import AnalysisPage from "./pages/AnalysisPage";
import NavBar from "./components/NavBar"; // 🏠 導覽列
import StarButton from "./components/StarButton"; // ⭐️ 小星星按鈕
import MouseRipple from "./components/MouseRipple";
import BackgroundStars from "./components/BackgroundStars";
import MouseBubbles from "./components/MouseBubbles";
import UserProfilePage from "./pages/UserProfilePage"; // 🆕 用戶個人中心頁

function App() {
  const location = useLocation(); // 📍 獲取當前路徑

  // 🛡️ 導覽列不顯示於動畫頁 & 登入頁
  const hideNavbarOnPages = ["/", "/login"];

  // 🌟 小星星按鈕（除了動畫頁，其他頁面都顯示）
  const showStarButton = !hideNavbarOnPages.includes(location.pathname);

  return (
    <>
      {/* 🏠 導覽列（不顯示於動畫頁 & 登入頁） */}
      {!hideNavbarOnPages.includes(location.pathname) && <NavBar />}

      {/* 🌟 小星星按鈕（由 `App.jsx` 控制，不用手動設定特定頁面） */}
      {showStarButton && <StarButton />}

      {/* 🖱️ 背景動畫切換 */}
      {location.pathname === "/upload" ? (
        <MouseBubbles /> // 🫧 上傳頁顯示滑鼠泡泡
      ) : !hideNavbarOnPages.includes(location.pathname) ? (
        <>
          <BackgroundStars /> {/* ✨ 其他頁面顯示星星背景 */}
          <MouseRipple />     {/* 🖱️ 滑鼠漣漪效果 */}
        </>
      ) : null}

      {/* 🗺️ 路由設定 */}
      <Routes>
        <Route path="/" element={<SplashScreen />} />       {/* 🌠 動畫頁 */}
        <Route path="/login" element={<LoginPage />} />     {/* 🔑 登入頁 */}
        <Route path="/register" element={<RegisterPage />} /> {/* 🆕 註冊頁 */}
        <Route path="/upload" element={<UploadPage />} />   {/* 📤 上傳頁 */}
        <Route path="/admin-login" element={<AdminLoginPage />} /> {/* 🛡️ 管理員登入頁 */}
        <Route path="/admin" element={<AdminPage />} />     {/* 🗂️ 管理員頁 */}
        <Route path="/admin/user/:userId" element={<UserDetail />} /> {/* 🆕 用戶詳情頁 */}
        <Route path="/analysis" element={<AnalysisPage />} />  {/* 🆕 分析頁面 */}
        <Route path="/error-logs" element={<ErrorLogs />} />
        <Route path="/user/videos" element={<UserProfilePage />} />  {/* 🔥 修正這行 */}
      </Routes>
    </>
  );
}

export default App;
