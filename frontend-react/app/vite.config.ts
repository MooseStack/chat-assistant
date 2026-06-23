// Only used during build and running in dev/preview mode

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUrl = env.BACKEND_URL || 'http://localhost:8000';
  const appTitle = env.APP_TITLE || 'Chat Assistant';
  const sslVerify = (env.SSL_VERIFY || 'false').toLowerCase();
  const secure = ['true', '1', 'yes'].includes(sslVerify);
  const isDev = mode === 'development';

  return {
    plugins: [react()],
    define: {
      __BACKEND_URL__: JSON.stringify(isDev ? backendUrl : '__BACKEND_URL__'),
      __APP_TITLE__: JSON.stringify(isDev ? appTitle : '__APP_TITLE__'),
    },
    server: {
      allowedHosts: true,
      port: 5173,
      proxy: {
        '/chat': {
          target: backendUrl,
          changeOrigin: true,
          secure,
        },
        '/health': {
          target: backendUrl,
          changeOrigin: true,
          secure,
        },
      },
    },
  };
});
