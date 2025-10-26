// backend/server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ランダムUser-Agent
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (X11; Linux x86_64)"
];
function randomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// トップページ（UI + 背景）
app.get('/', (req, res) => {
  res.send(`
  <html>
    <head>
      <title>AI Proxy</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: linear-gradient(to right, #1f1c2c, #928dab);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          flex-direction: column;
          text-align: center;
        }
        input, button {
          padding: 10px;
          margin: 5px;
          border-radius: 5px;
          border: none;
        }
        button {
          background-color: #ff6b6b;
          color: white;
          cursor: pointer;
        }
        a {
          color: #ffd700;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>AI Proxy Server</h1>
      <p>プロキシURL: <code>/proxy?url=対象URL</code></p>
      <p>AIテスト: <code>/ai?prompt=質問内容</code></p>
    </body>
  </html>
  `);
});

// プロキシエンドポイント
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URL is required');

  try {
    const headers = { 'User-Agent': randomUserAgent() };
    const response = await fetch(targetUrl, { headers });
    let body = await response.text();

    // iframeブロック回避
    body = body.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '');
    body = body.replace(/<meta http-equiv="X-Frame-Options"[^>]*>/gi, '');

    res.send(body);
  } catch (err) {
    res.status(500).send('Error fetching URL: ' + err.message);
  }
});

// 簡易AIエンドポイント（API不要）
app.get('/ai', (req, res) => {
  const prompt = req.query.prompt || 'こんにちは';
  
  // 本格AIではなく簡易サンプル応答
  const responseText = `あなたの質問: "${prompt}" に対して、AIはこう答えます: "これはサンプル応答です。AI機能を拡張可能です。"`;
  
  res.send(responseText);
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
