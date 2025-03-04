from fastapi import FastAPI, HTTPException
import boto3
import os
import requests
from moviepy.video.io.VideoFileClip import VideoFileClip

app = FastAPI()

S3_BUCKET = "redlightguard"  # 你的 S3 bucket 名稱
s3_client = boto3.client("s3")


@app.post("/videos/cut")
def cut_video(user_id: str, filename: str, start: float, end: float):
    """
    下載 S3 影片 → 裁剪 → 上傳回 S3（同一個資料夾，但檔名加 "-cut.mp4"）
    """

    # 1️⃣ 先組出 S3 影片網址
    original_s3_key = f"{user_id}/{filename}"
    local_input = "/tmp/input_video.mp4"
    local_output = "/tmp/output_video.mp4"

    try:
        # 2️⃣ 下載影片到後端
        s3_client.download_file(S3_BUCKET, original_s3_key, local_input)

        # 3️⃣ 用 MoviePy 裁剪影片
        clip = VideoFileClip(local_input).subclip(start, end)
        clip.write_videofile(local_output, codec="libx264", audio_codec="aac")
        clip.close()

        # 4️⃣ 裁剪後的檔名（同一資料夾，但加 `-cut.mp4`）
        new_filename = filename.replace(".mp4", "-cut.mp4")
        new_s3_key = f"{user_id}/{new_filename}"

        # 5️⃣ 上傳裁剪後的影片
        s3_client.upload_file(local_output, S3_BUCKET, new_s3_key)

        # 6️⃣ 回傳新影片的 URL
        new_s3_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{new_s3_key}"

        # 7️⃣ 刪除暫存檔案
        os.remove(local_input)
        os.remove(local_output)

        return {
            "message": "影片裁剪成功",
            "new_filename": new_filename,
            "new_url": new_s3_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"裁剪失敗: {str(e)}")


