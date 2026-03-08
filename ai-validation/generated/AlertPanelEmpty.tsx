// =============================================================================
// AlertPanelEmpty.tsx — Healthy empty state
// Generated from: PRD-PLATFORM-001 v0.1 — M-5, US-5, Component States table
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// =============================================================================

import React from 'react';

interface Props {
  lastChecked: Date | null;
}

export function AlertPanelEmpty({ lastChecked }: Props) {
  return (
    // M-5: never a blank panel — healthy state is always explicitly shown
    <div style={{
      background: '#F0FDF4',
      border: '1px solid #86EFAC',
      borderRadius: 6,
      padding: '12px 16px',
    }}>
      {/* US-5: "No active alerts" message */}
      <strong style={{ color: '#15803D' }}>
        ✓ No active alerts — all systems healthy
      </strong>
      {/* US-5: last-checked timestamp */}
      {lastChecked && (
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
