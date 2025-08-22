// Vite Environment Variables Declaration
/// <reference types="vite/client" />
/* eslint-disable no-unused-vars */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_OAUTH_REDIRECT_URI: string;
  readonly VITE_DEBUG_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
