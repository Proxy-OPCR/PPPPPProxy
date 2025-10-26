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

// トップURLアクセス用HTML
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AI Proxy</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to right, #1f1c2c, #928dab);
            color: white;
            text-align: center;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>Proxy server is running!</h1>
        <p>Use <code>/proxy?url=対象URL</code> to access websites.</p>
      </body>
    </html>
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
    body
