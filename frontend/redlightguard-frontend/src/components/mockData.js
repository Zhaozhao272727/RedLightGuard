export const mockUsers = [
  {
    id: "user-001",
    username: "flyfly27272727272727",
    email: "flyfly27272727272727@gmail.com",
    password: "111111",  // ⚠️ 這只是測試假資料，正式環境不要存明文密碼！
    created_at: "2025-03-05T04:40:00Z"
  }
];

export const mockUploads = [
  {
    id: "video-001",
    user_id: "user-001",
    filename: "utomp3.com - 闖闖闖闖闖紅燈.mp4",
    url: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119419/x2kwveo5g8j1wwwgkbty.mp4",
    downloadUrl: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119419/x2kwveo5g8j1wwwgkbty.mp4",
    status: "Red Light Violation",
    uploaded_at: "2025-03-05T04:45:00Z",
    thumbnail: "https://via.placeholder.com/150" // ⚠️ 這裡可以換成 Cloudinary 影片縮略圖
  },
  {
    id: "video-002",
    user_id: "user-001",
    filename: "utomp3.com - 這紅綠燈會引誘人闖紅燈.mp4",
    url: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/ef3xpgef3hyfkcorpcdy.mp4",
    downloadUrl: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/ef3xpgef3hyfkcorpcdy.mp4",
    status: "Red Light Violation",
    uploaded_at: "2025-03-05T04:50:00Z",
    thumbnail: "https://via.placeholder.com/150"
  },
  {
    id: "video-003",
    user_id: "user-001",
    filename: "『療癒片』記得禮讓行人.mp4",
    url: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/ef3xpgef3hyfkcorpcdy.mp4",
    downloadUrl: "https://res.cloudinary.com/dsot3yynx/video/upload/v1741119420/nwljx7iljyq8addtdwx0.mp4",
    status: "No Red Light",
    uploaded_at: "2025-03-05T04:55:00Z",
    thumbnail: "https://via.placeholder.com/150"
  }
];
