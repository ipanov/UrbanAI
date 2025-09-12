#!/usr/bin/env node

/**
 * Visual Reference Screenshot Capture Script
 * Captures reference screenshots from HTML mockups for visual regression testing
 */

const fs = require('fs');
const path = require('path');

async function captureReferenceScreenshots() {
  console.log('🎨 Capturing visual reference screenshots from HTML mocks...');
  
  try {
    // Check if we have Puppeteer MCP access
    console.log('⚠️  Puppeteer MCP server required - Claude Code will handle screenshot capture');
    console.log('📁 Reference directory: tests/visual-refs/');
    
    // List available HTML mocks
    const mocksDir = path.join(process.cwd(), 'mocks');
    const mockFiles = fs.readdirSync(mocksDir).filter(file => file.endsWith('.html'));
    
    console.log('\n📋 Available HTML mockups for screenshot capture:');
    mockFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    
    console.log('\n💡 To capture reference screenshots:');
    console.log('   1. Ask Claude Code to use Puppeteer MCP server');
    console.log('   2. Navigate to each HTML mock file:// URL');
    console.log('   3. Capture full-page screenshots');
    console.log('   4. Save to tests/visual-refs/ with descriptive names');
    
    console.log('\n🎯 Expected reference files:');
    mockFiles.forEach(file => {
      const baseName = file.replace('.html', '');
      console.log(`   - tests/visual-refs/${baseName}-desktop.png`);
      console.log(`   - tests/visual-refs/${baseName}-mobile.png`);
    });
    
    // Create reference directory structure
    const refDir = path.join(process.cwd(), 'tests', 'visual-refs');
    if (!fs.existsSync(refDir)) {
      fs.mkdirSync(refDir, { recursive: true });
    }
    
    // Create reference mapping file
    const referenceMap = {
      created: new Date().toISOString(),
      description: "Visual reference screenshot mapping for HTML mockups",
      mockups: mockFiles.map(file => ({
        mockFile: file,
        component: file.replace('.html', '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        references: {
          desktop: `tests/visual-refs/${file.replace('.html', '')}-desktop.png`,
          mobile: `tests/visual-refs/${file.replace('.html', '')}-mobile.png`,
          tablet: `tests/visual-refs/${file.replace('.html', '')}-tablet.png`
        },
        mockPath: `mocks/${file}`,
        status: "pending_capture"
      }))
    };
    
    fs.writeFileSync(
      path.join(refDir, 'reference-map.json'),
      JSON.stringify(referenceMap, null, 2)
    );
    
    console.log('\n✅ Reference mapping created: tests/visual-refs/reference-map.json');
    console.log('🎯 Ready for Claude Code + Puppeteer screenshot capture');
    
  } catch (error) {
    console.error('❌ Error setting up reference capture:', error.message);
  }
}

// Run the script
captureReferenceScreenshots();