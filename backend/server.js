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

// ランダムUser-Agentでブロック回避
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (X11; Linux x86_64)"
];
function randomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// トップアクセス時
app.get('/', (req, res) => {
  res.send(`
    <h2>Proxy server is running!</h2>
    <p>Use <code>/proxy?url=対象URL</code> to access websites.</p>
  `);
});

// プロキシ
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

// サーバー起動
app.listen(PORT, () => {
  console.log(`Proxy server running at port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, #00c6ff, #0072ff);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          }
          a {
            color: #fff;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>AI Proxy Server</h1>
        <p>Use <a href="/proxy?url=https://example.com">/proxy?url=対象URL</a> to access websites</p>
      </body>
    </html>
  `);
});
