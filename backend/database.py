import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 讀取 .env
load_dotenv()

# Supabase API 連線資訊
SUPABASE_URL = "https://ihwwtqduzpfwynqojcln.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # 記得在 .env 裡面加上 SUPABASE_KEY

# 建立 Supabase 客戶端
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 測試從 users 這張表讀取資料
try:
    response = supabase.table("users").select("*").execute()
    print("✅ 成功連接 Supabase！")
    print(response)
except Exception as e:
    print("⚠️  連接資料庫失敗：", e)
