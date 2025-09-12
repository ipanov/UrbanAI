#!/usr/bin/env node

/**
 * Visual Comparison Tool for Claude Code
 * Helps compare implementation screenshots with reference mockups
 */

const fs = require('fs');
const path = require('path');

function visualCompare(componentName, implementationScreenshot) {
  console.log('🎨 Visual Comparison Tool');
  console.log('========================');
  
  try {
    // Load reference map
    const referenceMapPath = path.join(process.cwd(), 'tests', 'visual-refs', 'reference-map.json');
    
    if (!fs.existsSync(referenceMapPath)) {
      console.log('❌ No reference map found');
      console.log('💡 Run: node .claude/scripts/capture-reference-screenshots.js');
      return;
    }
    
    const referenceMap = JSON.parse(fs.readFileSync(referenceMapPath, 'utf8'));
    
    // Find matching component
    const component = referenceMap.mockups.find(m => 
      m.component.toLowerCase().includes(componentName?.toLowerCase() || '') ||
      m.mockFile.includes(componentName || '')
    );
    
    if (!component) {
      console.log('❌ Component not found in reference map');
      console.log('📋 Available components:');
      referenceMap.mockups.forEach(m => {
        console.log(`   - ${m.component} (${m.mockFile})`);
      });
      return;
    }
    
    console.log(`🎯 Comparing: ${component.component}`);
    console.log(`📄 HTML Mock: ${component.mockPath}`);
    console.log('');
    
    // Visual comparison checklist
    console.log('📝 Visual Comparison Checklist:');
    console.log('');
    console.log('🖥️  DESKTOP COMPARISON:');
    console.log(`   Reference: ${component.references.desktop}`);
    console.log(`   Implementation: ${implementationScreenshot || 'Take screenshot now'}`);
    console.log('   ✅ Layout matches');
    console.log('   ✅ Colors and typography match');
    console.log('   ✅ Spacing and proportions correct');
    console.log('   ✅ Interactive states properly styled');
    console.log('');
    
    console.log('📱 MOBILE COMPARISON:');
    console.log(`   Reference: ${component.references.mobile}`);
    console.log('   Implementation: Take mobile screenshot');
    console.log('   ✅ Responsive design works');
    console.log('   ✅ Mobile-specific interactions');
    console.log('   ✅ Touch-friendly sizing');
    console.log('');
    
    console.log('⚡ INTERACTION TESTING:');
    console.log('   ✅ Hover states match design');
    console.log('   ✅ Focus states for accessibility');
    console.log('   ✅ Loading states if applicable');
    console.log('   ✅ Error states styled correctly');
    console.log('');
    
    // Instructions for Claude Code
    console.log('🤖 FOR CLAUDE CODE:');
    console.log('1. Use Puppeteer MCP server to take screenshot of implementation');
    console.log('2. Compare side-by-side with reference images');
    console.log('3. Identify specific differences');
    console.log('4. Iterate implementation until visual match achieved');
    console.log('5. Mark component as visually validated');
    console.log('');
    
    // Save comparison session
    const sessionLog = {
      timestamp: new Date().toISOString(),
      component: component.component,
      mockFile: component.mockFile,
      implementationScreenshot: implementationScreenshot || 'pending',
      status: 'in_progress',
      checklist: {
        desktop_layout: false,
        mobile_responsive: false,
        colors_typography: false,
        spacing_proportions: false,
        interactive_states: false
      }
    };
    
    const sessionsDir = path.join(process.cwd(), 'tests', 'visual-sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }
    
    const sessionFile = path.join(sessionsDir, `${component.mockFile.replace('.html', '')}-session.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(sessionLog, null, 2));
    
    console.log(`📄 Session logged: ${sessionFile}`);
    console.log('✅ Ready for visual comparison!');
    
  } catch (error) {
    console.error('❌ Visual comparison failed:', error.message);
  }
}

// Handle command line arguments
const componentName = process.argv[2];
const screenshotPath = process.argv[3];

if (!componentName) {
  console.log('Usage: node visual-compare.js <component-name> [screenshot-path]');
  console.log('Example: node visual-compare.js "login" "implementation-screenshot.png"');
  process.exit(1);
}

visualCompare(componentName, screenshotPath);