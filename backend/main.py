from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
from datetime import datetime
import uvicorn

# ✅ 1. 先載入環境變數
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# ✅ 2. 確保環境變數有載入
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ 環境變數 `SUPABASE_URL` 或 `SUPABASE_KEY` 未正確載入！請確認 .env 檔案是否存在。")

# ✅ 3. 初始化 FastAPI（這行要在 Middleware 之前）
app = FastAPI()

# ✅ 4. 設定 CORS（這行要放在 `app = FastAPI()` 之後，且要在所有路由之前）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 允許所有來源（測試用，正式環境請改為你的前端網址）
    allow_credentials=True,
    allow_methods=["*"],  # 🔥 允許所有 HTTP 方法
    allow_headers=["*"],  # 🔥 允許所有 Headers
)

# ✅ 5. 確保 `OPTIONS` 預檢請求成功
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str, request: Request):
    return {
        "message": "✅ CORS 預檢請求成功！",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }

# ✅ 6. 創建 Supabase 客戶端
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase 連線成功！")
except Exception as e:
    print(f"❌ Supabase 連線失敗: {e}")
    raise RuntimeError("Supabase 連線錯誤")

# ✅ 7. 定義請求格式
class VideoUpload(BaseModel):
    user_id: str
    filename: str

# ✅ 8. FastAPI 測試端點
@app.get("/")
def root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/ping")
def ping():
    return {"message": "Pong!"}

# ✅ 9. 用戶 API
@app.get("/users")
def get_users():
    try:
        response = supabase.table("users").select("*").execute()
        return {"message": "✅ 成功取得用戶列表！", "data": response}
    except Exception as e:
        return {"error": "❌ 無法取得用戶列表", "details": str(e)}

@app.post("/add_user")
def add_test_user():
    try:
        user_id = str(uuid.uuid4())  
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
    
# 🚀 確保這個路由存在！
@app.get("/users/{user_id}")
async def get_user(user_id: str):
    return {"id": user_id, "username": "zhaozhao", "email": "zhaozhao@example.com"}

# ✅ 10. 影片 API
@app.post("/upload")
def upload_video(video: VideoUpload):
    try:
        video_id = str(uuid.uuid4())  
        uploaded_at = datetime.utcnow().isoformat()  
        new_video = {
            "id": video_id,
            "user_id": video.user_id,
            "filename": video.filename,
            "uploaded_at": uploaded_at,
            "status": "pending"
        }
        response = supabase.table("videos").insert(new_video).execute()
        return {"message": "✅ 影片資訊已儲存！", "video_id": video_id, "data": response}
    except Exception as e:
        return {"error": "❌ 影片上傳失敗", "details": str(e)}

@app.get("/videos")
def get_videos():
    try:
        response = supabase.table("videos").select("*").execute()
        print("🟢 取得影片列表:", response)  # ✅ Debug 訊息
        return {"message": "✅ 成功取得影片列表！", "data": response}
    except Exception as e:
        print(f"❌ 無法取得影片列表: {e}")  # ✅ Debug 訊息
        return {"error": "❌ 無法取得影片列表", "details": str(e)}


# ✅ 11. 啟動 FastAPI
if __name__ == "__main__":
    print("⚡ FastAPI 啟動中...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

import pprint  # 🔥 讓輸出更清楚

print("📌 已註冊的路由:")
pprint.pprint(app.routes)  # 🔥 這會列出所有註冊的 API！


