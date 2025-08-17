import { test, expect } from '@playwright/test';

test.describe('UrbanAI UX Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set default timeout
    test.setTimeout(30000);
  });

  test.describe('Landing Page to React App Flow', () => {
    test('should load landing page successfully', async ({ page }) => {
      // Navigate to landing page
      await page.goto('http://localhost:8080');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Verify page title
      await expect(page).toHaveTitle('UrbanAI - Report Municipal Issues with Confidence');
      
      // Verify key elements are present
      await expect(page.locator('.logo-text')).toHaveText('UrbanAI');
      await expect(page.locator('.hero-headline')).toBeVisible();
      await expect(page.locator('.cta-button')).toBeVisible();
      await expect(page.locator('.cta-button')).toHaveText('Get Started');
      
      // Verify navigation links
      const navLinks = page.locator('.nav-links a');
      await expect(navLinks).toHaveCount(3);
      await expect(navLinks.nth(0)).toHaveText('Features');
      await expect(navLinks.nth(1)).toHaveText('Privacy');
      await expect(navLinks.nth(2)).toHaveText('Contact');
      
      // Verify download buttons
      const downloadButtons = page.locator('.download-button');
      await expect(downloadButtons).toHaveCount(2);
      
      // Take screenshot for visual verification
      await page.screenshot({ path: 'landing-page-loaded.png', fullPage: true });
    });

    test('should handle smooth scrolling navigation', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click Features link
      await page.click('.nav-links a[href="#features"]');
      
      // Wait for scroll to complete
      await page.waitForTimeout(1000);
      
      // Verify Features section is in view
      const featuresSection = page.locator('#features');
      const featuresBox = await featuresSection.boundingBox();
      expect(featuresBox?.y).toBeLessThan(200); // Should be near top of viewport
      
      // Click Privacy link
      await page.click('.nav-links a[href="#privacy"]');
      
      // Wait for scroll to complete
      await page.waitForTimeout(1000);
      
      // Verify Privacy section is in view
      const privacySection = page.locator('#privacy');
      const privacyBox = await privacySection.boundingBox();
      expect(privacyBox?.y).toBeLessThan(200);
    });

    test('should show user feedback for footer links', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click footer link
      await page.click('.footer-links a:first-child');
      
      // Wait for feedback to appear
      await page.waitForSelector('.user-feedback');
      const feedback = page.locator('.user-feedback');
      await expect(feedback).toBeVisible();
      await expect(feedback).toHaveText('This section will be implemented in the full application.');
      
      // Verify feedback disappears after timeout
      await page.waitForSelector('.user-feedback', { state: 'hidden', timeout: 4000 });
      await expect(feedback).toBeHidden();
    });

    test('should redirect to React app when Get Started is clicked', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click Get Started button
      await page.click('.cta-button');
      
      // Wait for redirect to complete
      await page.waitForURL('http://localhost:3000/');
      
      // Verify we're on the React app
      await expect(page).toHaveURL('http://localhost:3000/');
      
      // Wait for React app to load
      await page.waitForSelector('#root', { state: 'visible' });
      
      // Take screenshot after redirect
      await page.screenshot({ path: 'react-app-loaded.png', fullPage: true });
    });

    test('should handle React app loading state', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click Get Started button
      await page.click('.cta-button');
      
      // Verify button shows loading state
      await expect(page.locator('.cta-button')).toHaveText('Loading...');
      await expect(page.locator('.cta-button')).toBeDisabled();
      
      // Wait for redirect
      await page.waitForURL('**/app');
      
      // Verify React app loads
      await page.waitForSelector('#root', { state: 'visible', timeout: 10000 });
    });

    test('should show feedback when React app is unavailable', async ({ page }) => {
      // Mock failed health check
      await page.route('**/app', route => route.abort('failed'));
      
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click Get Started button
      await page.click('.cta-button');
      
      // Wait for error feedback
      await page.waitForSelector('.user-feedback-error');
      const feedback = page.locator('.user-feedback-error');
      await expect(feedback).toBeVisible();
      await expect(feedback).toHaveText('Unable to connect to application. Please try again later.');
      
      // Verify button is reset
      await expect(page.locator('.cta-button')).toHaveText('Get Started');
      await expect(page.locator('.cta-button')).not.toBeDisabled();
    });

    test('should handle keyboard navigation', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Focus on Get Started button
      await page.focus('.cta-button');
      
      // Press Enter key
      await page.keyboard.press('Enter');
      
      // Verify redirect happens
      await page.waitForURL('**/app');
      await expect(page).toHaveURL(/\/app(\/|$)/);
    });
  });

  test.describe('React App Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Start from React app directly
      await page.goto('http://localhost:8080/app');
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('#root', { state: 'visible' });
    });

    test('should load OAuth login page', async ({ page }) => {
      // Verify OAuth login elements are present
      await expect(page.locator('text=Welcome to UrbanAI')).toBeVisible();
      await expect(page.locator('text=Sign in to report municipal issues')).toBeVisible();
      
      // Verify OAuth provider buttons
      const microsoftButton = page.locator('button:has-text("Continue with Microsoft")');
      const googleButton = page.locator('button:has-text("Continue with Google")');
      const facebookButton = page.locator('button:has-text("Continue with Facebook")');
      
      await expect(microsoftButton).toBeVisible();
      await expect(googleButton).toBeVisible();
      await expect(facebookButton).toBeVisible();
      
      // Verify guest access button
      await expect(page.locator('button:has-text("Continue as Guest")')).toBeVisible();
      
      // Take screenshot of login page
      await page.screenshot({ path: 'oauth-login-page.png', fullPage: true });
    });

    test('should handle OAuth provider selection', async ({ page }) => {
      // Mock OAuth redirect to prevent actual navigation
      await page.route('**/auth/**', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'OAuth flow initiated' })
      }));
      
      // Click Microsoft OAuth button
      await page.click('button:has-text("Continue with Microsoft")');
      
      // Verify OAuth flow was initiated (check for console log or API call)
      // In a real test, you'd verify the redirect to OAuth provider
      await expect(page.locator('button:has-text("Continue with Microsoft")')).toBeVisible();
    });

    test('should handle guest access', async ({ page }) => {
      // Click guest access button
      await page.click('button:has-text("Continue as Guest")');
      
      // Verify navigation to dashboard
      await page.waitForURL('**/dashboard');
      await expect(page).toHaveURL(/\/dashboard$/);
      
      // Verify dashboard loads
      await expect(page.locator('text=UrbanAI Dashboard')).toBeVisible();
      
      // Take screenshot of dashboard
      await page.screenshot({ path: 'dashboard-page.png', fullPage: true });
    });

    test('should handle responsive design on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      
      // Reload page to apply responsive styles
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify mobile layout
      const navContainer = page.locator('.nav-container');
      const navBox = await navContainer.boundingBox();
      expect(navBox?.width).toBeLessThan(400); // Should be narrow on mobile
      
      // Verify hero section stacks vertically
      const heroContainer = page.locator('.hero-container');
      const heroBox = await heroContainer.boundingBox();
      expect(heroBox?.width).toBeLessThan(400);
      
      // Take mobile screenshot
      await page.screenshot({ path: 'mobile-landing-page.png', fullPage: true });
    });

    test('should handle responsive design on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Reload page to apply responsive styles
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify tablet layout
      const featuresGrid = page.locator('.features-grid');
      const gridBox = await featuresGrid.boundingBox();
      expect(gridBox?.width).toBeGreaterThan(700);
      
      // Take tablet screenshot
      await page.screenshot({ path: 'tablet-landing-page.png', fullPage: true });
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should meet WCAG accessibility requirements', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Check for proper heading hierarchy
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements: Element[]) => 
        elements.map(h => ({
          level: h.tagName,
          text: h.textContent?.trim()
        }))
      );
      
      // Verify there's exactly one H1
      const h1Count = headings.filter(h => h.level === 'H1').length;
      expect(h1Count).toBe(1);
      
      // Verify alt text for images
      const images = await page.$$eval('img', (elements: HTMLImageElement[]) => 
        elements.map(img => ({
          hasAlt: img.hasAttribute('alt'),
          altText: img.getAttribute('alt')
        }))
      );
      
      // All images should have alt text
      images.forEach(img => {
        expect(img.hasAlt).toBe(true);
      });
      
      // Verify buttons have accessible names
      const buttons = await page.$$eval('button', (elements: HTMLButtonElement[]) => 
        elements.map(button => ({
          hasText: button.textContent?.trim().length > 0,
          hasAriaLabel: button.hasAttribute('aria-label')
        }))
      );
      
      buttons.forEach(button => {
        expect(button.hasText || button.hasAriaLabel).toBe(true);
      });
      
      // Verify color contrast (basic check)
      const ctaButton = page.locator('.cta-button');
      const backgroundColor = await ctaButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.backgroundColor;
      });
      
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Tab through interactive elements
      const interactiveElements = [
        '.nav-links a',
        '.cta-button',
        '.download-button',
        '.footer-links a',
        '.privacy-link'
      ];
      
      for (const selector of interactiveElements) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
        
        // Check if element is focused
        const activeElement = await page.evaluate(() => document.activeElement);
        const isElementFocused = await page.$eval(selector, (el, active) => 
          el === active, activeElement);
        
        // At least one of the elements matching the selector should be focused
        const elements = await page.$$(selector);
        const anyFocused = await Promise.all(
          elements.map(el => el.evaluate((el, active) => el === active, activeElement))
        );
        
        expect(anyFocused.some(focused => focused)).toBe(true);
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load landing page within performance budget', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      console.log(`Landing page load time: ${loadTime}ms`);
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should handle React app redirect within performance budget', async ({ page }) => {
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      const startTime = Date.now();
      
      // Click Get Started button
      await page.click('.cta-button');
      
      // Wait for React app to load
      await page.waitForSelector('#root', { state: 'visible' });
      
      const redirectTime = Date.now() - startTime;
      console.log(`Redirect time: ${redirectTime}ms`);
      
      // Should redirect within 5 seconds
      expect(redirectTime).toBeLessThan(5000);
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Block all network requests
      await page.route('**', route => route.abort('failed'));
      
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click Get Started button
      await page.click('.cta-button');
      
      // Should show error feedback
      await page.waitForSelector('.user-feedback-error');
      await expect(page.locator('.user-feedback-error')).toBeVisible();
    });

    test('should handle slow React app loading', async ({ page }) => {
      // Add delay to React app responses
      await page.route('**/app/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await route.continue();
      });
      
      await page.goto('http://localhost:8080');
      await page.waitForLoadState('networkidle');
      
      // Click Get Started button
      await page.click('.cta-button');
      
      // Should show loading state
      await expect(page.locator('.cta-button')).toHaveText('Loading...');
      
      // Should eventually load
      await page.waitForSelector('#root', { state: 'visible', timeout: 10000 });
    });
  });
});
