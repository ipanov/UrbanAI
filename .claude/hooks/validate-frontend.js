#!/usr/bin/env node

/**
 * Claude Hook: Enhanced Frontend Validator with Visual Testing
 * Runs after MultiEdit operations to validate frontend changes before CI runs
 * Includes TypeScript, ESLint, Build, and Visual Regression Testing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function validateFrontend() {
  try {
    // Check if we're in the frontend directory or editing frontend files
    const cwd = process.cwd();
    const isFrontendEdit = cwd.includes('UrbanAI.Frontend') || 
                         process.argv.some(arg => arg.includes('UrbanAI.Frontend'));
    
    if (!isFrontendEdit) return;

    console.log('\n🔍 Validating frontend changes...');
    
    // Check if frontend directory exists
    const frontendDir = path.join(process.cwd(), 'src', 'UrbanAI.Frontend');
    if (!fs.existsSync(frontendDir)) {
      console.log('❌ Frontend directory not found');
      return;
    }

    // Run quick validations
    const validations = [];
    
    try {
      // Type check
      console.log('  🔧 Running TypeScript check...');
      execSync('npm run type-check', { 
        cwd: frontendDir, 
        stdio: 'pipe',
        timeout: 10000 
      });
      validations.push('✅ TypeScript: OK');
    } catch (error) {
      validations.push('❌ TypeScript: ERRORS');
      console.log('    Type errors detected - CI will fail');
    }

    try {
      // Lint check
      console.log('  🧹 Running ESLint...');
      execSync('npm run lint', { 
        cwd: frontendDir, 
        stdio: 'pipe',
        timeout: 8000 
      });
      validations.push('✅ Linting: OK');
    } catch (error) {
      validations.push('❌ Linting: ERRORS');
      console.log('    Lint errors detected - CI will fail');
    }

    try {
      // Quick build test
      console.log('  📦 Testing build...');
      execSync('npm run build', { 
        cwd: frontendDir, 
        stdio: 'pipe',
        timeout: 15000 
      });
      validations.push('✅ Build: OK');
    } catch (error) {
      validations.push('❌ Build: FAILED');
      console.log('    Build errors detected - CI will fail');
    }

    // Visual validation check
    try {
      console.log('  🎨 Checking for visual validation requirements...');
      const referenceMapPath = path.join(process.cwd(), 'tests', 'visual-refs', 'reference-map.json');
      
      if (fs.existsSync(referenceMapPath)) {
        const referenceMap = JSON.parse(fs.readFileSync(referenceMapPath, 'utf8'));
        const hasReferences = referenceMap.mockups.some(m => m.status === 'captured');
        
        if (hasReferences) {
          validations.push('✅ Visual: References available');
          console.log('    📸 Visual references found - manual visual comparison recommended');
        } else {
          validations.push('⚠️  Visual: No reference screenshots');
          console.log('    📸 Run: node .claude/scripts/capture-reference-screenshots.js');
        }
      } else {
        validations.push('⚠️  Visual: No reference system');
        console.log('    📸 Visual validation system not initialized');
      }
    } catch (error) {
      validations.push('⚠️  Visual: Check failed');
    }

    // Report results
    console.log('\n📋 Enhanced Frontend Validation Results:');
    validations.forEach(result => console.log(`  ${result}`));
    
    const hasErrors = validations.some(v => v.includes('❌'));
    const hasWarnings = validations.some(v => v.includes('⚠️'));
    
    if (hasErrors) {
      console.log('\n❌ Critical issues detected - fix before pushing to avoid CI failures');
      console.log('💡 Run individual commands in src/UrbanAI.Frontend/ to debug');
    } else if (hasWarnings) {
      console.log('\n⚠️  Warnings detected - consider addressing for better quality');
      console.log('🎨 Visual validation: Ensure UI matches design mockups');
    } else {
      console.log('\n✅ All validations passed - ready for CI');
      console.log('🎯 Don\'t forget to visually compare implementation with mockups!');
    }
    console.log('');

  } catch (error) {
    console.log('\n⚠️  Enhanced frontend validation failed - check manually before pushing\n');
  }
}

// Run validation
validateFrontend();