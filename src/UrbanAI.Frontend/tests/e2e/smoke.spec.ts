import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical Path Validation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/UrbanAI/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to OAuth login', async ({ page }) => {
    await page.goto('/');
    
    // Look for OAuth login elements
    const microsoftButton = page.getByText(/Microsoft/i);
    const googleButton = page.getByText(/Google/i);
    
    // At least one OAuth provider should be visible
    const hasOAuthProvider = await microsoftButton.isVisible().catch(() => false) || 
                            await googleButton.isVisible().catch(() => false);
    
    expect(hasOAuthProvider).toBe(true);
  });

  test('should handle basic navigation without errors', async ({ page }) => {
    // Start from home page
    await page.goto('/');
    
    // Should not have any console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate around basic routes
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that no critical errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('dev server') &&
      !error.includes('HMR')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds (generous for smoke test)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Basic check that page renders on mobile
    await expect(page.locator('body')).toBeVisible();
    
    // Should not have horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    const viewportWidth = await page.viewportSize();
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth?.width || 375);
  });
});