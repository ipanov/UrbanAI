# UrbanAI E2E Testing Documentation

This directory contains comprehensive end-to-end (E2E) tests for the UrbanAI application, focusing on validating the complete user experience (UX) flow from the landing page through the React application.

## Overview

The E2E test suite covers:

- **Landing Page to React App Flow**: Validates the complete user journey from the static landing page to the React application
- **OAuth Authentication**: Tests Microsoft, Google, Facebook, and guest access flows
- **Responsive Design**: Validates mobile, tablet, and desktop layouts
- **Accessibility**: Ensures WCAG compliance and keyboard navigation support
- **Performance**: Validates load times and performance budgets
- **Error Handling**: Tests graceful handling of network errors and slow loading

## Test Structure

### Main Test File: `ux-flow.spec.ts`

The primary test file contains multiple test suites:

1. **Landing Page to React App Flow**
   - Landing page loading and element validation
   - Smooth scrolling navigation
   - User feedback for incomplete features
   - Redirect to React app
   - Loading states and error handling
   - Keyboard navigation support

2. **React App Functionality**
   - OAuth login page validation
   - OAuth provider selection
   - Guest access flow
   - Dashboard navigation

3. **Accessibility Tests**
   - WCAG compliance checks
   - Keyboard navigation validation
   - Color contrast verification
   - Screen reader compatibility

4. **Performance Tests**
   - Landing page load time validation
   - React app redirect performance
   - Performance budget enforcement

5. **Error Handling Tests**
   - Network error scenarios
   - Slow loading conditions
   - Graceful degradation

### Configuration Files

- **`playwright.config.ts`**: Main Playwright configuration with browser settings, web servers, and test options
- **`global-setup.ts`**: Pre-test setup including server health checks and environment preparation
- **`global-teardown.ts`**: Post-test cleanup and test artifact collection

## Prerequisites

Before running the E2E tests, ensure you have:

1. Node.js (v18 or higher)
2. All dependencies installed: `npm install`
3. Playwright browsers installed: `npm run playwright:install`

## Running Tests

### Basic Test Execution

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive debugging)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug
```

### Browser-Specific Testing

```bash
# Run tests only on Chrome
npm run test:e2e:chrome

# Run tests only on Firefox
npm run test:e2e:firefox

# Run tests only on Safari
npm run test:e2e:safari

# Run tests on mobile viewports
npm run test:e2e:mobile
```

### UX Flow Specific Testing

```bash
# Run only the UX flow tests
npm run test:ux-flow

# Run UX flow tests in headed mode
npm run test:ux-flow:headed
```

### Complete Test Suite

```bash
# Run all tests (unit, integration, E2E)
npm run test:complete

# Validate UX across all platforms
npm run validate:ux
```

## Development Workflow

### Starting Development Servers

```bash
# Start both the main server and React dev server
npm run start:all

# Start only the main server
npm run start:server

# Start only the React dev server
npm run dev
```

### Test Development

1. **Write Tests**: Add new test cases in `ux-flow.spec.ts` or create new test files
2. **Run Locally**: Use `npm run test:e2e:ui` for interactive debugging
3. **Validate**: Run `npm run validate:ux` to ensure cross-platform compatibility
4. **CI/CD**: Tests run automatically in CI/CD pipelines

## Test Configuration

### Environment Variables

The tests can be configured using environment variables:

```bash
# Set environment for testing
export NODE_ENV=test

# Set base URL for tests
export BASE_URL=http://localhost:8080

# Enable debug logging
export DEBUG=playwright*
```

### Custom Configuration

To modify test behavior:

1. **Timeouts**: Adjust in `playwright.config.ts` under `use.timeout`
2. **Retry Logic**: Configure `retries` in `playwright.config.ts`
3. **Browser Settings**: Modify `projects` array in `playwright.config.ts`
4. **Server Configuration**: Update `webServer` array for different environments

## Test Artifacts

### Generated Files

Tests generate the following artifacts:

- **Screenshots**: Visual validation of UI states
- **Videos**: Recording of test execution (on failure)
- **Traces**: Detailed execution traces for debugging
- **Test Summary**: JSON report with test results and metrics

### Artifact Locations

```
test-results/
├── screenshots/          # Test screenshots
├── videos/              # Test recordings
├── traces/              # Debug traces
└── test-summary.json    # Test execution summary
```

## Debugging

### Common Issues

1. **Server Not Starting**: Ensure ports 8080 and 3000 are available
2. **Timeout Errors**: Increase timeout values in `playwright.config.ts`
3. **Element Not Found**: Use `test:e2e:debug` to inspect the page
4. **Network Issues**: Check server health and network connectivity

### Debug Commands

```bash
# Debug with visible browser and breakpoints
npm run test:e2e:debug

# Run tests with verbose output
DEBUG=playwright* npm run test:e2e

# Generate HTML report with traces
npm run test:e2e -- --reporter=html
```

## Best Practices

### Test Writing

1. **Atomic Tests**: Each test should validate one specific behavior
2. **Descriptive Names**: Use clear, descriptive test names
3. **Wait Strategies**: Use Playwright's auto-wait features instead of fixed timeouts
4. **Selectors**: Use stable selectors (data-testid, role, text)
5. **Cleanup**: Reset application state between tests

### Performance Considerations

1. **Parallel Execution**: Tests run in parallel by default
2. **Resource Management**: Clean up resources in `global-teardown.ts`
3. **Network Conditions**: Mock network calls for faster execution
4. **Browser Isolation**: Use browser contexts for test isolation

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run playwright:install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## Troubleshooting

### Common Solutions

1. **Port Conflicts**: Change server ports in configuration
2. **Permission Issues**: Run with appropriate permissions
3. **Dependency Issues**: Clean install with `rm -rf node_modules && npm install`
4. **Browser Issues**: Reinstall browsers with `npm run playwright:install:all`

### Getting Help

- Check Playwright documentation: https://playwright.dev/docs/intro
- Review test output logs for specific error messages
- Use debug mode to inspect test execution step-by-step

## Contributing

When adding new tests:

1. Follow the existing test structure and naming conventions
2. Include both positive and negative test cases
3. Add appropriate assertions and error handling
4. Update documentation for new test scenarios
5. Validate tests across all supported browsers

## Future Enhancements

Planned improvements to the E2E test suite:

- **Visual Regression Testing**: Integration with tools like Percy or Applitools
- **API Testing**: Add API endpoint validation alongside UI tests
- **Performance Monitoring**: Integrate with Lighthouse for performance metrics
- **Accessibility Scanning**: Automated accessibility violation detection
- **Cross-Browser Matrix**: Expand browser and device coverage
