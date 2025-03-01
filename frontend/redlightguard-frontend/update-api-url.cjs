const fs = require("fs");
const path = require("path");

// 你的舊 API URL（確認這是你要替換的舊網址）
const OLD_API_URL = "http://127.0.0.1:8000";
// 你的新 API 變數
const NEW_API_IMPORT = `import API_BASE_URL from "./config.js";`;
const NEW_API_URL = "API_BASE_URL";

// 設定要修改的資料夾 (src 內所有 .js 和 .jsx 檔案)
const targetDir = path.join(__dirname, "src");

// 確保 `config.js` 有被引用
function ensureConfigImport(filePath) {
    let content = fs.readFileSync(filePath, "utf-8");
    if (!content.includes("import API_BASE_URL")) {
        content = `${NEW_API_IMPORT}\n${content}`;
        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`✅ 已新增 API_BASE_URL 引用: ${filePath}`);
    }
}

// 遞迴搜尋並更新檔案
function updateFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateFiles(fullPath); // 遞迴處理子資料夾
        } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
            let content = fs.readFileSync(fullPath, "utf-8");
            if (content.includes(OLD_API_URL)) {
                // 確保有 `config.js` 引用
                ensureConfigImport(fullPath);
                // 修改舊的 API URL 為 `API_BASE_URL`
                content = content.replace(new RegExp(OLD_API_URL, "g"), `\${${NEW_API_URL}}`);
                fs.writeFileSync(fullPath, content, "utf-8");
                console.log(`✅ 已更新 API URL: ${fullPath}`);
            }
        }
    });
}

console.log("🔍 正在掃描並更新 API URL...");
updateFiles(targetDir);
console.log("🎉 API URL 更新完成！請確認修改結果。");
