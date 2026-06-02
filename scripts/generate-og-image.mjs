#!/usr/bin/env node
/**
 * Render hero-style social share image (Open Graph / Twitter card).
 * Usage: npm run generate:og
 * Output: public/media/og-image.webp (1200×630)
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, unlink } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const templatePath = path.join(root, 'src/og/social-share.html');
const outDir = path.join(root, 'public/media');
const outFile = path.join(outDir, 'og-image.webp');
const tmpPng = path.join(outDir, '.og-image-tmp.png');

const VIEWPORT = { width: 1200, height: 630 };

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        const pathname = decodeURIComponent(url.pathname);

        if (pathname === '/og' || pathname === '/og/') {
          const html = await readFile(templatePath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
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
  await mkdir(outDir, { recursive: true });

  console.log('Starting OG render server…');
  const { server, port } = await startStaticServer();
  const url = `http://127.0.0.1:${port}/og/`;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: VIEWPORT });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    await page.screenshot({ path: tmpPng, type: 'png' });
    await browser.close();

    execFileSync(
      ffmpegPath,
      ['-y', '-i', tmpPng, '-vf', 'scale=1200:630', '-quality', '88', outFile],
      { stdio: 'inherit' },
    );
    await unlink(tmpPng).catch(() => {});

    console.log(`Wrote ${path.relative(root, outFile)}`);
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
