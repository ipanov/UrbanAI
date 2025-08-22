import { test, expect } from '@playwright/test';

test.describe('MVP: Microsoft OAuth Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the landing page
    await page.goto('http://localhost:3000');
  });

  test('should display login page with Microsoft OAuth option', async ({ page }) => {
    // Wait for the OAuth login page to load
    await expect(page.locator('[data-testid="oauth-login-page"]')).toBeVisible();
    
    // Check that Microsoft login button is present
    await expect(page.locator('button', { hasText: 'Continue with Microsoft' })).toBeVisible();
    
    // Verify page title and description
    await expect(page.locator('h1')).toContainText('Welcome to UrbanAI');
    await expect(page.locator('text=Report municipal issues and track their resolution')).toBeVisible();
  });

  test('should redirect to Microsoft OAuth when clicking Microsoft login', async ({ page }) => {
    // Click the Microsoft login button
    await page.locator('button', { hasText: 'Continue with Microsoft' }).click();
    
    // Wait for redirect to Microsoft OAuth
    await page.waitForURL(/login\.microsoftonline\.com|localhost.*\/auth\/microsoft/, { timeout: 10000 });
    
    // If we're redirected to localhost (mock scenario), verify it's the Microsoft OAuth endpoint
    const currentUrl = page.url();
    if (currentUrl.includes('localhost')) {
      expect(currentUrl).toContain('/auth/microsoft');
    } else {
      // Real Microsoft OAuth - should contain Microsoft domain
      expect(currentUrl).toContain('microsoftonline.com');
    }
  });

  test('should show dashboard with welcome tutorial for new user', async ({ page }) => {
    // Mock successful authentication by setting token
    await page.addInitScript(() => {
      // Mock localStorage with auth token for a new user
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
      // Ensure user is treated as new (no tutorial completion flag)
      localStorage.removeItem('urbanai_tutorial_completed');
      localStorage.removeItem('urbanai_welcome_issue_seen');
    });

    // Navigate directly to dashboard (simulating post-auth redirect)
    await page.goto('http://localhost:3000/dashboard');

    // Verify dashboard page loaded
    await expect(page.locator('.dashboard')).toBeVisible();
    await expect(page.locator('h1', { hasText: 'UrbanAI Dashboard' })).toBeVisible();

    // Verify welcome tutorial modal appears for new users
    await expect(page.locator('.tutorial-modal')).toBeVisible();
    await expect(page.locator('.tutorial-content h3')).toContainText('Welcome to UrbanAI');
    
    // Check tutorial progress (should be step 1 of 5)
    await expect(page.locator('.tutorial-progress')).toContainText('Step 1 of 5');
  });

  test('should navigate through welcome tutorial steps', async ({ page }) => {
    // Mock authenticated new user
    await page.addInitScript(() => {
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
      localStorage.removeItem('urbanai_tutorial_completed');
      localStorage.removeItem('urbanai_welcome_issue_seen');
    });

    await page.goto('http://localhost:3000/dashboard');

    // Wait for tutorial modal
    await expect(page.locator('.tutorial-modal')).toBeVisible();

    // Step 1: Welcome
    await expect(page.locator('.tutorial-content h3')).toContainText('Welcome to UrbanAI');
    await page.locator('button', { hasText: 'Next' }).click();

    // Step 2: Dashboard Overview
    await expect(page.locator('.tutorial-content h3')).toContainText('Your Dashboard Overview');
    await page.locator('button', { hasText: 'Next' }).click();

    // Step 3: Report Issues
    await expect(page.locator('.tutorial-content h3')).toContainText('Report New Issues');
    await page.locator('button', { hasText: 'Next' }).click();

    // Step 4: Track Activity
    await expect(page.locator('.tutorial-content h3')).toContainText('Track Recent Activity');
    await page.locator('button', { hasText: 'Next' }).click();

    // Step 5: Final step
    await expect(page.locator('.tutorial-content h3')).toContainText("You're All Set");
    await page.locator('button', { hasText: 'Get Started!' }).click();

    // Tutorial should close
    await expect(page.locator('.tutorial-modal')).not.toBeVisible();
  });

  test('should show welcome template issue for new users', async ({ page }) => {
    // Mock authenticated new user with API responses
    await page.route('**/api/issues', async route => {
      // Return empty array to simulate new user with no issues
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
      localStorage.removeItem('urbanai_welcome_issue_seen');
    });

    await page.goto('http://localhost:3000/dashboard');

    // Close tutorial if it appears
    if (await page.locator('.tutorial-modal').isVisible()) {
      await page.locator('.tutorial-close').click();
    }

    // Wait for dashboard to load and check for welcome issue
    await expect(page.locator('.recent-issues-section')).toBeVisible();
    
    // Should show welcome template issue
    await expect(page.locator('.welcome-issue')).toBeVisible();
    await expect(page.locator('.issue-card h4')).toContainText('Welcome to UrbanAI! 🎉 (Template Issue)');
    await expect(page.locator('.template-issue-badge')).toBeVisible();
    await expect(page.locator('.template-issue-badge')).toContainText('Template');
  });

  test('should show stats cards with initial values', async ({ page }) => {
    // Mock API response for new user
    await page.route('**/api/issues', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.addInitScript(() => {
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
    });

    await page.goto('http://localhost:3000/dashboard');

    // Verify stats cards are visible
    const statCards = page.locator('.stat-card');
    await expect(statCards).toHaveCount(4);

    // Check stat values for new user (with welcome issue, should show 1)
    await expect(page.locator('.stat-card').first().locator('h3')).toContainText('1'); // Total Reports
    await expect(page.locator('.stat-card').nth(1).locator('h3')).toContainText('1'); // In Progress
    await expect(page.locator('.stat-card').nth(2).locator('h3')).toContainText('0'); // Resolved
    await expect(page.locator('.stat-card').nth(3).locator('h3')).toContainText('0%'); // Resolution Rate
  });

  test('should show quick action buttons', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
    });

    await page.goto('http://localhost:3000/dashboard');

    // Verify quick action buttons
    await expect(page.locator('[data-testid="get-started-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="get-started-btn"]')).toContainText('Report New Issue');
    
    await expect(page.locator('button', { hasText: 'View My Reports' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Browse Map' })).toBeVisible();
  });

  test('should handle logout functionality', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
    });

    await page.goto('http://localhost:3000/dashboard');

    // Click logout button
    await page.locator('.logout-btn').click();

    // Should redirect to home page and clear token
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Verify token is removed from localStorage
    const token = await page.evaluate(() => localStorage.getItem('urbanai_token'));
    expect(token).toBeNull();
  });

  test('should not show tutorial for returning users', async ({ page }) => {
    // Mock returning user (tutorial already completed)
    await page.addInitScript(() => {
      localStorage.setItem('urbanai_token', 'mock-jwt-token-for-testing');
      localStorage.setItem('urbanai_tutorial_completed', 'true');
      localStorage.setItem('urbanai_welcome_issue_seen', 'true');
    });

    await page.route('**/api/issues', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('http://localhost:3000/dashboard');

    // Tutorial modal should not be visible
    await expect(page.locator('.tutorial-modal')).not.toBeVisible();
    
    // Dashboard should be visible
    await expect(page.locator('.dashboard')).toBeVisible();
  });
});