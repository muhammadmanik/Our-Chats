import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

function serve(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

http.createServer((req, res) => {
  let url = req.url.split('?')[0];

  if (url === '/') {
    return serve(res, path.join(DIST, 'index.html'));
  }

  // Try dist folder first (react built assets)
  const distPath = path.join(DIST, url);
  if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
    return serve(res, distPath);
  }

  // Fallback to root directory (media files)
  const rootPath = path.join(ROOT, url);
  if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
    return serve(res, rootPath);
  }

  // SPA fallback
  serve(res, path.join(DIST, 'index.html'));
}).listen(PORT, () => {
  console.log(`Chat app running at http://localhost:${PORT}`);
});
