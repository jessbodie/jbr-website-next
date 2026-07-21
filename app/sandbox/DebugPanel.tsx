'use client';

import { useSyncExternalStore } from 'react';
import { debug, INTEGRATION_LABELS, type DebugEntry } from './debugLog';
import styles from './page.module.scss';

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour12: false }) +
    '.' + String(d.getMilliseconds()).padStart(3, '0');
}

export default function DebugPanel() {
  const enabled = useSyncExternalStore(
    debug.subscribe,
    debug.isEnabled,
    () => true, // default ON during SSR to match initial store state
  );
  const entries = useSyncExternalStore(
    debug.subscribe,
    debug.getSnapshot,
    debug.getServerSnapshot,
  );

  return (
    <div className={styles.debugRoot}>
      <div className={styles.debugControls}>
        <label className={styles.debugCheckbox}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => debug.setEnabled(e.target.checked)}
          />
          <span>Debug</span>
          <span className={styles.debugHint}></span>
        </label>
        {enabled && (
          <button
            type="button"
            className={styles.debugClear}
            onClick={() => debug.clear()}
            disabled={entries.length === 0}
          >
            Clear
          </button>
        )}
      </div>

      {enabled && (
        <div className={styles.debugPanel} role="log" aria-live="polite">
          {entries.length === 0 ? (
            <p className={styles.debugEmpty}>
              No events yet. Interact with a button above to see its trace.
            </p>
          ) : (
            <ul className={styles.debugList}>
              {entries.map((entry) => (
                <DebugRow key={entry.id} entry={entry} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function DebugRow({ entry }: { entry: DebugEntry }) {
  return (
    <li className={`${styles.debugEntry} ${styles[`level_${entry.level}`]}`}>
      <span className={styles.debugTime}>{formatTime(entry.ts)}</span>
      <span className={styles.debugTag}>{INTEGRATION_LABELS[entry.integration]}</span>
      <span className={styles.debugMessage}>{entry.message}</span>
      {entry.detail !== undefined && (
        <details className={styles.debugDetail}>
          <summary>raw</summary>
          <pre>{safeStringify(entry.detail)}</pre>
        </details>
      )}
    </li>
  );
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, replacer, 2);
  } catch {
    return String(value);
  }
}

// Errors don't serialize to JSON by default; expose their useful fields.
function replacer(_key: string, value: unknown) {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}
