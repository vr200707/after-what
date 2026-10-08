import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./site/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = resolve(root, '.' + (pathname.endsWith('/') ? pathname+'index.html' : pathname));
    if (!target.startsWith(root.endsWith(sep) ? root : root+sep)) { response.writeHead(403);response.end('Forbidden');return; }
    const contents = await readFile(target);
    response.writeHead(200, {'Content-Type':mime[extname(target)] || 'application/octet-stream','Cache-Control':'no-cache'});
    response.end(contents);
  } catch { response.writeHead(404);response.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Story board: http://127.0.0.1:${port}`));
