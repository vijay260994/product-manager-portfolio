// =============================================================================
// AlertCard.tsx — Individual alert instance (rendered inside expanded group)
// Generated from: PRD-PLATFORM-001 v0.1 — M-2, S-1, US-4
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// =============================================================================

import React from 'react';
import { Alert } from '../../types/alertmanager';

interface Props {
  alert:          Alert;
  formatDuration: (startsAt: string) => string;
}

export function AlertCard({ alert, formatDuration }: Props) {
  return (
    <div style={{
      borderTop: '1px solid #E5E7EB',
      marginTop: 8, paddingTop: 8, paddingLeft: 16,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 13, color: '#374151',
    }}>
      {/* M-2: alertname + summary */}
      <span>
        <strong>{alert.labels.alertname}</strong>
        {' — '}
        {alert.annotations.summary}
      </span>

      <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {/* US-4: firing duration */}
        <span style={{ color: '#6B7280' }}>{formatDuration(alert.startsAt)}</span>
        {/* S-1: Grafana deeplink */}
        {alert.generatorURL && (
          <a
            href={alert.generatorURL}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#2563EB', textDecoration: 'none' }}
          >
            ↗
          </a>
        )}
      </span>
    </div>
  );
}
