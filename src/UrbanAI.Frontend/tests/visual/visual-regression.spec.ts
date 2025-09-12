import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for UrbanAI Frontend
 * Compares implementation screenshots with HTML mockup references
 * 
 * Prerequisites:
 * 1. Reference screenshots must be captured from HTML mocks
 * 2. Run: node .claude/scripts/capture-reference-screenshots.js
 */

test.describe('Visual Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for visual testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Login Page - Visual Comparison', async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare with reference
    await expect(page).toHaveScreenshot('login-page-desktop.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
    
    // Test mobile responsive design
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('login-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });

  test('Dashboard - Visual Comparison', async ({ page }) => {
    // Mock authenticated state or navigate to dashboard
    await page.goto('/dashboard');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare with reference
    await expect(page).toHaveScreenshot('dashboard-page-desktop.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
    
    // Test mobile responsive design
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('dashboard-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });

  test('GDPR Compliance Page - Visual Comparison', async ({ page }) => {
    await page.goto('/privacy/cookie-policy');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('gdpr-compliance-page-desktop.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('gdpr-compliance-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });

  test('GDPR Data Management - Visual Comparison', async ({ page }) => {
    await page.goto('/privacy/data-management');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('gdpr-data-management-desktop.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('gdpr-data-management-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });

  test('Component Interactive States', async ({ page }) => {
    await page.goto('/');
    
    // Test button hover states
    const loginButton = page.locator('button[type="submit"], .cta-button').first();
    await loginButton.hover();
    await expect(loginButton).toHaveScreenshot('button-hover-state.png');
    
    // Test focus states
    await loginButton.focus();
    await expect(loginButton).toHaveScreenshot('button-focus-state.png');
    
    // Test form input states
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.count() > 0) {
      await emailInput.focus();
      await expect(emailInput).toHaveScreenshot('input-focus-state.png');
      
      // Test validation states
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      await expect(emailInput).toHaveScreenshot('input-error-state.png');
    }
  });

  test('Cross-Browser Compatibility', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take browser-specific screenshots
    await expect(page).toHaveScreenshot(`login-${browserName}.png`, {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
    });
  });
});