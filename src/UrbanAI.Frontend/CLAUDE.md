# UrbanAI Frontend Context

This file provides specific guidance for working with the React TypeScript frontend application.

## Architecture Overview

The frontend is a single-page application built with:
- **React 18**: Component-based UI framework with hooks
- **TypeScript**: Type safety and enhanced developer experience
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation

## Project Structure

```
src/UrbanAI.Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── atoms/           # Basic UI elements (Button, Input, etc.)
│   │   ├── __tests__/       # Component tests
│   │   └── *.tsx            # Page-level components
│   ├── config/              # Configuration and API setup
│   ├── constants/           # Application constants
│   ├── contexts/            # React context providers
│   ├── styles/              # Global styles and CSS
│   └── test/                # Test utilities and setup
├── tests/e2e/               # Playwright end-to-end tests
├── dist/                    # Build output
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── playwright.config.ts     # E2E test configuration
└── tsconfig.json            # TypeScript configuration
```

## Key Components

### Authentication Components
- **OAuthLoginPage**: Login interface with provider selection
- **OAuthCallback**: Handles OAuth return flow and token exchange
- **LegalAgreementModal**: GDPR compliance and user consent

### Layout Components  
- **Layout**: Main application shell and navigation
- **Dashboard**: Main user interface after authentication
- **Issues**: Issue management interface

### Atomic Components
- **Button**: Reusable button with variants and states
- **Card**: Content container with consistent styling
- **Input**: Form input with validation support
- **Typography**: Text components with design system styles

## Configuration

### API Configuration
- **Base URL**: Configured in `src/config/api.ts`
- **Endpoints**: Centralized API endpoint definitions
- **Environment**: Automatic detection of development vs production

### Build Configuration
- **Vite**: Modern build tool with fast HMR
- **TypeScript**: Strict type checking enabled
- **Path Aliases**: Clean imports with @ prefix

## State Management

### React Context
- **UserContext**: Global user authentication state
- **Local State**: Component-specific state with useState
- **Session Storage**: OAuth flow state management

### Data Flow Patterns
- Lift state up when shared between components
- Use custom hooks for reusable stateful logic
- Context for global application state
- Props for parent-child communication

## API Integration

### Authentication Flow
```typescript
// OAuth authorization
POST /api/v1/oauth/authorize/{provider}

// OAuth callback handling  
GET /api/v1/oauth/callback/{provider}

// User registration
POST /api/auth/register-external
```

### Data Fetching Patterns
- Use async/await for API calls
- Implement loading and error states
- Handle authentication tokens in requests
- Cache responses when appropriate

## Styling Guidelines

### CSS Organization
- Global styles in `src/styles/globals.css`
- Component-specific styles co-located
- CSS custom properties for theming
- Responsive design with mobile-first approach

### Design System
- Consistent color palette and spacing
- Typography scale and hierarchy
- Component variants and states
- Accessibility considerations

## Development Workflow

### Development Server
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests
npm run test:complete # Run all tests
```

### Code Quality
```bash
npm run lint         # ESLint checks
npm run type-check   # TypeScript compilation check
```

## Testing Strategy

### Unit Testing (Vitest)
- Test component rendering and behavior
- Mock external dependencies and APIs
- Test user interactions and state changes
- Located in component `__tests__/` directories

### Integration Testing
- Test component integration and data flow
- Verify API integration with mock responses
- Test authentication and routing flows

### E2E Testing (Playwright)
- Test complete user workflows
- Cross-browser compatibility
- Real authentication flows
- Critical path validation

## Performance Optimization

### Bundle Optimization
- Vite handles tree shaking and code splitting automatically
- Dynamic imports for route-level code splitting
- Asset optimization and compression

### Runtime Performance
- React.memo for expensive components
- useCallback for stable function references
- useMemo for expensive calculations
- Proper dependency arrays in hooks

## Common Development Tasks

### Adding New Component
1. Create component file in appropriate directory
2. Implement with TypeScript interfaces
3. Add styles (CSS modules or styled-components)
4. Create tests in `__tests__/` directory
5. Export from index files if needed

### API Integration
1. Define TypeScript interfaces for data
2. Create API functions in config/api.ts
3. Implement loading and error states
4. Handle authentication if required
5. Add tests for integration

### Adding New Route
1. Create page component
2. Add route to router configuration
3. Implement navigation and links
4. Add E2E tests for critical paths
5. Update any navigation menus

## Security Considerations

### Authentication
- Store JWT tokens securely (localStorage)
- Implement token expiration handling
- Clear sensitive data on logout
- Validate authentication state

### Data Handling
- Sanitize user inputs
- Validate data from APIs
- Avoid exposing sensitive information
- Implement proper error boundaries

## Accessibility Standards

### WCAG Guidelines
- Semantic HTML structure
- Proper heading hierarchy  
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Alternative text for images

### Implementation
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard accessibility
- Test with screen readers
- Maintain focus management

## Important Notes

- Follow React best practices and hooks patterns
- Maintain TypeScript strict mode compliance
- Keep components small and focused
- Implement proper error handling
- Test user interactions thoroughly
- Optimize for performance and accessibility
- Follow existing code style and conventions