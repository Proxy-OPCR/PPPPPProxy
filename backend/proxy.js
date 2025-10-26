import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (X11; Linux x86_64)"
];

function randomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URL is required');

  try {
    const headers = { 'User-Agent': randomUserAgent() };
    const response = await fetch(targetUrl, { headers });
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send('Error fetching URL: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
