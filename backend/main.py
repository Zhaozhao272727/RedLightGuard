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

# ✅ 7. 註冊 API
@app.post("/register")
def register_user(user: UserCreate):
    try:
        # 🔍 檢查帳號是否已存在
        existing_account = supabase.table("users").select("*").eq("account", user.account).execute()
        if existing_account.data:
            raise HTTPException(status_code=400, detail="❌ 帳號已被使用！")

        # 🔍 檢查用戶名是否已存在
        existing_username = supabase.table("users").select("*").eq("username", user.username).execute()
        if existing_username.data:
            raise HTTPException(status_code=400, detail="❌ 用戶名已被使用！")

        # 🆕 產生 UUID
        user_id = str(uuid.uuid4())

        # 📝 新增用戶
        new_user = {
            "id": user_id,
            "account": user.account,
            "username": user.username,
            "password": user.password,  # 🚨 這裡未加密（未來建議用 bcrypt）
            "created_at": datetime.utcnow().isoformat(),
        }
        supabase.table("users").insert(new_user).execute()

        return {"message": "✅ 註冊成功！", "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 註冊失敗: {str(e)}")

# ✅ 8. 登入 API
@app.post("/login")
def login(request: LoginRequest):
    try:
        # 🔍 查詢帳號
        response = supabase.table("users").select("*").eq("account", request.account).execute()
        if not response.data:
            raise HTTPException(status_code=401, detail="❌ 帳號不存在！")

        user = response.data[0]
        
        # 🔐 檢查密碼
        if user["password"] != request.password:
            raise HTTPException(status_code=401, detail="❌ 密碼錯誤！")

        return {"message": "✅ 登入成功！", "account": user["account"], "username": user["username"]}

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
