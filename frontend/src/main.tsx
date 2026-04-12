import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { logger } from './utils/logger';

// ─── App startup log ────────────────────────────────
logger.info('SymptoSense app initializing', {
  debug: logger.isDebugMode(),
  env: import.meta.env.MODE,
  timestamp: new Date().toISOString(),
}, 'App');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
