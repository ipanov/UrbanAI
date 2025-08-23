import { Page } from '@playwright/test';

export interface TestUser {
  id: string;
  username: string;
  email: string;
  token: string;
  isAnonymous?: boolean;
}

export interface TestIssue {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  userId: string;
  createdAt: string;
}

export class TestDataHelper {
  // eslint-disable-next-line no-unused-vars
  constructor(private page: Page) {}

  /**
   * Create a test user for OAuth testing
   */
  static createTestUser(overrides: Partial<TestUser> = {}): TestUser {
    return {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'TestUser',
      email: 'test@example.com',
      token: 'mock-jwt-token-for-testing',
      isAnonymous: true,
      ...overrides
    };
  }

  /**
   * Create a test issue
   */
  static createTestIssue(overrides: Partial<TestIssue> = {}): TestIssue {
    return {
      id: '660e8400-e29b-41d4-a716-446655440000',
      title: 'Test Issue: Broken Streetlight',
      description: 'Streetlight on Main St is not working, creating safety hazard',
      latitude: 40.7128,
      longitude: -74.0060,
      status: 'Open',
      userId: '550e8400-e29b-41d4-a716-446655440000',
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  /**
   * Set up authenticated user in localStorage
   */
  async setupAuthenticatedUser(user: TestUser = TestDataHelper.createTestUser()) {
    await this.page.addInitScript((userData) => {
      localStorage.setItem('urbanai_token', userData.token);
      localStorage.setItem('urbanai_user', JSON.stringify({
        id: userData.id,
        username: userData.username,
        email: userData.email
      }));
    }, user);
  }

  /**
   * Set up new user (no tutorial completed)
   */
  async setupNewUser(user: TestUser = TestDataHelper.createTestUser()) {
    await this.setupAuthenticatedUser(user);
    await this.page.addInitScript(() => {
      localStorage.removeItem('urbanai_tutorial_completed');
      localStorage.removeItem('urbanai_welcome_issue_seen');
    });
  }

  /**
   * Set up returning user (tutorial completed)
   */
  async setupReturningUser(user: TestUser = TestDataHelper.createTestUser()) {
    await this.setupAuthenticatedUser(user);
    await this.page.addInitScript(() => {
      localStorage.setItem('urbanai_tutorial_completed', 'true');
      localStorage.setItem('urbanai_welcome_issue_seen', 'true');
    });
  }

  /**
   * Mock API responses for issues
   */
  async mockIssuesAPI(issues: TestIssue[] = []) {
    await this.page.route('**/api/issues', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(issues)
      });
    });

    // Mock individual issue endpoint
    for (const issue of issues) {
      await this.page.route(`**/api/issues/${issue.id}`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(issue)
        });
      });
    }
  }

  /**
   * Mock OAuth API responses
   */
  async mockOAuthAPI() {
    // Mock OAuth authorization endpoint
    await this.page.route('**/api/v1/oauth/authorize/**', async route => {
      const url = new URL(route.request().url());
      const provider = url.pathname.split('/').pop();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authorizationUrl: `/auth/callback/${provider}?code=test-auth-code-123&state=test-state`
        })
      });
    });

    // Mock OAuth callback endpoint
    await this.page.route('**/api/v1/oauth/callback/**', async route => {
      const testUser = TestDataHelper.createTestUser();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: testUser.token,
          user: {
            id: testUser.id,
            username: testUser.username,
            email: testUser.email
          },
          redirectUrl: '/dashboard'
        })
      });
    });

    // Mock user registration endpoint
    await this.page.route('**/api/auth/register-external', async route => {
      const testUser = TestDataHelper.createTestUser();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          token: testUser.token,
          username: testUser.username,
          userId: testUser.id
        })
      });
    });
  }

  /**
   * Clear all localStorage data
   */
  async clearStorageData() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Wait for API calls to complete
   */
  async waitForAPICall(urlPattern: string, timeout: number = 5000) {
    await this.page.waitForResponse(response => 
      response.url().includes(urlPattern) && response.status() === 200,
      { timeout }
    );
  }

  /**
   * Take a screenshot for debugging
   */
  async takeDebugScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/debug-${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}