import { test, expect } from '@playwright/test';
import { TestDataHelper } from './helpers/test-data';
import { LoginPage, DashboardPage, TutorialModal, IssuesSection } from './helpers/page-objects';

test.describe('Comprehensive UI Test Suite', () => {
  let testDataHelper: TestDataHelper;
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let tutorialModal: TutorialModal;
  let issuesSection: IssuesSection;

  test.beforeEach(async ({ page }) => {
    testDataHelper = new TestDataHelper(page);
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    tutorialModal = new TutorialModal(page);
    issuesSection = new IssuesSection(page);
  });

  test.describe('Authentication & Authorization', () => {
    test('should complete full OAuth flow with Microsoft', async ({ page }) => {
      await testDataHelper.mockOAuthAPI();
      
      // Start from login page
      await loginPage.goto();
      await loginPage.expectPageLoaded();
      await loginPage.expectLoginOptionsVisible();

      // Click Microsoft login
      await loginPage.clickMicrosoftLogin();

      // Should redirect to dashboard after successful auth
      await page.waitForURL('**/dashboard');
      await dashboardPage.expectPageLoaded();
    });

    test('should complete full OAuth flow with Google', async ({ page }) => {
      await testDataHelper.mockOAuthAPI();
      
      await loginPage.goto();
      await loginPage.clickGoogleLogin();

      await page.waitForURL('**/dashboard');
      await dashboardPage.expectPageLoaded();
    });

    test('should handle OAuth error gracefully', async ({ page }) => {
      // Mock OAuth error
      await page.route('**/api/v1/oauth/authorize/**', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'invalid_request' })
        });
      });

      await loginPage.goto();
      await loginPage.clickMicrosoftLogin();

      // Should show error message
      await expect(page.locator('.error-message')).toBeVisible();
      await expect(page.locator('.error-message')).toContainText('Authentication failed');
    });

    test('should logout user and clear session', async ({ page }) => {
      await testDataHelper.setupAuthenticatedUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      await dashboardPage.logout();

      // Should redirect to home page
      await expect(page).toHaveURL('http://localhost:3000/');

      // Verify token is cleared
      const token = await page.evaluate(() => localStorage.getItem('urbanai_token'));
      expect(token).toBeNull();
    });
  });

  test.describe('User Onboarding Experience', () => {
    test('should show complete tutorial for new users', async ({ page }) => {
      await testDataHelper.setupNewUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      // Should show tutorial modal
      await tutorialModal.expectVisible();
      await tutorialModal.completeTutorial();

      // Verify tutorial completion is saved
      const tutorialCompleted = await page.evaluate(() => 
        localStorage.getItem('urbanai_tutorial_completed')
      );
      expect(tutorialCompleted).toBe('true');
    });

    test('should not show tutorial for returning users', async ({ page }) => {
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      // Tutorial should not be visible
      await tutorialModal.expectNotVisible();
    });

    test('should show welcome issue for new users', async ({ page }) => {
      await testDataHelper.setupNewUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');

      // Close tutorial if visible
      if (await page.locator('.tutorial-modal').isVisible()) {
        await tutorialModal.clickClose();
      }

      await issuesSection.expectWelcomeIssueVisible();
    });
  });

  test.describe('Dashboard Functionality', () => {
    test('should display correct stats for user with issues', async ({ page }) => {
      const testIssues = [
        TestDataHelper.createTestIssue({ status: 'Open' }),
        TestDataHelper.createTestIssue({ 
          id: '660e8400-e29b-41d4-a716-446655440001',
          status: 'In Progress' 
        }),
        TestDataHelper.createTestIssue({ 
          id: '660e8400-e29b-41d4-a716-446655440002',
          status: 'Resolved' 
        })
      ];

      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI(testIssues);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      // Should show correct stats: 3 total, 1 in progress, 1 resolved, 33% resolution rate
      await dashboardPage.expectStatsCards('3', '1', '1', '33%');
    });

    test('should display empty state for new user', async ({ page }) => {
      await testDataHelper.setupNewUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');

      // Close tutorial
      if (await page.locator('.tutorial-modal').isVisible()) {
        await tutorialModal.clickClose();
      }

      // Should show stats with welcome issue
      await dashboardPage.expectStatsCards('1', '1', '0', '0%');
      await issuesSection.expectWelcomeIssueVisible();
    });

    test('should handle quick actions correctly', async ({ page }) => {
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();
      await dashboardPage.expectQuickActionsVisible();

      // Test "Report New Issue" button
      await dashboardPage.clickReportNewIssue();
      await expect(page).toHaveURL(/.*\/issues\/new/);
    });
  });

  test.describe('Issues Management', () => {
    test('should display user issues correctly', async ({ page }) => {
      const testIssues = [
        TestDataHelper.createTestIssue({ 
          title: 'Broken Streetlight on Main St' 
        }),
        TestDataHelper.createTestIssue({ 
          id: '660e8400-e29b-41d4-a716-446655440001',
          title: 'Pothole on Oak Avenue',
          status: 'In Progress'
        })
      ];

      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI(testIssues);

      await dashboardPage.goto('/dashboard');
      await issuesSection.expectIssueCount(2);
      await issuesSection.expectIssueVisible('Broken Streetlight on Main St');
      await issuesSection.expectIssueVisible('Pothole on Oak Avenue');
    });

    test('should handle issue creation workflow', async ({ page }) => {
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      // Mock issue creation endpoint
      await page.route('**/api/issues', async route => {
        if (route.request().method() === 'POST') {
          const newIssue = TestDataHelper.createTestIssue({
            id: 'new-issue-id',
            title: 'New Test Issue'
          });
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(newIssue)
          });
        }
      });

      await dashboardPage.goto('/dashboard');
      await dashboardPage.clickReportNewIssue();

      // Should navigate to issue creation form
      await expect(page).toHaveURL(/.*\/issues\/new/);
      
      // Verify form elements are present
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="title"]')).toBeVisible();
      await expect(page.locator('textarea[name="description"]')).toBeVisible();
    });
  });

  test.describe('Responsive Design & Mobile', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      // Mobile navigation should be accessible
      await expect(page.locator('.mobile-menu-button')).toBeVisible();
      
      // Stats cards should stack vertically on mobile
      const statCards = await dashboardPage.statCards.all();
      expect(statCards.length).toBe(4);
    });

    test('should work correctly on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();
      await dashboardPage.expectQuickActionsVisible();
    });
  });

  test.describe('Error Handling & Edge Cases', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      await testDataHelper.setupReturningUser();

      // Mock API error
      await page.route('**/api/issues', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        });
      });

      await dashboardPage.goto('/dashboard');

      // Should show error state
      await expect(page.locator('.error-banner')).toBeVisible();
      await expect(page.locator('.error-banner')).toContainText('Unable to load issues');
    });

    test('should handle slow API responses', async ({ page }) => {
      await testDataHelper.setupReturningUser();

      // Mock slow API response
      await page.route('**/api/issues', async route => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });

      await dashboardPage.goto('/dashboard');

      // Should show loading state
      await expect(page.locator('.loading-spinner')).toBeVisible();
      
      // Should eventually load
      await expect(page.locator('.loading-spinner')).not.toBeVisible({ timeout: 10000 });
      await dashboardPage.expectPageLoaded();
    });

    test('should handle expired authentication', async ({ page }) => {
      await testDataHelper.setupAuthenticatedUser();

      // Mock auth failure
      await page.route('**/api/**', async route => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Unauthorized' })
        });
      });

      await dashboardPage.goto('/dashboard');

      // Should redirect to login
      await expect(page).toHaveURL('http://localhost:3000/');
      
      // Token should be cleared
      const token = await page.evaluate(() => localStorage.getItem('urbanai_token'));
      expect(token).toBeNull();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      // Test keyboard navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should navigate or activate focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      await dashboardPage.goto('/dashboard');

      // Check for important ARIA attributes
      await expect(page.locator('[aria-label]')).toHaveCount.greaterThan(0);
      await expect(page.locator('h1')).toHaveAttribute('role', 'heading');
    });
  });

  test.describe('Performance', () => {
    test('should load dashboard within performance budget', async ({ page }) => {
      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI([]);

      const startTime = Date.now();
      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();
      const endTime = Date.now();

      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle large number of issues efficiently', async ({ page }) => {
      // Create 100 test issues
      const manyIssues = Array.from({ length: 100 }, (_, i) => 
        TestDataHelper.createTestIssue({
          id: `issue-${i}`,
          title: `Test Issue ${i + 1}`
        })
      );

      await testDataHelper.setupReturningUser();
      await testDataHelper.mockIssuesAPI(manyIssues);

      await dashboardPage.goto('/dashboard');
      await dashboardPage.expectPageLoaded();

      // Should handle large dataset without crashing
      await expect(dashboardPage.dashboardContainer).toBeVisible();
    });
  });
});