import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.ttf': 'font/ttf',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://localhost:${port}`);
      if (url.pathname === '/__mobile') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          '<!doctype html><html lang="it"><title>Open Taboo · anteprima telefono</title><body style="margin:0;background:#160b24;display:flex;justify-content:center;align-items:center;min-height:100vh"><iframe title="Open Taboo, telefono 390 × 844" src="/" style="width:390px;height:844px;max-height:98vh;border:1px solid #725384;border-radius:24px;background:#291148"></iframe></body></html>',
        );
        return;
      }
      const requested = resolve(root, '.' + decodeURIComponent(url.pathname));
      if (requested !== root && !requested.startsWith(root + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      let file = requested;
      try {
        if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      } catch {
        file = resolve(root, 'index.html');
      }
      const bytes = await readFile(file);
      res.writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(bytes);
    } catch {
      res.writeHead(404);
      res.end('Esporta prima il progetto: npm run export:web');
    }
  })
  .listen(port, '127.0.0.1', () =>
    console.log(
      `Open Taboo: http://localhost:${port}\nTelefono: http://localhost:${port}/__mobile`,
    ),
  );
