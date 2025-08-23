import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { processManager } from './helpers/process-manager';

test('global teardown', async ({ page }) => {
  console.log('🧹 Starting global teardown for UrbanAI E2E tests (embedded browsers only)');
  
  try {
    // Clean up tracked processes and test ports
    await processManager.cleanupAllProcesses();
    
    // Clean up test-specific ports
    const testPorts = [3100, 5101, 7082];
    for (const port of testPorts) {
      await processManager.killProcessOnPort(port);
    }
    
    // Show final process status
    const remainingProcesses = await processManager.getProcessesOnCommonPorts();
    if (remainingProcesses.length > 0) {
      console.log('⚠️  Remaining processes on test ports:', remainingProcesses);
    } else {
      console.log('✅ All test ports are clean');
    }
    
    // Create test results directory if it doesn't exist
    const testResultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
    }
    
    // Generate test summary
    const summary = {
      testRunCompleted: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      testResultsDir: testResultsDir,
      screenshots: [] as string[],
      videos: [] as string[],
      traces: [] as string[]
    };
    
    // Collect test artifacts
    if (fs.existsSync(testResultsDir)) {
      const files = fs.readdirSync(testResultsDir);
      
      files.forEach(file => {
        const filePath = path.join(testResultsDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
          if (file.endsWith('.png')) {
            summary.screenshots.push(file);
          } else if (file.endsWith('.webm')) {
            summary.videos.push(file);
          } else if (file.endsWith('.zip')) {
            summary.traces.push(file);
          }
        }
      });
    }
    
    // Write summary to file
    const summaryPath = path.join(testResultsDir, 'test-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('📊 Test summary generated:', summaryPath);
    console.log(`📸 Screenshots captured: ${summary.screenshots.length}`);
    console.log(`🎥 Videos recorded: ${summary.videos.length}`);
    console.log(`🔍 Traces collected: ${summary.traces.length}`);
    
    // Cleanup temporary files if needed
    const tempFiles = [
      'landing-page-loaded.png',
      'react-app-loaded.png',
      'oauth-login-page.png',
      'dashboard-page.png',
      'mobile-landing-page.png',
      'tablet-landing-page.png',
      'initial-state.png'
    ];
    
    tempFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️  Cleaned up temporary file: ${file}`);
        } catch (error) {
          console.warn(`⚠️  Could not clean up file ${file}:`, error);
        }
      }
    });
    
    console.log('✅ Global teardown completed successfully (embedded browsers only)');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    throw error;
  }
});
