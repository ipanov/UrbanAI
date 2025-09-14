const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8080/unified-web-landing-page.html');

  // Scroll to footer
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Wait for scroll animation
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'footer-logo-validation.png' });

  await browser.close();
  console.log('Footer screenshot captured successfully');
})();