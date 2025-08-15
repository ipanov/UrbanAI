import { test, expect } from '@playwright/test';

test.describe('OAuth Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/');
  });

  test('displays OAuth login options', async ({ page }) => {
    // Check that all OAuth provider buttons are visible
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByText('Continue with Microsoft')).toBeVisible();
    await expect(page.getByText('Continue with Facebook')).toBeVisible();
  });

  test('shows legal agreement modal when OAuth button is clicked', async ({ page }) => {
    // Click Google OAuth button
    await page.getByText('Continue with Google').click();
    
    // Verify legal agreement modal appears
    await expect(page.getByText('Before creating your account')).toBeVisible();
    await expect(page.getByText('I accept — Create my anonymous account')).toBeVisible();
    await expect(page.getByText('Cancel')).toBeVisible();
  });

  test('can accept legal agreement', async ({ page }) => {
    // Click Microsoft OAuth button
    await page.getByText('Continue with Microsoft').click();
    
    // Accept legal agreement
    await page.getByText('I accept — Create my anonymous account').click();
    
    // Modal should close
    await expect(page.getByText('Before creating your account')).not.toBeVisible();
  });

  test('can decline legal agreement', async ({ page }) => {
    // Click Facebook OAuth button
    await page.getByText('Continue with Facebook').click();
    
    // Decline legal agreement
    await page.getByText('Cancel').click();
    
    // Modal should close
    await expect(page.getByText('Before creating your account')).not.toBeVisible();
  });

  test('displays UrbanAI branding', async ({ page }) => {
    await expect(page.getByText('UrbanAI')).toBeVisible();
    await expect(page.getByText('Municipal Issue Reporting with AI-Powered Analysis')).toBeVisible();
  });

  test('OAuth buttons have proper accessibility attributes', async ({ page }) => {
    const googleButton = page.getByRole('button', { name: /continue with google/i });
    const microsoftButton = page.getByRole('button', { name: /continue with microsoft/i });
    const facebookButton = page.getByRole('button', { name: /continue with facebook/i });
    
    await expect(googleButton).toBeVisible();
    await expect(microsoftButton).toBeVisible();
    await expect(facebookButton).toBeVisible();
  });

  test('supports keyboard navigation', async ({ page }) => {
    // Tab through OAuth buttons
    await page.keyboard.press('Tab');
    await expect(page.getByText('Continue with Google')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByText('Continue with Microsoft')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByText('Continue with Facebook')).toBeFocused();
  });

  test('legal modal supports keyboard interaction', async ({ page }) => {
    // Open legal modal
    await page.getByText('Continue with Google').click();
    
    // Tab to Cancel button
    await page.keyboard.press('Tab');
    await expect(page.getByText('Cancel')).toBeFocused();
    
    // Tab to Accept button
    await page.keyboard.press('Tab');
    await expect(page.getByText('I accept — Create my anonymous account')).toBeFocused();
    
    // Enter should trigger accept
    await page.keyboard.press('Enter');
    await expect(page.getByText('Before creating your account')).not.toBeVisible();
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Check that OAuth buttons are still visible and clickable
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByText('Continue with Microsoft')).toBeVisible();
    await expect(page.getByText('Continue with Facebook')).toBeVisible();
    
    // Test modal on mobile
    await page.getByText('Continue with Google').click();
    await expect(page.getByText('Before creating your account')).toBeVisible();
  });

  test('handles provider-specific branding', async ({ page }) => {
    // Check for Google branding
    await page.getByText('Continue with Google').click();
    await expect(page.getByText(/You are signing in with Google/)).toBeVisible();
    await page.getByText('Cancel').click();
    
    // Check for Microsoft branding
    await page.getByText('Continue with Microsoft').click();
    await expect(page.getByText(/You are signing in with Microsoft/)).toBeVisible();
    await page.getByText('Cancel').click();
    
    // Check for Facebook branding
    await page.getByText('Continue with Facebook').click();
    await expect(page.getByText(/You are signing in with Facebook/)).toBeVisible();
  });
});
