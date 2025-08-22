#!/usr/bin/env node

/**
 * Claude Hook: Push Monitor
 * Runs after Bash commands to detect git pushes and provide CI guidance
 */

const fs = require('fs');
const path = require('path');

function monitorPush() {
  try {
    // Check if the command was likely a git push
    const args = process.argv.slice(2);
    const bashCommand = args.join(' ');
    
    if (bashCommand.includes('git push')) {
      console.log('\n🔄 Git push detected!');
      
      // Determine which branch was pushed
      let branch = 'unknown';
      if (bashCommand.includes('origin develop') || bashCommand.includes('develop')) {
        branch = 'develop';
      } else if (bashCommand.includes('origin main') || bashCommand.includes('main')) {
        branch = 'main';
      }
      
      if (branch === 'develop') {
        console.log('📋 Smart CI Pipeline will run:');
        console.log('  • Intelligent test selection based on changed files');
        console.log('  • Only relevant unit tests (no UI/E2E tests)'); 
        console.log('  • Automatic issue creation if CI fails');
        console.log('🔗 Monitor: https://github.com/YourRepo/UrbanAI/actions');
      } else if (branch === 'main') {
        console.log('🚀 Full CI/CD Pipeline will run:');
        console.log('  • Complete test suite (unit, integration, E2E)');
        console.log('  • Security analysis with CodeQL');
        console.log('  • Production deployment');
        console.log('⚠️  High-priority issue will be created if any step fails');
      }
      
      console.log('\n💡 CI failure hooks are configured to auto-create GitHub issues');
      console.log('');
    }
    
    // Check for potential CI-triggering commands
    if (bashCommand.includes('dotnet build') || bashCommand.includes('npm run build')) {
      console.log('\n💻 Local build detected - consider running tests before pushing:');
      if (bashCommand.includes('dotnet')) {
        console.log('  dotnet test --configuration Release');
      }
      if (bashCommand.includes('npm')) {
        console.log('  npm run test && npm run type-check && npm run lint');
      }
      console.log('');
    }

  } catch (error) {
    // Fail silently - hooks shouldn't interrupt normal operation
  }
}

// Run the monitor
monitorPush();