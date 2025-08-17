import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for UrbanAI E2E tests');
  
  // Launch a browser instance for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the server to be ready
    console.log('⏳ Waiting for servers to be ready...');
    
    // Check if the main server is running
    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await page.goto('http://localhost:8080/health', { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        if (response && response.ok()) {
          const healthData = await response.json();
          console.log('✅ Main server is healthy:', healthData);
          break;
        }
      } catch (error) {
        console.log(`⚠️  Attempt ${i + 1}/${maxRetries}: Main server not ready yet`);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          throw new Error('Main server failed to start after maximum retries');
        }
      }
    }
    
    // Check if React dev server is running
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await page.goto('http://localhost:3000', { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        if (response && response.ok()) {
          console.log('✅ React dev server is ready');
          break;
        }
      } catch (error) {
        console.log(`⚠️  Attempt ${i + 1}/${maxRetries}: React dev server not ready yet`);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.log('⚠️  React dev server may not be running - tests will use production build');
          break;
        }
      }
    }
    
    // Navigate back to landing page to ensure it's ready
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    console.log('✅ Landing page is ready');
    
    // Take a screenshot of the initial state
    await page.screenshot({ path: 'test-results/initial-state.png', fullPage: true });
    
    console.log('🎉 Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
