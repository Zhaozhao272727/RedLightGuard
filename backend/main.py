from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
from datetime import datetime
import uvicorn

# ✅ 1. 載入環境變數
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Supabase 環境變數未正確載入！")

# ✅ 2. 初始化 FastAPI
app = FastAPI()

# ✅ 3. 設定 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 4. 連接 Supabase
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase 連線成功！")
except Exception as e:
    print(f"❌ Supabase 連線失敗: {e}")
    raise RuntimeError("Supabase 連線錯誤")

# ✅ 5. 測試 API
@app.get("/ping")
def health_check():
    return {"message": "pong"}

# ✅ 6. 用戶模型
class UserCreate(BaseModel):
    account: str
    username: str
    password: str

class LoginRequest(BaseModel):
    account: str
    password: str

@app.post("/register")
def register_user(user: UserCreate):
    try:
        # 🔥 使用 Supabase Auth 註冊用戶
        auth_response = supabase.auth.sign_up({
            "email": user.email,  
            "password": user.password
        })

        if "error" in auth_response:
            raise HTTPException(status_code=400, detail=f"❌ 註冊失敗: {auth_response['error']['message']}")

        user_id = auth_response["user"]["id"]

        # 📝 在 `users` 資料表內存額外資訊（username）
        supabase.table("users").insert({
            "id": user_id,
            "username": user.username,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"message": "✅ 註冊成功！", "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 註冊失敗: {str(e)}")


@app.post("/login")
def login(request: LoginRequest):
    try:
        # 🔥 向 Supabase Auth 驗證用戶
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })

        if "error" in auth_response:
            raise HTTPException(status_code=401, detail=f"❌ 登入失敗: {auth_response['error']['message']}")

        return {
            "message": "✅ 登入成功！",
            "user_id": auth_response["user"]["id"],
            "access_token": auth_response["session"]["access_token"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 伺服器錯誤: {str(e)}")


# ✅ 9. 取得所有用戶
@app.get("/users")
def get_users():
    try:
        response = supabase.table("users").select("id, account, username, created_at").execute()
        return {"message": "✅ 成功取得用戶列表！", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 取得用戶列表失敗: {str(e)}")

# ✅ 10. 影片 API
class VideoUpload(BaseModel):
    user_id: str
    filename: str

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
        supabase.table("videos").insert(new_video).execute()
        return {"message": "✅ 影片資訊已儲存！", "video_id": video_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 影片上傳失敗: {str(e)}")

@app.get("/videos")
def get_videos():
    try:
        response = supabase.table("videos").select("*").execute()
        return {"message": "✅ 成功取得影片列表！", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 取得影片列表失敗: {str(e)}")

# ✅ 11. 啟動 FastAPI
if __name__ == "__main__":
    print("⚡ FastAPI 啟動中...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
