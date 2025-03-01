fetch(`${API_BASE_URL}/videos`)
  .then(response => response.json())
  .then(data => console.log("📺 API 回應:", data))
  .catch(error => console.error("❌ 無法獲取影片列表:", error));


fetch(`${API_BASE_URL}/videos`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`❌ API 回應錯誤: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => console.log("📺 API 回應:", data))
  .catch(error => console.error("❌ 無法從 Render 獲取影片列表:", error));

