from fastapi import FastAPI, HTTPException, File, UploadFile, Depends, Form, Response
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

# ✅ 2. 連接 Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ✅ 3. 初始化 FastAPI
app = FastAPI()

# ✅ 4. 設定 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生產環境建議限定來源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 5. AWS S3 客戶端
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

# ✅ 6. 健康檢查 API (UptimeRobot 會用 HEAD 或 GET)
@app.get("/ping")
def health_check():
    return {"message": "pong"}

@app.head("/ping")
def head_ping():
    # 給 UptimeRobot 用，回傳 200 即可
    return Response(status_code=200)

@app.get("/")
def home():
    return {"message": "✅ RedLightGuard API is running!"}

# ✅ 7. 用戶模型
class UserCreate(BaseModel):
    email: str  
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str  
    password: str

# ✅ 8. 註冊 API（使用 Supabase Auth）
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

        # 將使用者資訊存進資料表 (假設表名為 "users")
        supabase.table("users").insert({
            "id": user_id,
            "username": user.username,
            "email": user.email,
            "created_at": datetime.utcnow().isoformat()
        }).execute()

        return {"message": "✅ 註冊成功！", "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 註冊失敗: {str(e)}")

# ✅ 9. 登入 API
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

# ✅ 10. S3 影片上傳 API
@app.post("/upload")
async def upload_video(
    file: UploadFile = File(...), 
    user_id: str = Form(...)
):
    try:
        if not user_id:
            raise HTTPException(status_code=400, detail="❌ 缺少 user_id！請先登入或帶上 user_id")

        if file is None:
            raise HTTPException(status_code=400, detail="❌ 沒有收到影片檔案，請重新選擇！")

        video_id = str(uuid.uuid4())
        filename = f"{user_id}/{video_id}_{file.filename}"

        # ✅ 先讀取檔案內容，確認非空
        file_content = await file.read()
        if not file_content:
            raise HTTPException(status_code=400, detail="❌ 檔案為空，請重新選擇！")

        # 重新將檔案指針移回開頭，才能正常上傳到 S3
        file.file.seek(0)

        # ✅ 上傳影片到 S3
        s3_client.upload_fileobj(file.file, AWS_BUCKET_NAME, filename, ExtraArgs={"ACL": "private"})

        # ✅ 取得影片 URL
        video_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"

        # ✅ 儲存影片資訊到資料庫 (假設表名為 "videos")
        uploaded_at = datetime.utcnow().isoformat()
        supabase.table("videos").insert({
            "id": video_id,
            "user_id": user_id,
            "filename": file.filename,
            "s3_url": video_url,
            "uploaded_at": uploaded_at,
            "status": "pending"
        }).execute()

        return {"message": "✅ 影片已成功上傳！", "video_url": video_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 影片上傳失敗: {str(e)}")

# ✅ 11. 取得影片列表 API
@app.get("/videos")
def get_videos():
    try:
        response = supabase.table("videos").select("*").execute()
        return {"message": "✅ 成功取得影片列表！", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 取得影片列表失敗: {str(e)}")
