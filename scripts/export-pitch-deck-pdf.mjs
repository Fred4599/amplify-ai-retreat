#!/usr/bin/env node
/**
 * Export the HTML sales deck to a multi-page PDF (one slide per page, 16:9).
 * Usage: npm run export:deck
 * Output: public/downloads/Amplify-AI-Retreat-Sales-Deck.pdf
 */
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const deckPath = path.join(root, 'src/deck/sales-deck.html');
const outDir = path.join(root, 'public/downloads');
const outFile = path.join(outDir, 'Amplify-AI-Retreat-Sales-Deck.pdf');

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
        let pathname = decodeURIComponent(url.pathname);

        if (pathname === '/pitch-deck' || pathname === '/pitch-deck/') {
          const html = await readFile(deckPath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        }

        if (pathname === '/') {
          res.writeHead(302, { Location: '/pitch-deck/' });
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
  const url = `http://127.0.0.1:${port}/pitch-deck/`;

  console.log('Launching browser…');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForTimeout(1500);

  await mkdir(outDir, { recursive: true });

  console.log('Rendering PDF…');
  await page.pdf({
    path: outFile,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  server.close();

  console.log(`\nDone: ${outFile}`);
  console.log(`Share: /downloads/Amplify-AI-Retreat-Sales-Deck.pdf`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
