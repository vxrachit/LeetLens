"use client";

import { useEffect } from 'react';

export default function ClientConsoleFilter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const patterns: RegExp[] = [
      /defaultProps will be removed/i,
      /react devtools/i,
      /enable copy content js called/i,
      /e\.c\.p is not enabled/i,
      /could not establish connection/i,
      /duplicate script id/i,
      /failed to execute 'insertBefore' on 'Node'/i,
      /^unchecked runtime\.lastError:/i,
      /page keeping the extension port is moved into back\/?forward cache/i,
      /autofill/i,
    ];

    const origWarn = console.warn.bind(console);
    const origError = console.error.bind(console);

    function shouldSuppress(args: any[]) {
      try {
        const first = args[0];
        const text = typeof first === 'string' ? first : JSON.stringify(first || '');
        return patterns.some((p) => p.test(text));
      } catch (e) {
        return false;
      }
    }

    console.warn = (...args: any[]) => {
      if (shouldSuppress(args)) return;
      origWarn(...args);
    };

    console.error = (...args: any[]) => {
      if (shouldSuppress(args)) return;
      origError(...args);
    };

    return () => {
      console.warn = origWarn;
      console.error = origError;
    };
  }, []);

  return null;
}
