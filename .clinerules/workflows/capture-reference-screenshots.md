<task_objective>
Capture and organize reference screenshots from HTML mockups for visual validation system
</task_objective>

<detailed_sequence_of_steps>
1. **Scan HTML Mockups**: Identify all HTML files in mocks/ folder that need reference screenshots
2. **Check Existing References**: Review tests/visual-refs/ directory for existing reference images
3. **Launch Browser Instance**: Start Puppeteer MCP server for screenshot capture
4. **Process Each Mockup**: For each HTML file in mocks/ folder:
   - Load HTML file in browser
   - Capture desktop screenshot (1920x1080)
   - Capture mobile screenshot (375x667)
   - Capture tablet screenshot (768x1024)
   - Save screenshots with descriptive filenames
5. **Generate Reference Map**: Create tests/visual-refs/reference-map.json with component mappings
6. **Validate Screenshot Quality**: Ensure screenshots are clear and properly sized
7. **Update Memory Bank**: Record reference capture status in memory-bank/progress.md
8. **Create Comparison Scripts**: Update or create visual comparison tools
9. **Test Comparison System**: Validate that captured references work with comparison tools
10. **Document Reference System**: Update documentation with reference screenshot locations
</detailed_sequence_of_steps>

<mockup_files>
Available HTML mockups for reference capture:
- mocks/web-login-page.html - Login page design
- mocks/dashboard-page.html - Dashboard layout
- mocks/gdpr-compliance-page.html - GDPR cookie policy
- mocks/gdpr-data-management.html - Data management interface
- mocks/web-landing-page.html - Landing page design
- mocks/android-login-screen.html - Mobile login design
- mocks/android-landing-screen.html - Mobile landing design
</mockup_files>

<required_tools>
- Puppeteer MCP server for browser automation
- File system access for HTML mockup reading
- Image processing capabilities for screenshot optimization
- JSON configuration file creation
- Memory bank update capabilities
</required_tools>

<output_structure>
tests/visual-refs/
├── reference-map.json          # Component to mockup mapping
├── web-login-page/
│   ├── desktop-reference.png
│   ├── mobile-reference.png
│   └── tablet-reference.png
├── dashboard-page/
│   ├── desktop-reference.png
│   ├── mobile-reference.png
│   └── tablet-reference.png
└── [component-name]/
    ├── desktop-reference.png
    ├── mobile-reference.png
    └── tablet-reference.png
</output_structure>

<success_criteria>
- ✅ All HTML mockups processed and screenshots captured
- ✅ Reference images saved in organized directory structure
- ✅ reference-map.json created with proper component mappings
- ✅ Screenshots are high quality and properly sized
- ✅ Visual comparison tools can access reference images
- ✅ Reference system documented in memory bank
</success_criteria>

<failure_handling>
If screenshot capture fails:
1. **Browser Launch Issues**: Restart Puppeteer MCP server and retry
2. **HTML Loading Problems**: Check HTML file validity and paths
3. **Screenshot Quality Issues**: Adjust viewport settings and retry capture
4. **File System Permissions**: Ensure write access to tests/visual-refs/ directory
5. **Memory Issues**: Process mockups in smaller batches if needed

For each failure, provide specific error details and retry strategies.
</failure_handling>

<viewport_settings>
Desktop: 1920x1080 (full HD)
Tablet: 768x1024 (iPad portrait)
Mobile: 375x667 (iPhone SE)
</viewport_settings>
