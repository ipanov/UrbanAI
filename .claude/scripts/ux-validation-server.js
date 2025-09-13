const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

class UXValidationServer {
    constructor() {
        this.browser = null;
        this.page = null;
        this.server = null;
        this.validationResults = [];
    }

    async initialize() {
        // Start browser for visual validation
        this.browser = await chromium.launch({
            headless: false,
            slowMo: 100
        });
        this.page = await this.browser.newPage();

        // Set viewport for consistent screenshots
        await this.page.setViewportSize({ width: 1200, height: 800 });

        console.log('✅ UX Validation Server initialized');
    }

    async captureDesignCheckpoint(url, checkpointName, description) {
        console.log(`📸 Capturing checkpoint: ${checkpointName}`);

        try {
            // Navigate to the page
            await this.page.goto(url, { waitUntil: 'networkidle' });

            // Take full page screenshot
            const screenshotPath = path.join(__dirname, '../screenshots', `${checkpointName}.png`);
            await this.page.screenshot({
                path: screenshotPath,
                fullPage: true
            });

            // Capture metrics
            const metrics = await this.page.evaluate(() => {
                return {
                    title: document.title,
                    url: window.location.href,
                    viewport: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    },
                    elementCounts: {
                        buttons: document.querySelectorAll('button, .btn').length,
                        links: document.querySelectorAll('a').length,
                        images: document.querySelectorAll('img').length,
                        forms: document.querySelectorAll('form').length
                    }
                };
            });

            const checkpoint = {
                name: checkpointName,
                description,
                timestamp: new Date().toISOString(),
                screenshotPath,
                url,
                metrics,
                status: 'captured'
            };

            this.validationResults.push(checkpoint);

            console.log(`✅ Checkpoint '${checkpointName}' captured successfully`);
            return checkpoint;

        } catch (error) {
            console.error(`❌ Failed to capture checkpoint '${checkpointName}':`, error.message);
            return null;
        }
    }

    async validateResponsiveDesign(url, checkpointName) {
        const viewports = [
            { name: 'mobile', width: 390, height: 844 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'desktop', width: 1200, height: 800 },
            { name: 'desktop-large', width: 1920, height: 1080 }
        ];

        const responsiveResults = [];

        for (const viewport of viewports) {
            await this.page.setViewportSize(viewport);
            await this.page.goto(url, { waitUntil: 'networkidle' });

            const screenshotPath = path.join(__dirname, '../screenshots', `${checkpointName}-${viewport.name}.png`);
            await this.page.screenshot({ path: screenshotPath, fullPage: true });

            // Check for responsive issues
            const issues = await this.page.evaluate(() => {
                const issues = [];

                // Check for horizontal scroll
                if (document.body.scrollWidth > window.innerWidth) {
                    issues.push('Horizontal scroll detected');
                }

                // Check for overlapping elements
                const buttons = document.querySelectorAll('button, .btn');
                if (buttons.length > 0) {
                    buttons.forEach((btn, index) => {
                        const rect = btn.getBoundingClientRect();
                        if (rect.width < 44 || rect.height < 44) {
                            issues.push(`Button ${index + 1} too small for touch (${rect.width}x${rect.height})`);
                        }
                    });
                }

                return issues;
            });

            responsiveResults.push({
                viewport: viewport.name,
                dimensions: `${viewport.width}x${viewport.height}`,
                screenshotPath,
                issues,
                status: issues.length === 0 ? 'passed' : 'issues-detected'
            });

            console.log(`📱 ${viewport.name} (${viewport.width}x${viewport.height}): ${issues.length === 0 ? '✅ Passed' : '⚠️ ' + issues.length + ' issues'}`);
        }

        return responsiveResults;
    }

    async validateAccessibility(url) {
        console.log('♿ Running accessibility validation...');

        await this.page.goto(url, { waitUntil: 'networkidle' });

        // Inject axe-core for accessibility testing
        await this.page.addScriptTag({
            url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
        });

        const a11yResults = await this.page.evaluate(() => {
            return new Promise((resolve) => {
                axe.run((err, results) => {
                    if (err) {
                        resolve({ error: err.message });
                    } else {
                        resolve({
                            violations: results.violations.map(v => ({
                                id: v.id,
                                impact: v.impact,
                                description: v.description,
                                help: v.help,
                                helpUrl: v.helpUrl,
                                nodes: v.nodes.length
                            })),
                            passes: results.passes.length,
                            incomplete: results.incomplete.length
                        });
                    }
                });
            });
        });

        console.log(`♿ Accessibility: ${a11yResults.violations?.length || 0} violations, ${a11yResults.passes || 0} passes`);
        return a11yResults;
    }

    async validatePerformance(url) {
        console.log('⚡ Running performance validation...');

        await this.page.goto(url, { waitUntil: 'networkidle' });

        const performanceMetrics = await this.page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');

            return {
                loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0,
                domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart) : 0,
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                resourceCount: performance.getEntriesByType('resource').length
            };
        });

        console.log(`⚡ Performance: Load ${performanceMetrics.loadTime}ms, FCP ${Math.round(performanceMetrics.firstContentfulPaint)}ms`);
        return performanceMetrics;
    }

    async generateValidationReport() {
        const reportPath = path.join(__dirname, '../reports', `ux-validation-${Date.now()}.json`);

        // Ensure reports directory exists
        const reportsDir = path.dirname(reportPath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalCheckpoints: this.validationResults.length,
                successfulCheckpoints: this.validationResults.filter(r => r.status === 'captured').length
            },
            checkpoints: this.validationResults
        };

        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📊 Validation report saved: ${reportPath}`);

        return report;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('🧹 UX Validation Server cleaned up');
    }
}

module.exports = { UXValidationServer };

// CLI usage
if (require.main === module) {
    const validator = new UXValidationServer();

    async function runValidation() {
        try {
            await validator.initialize();

            const url = process.argv[2] || 'http://localhost:8080/unified-web-landing-page.html';
            const checkpointName = process.argv[3] || 'landing-page-validation';

            console.log(`🚀 Running UX validation for: ${url}`);

            // Capture initial checkpoint
            await validator.captureDesignCheckpoint(url, checkpointName, 'Initial design validation');

            // Run responsive design validation
            const responsiveResults = await validator.validateResponsiveDesign(url, checkpointName);

            // Run accessibility validation
            const a11yResults = await validator.validateAccessibility(url);

            // Run performance validation
            const performanceResults = await validator.validatePerformance(url);

            // Add results to validation
            validator.validationResults[validator.validationResults.length - 1].responsive = responsiveResults;
            validator.validationResults[validator.validationResults.length - 1].accessibility = a11yResults;
            validator.validationResults[validator.validationResults.length - 1].performance = performanceResults;

            // Generate report
            await validator.generateValidationReport();

            console.log('✅ UX validation completed successfully!');

        } catch (error) {
            console.error('❌ UX validation failed:', error);
        } finally {
            await validator.cleanup();
        }
    }

    runValidation();
}