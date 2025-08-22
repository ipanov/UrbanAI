import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page object with common functionality
 */
export abstract class BasePage {
  // eslint-disable-next-line no-unused-vars
  constructor(protected page: Page) {}

  async goto(path: string = '') {
    await this.page.goto(`http://localhost:3000${path}`);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }
}

/**
 * Landing/Login page object
 */
export class LoginPage extends BasePage {
  readonly loginContainer: Locator;
  readonly microsoftLoginBtn: Locator;
  readonly googleLoginBtn: Locator;
  readonly pageTitle: Locator;
  readonly pageDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.loginContainer = page.locator('[data-testid="oauth-login-page"]');
    this.microsoftLoginBtn = page.locator('button', { hasText: 'Continue with Microsoft' });
    this.googleLoginBtn = page.locator('button', { hasText: 'Continue with Google' });
    this.pageTitle = page.locator('h1');
    this.pageDescription = page.locator('text=Report municipal issues and track their resolution');
  }

  async expectPageLoaded() {
    await expect(this.loginContainer).toBeVisible();
    await expect(this.pageTitle).toContainText('Welcome to UrbanAI');
    await expect(this.pageDescription).toBeVisible();
  }

  async expectLoginOptionsVisible() {
    await expect(this.microsoftLoginBtn).toBeVisible();
    await expect(this.googleLoginBtn).toBeVisible();
  }

  async clickMicrosoftLogin() {
    await this.microsoftLoginBtn.click();
  }

  async clickGoogleLogin() {
    await this.googleLoginBtn.click();
  }
}

/**
 * Dashboard page object
 */
export class DashboardPage extends BasePage {
  readonly dashboardContainer: Locator;
  readonly pageTitle: Locator;
  readonly statCards: Locator;
  readonly quickActionButtons: Locator;
  readonly recentIssuesSection: Locator;
  readonly logoutBtn: Locator;
  readonly reportNewIssueBtn: Locator;
  readonly viewMyReportsBtn: Locator;
  readonly browseMapBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardContainer = page.locator('.dashboard');
    this.pageTitle = page.locator('h1', { hasText: 'UrbanAI Dashboard' });
    this.statCards = page.locator('.stat-card');
    this.quickActionButtons = page.locator('.quick-actions');
    this.recentIssuesSection = page.locator('.recent-issues-section');
    this.logoutBtn = page.locator('.logout-btn');
    this.reportNewIssueBtn = page.locator('[data-testid="get-started-btn"]');
    this.viewMyReportsBtn = page.locator('button', { hasText: 'View My Reports' });
    this.browseMapBtn = page.locator('button', { hasText: 'Browse Map' });
  }

  async expectPageLoaded() {
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.pageTitle).toBeVisible();
  }

  async expectStatsCards(totalReports: string, inProgress: string, resolved: string, resolutionRate: string) {
    await expect(this.statCards).toHaveCount(4);
    await expect(this.statCards.first().locator('h3')).toContainText(totalReports);
    await expect(this.statCards.nth(1).locator('h3')).toContainText(inProgress);
    await expect(this.statCards.nth(2).locator('h3')).toContainText(resolved);
    await expect(this.statCards.nth(3).locator('h3')).toContainText(resolutionRate);
  }

  async expectQuickActionsVisible() {
    await expect(this.reportNewIssueBtn).toBeVisible();
    await expect(this.reportNewIssueBtn).toContainText('Report New Issue');
    await expect(this.viewMyReportsBtn).toBeVisible();
    await expect(this.browseMapBtn).toBeVisible();
  }

  async clickReportNewIssue() {
    await this.reportNewIssueBtn.click();
  }

  async clickViewMyReports() {
    await this.viewMyReportsBtn.click();
  }

  async clickBrowseMap() {
    await this.browseMapBtn.click();
  }

  async logout() {
    await this.logoutBtn.click();
  }
}

/**
 * Tutorial modal object
 */
export class TutorialModal {
  readonly modal: Locator;
  readonly title: Locator;
  readonly content: Locator;
  readonly progress: Locator;
  readonly nextBtn: Locator;
  readonly closeBtn: Locator;
  readonly getStartedBtn: Locator;

  constructor(private page: Page) {
    this.modal = page.locator('.tutorial-modal');
    this.title = page.locator('.tutorial-content h3');
    this.content = page.locator('.tutorial-content');
    this.progress = page.locator('.tutorial-progress');
    this.nextBtn = page.locator('button', { hasText: 'Next' });
    this.closeBtn = page.locator('.tutorial-close');
    this.getStartedBtn = page.locator('button', { hasText: 'Get Started!' });
  }

  async expectVisible() {
    await expect(this.modal).toBeVisible();
  }

  async expectNotVisible() {
    await expect(this.modal).not.toBeVisible();
  }

  async expectStep(stepNumber: number, stepTitle: string) {
    await expect(this.title).toContainText(stepTitle);
    await expect(this.progress).toContainText(`Step ${stepNumber} of 5`);
  }

  async clickNext() {
    await this.nextBtn.click();
  }

  async clickClose() {
    await this.closeBtn.click();
  }

  async clickGetStarted() {
    await this.getStartedBtn.click();
  }

  async completeTutorial() {
    // Step 1: Welcome
    await this.expectStep(1, 'Welcome to UrbanAI');
    await this.clickNext();

    // Step 2: Dashboard Overview
    await this.expectStep(2, 'Your Dashboard Overview');
    await this.clickNext();

    // Step 3: Report Issues
    await this.expectStep(3, 'Report New Issues');
    await this.clickNext();

    // Step 4: Track Activity
    await this.expectStep(4, 'Track Recent Activity');
    await this.clickNext();

    // Step 5: Final step
    await this.expectStep(5, "You're All Set");
    await this.clickGetStarted();

    // Verify modal is closed
    await this.expectNotVisible();
  }
}

/**
 * Issues section object
 */
export class IssuesSection {
  readonly section: Locator;
  readonly welcomeIssue: Locator;
  readonly issueCards: Locator;
  readonly templateBadge: Locator;

  constructor(private page: Page) {
    this.section = page.locator('.recent-issues-section');
    this.welcomeIssue = page.locator('.welcome-issue');
    this.issueCards = page.locator('.issue-card');
    this.templateBadge = page.locator('.template-issue-badge');
  }

  async expectWelcomeIssueVisible() {
    await expect(this.welcomeIssue).toBeVisible();
    await expect(this.issueCards.first().locator('h4')).toContainText('Welcome to UrbanAI! 🎉 (Template Issue)');
    await expect(this.templateBadge).toBeVisible();
    await expect(this.templateBadge).toContainText('Template');
  }

  async expectIssueCount(count: number) {
    await expect(this.issueCards).toHaveCount(count);
  }

  async expectIssueVisible(title: string) {
    await expect(this.issueCards.filter({ hasText: title })).toBeVisible();
  }
}

/**
 * Navigation component object
 */
export class Navigation {
  readonly nav: Locator;
  readonly homeLink: Locator;
  readonly dashboardLink: Locator;
  readonly issuesLink: Locator;
  readonly mapLink: Locator;
  readonly userMenu: Locator;

  constructor(private page: Page) {
    this.nav = page.locator('nav');
    this.homeLink = page.locator('nav a[href="/"]');
    this.dashboardLink = page.locator('nav a[href="/dashboard"]');
    this.issuesLink = page.locator('nav a[href="/issues"]');
    this.mapLink = page.locator('nav a[href="/map"]');
    this.userMenu = page.locator('.user-menu');
  }

  async expectVisible() {
    await expect(this.nav).toBeVisible();
  }

  async goToDashboard() {
    await this.dashboardLink.click();
  }

  async goToIssues() {
    await this.issuesLink.click();
  }

  async goToMap() {
    await this.mapLink.click();
  }
}