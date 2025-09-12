<task_objective>
Execute complete frontend development checklist with automated quality assurance and visual validation
</task_objective>

<detailed_sequence_of_steps>
1. **Pre-Development Setup**: Ensure development environment is properly configured
2. **Code Quality Gates**: Run TypeScript compilation and ESLint validation
3. **Unit Test Execution**: Execute component unit tests with coverage reporting
4. **Build Validation**: Ensure production build completes successfully
5. **Development Server Test**: Start services using /start-dev-services.md workflow
6. **Visual Validation**: Execute /visual-validate-frontend.md workflow
7. **Responsive Testing**: Validate component across multiple viewport sizes
8. **Accessibility Audit**: Run accessibility checks using browser tools
9. **Performance Testing**: Validate bundle size and runtime performance
10. **Cross-browser Testing**: Test in supported browsers (Chrome, Firefox, Safari, Edge)
11. **Integration Testing**: Validate component integration with existing application
12. **Security Scan**: Run basic security checks on component code
13. **Documentation Review**: Ensure component is properly documented
14. **Memory Bank Update**: Record all validation results in memory-bank/progress.md
15. **Final Approval**: Request human confirmation for production readiness
</detailed_sequence_of_steps>

<quality_gates>
<code_quality>
- ✅ TypeScript compilation: tsc --noEmit passes
- ✅ ESLint validation: No errors or warnings
- ✅ Code formatting: Prettier standards met
- ✅ Import organization: Clean and logical imports
</code_quality>

<testing>
- ✅ Unit tests: 80%+ coverage achieved
- ✅ Integration tests: Component works with app state
- ✅ E2E tests: Critical user flows validated
- ✅ Visual regression: No unexpected visual changes
</testing>

<performance>
- ✅ Bundle size: < 200KB initial bundle
- ✅ Runtime performance: < 100ms interaction response
- ✅ Memory usage: No memory leaks detected
- ✅ Network requests: Optimized and cached
</performance>

<compatibility>
- ✅ Responsive design: Works on mobile, tablet, desktop
- ✅ Browser support: Chrome, Firefox, Safari, Edge
- ✅ Accessibility: WCAG 2.1 AA compliance
- ✅ Touch devices: Proper touch interactions
</compatibility>

<visual_design>
- ✅ Pixel-perfect match: HTML mockup reference
- ✅ Design system compliance: Consistent with brand
- ✅ Interactive states: Hover, focus, active, disabled
- ✅ Loading states: Proper loading indicators
- ✅ Error states: Clear error messaging
</visual_design>
</quality_gates>

<required_tools>
- TypeScript compiler for type checking
- ESLint for code quality analysis
- Jest/Vitest for unit testing
- Playwright for E2E testing
- Puppeteer MCP for visual validation
- Lighthouse for performance auditing
- Browser tools for accessibility testing
- Bundle analyzer for size optimization
</required_tools>

<success_criteria>
- ✅ All quality gates pass without exceptions
- ✅ Visual validation matches HTML mockups exactly
- ✅ Performance benchmarks achieved
- ✅ Accessibility requirements met
- ✅ Cross-browser compatibility confirmed
- ✅ Code quality standards maintained
- ✅ Documentation complete and accurate
- ✅ Ready for production deployment
</success_criteria>

<failure_handling>
For each failed quality gate, provide:
1. **Specific Error Details**: Exact error messages and locations
2. **Root Cause Analysis**: Why the failure occurred
3. **Fix Recommendations**: Step-by-step resolution instructions
4. **Prevention Measures**: How to avoid similar issues in future
5. **Severity Assessment**: Impact on production readiness

Allow user to:
- Accept exceptions with documented justification
- Request fixes with specific guidance
- Skip non-critical gates with approval
- Re-run failed validations after fixes
</failure_handling>

<reporting>
Generate comprehensive report including:
- Quality gate results with pass/fail status
- Performance metrics and benchmarks
- Visual validation comparison results
- Accessibility audit findings
- Security scan results
- Recommendations for improvement
- Timeline and effort estimates for fixes
</reporting>
