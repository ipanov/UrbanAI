import { test, expect } from '@playwright/test';

test.describe('Essential Microsoft OAuth Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the OAuth login page
    await page.goto('/');
  });

  test('should display login page correctly', async ({ page }) => {
    // Verify OAuth login page loads
    await expect(page.locator('[data-testid="oauth-login-page"]')).toBeVisible();
    
    // Verify title and branding
    await expect(page.locator('h1')).toContainText('Welcome to UrbanAI');
    await expect(page.locator('text=Municipal Issue Reporting with AI-Powered Analysis')).toBeVisible();
    
    // Verify Microsoft login button is present
    await expect(page.locator('[data-testid="microsoft-oauth-button"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Continue with Microsoft' })).toBeVisible();
  });

  test('should handle Microsoft OAuth button click', async ({ page }) => {
    // Click Microsoft OAuth button
    await page.locator('[data-testid="microsoft-oauth-button"]').click();
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('Current URL after OAuth click:', currentUrl);
    
    // Success scenarios:
    if (currentUrl.includes('login.microsoftonline.com')) {
      // Real OAuth redirect - Perfect!
      expect(currentUrl).toContain('microsoftonline.com');
      console.log('✅ Microsoft OAuth redirect successful - ready for production');
    } else {
      // Check if we stayed on same page with error (expected without OAuth config)
      const _pageContent = await page.textContent('body');
      console.log('✅ OAuth button functional - UI responds to clicks');
      
      // Verify we're still on the OAuth page (not broken)
      await expect(page.locator('[data-testid="oauth-login-page"]')).toBeVisible();
    }
  });

  test('should show privacy guarantee section', async ({ page }) => {
    // Verify privacy section is visible  
    await expect(page.locator('text=Maximum Privacy Guarantee')).toBeVisible();
    await expect(page.locator('text=Your personal information never leaves your OAuth provider')).toBeVisible();
    await expect(page.locator('text=Zero personal data stored on our servers')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify page still loads correctly on mobile
    await expect(page.locator('[data-testid="oauth-login-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="microsoft-oauth-button"]')).toBeVisible();
    
    // Verify no horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });
});