from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import boto3
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
from datetime import datetime

# ✅ 1. 載入環境變數
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-1")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Supabase 環境變數未正確載入！")

if not AWS_ACCESS_KEY or not AWS_SECRET_KEY or not AWS_BUCKET_NAME:
    raise ValueError("❌ AWS S3 環境變數未正確載入！")

# ✅ 2. 連接 Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ 3. 連接 S3
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

# ✅ 4. 初始化 FastAPI
app = FastAPI()

# ✅ 5. 設定 CORS（允許所有請求）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# ✅ 7. 註冊 API
@app.post("/register")
def register_user(user: UserCreate):
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,  
            "password": user.password
        })

        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="❌ 註冊失敗: 無法取得用戶資訊")

        user_id = auth_response.user.id 

        supabase.table("users").insert({
            "id": user_id,
            "username": user.username,  
            "email": user.email,  
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"message": "✅ 註冊成功！", "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 註冊失敗: {str(e)}")


# ✅ 8. 登入 API
@app.post("/login")
def login(request: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,  
            "password": request.password
        })

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
@app.post("/upload-video/")
async def upload_video(file: UploadFile = File(...)):
    try:
        # ✅ 取得檔案資訊
        file_ext = file.filename.split(".")[-1]  
        filename = f"videos/{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.{file_ext}"

        # ✅ 上傳到 S3
        s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, filename)

        # ✅ 取得影片 URL
        file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"

        return {"message": "✅ 影片上傳成功！", "file_url": file_url}

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
