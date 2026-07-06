#!/usr/bin/env node
/**
 * Screenshot the homepage hero for Open Graph / Twitter cards.
 * Usage: npm run generate:og
 * Output: public/media/og-image.webp (1200×630)
 */
import { createServer } from 'node:http';
import { mkdir, unlink } from 'node:fs/promises';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const outDir = path.join(root, 'public/media');
const outFile = path.join(outDir, 'og-image.webp');
const tmpPng = path.join(outDir, '.og-image-tmp.png');

const VIEWPORT = { width: 1200, height: 630 };

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
};

function resolveDistPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const safePath = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, '');
  const base = path.join(distDir, safePath);

  if (!base.startsWith(distDir)) return null;

  if (decoded.endsWith('/')) {
    const indexPath = path.join(base, 'index.html');
    if (existsSync(indexPath)) return indexPath;
    return null;
  }

  if (existsSync(base) && statSync(base).isFile()) return base;

  const withHtml = `${base}.html`;
  if (existsSync(withHtml)) return withHtml;

  const indexPath = path.join(base, 'index.html');
  if (existsSync(indexPath)) return indexPath;

  return null;
}

function startStaticServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url ?? '/', 'http://127.0.0.1');
        const filePath = resolveDistPath(url.pathname);

        if (!filePath) {
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

  console.log('Building site…');
  execFileSync('npx', ['astro', 'build'], { cwd: root, stdio: 'inherit' });

  console.log('Starting preview server…');
  const { server, port } = await startStaticServer();
  const url = `http://127.0.0.1:${port}/`;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: VIEWPORT });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector('#hero', { state: 'visible' });
    await page.waitForFunction(() => {
      const img = document.querySelector('#hero img');
      return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
    });
    await page.waitForTimeout(300);

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
