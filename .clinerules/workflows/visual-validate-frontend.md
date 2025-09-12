<task_objective>
Complete automated visual validation for frontend component implementation against HTML mockups
</task_objective>

<detailed_sequence_of_steps>
1. **Load Component Context**: Read the component name and identify corresponding HTML mockup from mocks/ folder
2. **Take Implementation Screenshot**: Use Puppeteer MCP server to capture screenshot of current implementation
3. **Load Reference Images**: Retrieve reference screenshots from tests/visual-refs/ directory
4. **Run Visual Comparison**: Execute automated pixel-perfect comparison using visual comparison tools
5. **Validate Responsive Design**: Test component across desktop, tablet, and mobile breakpoints
6. **Check Interactive States**: Validate hover, focus, active, and disabled states match design
7. **Generate Validation Report**: Create detailed report with specific differences and recommendations
8. **Update Memory Bank**: Record validation results in memory-bank/progress.md
9. **Request Human Confirmation**: Ask user to review validation results and approve/reject implementation
10. **Mark Component Complete**: Update component status as visually validated in project tracking
</detailed_sequence_of_steps>

<required_tools>
- Puppeteer MCP server for screenshot capture
- File system access for reference image retrieval
- Visual comparison algorithms for pixel analysis
- Responsive testing tools for breakpoint validation
- Memory bank update capabilities
</required_tools>

<success_criteria>
- ✅ Implementation screenshot matches HTML mockup reference
- ✅ Responsive design validated across all breakpoints
- ✅ Interactive states function as designed
- ✅ Visual comparison checklist completed
- ✅ Validation results documented in memory bank
- ✅ Component marked as visually validated
</success_criteria>

<failure_handling>
If visual validation fails:
1. Identify specific differences (colors, spacing, typography, layout)
2. Generate detailed comparison report with annotated screenshots
3. Provide actionable recommendations for fixes
4. Ask user whether to iterate implementation or accept differences
5. Document exceptions in memory bank for future reference
</failure_handling>
