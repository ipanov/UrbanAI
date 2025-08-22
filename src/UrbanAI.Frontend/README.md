# UrbanAI Frontend - Environment Configuration

## Environment Variables

This project uses Vite's environment variable system with the following configuration files:

### Environment Files

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.local` - Local overrides (gitignored)

### Required Environment Variables

```bash
# API Base URL
VITE_API_BASE_URL=http://localhost:5001

# OAuth Redirect URI
VITE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback

# Environment
VITE_NODE_ENV=development

# Debug Mode
VITE_DEBUG_MODE=true
```

## Configuration System

The frontend uses a type-safe configuration system located in `src/config/`:

- `src/config/api.ts` - API configuration and URL building utilities
- `src/config/types.ts` - TypeScript type definitions for configuration
- `src/vite-env.d.ts` - Vite environment variable type declarations

## Usage Examples

### API URL Building
```typescript
import { buildApiUrl } from '../config/api';

// Build API URLs that work in all environments
const apiUrl = buildApiUrl('auth/authorize/google');
```

### Configuration Access
```typescript
import { API_CONFIG, APP_CONFIG } from '../config/api';

// Access configuration values
const baseUrl = API_CONFIG.baseUrl;
const isDebug = APP_CONFIG.debug;
```

## Environment-Specific Builds

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## CORS Configuration

The backend is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: `https://www.urbanai.site`

## OAuth Configuration

OAuth callbacks are configured to work with:
- Development: `http://localhost:3000/auth/callback`
- Production: `https://www.urbanai.site/auth/callback`

## Best Practices

1. **Never hardcode URLs** - Always use the configuration system
2. **Environment variables must be prefixed with `VITE_`**
3. **Use `buildApiUrl()` for all API endpoint construction**
4. **Sensitive data should never be in frontend environment variables**
5. **Local overrides should be in `.env.local` (gitignored)**

## Adding New Environment Variables

1. Add the variable to both `.env.development` and `.env.production`
2. Update `src/vite-env.d.ts` with the new type declaration
3. Add the variable to `src/config/api.ts` if it's API-related
4. Document the variable in this README
