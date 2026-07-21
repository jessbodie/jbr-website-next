// Lightweight debug-log store for the sandbox Apple Pay integrations.
//
// Lives as a module-level external store (not React Context) because Button 1's
// click handler (`onApplePayButtonClicked` in ApplePayButton.tsx) is a module-level
// function that cannot call hooks. Both that handler and the button components call
// `debug.log(...)` plainly; the DebugPanel subscribes via useSyncExternalStore.

export type Level = 'info' | 'success' | 'error';
export type Integration = 'direct' | 'stripe' | 'decrypt';

export const INTEGRATION_LABELS: Record<Integration, string> = {
  direct: 'Apple Pay (Direct)',
  stripe: 'Stripe',
  decrypt: 'Self-Decrypt',
};

export interface DebugEntry {
  id: number;
  ts: number;
  integration: Integration;
  level: Level;
  message: string;
  detail?: unknown;
}

let entries: DebugEntry[] = [];
let enabled = true; // default ON — the trace is visible on first load
let nextId = 0;
const listeners = new Set<() => void>();

// A single frozen empty array so getServerSnapshot / cleared state stays
// referentially stable across renders (avoids useSyncExternalStore loops).
const EMPTY: DebugEntry[] = [];

function notify() {
  for (const fn of listeners) fn();
}

export const debug = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // Must return a referentially stable array between notifications.
  getSnapshot(): DebugEntry[] {
    return entries.length ? entries : EMPTY;
  },

  // No entries during SSR — same stable reference every call.
  getServerSnapshot(): DebugEntry[] {
    return EMPTY;
  },

  isEnabled() {
    return enabled;
  },

  setEnabled(on: boolean) {
    enabled = on;
    notify();
  },

  clear() {
    entries = [];
    notify();
  },

  log(integration: Integration, level: Level, message: string, detail?: unknown) {
    // Errors always reach the console, regardless of the Debug toggle.
    if (level === 'error') {
      console.error(`[${INTEGRATION_LABELS[integration]}] ${message}`, detail ?? '');
    }

    // Info/step/etc. are only captured for the panel when Debug is ON.
    if (!enabled) return;

    entries = [
      ...entries,
      { id: nextId++, ts: Date.now(), integration, level, message, detail },
    ];
    notify();
  },
};
