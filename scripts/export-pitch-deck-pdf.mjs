#!/usr/bin/env node
/**
 * Export the HTML sales deck to PDF — one screenshot per slide (matches live deck).
 * Usage: npm run export:deck
 * Output: public/downloads/Amplify-AI-Retreat-Sales-Deck.pdf
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const deckPath = path.join(root, 'src/deck/sales-deck.html');
const outDir = path.join(root, 'public/downloads');
const outFile = path.join(outDir, 'Amplify-AI-Retreat-Sales-Deck.pdf');

const VIEWPORT = { width: 1920, height: 1080 };

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
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForTimeout(800);

  await page.evaluate(() => {
    document.body.classList.add('pdf-export');
  });

  const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
  const pdfDoc = await PDFDocument.create();

  console.log(`Capturing ${total} slides at ${VIEWPORT.width}×${VIEWPORT.height}…`);

  for (let i = 1; i <= total; i++) {
    await page.evaluate((n) => {
      if (typeof showSlide === 'function') showSlide(n);

      const slide = document.querySelector('.slide.active');
      const content = slide?.querySelector('.slide-content');
      if (!content) return;

      content.style.transform = 'none';
      content.style.maxHeight = 'none';

      const pad = 56;
      const availH = slide.clientHeight - pad;
      const availW = slide.clientWidth - pad;
      const scale = Math.min(1, availH / content.scrollHeight, availW / content.scrollWidth);

      if (scale < 0.98) {
        content.style.transform = `scale(${scale})`;
        content.style.transformOrigin = 'center center';
      }
    }, i);

    await page.waitForTimeout(350);

    const png = await page.screenshot({ type: 'png', animations: 'disabled' });
    const image = await pdfDoc.embedPng(png);
    const w = image.width;
    const h = image.height;
    const pdfPage = pdfDoc.addPage([w, h]);
    pdfPage.drawImage(image, { x: 0, y: 0, width: w, height: h });

    console.log(`  ✓ Slide ${i}/${total}`);
  }

  await mkdir(outDir, { recursive: true });
  const pdfBytes = await pdfDoc.save();
  await writeFile(outFile, pdfBytes);

  await browser.close();
  server.close();

  const mb = (pdfBytes.length / (1024 * 1024)).toFixed(1);
  console.log(`\nDone: ${outFile} (${mb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
