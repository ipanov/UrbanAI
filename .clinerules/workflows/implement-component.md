<task_objective>
Implement a complete frontend component with automated visual validation and quality assurance
</task_objective>

<detailed_sequence_of_steps>
1. **Component Analysis**: Read component requirements from design specifications and HTML mockups
2. **Identify HTML Mockup**: Locate corresponding HTML file in mocks/ folder for visual reference
3. **Check Existing Implementation**: Review current component code in src/UrbanAI.Frontend/src/
4. **Implement Component Logic**: Create or update React component with proper TypeScript types
5. **Apply Styling**: Implement CSS modules or styled-components matching design specifications
6. **Add Responsive Design**: Ensure component works across desktop, tablet, and mobile breakpoints
7. **Implement Interactive States**: Add hover, focus, active, and disabled states as per design
8. **Run TypeScript Checks**: Validate code with tsc --noEmit for type safety
9. **Execute Linting**: Run ESLint to ensure code quality standards
10. **Start Development Server**: Use /start-dev-services.md workflow to launch frontend
11. **Visual Validation**: Execute /visual-validate-frontend.md workflow for pixel-perfect comparison
12. **Cross-browser Testing**: Validate component in multiple browsers if required
13. **Performance Check**: Ensure component meets performance benchmarks
14. **Update Documentation**: Add component documentation and usage examples
15. **Memory Bank Update**: Record implementation details in memory-bank/progress.md
16. **Commit Changes**: Stage and commit component with descriptive message
17. **Push to Repository**: Push changes to appropriate branch (develop/feature branch)
</detailed_sequence_of_steps>

<required_tools>
- React development environment
- TypeScript compiler
- ESLint for code quality
- Visual validation tools (Puppeteer MCP)
- Git for version control
- Memory bank update capabilities
- Development server management
</required_tools>

<quality_gates>
- ✅ TypeScript compilation passes without errors
- ✅ ESLint validation passes with no errors
- ✅ Visual validation matches HTML mockup reference
- ✅ Responsive design validated across breakpoints
- ✅ Interactive states properly implemented
- ✅ Performance benchmarks met
- ✅ Code documented and commented appropriately
- ✅ Changes committed and pushed to repository
</quality_gates>

<success_criteria>
- ✅ Component renders correctly in development environment
- ✅ Visual appearance matches HTML mockup exactly
- ✅ Responsive behavior works across all screen sizes
- ✅ Interactive states function as designed
- ✅ Code passes all quality checks (TypeScript, ESLint)
- ✅ Component documented and ready for integration
- ✅ Implementation committed to version control
</success_criteria>

<failure_handling>
If implementation fails quality gates:
1. **TypeScript Errors**: Fix type issues and re-run compilation
2. **ESLint Violations**: Address code quality issues and re-run linting
3. **Visual Differences**: Identify specific discrepancies and iterate implementation
4. **Performance Issues**: Optimize component and re-test performance
5. **Responsive Problems**: Fix breakpoint-specific issues and re-validate
6. **Documentation Missing**: Complete documentation and update component docs

For each failure, provide specific recommendations and ask user for approval before proceeding.
</failure_handling>

<integration_notes>
- Component should follow established design system patterns
- Use existing utility functions and shared components when possible
- Maintain consistency with other components in the application
- Follow TypeScript and React best practices
- Ensure accessibility compliance (WCAG guidelines)
- Test component integration with existing application state
</integration_notes>
