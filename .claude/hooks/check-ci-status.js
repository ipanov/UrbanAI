#!/usr/bin/env node

/**
 * Claude Hook: CI Status Checker
 * Runs on UserPromptSubmit to check if there are any CI failures that need attention
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkCIStatus() {
  try {
    // Check if we're in a git repository
    const isGitRepo = fs.existsSync('.git');
    if (!isGitRepo) {
      return;
    }

    // Get current branch
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    
    // Check for active CI failure context
    const contextFile = 'memory-bank/activeContext.md';
    if (fs.existsSync(contextFile)) {
      const contextContent = fs.readFileSync(contextFile, 'utf-8');
      
      // Check if context is recent (within last 2 hours)
      const contextStat = fs.statSync(contextFile);
      const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
      
      if (contextStat.mtime.getTime() > twoHoursAgo) {
        console.log('\n⚠️  ACTIVE CI FAILURE DETECTED');
        console.log('📄 CI failure context available in memory-bank/activeContext.md');
        
        // Extract issue link if available
        const issueMatch = contextContent.match(/- Issue: #(\d+) (https:\/\/[^\s]+)/);
        if (issueMatch) {
          console.log(`🔗 GitHub Issue: #${issueMatch[1]} ${issueMatch[2]}`);
        }
        
        console.log('💡 Consider addressing CI failures before continuing development\n');
      }
    }

    // Check git status for uncommitted changes
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    if (gitStatus) {
      const changedFiles = gitStatus.split('\n').length;
      if (changedFiles > 5) {
        console.log(`\n📝 ${changedFiles} files have changes - consider committing progress\n`);
      }
    }

    // Check if on develop branch with unpushed commits
    if (currentBranch === 'develop') {
      try {
        const unpushed = execSync('git log origin/develop..HEAD --oneline', { encoding: 'utf-8' }).trim();
        if (unpushed) {
          const commitCount = unpushed.split('\n').length;
          console.log(`\n🚀 ${commitCount} commit(s) ready to push to develop - CI will run automatically\n`);
        }
      } catch (error) {
        // Ignore if remote tracking doesn't exist
      }
    }

  } catch (error) {
    // Fail silently - hooks shouldn't interrupt normal operation
  }
}

// Run the check
checkCIStatus();