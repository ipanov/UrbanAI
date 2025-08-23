import { test, expect } from '@playwright/test';
import { processManager } from './helpers/process-manager';

test('global setup', async ({ page }) => {
  console.log('🚀 Starting global setup for UrbanAI E2E tests (embedded browsers only)');
  
  // Clean up any existing processes on test ports
  const testPorts = [3100, 5101, 7082];
  for (const port of testPorts) {
    await processManager.killProcessOnPort(port);
  }
  
  try {
    // Wait for the test servers to be ready (managed by webServer config)
    console.log('⏳ Waiting for test servers to be ready...');
    
    const maxRetries = 20;
    const retryDelay = 3000; // 3 seconds
    
    // Check if the API test server is running
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await page.goto('http://localhost:5101/swagger', { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        if (response && response.ok()) {
          console.log('✅ API test server is healthy on port 5101');
          break;
        }
      } catch (error) {
        console.log(`⚠️  Attempt ${i + 1}/${maxRetries}: API test server not ready yet`);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.log('⚠️  API test server not responding - webServer should handle this');
          break;
        }
      }
    }
    
    // Check if React test server is running
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await page.goto('http://localhost:3100', { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        if (response && response.ok()) {
          console.log('✅ React test server is ready on port 3100');
          break;
        }
      } catch (error) {
        console.log(`⚠️  Attempt ${i + 1}/${maxRetries}: React test server not ready yet`);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.log('⚠️  React test server not responding - webServer should handle this');
          break;
        }
      }
    }
    
    // Navigate to test app to ensure it's ready
    await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
    console.log('✅ Test application is ready');
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: 'test-results/initial-state.png', fullPage: true });
    
    console.log('🎉 Global setup completed successfully (embedded browsers only)');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
});
