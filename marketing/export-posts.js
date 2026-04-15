const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const INPUT_DIR = path.join(__dirname, 'instagram');
const OUTPUT_DIR = path.join(__dirname, 'instagram', 'exports');

async function exportPosts() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.html')).sort();
  console.log(`Found ${files.length} HTML posts to export...\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const file of files) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });

    const filePath = path.join(INPUT_DIR, file);
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 500));

    const outputName = file.replace('.html', '.jpg');
    const outputPath = path.join(OUTPUT_DIR, outputName);

    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 95,
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
    });

    console.log(`✓ ${outputName}`);
    await page.close();
  }

  await browser.close();
  console.log(`\nDone! ${files.length} JPGs exported to: ${OUTPUT_DIR}`);
}

exportPosts().catch(err => {
  console.error('Export failed:', err.message);
  process.exit(1);
});
