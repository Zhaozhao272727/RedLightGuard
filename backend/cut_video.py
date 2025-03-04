from fastapi import FastAPI, HTTPException
import boto3
import os
from moviepy.video.io.VideoFileClip import VideoFileClip

app = FastAPI()

S3_BUCKET = "redlightguard"  # S3 存儲桶名稱
s3_client = boto3.client("s3")

@app.post("/videos/cut")
def cut_video(user_id: str, filename: str, start: float = 0.0):
    """
    下載 S3 影片 → 按「15秒裁剪 + 5秒重疊」處理 → 上傳回 S3
    """
    original_s3_key = f"{user_id}/{filename}"
    local_input = "/tmp/input_video.mp4"
    local_output = "/tmp/output_video.mp4"

    # 設定裁剪時長
    CLIP_LENGTH = 15  # 每段 15 秒
    OVERLAP = 5  # 重疊 5 秒

    print(f"🎬 正在裁剪影片：{filename}，開始時間：{start} 秒")

    try:
        # 下載影片
        print("⬇️ 下載影片中...")
        s3_client.download_file(S3_BUCKET, original_s3_key, local_input)
        print("✅ 下載完成！")

        # 加載影片
        clip = VideoFileClip(local_input)
        video_duration = clip.duration  # 取得影片總長度
        print(f"🎥 影片總長度：{video_duration} 秒")

        # 確保裁剪不超過影片時長
        end = min(start + CLIP_LENGTH, video_duration)
        print(f"🔪 設定裁剪範圍：{start} 秒 ~ {end} 秒")

        # 執行裁剪
        subclip = clip.subclip(start, end)
        subclip.write_videofile(local_output, codec="libx264", audio_codec="aac")
        subclip.close()
        print("✅ 裁剪完成！")

        # 檢查輸出
        if not os.path.exists(local_output):
            raise Exception("❌ MoviePy 沒有輸出裁剪後的影片！")

        # 命名新檔案
        new_filename = filename.replace(".mp4", f"-{int(start)}s-cut.mp4")
        new_s3_key = f"{user_id}/{new_filename}"

        # 上傳到 S3
        print("⬆️ 上傳裁剪後的影片到 S3...")
        s3_client.upload_file(local_output, S3_BUCKET, new_s3_key)
        print("✅ 上傳完成！")

        # 計算下一段影片的 `start`（15秒 + 5秒重疊）
        next_start = start + CLIP_LENGTH - OVERLAP
        if next_start >= video_duration:
            next_start = None  # 影片已經裁剪完畢

        # 清理暫存
        os.remove(local_input)
        os.remove(local_output)

        return {
            "message": "影片裁剪成功",
            "new_filename": new_filename,
            "new_url": f"https://{S3_BUCKET}.s3.amazonaws.com/{new_s3_key}",
            "next_start": next_start  # 告訴前端下一段的起點（如果還沒裁完）
        }

    except Exception as e:
        print(f"❌ 裁剪失敗: {str(e)}")
        raise HTTPException(status_code=500, detail=f"裁剪失敗: {str(e)}")
