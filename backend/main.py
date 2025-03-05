from fastapi import FastAPI, HTTPException, File, UploadFile, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import boto3
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
from datetime import datetime
import hashlib
from cut_video import app as cut_video_app

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

# ✅ 6. 健康檢查 API
@app.get("/ping")
def health_check():
    return {"message": "pong"}

@app.head("/ping")
def head_ping():
    return Response(status_code=200)

@app.get("/")
def home():
    return {"message": "✅ RedLightGuard API is running!"}

# ✅ 7. 註冊 API（Supabase Auth）
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

@app.post("/register")
def register_user(user: UserCreate):
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        if auth_response.user is None:
            raise HTTPException(status_code=400, detail="❌ 註冊失敗")

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
class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login")
def login(request: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })

        if auth_response.session is None:
            raise HTTPException(status_code=401, detail="❌ 登入失敗")

        return {
            "message": "✅ 登入成功！",
            "user_id": auth_response.user.id,
            "access_token": auth_response.session.access_token
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 伺服器錯誤: {str(e)}")

# ✅ 9. 影片上傳 API（避免重複上傳）
@app.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    try:
        if not user_id:
            raise HTTPException(status_code=400, detail="❌ 缺少 user_id！請先登入")

        if file is None:
            raise HTTPException(status_code=400, detail="❌ 沒有收到影片檔案")

        # ✅ 計算檔案的哈希值，避免重複上傳
        file_content = await file.read()
        file_hash = hashlib.md5(file_content).hexdigest()

        # 檢查是否已經上傳過
        existing_video = supabase.table("videos").select("id").eq("hash", file_hash).execute()
        if existing_video.data:
            raise HTTPException(status_code=400, detail="⚠️ 影片已上傳過，請勿重複上傳！")

        # 生成唯一檔名
        video_id = str(uuid.uuid4())
        filename = f"{user_id}/{video_id}_{file.filename}"

        # 重新將檔案指針移回開頭，才能正常上傳
        file.file.seek(0)

        # ✅ 上傳影片到 S3
        s3_client.upload_fileobj(
            file.file,
            AWS_BUCKET_NAME,
            filename,
            ExtraArgs={"ACL": "private"}
        )

        video_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"

        # ✅ 儲存影片資訊
        uploaded_at = datetime.utcnow().isoformat()
        supabase.table("videos").insert({
            "id": video_id,
            "user_id": user_id,
            "filename": file.filename,
            "s3_url": video_url,
            "hash": file_hash,
            "uploaded_at": uploaded_at,
            "status": "pending"
        }).execute()

        return {"message": "✅ 影片已成功上傳！", "video_url": video_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 影片上傳失敗: {str(e)}")

# ✅ 10. 取得特定用戶的影片列表 API
@app.get("/user/videos")
def get_user_videos(user_id: str):
    try:
        if not user_id:
            raise HTTPException(status_code=400, detail="❌ 缺少 user_id！")

        # 取得 S3 影片清單
        s3 = boto3.client("s3")
        prefix = f"{user_id}/"
        response = s3.list_objects_v2(Bucket=AWS_BUCKET_NAME, Prefix=prefix)

        if "Contents" not in response or not response["Contents"]:
            return {"message": "⚠️ 該用戶沒有上傳影片！", "videos": []}

        video_list = [
            {
                "name": obj["Key"].split("/")[-1],
                "url": f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{obj['Key']}"
            }
            for obj in response["Contents"]
        ]

        return {"message": "✅ 成功取得影片列表！", "videos": video_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ 取得影片列表失敗: {str(e)}")

# ✅ 11. 掛載 `/videos/cut`（影片裁剪 API）
app.mount("/videos", cut_video_app)

# ❌ 現在缺少用戶清單 API，需要補上：
@app.get("/admin/users")
async def get_all_users():
    users = [{"id": 1, "username": "Zhaozhao", "email": "zhaozhao@example.com"}]  # 模擬資料
    return {"data": users}

# ❌ 現在缺少所有影片 API，需要補上：
@app.get("/admin/videos")
async def get_all_videos():
    videos = [{"id": 1, "filename": "video1.mp4", "user_id": 1, "status": "Pending"}]  # 模擬資料
    return {"data": videos}