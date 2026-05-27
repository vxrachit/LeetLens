type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const envLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'error' : 'debug');

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

const current = LEVELS[envLevel] ?? LEVELS.debug;

function shouldLog(level: LogLevel) {
  return LEVELS[level] >= current ? false : true;
}

function formatPrefix() {
  return '[LeetLens]';
}

export const logger = {
  debug: (...args: any[]) => {
    if (!shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.debug(formatPrefix(), ...args);
  },
  info: (...args: any[]) => {
    if (!shouldLog('info')) return;
    // eslint-disable-next-line no-console
    console.info(formatPrefix(), ...args);
  },
  warn: (...args: any[]) => {
    if (!shouldLog('warn')) return;
    // eslint-disable-next-line no-console
    console.warn(formatPrefix(), ...args);
  },
  error: (...args: any[]) => {
    if (!shouldLog('error')) return;
    // eslint-disable-next-line no-console
    console.error(formatPrefix(), ...args);
  },
};

export default logger;
