#!/usr/bin/env node
/**
 * Export attendee-facing agenda PDFs.
 * Usage:
 *   npm run export:agenda                    — full 5-page experience guide
 *   npm run export:agenda:one-sheet          — single-page what to expect
 *   npm run export:agenda:jets-and-capital   — Jets & Capital cover + what to expect
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
const oneSheet = process.argv.includes('--one-sheet');
const jetsAndCapital = process.argv.includes('--jets-and-capital');

const docPath = path.join(
  root,
  oneSheet || jetsAndCapital
    ? 'src/agenda/attendee-agenda-one-sheet.html'
    : 'src/agenda/attendee-agenda.html',
);
const coverPath = path.join(root, 'src/agenda/attendee-agenda-jets-and-capital-cover.html');

const route = jetsAndCapital
  ? '/agenda-jets-and-capital-cover'
  : oneSheet
    ? '/agenda-one-sheet'
    : '/agenda';

const outDir = path.join(root, 'public/downloads');
const outFile = path.join(
  outDir,
  jetsAndCapital
    ? 'Amplify-AI-Retreat-What-to-Expect-Jets-and-Capital.pdf'
    : oneSheet
      ? 'Amplify-AI-Retreat-What-to-Expect.pdf'
      : 'Amplify-AI-Retreat-Agenda.pdf',
);

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

        if (pathname === '/agenda-one-sheet' || pathname === '/agenda-one-sheet/') {
          const html = await readFile(
            path.join(root, 'src/agenda/attendee-agenda-one-sheet.html'),
            'utf-8',
          );
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        }

        if (pathname === '/agenda-jets-and-capital-cover' || pathname === '/agenda-jets-and-capital-cover/') {
          const html = await readFile(coverPath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        }

        if (pathname === '/agenda' || pathname === '/agenda/') {
          const html = await readFile(docPath, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          return;
        }

        if (pathname === '/') {
          res.writeHead(302, { Location: `${route}/` });
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

async function renderPdf(page, url, viewport) {
  if (viewport) {
    await page.setViewportSize(viewport);
  }

  await page.goto(url, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(2500);

  return page.pdf({
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
}

async function main() {
  console.log('Starting export server…');
  const { server, port } = await startStaticServer();
  const baseUrl = `http://127.0.0.1:${port}`;
  const oneSheetViewport = { width: 816, height: 1056 };

  console.log('Launching browser…');
  const browser = await chromium.launch();
  const page = await browser.newPage(
    oneSheet || jetsAndCapital ? { viewport: oneSheetViewport } : undefined,
  );

  await mkdir(outDir, { recursive: true });

  let pdfBuffer;

  if (jetsAndCapital) {
    console.log('Rendering Jets & Capital cover page…');
    const coverPdf = await renderPdf(
      page,
      `${baseUrl}/agenda-jets-and-capital-cover/`,
      oneSheetViewport,
    );

    console.log('Rendering What to Expect content page…');
    const contentPdf = await renderPdf(
      page,
      `${baseUrl}/agenda-one-sheet/`,
      oneSheetViewport,
    );

    const merged = await PDFDocument.create();
    const coverDoc = await PDFDocument.load(coverPdf);
    const contentDoc = await PDFDocument.load(contentPdf);

    const coverPages = await merged.copyPages(coverDoc, coverDoc.getPageIndices());
    coverPages.forEach((p) => merged.addPage(p));

    const contentPages = await merged.copyPages(contentDoc, contentDoc.getPageIndices());
    contentPages.forEach((p) => merged.addPage(p));

    pdfBuffer = Buffer.from(await merged.save());
    await writeFile(outFile, pdfBuffer);
  } else {
    pdfBuffer = await renderPdf(page, `${baseUrl}${route}/`);
    await writeFile(outFile, pdfBuffer);
  }

  await browser.close();
  server.close();

  const mb = (pdfBuffer.length / (1024 * 1024)).toFixed(1);
  console.log(`\nDone: ${outFile} (${mb} MB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
