#!/usr/bin/env node

/**
 * Claude Hook: Change Tracker
 * Runs after Edit operations to track file changes and provide CI guidance
 */

const fs = require('fs');
const path = require('path');

function trackChanges() {
  try {
    // Get the edited file from command line arguments
    const args = process.argv.slice(2);
    let editedFile = '';
    
    // Try to extract file path from args (this is a simplified approach)
    for (let i = 0; i < args.length; i++) {
      if (args[i].includes('.') && !args[i].startsWith('--')) {
        editedFile = args[i];
        break;
      }
    }
    
    if (!editedFile) return;
    
    // Determine which CI tests would be triggered
    const fileName = path.basename(editedFile).toLowerCase();
    const filePath = editedFile.toLowerCase();
    
    let testScope = [];
    
    // Backend changes
    if (filePath.includes('urbanai.api') || filePath.includes('urbanai.application') || 
        filePath.includes('urbanai.domain') || filePath.includes('urbanai.infrastructure') ||
        filePath.includes('tests/') || fileName.endsWith('.cs') || fileName.endsWith('.csproj')) {
      testScope.push('Backend unit tests');
      if (filePath.includes('urbanai.api') || filePath.includes('integration')) {
        testScope.push('Integration tests');
      }
    }
    
    // Frontend changes
    if (filePath.includes('urbanai.frontend') || fileName.endsWith('.tsx') || 
        fileName.endsWith('.ts') || fileName.endsWith('.js') || fileName.endsWith('.jsx') ||
        fileName === 'package.json' || fileName === 'package-lock.json') {
      testScope.push('Frontend unit tests');
      testScope.push('Type checking');
      testScope.push('Linting');
    }
    
    // Mobile changes
    if (filePath.includes('urbanai.mobile')) {
      testScope.push('Mobile tests (non-blocking)');
    }
    
    // Config/docs changes (no tests)
    if (fileName.endsWith('.md') || fileName.endsWith('.json') || 
        fileName === '.gitignore' || fileName === 'claude.md' ||
        filePath.includes('mocks/') || filePath.includes('docs/')) {
      testScope = ['No tests needed - config/docs only'];
    }
    
    // Workflow changes
    if (filePath.includes('.github/workflows/')) {
      testScope.push('Workflow validation');
    }
    
    if (testScope.length > 0) {
      console.log(`\n📝 File modified: ${path.basename(editedFile)}`);
      console.log('🧪 On next push to develop, CI will run:');
      testScope.forEach(scope => {
        console.log(`  • ${scope}`);
      });
      
      if (testScope.includes('No tests needed - config/docs only')) {
        console.log('💡 Build minutes saved by skipping unnecessary tests!');
      }
      console.log('');
    }

  } catch (error) {
    // Fail silently - hooks shouldn't interrupt normal operation
  }
}

// Run the tracker
trackChanges();