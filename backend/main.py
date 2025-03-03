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

# ✅ 2. 連接 Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ 3. 初始化 FastAPI
app = FastAPI()

# ✅ 4. 設定 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://redlightguard.vercel.app", "https://uptimerobot.com", "https://dashboard.uptimerobot.com"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 5. 健康檢查 API
@app.get("/ping")
def health_check():
    return {"message": "pong"}

@app.get("/")
def home():
    return {"message": "✅ RedLightGuard API is running!"}


# ✅ 6. 用戶模型
class UserCreate(BaseModel):
    email: str  
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str  
    password: str

# ✅ 7. 註冊 API（使用 Supabase Auth）
@app.post("/register")
def register_user(user: UserCreate):
    try:
        # 使用 Supabase Auth 註冊用戶
        auth_response = supabase.auth.sign_up({
            "email": user.email,  
            "password": user.password
        })

        # 確保 `user` 存在
        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="❌ 註冊失敗: 無法取得用戶資訊")

        user_id = auth_response.user.id  # 正確存取 user_id

        # 儲存用戶資料到 `users` 資料表
        supabase.table("users").insert({
            "id": user_id,
            "username": user.username,  
            "email": user.email,  
            "account": user.username,  # 將 `account` 欄位設為 `username`
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"message": "✅ 註冊成功！", "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 註冊失敗: {str(e)}")



# ✅ 8. 登入 API（使用 Supabase Auth）
@app.post("/login")
def login(request: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,  
            "password": request.password
        })

        # 🔥 確保 `session` & `user` 存在
        if auth_response.session is None:
            raise HTTPException(status_code=401, detail="❌ 登入失敗: 無法驗證用戶")

        return {
            "message": "✅ 登入成功！",
            "user_id": auth_response.user.id,
            "access_token": auth_response.session.access_token
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 伺服器錯誤: {str(e)}")


# ✅ 9. 取得所有用戶
@app.get("/users")
def get_users():
    try:
        response = supabase.table("users").select("id, username, email, created_at").execute()
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

# ✅ 11. UptimeRobot API
@app.get("/ping", response_model=dict)
def health_check():
    return {"status": "ok", "message": "pong"}
