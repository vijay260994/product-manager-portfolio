// =============================================================================
// AlertPanelError.tsx — Error state (API unreachable)
// Generated from: PRD-PLATFORM-001 v0.1 — M-5, Component States table
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// =============================================================================

import React from 'react';

interface Props {
  error:       string | null;
  lastChecked: Date | null;
  onRetry:     () => void;
}

export function AlertPanelError({ error, lastChecked, onRetry }: Props) {
  return (
    // M-5: never a blank panel — error state is always explicitly shown
    <div style={{
      background: '#FEF2F2',
      border: '1px solid #FCA5A5',
      borderRadius: 6,
      padding: '12px 16px',
    }}>
      <strong style={{ color: '#DC2626' }}>
        ⚠ Unable to reach alerting service
      </strong>

      {error && (
        <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>
          {error}
        </div>
      )}

      {/* Component States table: show last successful fetch time */}
      {lastChecked && (
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          Last successful check: {lastChecked.toLocaleTimeString()}
        </div>
      )}

      <button
        onClick={onRetry}
        style={{
          marginTop: 10, fontSize: 12, padding: '4px 12px',
          background: '#FEE2E2', border: '1px solid #FCA5A5',
          borderRadius: 4, cursor: 'pointer', color: '#DC2626',
        }}
      >
        Retry
      </button>
    </div>
  );
}
