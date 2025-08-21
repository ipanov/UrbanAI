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
    
    // Check for active CI failure issues via GitHub CLI
    try {
      const openIssues = execSync('gh issue list --label "ci-failure" --state open --limit 5 --json number,title,url', { encoding: 'utf-8' }).trim();
      if (openIssues && openIssues !== '[]') {
        const issues = JSON.parse(openIssues);
        if (issues.length > 0) {
          console.log('\n⚠️  ACTIVE CI FAILURES DETECTED');
          console.log(`📄 ${issues.length} open CI failure issue(s):`);
          
          issues.forEach(issue => {
            console.log(`🔗 Issue #${issue.number}: ${issue.title.substring(0, 60)}...`);
            console.log(`   ${issue.url}`);
          });
          
          console.log('💡 Consider addressing CI failures before continuing development\n');
        }
      }
    } catch (error) {
      // Ignore if gh CLI not available or not authenticated
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