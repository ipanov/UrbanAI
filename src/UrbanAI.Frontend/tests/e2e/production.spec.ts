import { test, expect } from '@playwright/test';

test.describe('Production Validation - Embedded Browser Testing', () => {
  test('should work correctly in embedded Chromium', async ({ page }) => {
    // This test runs with embedded Chromium only (per CLAUDE.md guidelines)
    await page.goto('/');
    
    // Verify page loads correctly in embedded browser
    await expect(page).toHaveTitle(/UrbanAI/);
    
    // Check basic browser functionality
    const userAgent = await page.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Chrome'); // Embedded Chromium still reports as Chrome
    
    // Basic functionality test in embedded browser
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle media codecs in embedded browser', async ({ page }) => {
    await page.goto('/');
    
    // Test media functionality in embedded Chromium
    const hasMediaSupport = await page.evaluate(() => {
      const video = document.createElement('video');
      return !!(video.canPlayType && video.canPlayType('video/mp4'));
    });
    
    expect(hasMediaSupport).toBe(true);
  });

  test('should validate local storage functionality', async ({ page, context }) => {
    // Test local storage in embedded browser environment
    await page.goto('/');
    
    // Check that cookies and local storage work in embedded browser
    await page.evaluate(() => {
      localStorage.setItem('test', 'value');
    });
    
    const stored = await page.evaluate(() => localStorage.getItem('test'));
    expect(stored).toBe('value');
    
    // Cleanup
    await page.evaluate(() => {
      localStorage.removeItem('test');
    });
  });
});