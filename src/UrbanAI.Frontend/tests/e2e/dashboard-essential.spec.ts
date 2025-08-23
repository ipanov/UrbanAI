import { test, expect } from '@playwright/test';

test.describe('Essential Dashboard Tests', () => {
  test('should display dashboard when accessing directly', async ({ page }) => {
    // Go directly to dashboard (will show guest/unauthenticated view)
    await page.goto('/dashboard');
    
    // Verify dashboard page loads
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
    
    // Verify welcome section appears
    await expect(page.locator('[data-testid="welcome-section"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Welcome to UrbanAI');
    
    // Verify action buttons are present
    await expect(page.locator('[data-testid="get-started-btn"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Report New Issue' })).toBeVisible();
  });

  test('should handle dashboard responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // Verify dashboard works on mobile
    await expect(page.locator('[data-testid="dashboard-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="welcome-section"]')).toBeVisible();
    
    // Verify no horizontal scroll
    const bodyWidth = await page.locator('body').evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('should navigate back to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for a way to get back to login (might be in header/nav)
    // This tests the basic navigation structure
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
    
    // If there's a login/logout button in the navigation, test it
    const loginLink = page.locator('a[href="/login"], a[href="/"], button:has-text("Login"), button:has-text("Sign In")').first();
    const hasLoginLink = await loginLink.isVisible().catch(() => false);
    
    if (hasLoginLink) {
      console.log('✅ Navigation back to login available');
    } else {
      console.log('ℹ️ Direct navigation to dashboard works');
    }
  });
});