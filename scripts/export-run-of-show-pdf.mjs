#!/usr/bin/env node
/**
 * Export the internal run-of-show HTML to a branded PDF.
 * Usage: npm run export:run-of-show
 * Output: internal/Amplify-AI-Retreat-Run-of-Show.pdf
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docPath = path.join(root, 'src/internal/run-of-show.html');
const outDir = path.join(root, 'internal');
const outFile = path.join(outDir, 'Amplify-AI-Retreat-Run-of-Show.pdf');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        const pathname = decodeURIComponent(url.pathname);

        if (pathname === '/run-of-show' || pathname === '/run-of-show/') {
          const html = await readFile(docPath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        }

        if (pathname === '/') {
          res.writeHead(302, { Location: '/run-of-show/' });
          res.end();
          return;
        }

        const filePath = path.join(root, 'public', pathname);
        if (!filePath.startsWith(path.join(root, 'public')) || !existsSync(filePath)) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
        createReadStream(filePath).pipe(res);
      } catch {
        res.writeHead(500);
        res.end('Server error');
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  console.log('Starting export server…');
  const { server, port } = await startStaticServer();
  const url = `http://127.0.0.1:${port}/run-of-show/`;

  console.log('Launching browser…');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(2500);

  await mkdir(outDir, { recursive: true });

  const pdfBuffer = await page.pdf({
    path: outFile,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  server.close();

  const mb = (pdfBuffer.length / (1024 * 1024)).toFixed(1);
  console.log(`\nDone: ${outFile} (${mb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
