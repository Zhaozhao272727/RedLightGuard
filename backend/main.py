from fastapi import FastAPI
from supabase import create_client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uuid
from datetime import datetime
import uvicorn

# 載入環境變數
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# 創建 Supabase 客戶端
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

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

# 影片上傳 API
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
        return {"message": "✅ 影片資訊已儲存！", "video_id": video_id, "data": response}
    except Exception as e:
        return {"error": "❌ 影片上傳失敗", "details": str(e)}
    
@app.get("/videos")
def get_videos():
    try:
        response = supabase.table("videos").select("*").execute()
        return {"message": "✅ 成功取得影片列表！", "data": response}
    except Exception as e:
        return {"error": "❌ 無法取得影片列表", "details": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

