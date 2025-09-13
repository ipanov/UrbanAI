#!/usr/bin/env node

/**
 * Claude Code Designer
 * AI-powered design system for rapid UI/UX prototyping and implementation
 * Leverages existing Playwright MCP and Visual Validation System
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ClaudeCodeDesigner {
  constructor() {
    this.projectRoot = process.cwd();
    this.mocksDir = path.join(this.projectRoot, 'mocks');
    this.componentsDir = path.join(this.projectRoot, 'src', 'UrbanAI.Frontend', 'src', 'components');
    this.visualRefsDir = path.join(this.projectRoot, 'tests', 'visual-refs');
    this.designSystemPath = path.join(this.projectRoot, '.claude', 'design-system.json');
  }

  /**
   * Initialize the Claude Code Designer system
   */
  async initialize() {
    console.log('🎨 Initializing Claude Code Designer...\n');

    // Ensure required directories exist
    this.ensureDirectories();

    // Load or create design system configuration
    await this.loadDesignSystem();

    // Scan existing mockups and components
    await this.scanExistingAssets();

    console.log('✅ Claude Code Designer initialized successfully!\n');
  }

  /**
   * Generate a new component from a design prompt
   */
  async generateComponent(prompt, componentName, mockupFile = null) {
    console.log(`🚀 Generating component: ${componentName}`);
    console.log(`📝 Design prompt: ${prompt}\n`);

    try {
      // Step 1: Create HTML mockup if not provided
      let mockupPath;
      if (mockupFile) {
        mockupPath = path.join(this.mocksDir, mockupFile);
      } else {
        mockupPath = await this.generateMockup(prompt, componentName);
      }

      // Step 2: Generate React component based on mockup
      const componentPath = await this.generateReactComponent(componentName, mockupPath);

      // Step 3: Create reference screenshots
      await this.captureReferenceScreenshots(mockupPath, componentName);

      // Step 4: Implement visual validation
      await this.setupVisualValidation(componentName, mockupPath);

      // Step 5: Generate tests
      await this.generateTests(componentName);

      console.log(`✅ Component ${componentName} generated successfully!`);
      console.log(`📂 Files created:`);
      console.log(`   - HTML Mockup: ${mockupPath}`);
      console.log(`   - React Component: ${componentPath}`);
      console.log(`   - Visual References: tests/visual-refs/${componentName}/`);
      console.log(`   - Tests: src/UrbanAI.Frontend/tests/e2e/${componentName}.spec.ts\n`);

      return {
        mockupPath,
        componentPath,
        componentName
      };

    } catch (error) {
      console.error(`❌ Failed to generate component: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate HTML mockup from design prompt
   */
  async generateMockup(prompt, componentName) {
    console.log('📄 Generating HTML mockup...');

    const mockupContent = this.createMockupTemplate(prompt, componentName);
    const mockupFile = `${componentName.toLowerCase().replace(/\s+/g, '-')}-mockup.html`;
    const mockupPath = path.join(this.mocksDir, mockupFile);

    fs.writeFileSync(mockupPath, mockupContent);
    console.log(`   ✅ HTML mockup created: ${mockupFile}`);

    return mockupPath;
  }

  /**
   * Create HTML mockup template based on design prompt and system
   */
  createMockupTemplate(prompt, componentName) {
    const designSystem = this.loadDesignSystemSync();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} - Design Mockup</title>
    <style>
        /* Design System Variables */
        :root {
            --primary-color: ${designSystem.colors.primary};
            --secondary-color: ${designSystem.colors.secondary};
            --text-color: ${designSystem.colors.text};
            --background-color: ${designSystem.colors.background};
            --border-color: ${designSystem.colors.border};
            --font-family: ${designSystem.typography.fontFamily};
            --font-size-base: ${designSystem.typography.fontSize.base};
            --spacing-sm: ${designSystem.spacing.sm};
            --spacing-md: ${designSystem.spacing.md};
            --spacing-lg: ${designSystem.spacing.lg};
            --border-radius: ${designSystem.borders.radius};
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family);
            font-size: var(--font-size-base);
            color: var(--text-color);
            background-color: var(--background-color);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--spacing-lg);
        }

        /* Component-specific styles based on design prompt */
        .${componentName.toLowerCase().replace(/\s+/g, '-')} {
            /* Generated based on: ${prompt} */
            background: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: var(--spacing-md);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: var(--spacing-md);
            }
        }

        /* Interactive States */
        .button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: var(--spacing-sm) var(--spacing-md);
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }

        .button:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        .button:active {
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="${componentName.toLowerCase().replace(/\s+/g, '-')}">
            <h2>${componentName}</h2>
            <p>Design Prompt: ${prompt}</p>

            <!-- TODO: Add actual mockup content based on design prompt -->
            <div class="mockup-placeholder">
                <p>🎨 Mockup content will be generated here based on the design prompt.</p>
                <p>This template provides the foundation with your design system variables.</p>
                <button class="button">Interactive Button Example</button>
            </div>
        </div>
    </div>

    <!-- Design System Documentation -->
    <script>
        // Design system data for component generation
        window.designSystem = ${JSON.stringify(designSystem, null, 2)};
        console.log('Design System loaded:', window.designSystem);
    </script>
</body>
</html>`;
  }

  /**
   * Generate React component from HTML mockup
   */
  async generateReactComponent(componentName, mockupPath) {
    console.log('⚛️  Generating React component...');

    const componentTemplate = this.createReactComponentTemplate(componentName, mockupPath);
    const componentFile = `${componentName}.tsx`;
    const componentPath = path.join(this.componentsDir, componentFile);

    // Ensure component directory exists
    if (!fs.existsSync(this.componentsDir)) {
      fs.mkdirSync(this.componentsDir, { recursive: true });
    }

    fs.writeFileSync(componentPath, componentTemplate);
    console.log(`   ✅ React component created: ${componentFile}`);

    return componentPath;
  }

  /**
   * Create React component template
   */
  createReactComponentTemplate(componentName, mockupPath) {
    const designSystem = this.loadDesignSystemSync();

    return `import React from 'react';
import styled from 'styled-components';

// Design System Integration
const theme = ${JSON.stringify(designSystem, null, 2)};

interface ${componentName}Props {
  // Add your props here
  className?: string;
  children?: React.ReactNode;
}

const ${componentName}Container = styled.div\`
  /* Generated from mockup: ${mockupPath} */
  background: \${props => props.theme?.colors?.background || theme.colors.background};
  border: 1px solid \${props => props.theme?.colors?.border || theme.colors.border};
  border-radius: \${props => props.theme?.borders?.radius || theme.borders.radius};
  padding: \${props => props.theme?.spacing?.md || theme.spacing.md};
  font-family: \${props => props.theme?.typography?.fontFamily || theme.typography.fontFamily};
  color: \${props => props.theme?.colors?.text || theme.colors.text};

  /* Responsive Design */
  @media (max-width: 768px) {
    padding: \${props => props.theme?.spacing?.sm || theme.spacing.sm};
  }
\`;

const StyledButton = styled.button\`
  background: \${props => props.theme?.colors?.primary || theme.colors.primary};
  color: white;
  border: none;
  padding: \${props => props.theme?.spacing?.sm || theme.spacing.sm} \${props => props.theme?.spacing?.md || theme.spacing.md};
  border-radius: \${props => props.theme?.borders?.radius || theme.borders.radius};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid \${props => props.theme?.colors?.primary || theme.colors.primary};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
\`;

export const ${componentName}: React.FC<${componentName}Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <${componentName}Container className={className} {...props}>
      <h2>${componentName}</h2>
      {children}

      {/* TODO: Implement actual component logic based on mockup */}
      <div className="component-content">
        <p>🚀 Component generated by Claude Code Designer</p>
        <StyledButton>Interactive Button</StyledButton>
      </div>
    </${componentName}Container>
  );
};

export default ${componentName};
`;
  }

  /**
   * Capture reference screenshots using existing system
   */
  async captureReferenceScreenshots(mockupPath, componentName) {
    console.log('📸 Capturing reference screenshots...');

    try {
      // Use existing reference screenshot system
      await execAsync('node .claude/scripts/capture-reference-screenshots.js');
      console.log(`   ✅ Reference screenshots captured for ${componentName}`);
    } catch (error) {
      console.warn(`   ⚠️  Reference screenshot capture failed: ${error.message}`);
    }
  }

  /**
   * Setup visual validation for component
   */
  async setupVisualValidation(componentName, mockupPath) {
    console.log('🎯 Setting up visual validation...');

    // Update reference map with new component
    const referenceMapPath = path.join(this.visualRefsDir, 'reference-map.json');
    let referenceMap = { mockups: [] };

    if (fs.existsSync(referenceMapPath)) {
      referenceMap = JSON.parse(fs.readFileSync(referenceMapPath, 'utf8'));
    }

    // Add new component to reference map
    const mockupFile = path.basename(mockupPath);
    referenceMap.mockups.push({
      component: componentName,
      mockFile: mockupFile,
      mockPath: mockupPath,
      references: {
        desktop: \`tests/visual-refs/\${componentName}/desktop.png\`,
        mobile: \`tests/visual-refs/\${componentName}/mobile.png\`
      }
    });

    // Ensure visual refs directory exists
    if (!fs.existsSync(this.visualRefsDir)) {
      fs.mkdirSync(this.visualRefsDir, { recursive: true });
    }

    fs.writeFileSync(referenceMapPath, JSON.stringify(referenceMap, null, 2));
    console.log(`   ✅ Visual validation configured for ${componentName}`);
  }

  /**
   * Generate Playwright tests for component
   */
  async generateTests(componentName) {
    console.log('🧪 Generating tests...');

    const testContent = this.createTestTemplate(componentName);
    const testFile = \`\${componentName.toLowerCase().replace(/\s+/g, '-')}.spec.ts\`;
    const testPath = path.join(this.projectRoot, 'src', 'UrbanAI.Frontend', 'tests', 'e2e', testFile);

    // Ensure test directory exists
    const testDir = path.dirname(testPath);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    fs.writeFileSync(testPath, testContent);
    console.log(`   ✅ Tests created: ${testFile}`);
  }

  /**
   * Create test template for component
   */
  createTestTemplate(componentName) {
    return \`import { test, expect } from '@playwright/test';

test.describe('${componentName} Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to component page (adjust URL as needed)
    await page.goto('/');
  });

  test('should render ${componentName} correctly', async ({ page }) => {
    // Find the component
    const component = page.locator('.${componentName.toLowerCase().replace(/\\s+/g, '-')}');
    await expect(component).toBeVisible();

    // Visual regression test
    await expect(page).toHaveScreenshot('${componentName.toLowerCase()}-desktop.png');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const component = page.locator('.${componentName.toLowerCase().replace(/\\s+/g, '-')}');
    await expect(component).toBeVisible();

    // Mobile visual regression test
    await expect(page).toHaveScreenshot('${componentName.toLowerCase()}-mobile.png');
  });

  test('should handle interactive states', async ({ page }) => {
    const button = page.locator('button').first();

    // Test hover state (if applicable)
    await button.hover();
    await expect(button).toHaveCSS('opacity', '0.9');

    // Test focus state
    await button.focus();
    await expect(button).toBeFocused();

    // Test click interaction
    await button.click();
    // Add assertions based on expected behavior
  });

  test('should meet accessibility standards', async ({ page }) => {
    // Check for proper ARIA attributes
    const component = page.locator('.${componentName.toLowerCase().replace(/\\s+/g, '-')}');

    // Check color contrast (you can integrate axe-core here)
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
\`;
  }

  /**
   * Load or create design system configuration
   */
  async loadDesignSystem() {
    if (fs.existsSync(this.designSystemPath)) {
      console.log('📋 Loading existing design system...');
    } else {
      console.log('🎨 Creating default design system...');
      this.createDefaultDesignSystem();
    }
  }

  /**
   * Load design system synchronously
   */
  loadDesignSystemSync() {
    if (fs.existsSync(this.designSystemPath)) {
      return JSON.parse(fs.readFileSync(this.designSystemPath, 'utf8'));
    }

    const defaultSystem = this.getDefaultDesignSystem();
    fs.writeFileSync(this.designSystemPath, JSON.stringify(defaultSystem, null, 2));
    return defaultSystem;
  }

  /**
   * Create default design system
   */
  createDefaultDesignSystem() {
    const designSystem = this.getDefaultDesignSystem();

    fs.writeFileSync(this.designSystemPath, JSON.stringify(designSystem, null, 2));
    console.log('   ✅ Default design system created');
  }

  /**
   * Get default design system configuration
   */
  getDefaultDesignSystem() {
    return {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
        text: '#212529',
        background: '#ffffff',
        border: '#dee2e6'
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem'
      },
      borders: {
        radius: '0.25rem',
        width: '1px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      },
      breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    };
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [
      this.mocksDir,
      this.componentsDir,
      this.visualRefsDir,
      path.dirname(this.designSystemPath)
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(\`   📁 Created directory: \${dir}\`);
      }
    });
  }

  /**
   * Scan existing mockups and components
   */
  async scanExistingAssets() {
    console.log('🔍 Scanning existing assets...');

    // Scan mockups
    if (fs.existsSync(this.mocksDir)) {
      const mockups = fs.readdirSync(this.mocksDir).filter(file => file.endsWith('.html'));
      console.log(\`   📄 Found \${mockups.length} existing mockups\`);
    }

    // Scan components
    if (fs.existsSync(this.componentsDir)) {
      const components = fs.readdirSync(this.componentsDir).filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
      console.log(\`   ⚛️  Found \${components.length} existing components\`);
    }
  }

  /**
   * Run visual validation workflow
   */
  async runVisualValidation(componentName) {
    console.log(\`🎯 Running visual validation for \${componentName}...\`);

    try {
      await execAsync(\`node .claude/scripts/visual-compare.js "\${componentName}"\`);
      console.log(\`   ✅ Visual validation completed for \${componentName}\`);
    } catch (error) {
      console.error(\`   ❌ Visual validation failed: \${error.message}\`);
      throw error;
    }
  }

  /**
   * Generate complete design workflow
   */
  async designWorkflow(prompt, componentName, options = {}) {
    console.log('🎨 Starting Claude Code Designer Workflow\\n');
    console.log('=' .repeat(50));

    try {
      // Initialize if not done
      await this.initialize();

      // Generate component
      const result = await this.generateComponent(prompt, componentName, options.mockupFile);

      // Run visual validation
      if (options.skipValidation !== true) {
        await this.runVisualValidation(componentName);
      }

      console.log('🎉 Design workflow completed successfully!\\n');
      console.log('🚀 Next steps:');
      console.log('1. Review the generated HTML mockup');
      console.log('2. Customize the React component as needed');
      console.log('3. Run visual validation: npm run test:e2e:visual');
      console.log('4. Integrate component into your application\\n');

      return result;

    } catch (error) {
      console.error(\`❌ Design workflow failed: \${error.message}\`);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const designer = new ClaudeCodeDesigner();

  if (args.length === 0) {
    console.log('Claude Code Designer - AI-powered UI/UX prototyping\\n');
    console.log('Usage:');
    console.log('  node claude-code-designer.js init                           # Initialize the system');
    console.log('  node claude-code-designer.js generate <prompt> <component>  # Generate component');
    console.log('  node claude-code-designer.js validate <component>          # Run visual validation');
    console.log('\\nExamples:');
    console.log('  node claude-code-designer.js generate "Modern login form with social auth" LoginForm');
    console.log('  node claude-code-designer.js generate "Dashboard with cards and metrics" Dashboard');
    console.log('  node claude-code-designer.js validate LoginForm');
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'init':
        await designer.initialize();
        break;

      case 'generate':
        if (args.length < 3) {
          console.error('❌ Usage: generate <prompt> <component-name>');
          process.exit(1);
        }
        const prompt = args[1];
        const componentName = args[2];
        await designer.designWorkflow(prompt, componentName);
        break;

      case 'validate':
        if (args.length < 2) {
          console.error('❌ Usage: validate <component-name>');
          process.exit(1);
        }
        const validationComponent = args[1];
        await designer.runVisualValidation(validationComponent);
        break;

      default:
        console.error(\`❌ Unknown command: \${command}\`);
        process.exit(1);
    }
  } catch (error) {
    console.error(\`❌ Error: \${error.message}\`);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { ClaudeCodeDesigner };

// Run CLI if called directly
if (require.main === module) {
  main();
}