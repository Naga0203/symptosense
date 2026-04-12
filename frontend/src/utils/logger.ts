/**
 * Frontend structured logger.
 * 
 * - In development: logs to console with level prefixes and structured data.
 * - Debug mode: toggled via VITE_DEBUG_MODE env var.
 * - Captures user actions, errors, API failures.
 * - Optionally forwards logs to a backend endpoint.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
  source?: string;
}

// ─── Config ──────────────────────────────────────────
const IS_DEV = import.meta.env.DEV;
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';
const LOG_ENDPOINT = import.meta.env.VITE_LOG_ENDPOINT || '';

// ─── In-memory buffer for debug panel ────────────────
const LOG_BUFFER_MAX = 200;
const logBuffer: LogEntry[] = [];

function pushToBuffer(entry: LogEntry) {
  logBuffer.push(entry);
  if (logBuffer.length > LOG_BUFFER_MAX) {
    logBuffer.shift();
  }
}

// ─── Console formatters ─────────────────────────────
const LEVEL_STYLES: Record<LogLevel, string> = {
  info: 'color: #22d3ee; font-weight: bold;',
  warn: 'color: #fbbf24; font-weight: bold;',
  error: 'color: #ef4444; font-weight: bold;',
  debug: 'color: #a855f7; font-weight: bold;',
};

const LEVEL_ICONS: Record<LogLevel, string> = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
};

function formatLog(entry: LogEntry): void {
  const prefix = `${LEVEL_ICONS[entry.level]} [${entry.level.toUpperCase()}]`;
  const source = entry.source ? ` [${entry.source}]` : '';
  const msg = `${prefix}${source} ${entry.message}`;

  if (entry.data !== undefined) {
    console.groupCollapsed(`%c${msg}`, LEVEL_STYLES[entry.level]);
    console.log('Data:', entry.data);
    console.log('Time:', entry.timestamp);
    console.groupEnd();
  } else {
    console.log(`%c${msg}`, LEVEL_STYLES[entry.level]);
  }
}

// ─── Remote log forwarder (fire-and-forget) ──────────
async function sendToBackend(entry: LogEntry): Promise<void> {
  if (!LOG_ENDPOINT) return;
  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch {
    // Silent fail — don't create log loops
  }
}

// ─── Core log function ──────────────────────────────
function log(level: LogLevel, message: string, data?: unknown, source?: string): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    data,
    source,
  };

  pushToBuffer(entry);

  // Console output in dev or debug mode
  if (IS_DEV || DEBUG_MODE) {
    formatLog(entry);
  }

  // Forward errors (and optionally warns) to backend
  if (level === 'error' || (DEBUG_MODE && level === 'warn')) {
    sendToBackend(entry);
  }
}

// ─── Public API ─────────────────────────────────────
export const logger = {
  info: (message: string, data?: unknown, source?: string) => log('info', message, data, source),
  warn: (message: string, data?: unknown, source?: string) => log('warn', message, data, source),
  error: (message: string, data?: unknown, source?: string) => log('error', message, data, source),
  debug: (message: string, data?: unknown, source?: string) => {
    if (DEBUG_MODE) log('debug', message, data, source);
  },

  /** Log a user action (clicks, navigation) */
  action: (action: string, details?: unknown) => log('info', `User Action: ${action}`, details, 'UserAction'),

  /** Log an API call result */
  api: (method: string, url: string, status?: number, data?: unknown) =>
    log(status && status >= 400 ? 'error' : 'info', `API ${method} ${url} → ${status || 'pending'}`, data, 'API'),

  /** Get the in-memory log buffer (for debug panel) */
  getBuffer: (): readonly LogEntry[] => logBuffer,

  /** Clear the buffer */
  clearBuffer: () => { logBuffer.length = 0; },

  /** Check if debug mode is active */
  isDebugMode: () => DEBUG_MODE,
};

// ─── Global error handler ───────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error(
      `Unhandled Error: ${event.message}`,
      { filename: event.filename, lineno: event.lineno, colno: event.colno },
      'GlobalErrorHandler'
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error(
      `Unhandled Promise Rejection: ${event.reason}`,
      event.reason,
      'GlobalErrorHandler'
    );
  });
}

export type { LogEntry, LogLevel };
