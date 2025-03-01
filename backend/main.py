from fastapi import FastAPI
from supabase import create_client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
from datetime import datetime
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# ✅ 1. 先載入環境變數
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# ✅ 2. 確保環境變數有載入
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ 環境變數 `SUPABASE_URL` 或 `SUPABASE_KEY` 未正確載入！請確認 .env 檔案是否存在。")

# ✅ 3. 初始化 FastAPI（這行要在 Middleware 之前）
app = FastAPI()

# ✅ 4. 設定 CORS（這行要放在 `app = FastAPI()` 之後）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://opulent-spork-x5pw7xq54pxr2pr49-5173.app.github.dev",  # ✅ 你的前端網址
        "https://opulent-spork-x5pw7xq54pxr2pr49-8000.app.github.dev"   # ✅ 你的後端網址 (可選)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ✅ 5. 創建 Supabase 客戶端
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase 連線成功！")
except Exception as e:
    print(f"❌ Supabase 連線失敗: {e}")
    raise RuntimeError("Supabase 連線錯誤")

# 定義請求格式
class VideoUpload(BaseModel):
    user_id: str
    filename: str

@app.get("/")
def root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/ping")
def ping():
    return {"message": "Pong!"}

@app.get("/users")
def get_users():
    try:
        response = supabase.table("users").select("*").execute()
        print("🟢 取得用戶列表:", response)  # ✅ 增加 debug 訊息
        return {"message": "✅ 成功取得用戶列表！", "data": response}
    except Exception as e:
        print(f"❌ 無法取得用戶列表: {e}")  # ✅ 增加 debug 訊息
        return {"error": "❌ 無法取得用戶列表", "details": str(e)}

@app.post("/add_user")
def add_test_user():
    try:
        user_id = str(uuid.uuid4())  # ✅ 這行讓 `id` 自動產生新值
        new_user = {
            "id": user_id,
            "username": "TestUser",
            "email": "test@example.com",
            "created_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("users").insert(new_user).execute()
        return {"message": "✅ 測試用戶新增成功！", "data": response}
    except Exception as e:
        return {"error": "❌ 新增用戶失敗", "details": str(e)}



# ✅ 6. 影片上傳 API
@app.post("/upload")
def upload_video(video: VideoUpload):
    try:
        video_id = str(uuid.uuid4())  # 生成唯一 ID
        uploaded_at = datetime.utcnow().isoformat()  # 取得當前時間
        new_video = {
            "id": video_id,
            "user_id": video.user_id,
            "filename": video.filename,
            "uploaded_at": uploaded_at,
            "status": "pending"
        }

        response = supabase.table("videos").insert(new_video).execute()
        print("🟢 Supabase 回應:", response)  # ✅ 增加 debug 訊息
        return {"message": "✅ 影片資訊已儲存！", "video_id": video_id, "data": response}
    except Exception as e:
        print(f"❌ 影片上傳失敗: {e}")  # ✅ 增加 debug 訊息
        return {"error": "❌ 影片上傳失敗", "details": str(e)}

# ✅ 7. 取得影片列表 API
@app.get("/videos")
def get_videos():
    try:
        response = supabase.table("videos").select("*").execute()
        print("🟢 取得影片列表:", response)  # ✅ 增加 debug 訊息
        return {"message": "✅ 成功取得影片列表！", "data": response}
    except Exception as e:
        print(f"❌ 無法取得影片列表: {e}")  # ✅ 增加 debug 訊息
        return {"error": "❌ 無法取得影片列表", "details": str(e)}

# ✅ 8. 啟動 FastAPI（部署時不用 `uvicorn.run`）
if __name__ == "__main__":
    print("⚡ FastAPI 啟動中...")
    print(f"🔗 伺服器運行於: http://127.0.0.1:8000")
    print(f"🔗 Codespaces 外部連結: {os.getenv('CODESPACES_URL', '無')}")

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
