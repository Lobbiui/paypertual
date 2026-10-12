import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 8080);
const publicDirectory = resolve(fileURLToPath(new URL('./dist/', import.meta.url)));

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  try {
    const requestUrl = new URL(request.url || '/', 'http://localhost');
    const pathname = decodeURIComponent(requestUrl.pathname);
    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = resolve(publicDirectory, relativePath);

    if (filePath !== publicDirectory && !filePath.startsWith(`${publicDirectory}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) throw new Error('Not a file');

    const extension = extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'Content-Length': fileInfo.size,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; form-action 'self' mailto:; base-uri 'self'; frame-ancestors 'none'",
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=604800'
    };

    response.writeHead(200, headers);
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff'
    }).end('Not found');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Payperpetual is listening on port ${port}`);
});
