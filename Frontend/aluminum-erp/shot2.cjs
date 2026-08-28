const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile view
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: '/home/claude/mobile.png' });
  // Open drawer
  await mobilePage.click('button[aria-label="فتح القائمة"]');
  await mobilePage.waitForTimeout(400);
  await mobilePage.screenshot({ path: '/home/claude/mobile-drawer.png' });

  // Desktop collapsed sidebar
  const desktopPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await desktopPage.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(300);
  await desktopPage.click('button[aria-label="طي / فتح القائمة"]');
  await desktopPage.waitForTimeout(400);
  await desktopPage.screenshot({ path: '/home/claude/collapsed.png' });

  await browser.close();
})();
