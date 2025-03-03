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

@app.get("/")
async def root():
    return {"message": "✅ 伺服器運行正常！"}

# ✅ 3. 設定 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://redlightguard.vercel.app"],  # 允許你的前端
    allow_credentials=True,
    allow_methods=["*"],  # 允許所有請求方法（GET, POST, DELETE...）
    allow_headers=["*"],  # 允許所有請求標頭
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
    email: str  # ✅ 修正：新增 email
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str  # ✅ 修正：使用 email
    password: str

@app.post("/register")
def register_user(user: UserCreate):
    try:
        # ✅ Supabase Auth 註冊用戶
        auth_response = supabase.auth.sign_up({
            "email": user.email,  
            "password": user.password
        })

        # ✅ 先 `print(auth_response)` 看回傳格式
        print("🛠️ auth_response:", auth_response)

        # ✅ 取 user_id（避免 KeyError）
        user_data = auth_response.get("user")
        if not user_data:
            raise HTTPException(status_code=400, detail=f"❌ 註冊失敗: {auth_response}")

        user_id = user_data.get("id")  # ✅ 修正 user_id 取法

        # ✅ 將用戶存入 `users` 資料表
        supabase.table("users").insert({
            "id": user_id,
            "account": user.account,
            "username": user.username,
            "email": user.email,  # ✅ 確保 email 也存入資料表
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
            "email": request.email,  # ✅ 修正為 email
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

