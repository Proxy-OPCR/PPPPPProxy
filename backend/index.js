import express from "express";
import httpProxy from "http-proxy";

const app = express();
const proxy = httpProxy.createProxyServer({});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("PPPPPProxy Server is running ✅");
});

// 任意のターゲットにプロキシ
app.use("/proxy", (req, res) => {
  const target = req.query.url;
  if (!target) return res.status(400).send("Missing 'url' parameter");
  proxy.web(req, res, { target, changeOrigin: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
