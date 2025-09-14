const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/unified-web-landing-page.html');

  // Scroll to footer
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Wait for scroll to complete
  await page.waitForTimeout(1000);

  // Take screenshot of viewport (which should now show footer)
  await page.screenshot({ path: 'footer-validation.png' });

  await browser.close();
})();