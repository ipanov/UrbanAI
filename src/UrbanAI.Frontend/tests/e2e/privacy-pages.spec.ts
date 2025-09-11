import { test, expect } from '@playwright/test';

test.describe('Privacy Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8080/app');
  });

  test('should navigate to cookie policy page', async ({ page }) => {
    // Navigate to cookie policy page
    await page.goto('http://localhost:8080/app/privacy/cookies');

    // Check page title and content
    await expect(page).toHaveTitle(/UrbanAI/);
    await expect(page.locator('h1')).toContainText('Cookie Policy');

    // Check main sections
    await expect(page.locator('text=Cookie Usage at a Glance')).toBeVisible();
    await expect(page.locator('text=Essential Cookies Only:')).toBeVisible();
    await expect(page.locator('text=Your Control:')).toBeVisible();
    await expect(page.locator('text=Privacy-First:')).toBeVisible();

    // Check table of contents
    await expect(page.locator('text=Contents')).toBeVisible();
    await expect(page.locator('text=1. What Are Cookies')).toBeVisible();
    await expect(page.locator('text=2. Cookies We Use')).toBeVisible();

    // Check cookie categories
    await expect(page.locator('text=Essential Cookies (Always Active)')).toBeVisible();
    await expect(page.locator('text=urbanai_session')).toBeVisible();
    await expect(page.locator('text=urbanai_csrf')).toBeVisible();

    // Check functional cookies
    await expect(page.locator('text=Functional Cookies (Optional)')).toBeVisible();
    await expect(page.locator('text=urbanai_theme')).toBeVisible();
    await expect(page.locator('text=urbanai_lang')).toBeVisible();

    // Check third-party services
    await expect(page.locator('text=OAuth Providers')).toBeVisible();
    await expect(page.locator('text=Microsoft, Google, Facebook')).toBeVisible();

    // Check contact information
    await expect(page.locator('text=privacy@urbanai.site')).toBeVisible();
    await expect(page.locator('text=cookies@urbanai.site')).toBeVisible();
    await expect(page.locator('text=dpo@urbanai.site')).toBeVisible();

    // Check navigation links
    await expect(page.locator('text=← Back to Home')).toBeVisible();
    await expect(page.locator('text=Privacy Policy →')).toBeVisible();
  });

  test('should navigate to GDPR data management page', async ({ page }) => {
    // Navigate to GDPR data management page
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Check page title and content
    await expect(page).toHaveTitle(/UrbanAI/);
    await expect(page.locator('h1')).toContainText('My Data & Privacy');

    // Check tabs
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=My Data')).toBeVisible();
    await expect(page.locator('text=My Issues')).toBeVisible();
    await expect(page.locator('text=Export Data')).toBeVisible();
    await expect(page.locator('text=Delete Account')).toBeVisible();

    // Check overview tab content (default)
    await expect(page.locator('text=Your Privacy Rights')).toBeVisible();
    await expect(page.locator('text=Data Processing Summary')).toBeVisible();
    await expect(page.locator('text=Zero-PII Architecture')).toBeVisible();
  });

  test('should switch between GDPR data management tabs', async ({ page }) => {
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Click on My Data tab
    await page.locator('text=My Data').click();
    await expect(page.locator('text=Account Information')).toBeVisible();
    await expect(page.locator('text=OAuth Provider Links')).toBeVisible();
    await expect(page.locator('text=Client-Side Data')).toBeVisible();

    // Click on My Issues tab
    await page.locator('text=My Issues').click();
    await expect(page.locator('text=Issues You\'ve Reported')).toBeVisible();
    await expect(page.locator('text=ISS-2024-001')).toBeVisible();
    await expect(page.locator('text=ISS-2024-002')).toBeVisible();
    await expect(page.locator('text=ISS-2024-003')).toBeVisible();

    // Click on Export Data tab
    await page.locator('text=Export Data').click();
    await expect(page.locator('text=Export Your Data')).toBeVisible();
    await expect(page.locator('text=Download My Data')).toBeVisible();
    await expect(page.locator('text=Export Client-Side Data')).toBeVisible();

    // Click on Delete Account tab
    await page.locator('text=Delete Account').click();
    await expect(page.locator('text=Delete My Account')).toBeVisible();
    await expect(page.locator('text=What happens when you delete your account:')).toBeVisible();
  });

  test('should test data export functionality', async ({ page }) => {
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Navigate to export tab
    await page.locator('text=Export Data').click();

    // Click download button (this will trigger a download)
    const downloadPromise = page.waitForEvent('download');
    await page.locator('text=Download My Data').click();
    const download = await downloadPromise;

    // Verify download was initiated
    expect(download.suggestedFilename()).toMatch(/urbanai-data-export.*\.json/);
  });

  test('should test delete account modal functionality', async ({ page }) => {
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Navigate to delete account tab
    await page.locator('text=Delete Account').click();

    // Click delete account button
    await page.locator('text=Delete My Account').click();

    // Check modal appears
    await expect(page.locator('text=Confirm Account Deletion')).toBeVisible();
    await expect(page.locator('text=Type DELETE to confirm:')).toBeVisible();

    // Type confirmation text
    await page.locator('input[placeholder="Type DELETE here"]').fill('DELETE');

    // Verify delete button is enabled
    const deleteButton = page.locator('text=Delete Account').first();
    await expect(deleteButton).toBeEnabled();

    // Close modal
    await page.locator('[data-testid="x-icon"]').click();
    await expect(page.locator('text=Confirm Account Deletion')).not.toBeVisible();
  });

  test('should test anonymize data modal functionality', async ({ page }) => {
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Navigate to delete account tab
    await page.locator('text=Delete Account').click();

    // Click anonymize button
    await page.locator('text=Anonymize My Data Only').click();

    // Check modal appears
    await expect(page.locator('text=Anonymize My Data')).toBeVisible();
    await expect(page.locator('text=What happens:')).toBeVisible();

    // Close modal
    await page.locator('[data-testid="x-icon"]').click();
    await expect(page.locator('text=Anonymize My Data')).not.toBeVisible();
  });

  test('should test cookie policy anchor navigation', async ({ page }) => {
    await page.goto('http://localhost:8080/app/privacy/cookies');

    // Click on table of contents links
    await page.locator('text=1. What Are Cookies').click();
    await expect(page.locator('#what-are-cookies')).toBeInViewport();

    await page.locator('text=2. Cookies We Use').click();
    await expect(page.locator('#cookies-we-use')).toBeInViewport();

    await page.locator('text=3. Third-Party Cookies').click();
    await expect(page.locator('#third-party-cookies')).toBeInViewport();

    await page.locator('text=4. Managing Your Cookie Preferences').click();
    await expect(page.locator('#managing-cookies')).toBeInViewport();
  });

  test('should test responsive design on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:8080/app/privacy/cookies');

    // Check that content is still accessible
    await expect(page.locator('h1')).toContainText('Cookie Policy');
    await expect(page.locator('text=Cookie Usage at a Glance')).toBeVisible();

    // Check GDPR data management page on mobile
    await page.goto('http://localhost:8080/app/gdpr-data-management');
    await expect(page.locator('h1')).toContainText('My Data & Privacy');

    // Test tab switching on mobile
    await page.locator('text=My Data').click();
    await expect(page.locator('text=Account Information')).toBeVisible();
  });

  test('should test accessibility features', async ({ page }) => {
    await page.goto('http://localhost:8080/app/privacy/cookies');

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);

    // Check for alt text on images (logos)
    const images = await page.locator('img');
    const imageCount = await images.count();
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }

    // Check GDPR page accessibility
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Check for proper button labels
    const buttons = await page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Check for focus management in modals
    await page.locator('text=Delete Account').click();
    await page.locator('text=Delete My Account').click();

    // Modal should be focusable
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible();
  });

  test('should test GDPR compliance elements', async ({ page }) => {
    await page.goto('http://localhost:8080/app/gdpr-data-management');

    // Check for GDPR rights information
    await expect(page.locator('text=📋 Access your data')).toBeVisible();
    await expect(page.locator('text=📥 Export your data')).toBeVisible();
    await expect(page.locator('text=✏️ Correct your data')).toBeVisible();
    await expect(page.locator('text=🗑️ Delete your data')).toBeVisible();

    // Check for privacy information
    await expect(page.locator('text=Zero-PII Architecture')).toBeVisible();
    await expect(page.locator('text=We don\'t store names, emails, or personal identifiers')).toBeVisible();

    // Check cookie policy GDPR compliance
    await page.goto('http://localhost:8080/app/privacy/cookies');
    await expect(page.locator('text=GDPR')).toBeVisible();
    await expect(page.locator('text=CCPA')).toBeVisible();
    await expect(page.locator('text=European Union countries (GDPR compliant)')).toBeVisible();
  });

  test('should test navigation between privacy pages', async ({ page }) => {
    // Start at cookie policy
    await page.goto('http://localhost:8080/app/privacy/cookies');

    // Navigate to privacy policy
    await page.locator('text=Privacy Policy →').click();
    await expect(page).toHaveURL('http://localhost:8080/app/privacy');

    // Navigate back to home
    await page.locator('text=← Back to Home').click();
    await expect(page).toHaveURL('http://localhost:8080/app/');

    // Navigate to GDPR data management
    await page.goto('http://localhost:8080/app/gdpr-data-management');
    await expect(page.locator('text=My Data & Privacy')).toBeVisible();
  });
});
