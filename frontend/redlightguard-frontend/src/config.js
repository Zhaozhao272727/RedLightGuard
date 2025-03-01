export const API_BASE_URL = "https://opulent-spork-x5pw7xq54pxr2pr49-8000.app.github.dev";
export default API_BASE_URL;

fetch(`${API_BASE_URL}/videos`)
  .then(response => response.json())
  .then(data => console.log("📺 API 回應:", data))
  .catch(error => console.error("❌ 無法獲取影片列表:", error));
