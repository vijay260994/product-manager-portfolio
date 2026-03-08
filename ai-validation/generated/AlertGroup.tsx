// =============================================================================
// AlertGroup.tsx — Collapsible group row
// Generated from: PRD-PLATFORM-001 v0.1 — US-2, M-2, M-3, S-1, US-4
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// =============================================================================

import React, { useState }               from 'react';
import { AlertGroup as TAlertGroup }     from '../../types/alertmanager';
import { AlertCard }                     from './AlertCard';

// M-3: severity colour tokens — critical red · warning amber · info blue
const COLOURS: Record<string, { bg: string; border: string; badge: string }> = {
  critical: { bg: '#FEF2F2', border: '#FCA5A5', badge: '#DC2626' },
  warning:  { bg: '#FFFBEB', border: '#FCD34D', badge: '#D97706' },
  info:     { bg: '#EFF6FF', border: '#93C5FD', badge: '#2563EB' },
  default:  { bg: '#F9FAFB', border: '#D1D5DB', badge: '#6B7280' },
};

interface Props {
  group:          TAlertGroup;
  formatDuration: (startsAt: string) => string;
}

export function AlertGroup({ group, formatDuration }: Props) {
  const [expanded, setExpanded] = useState(false);

  const lead     = group.alerts[0];
  const severity = lead?.labels.severity ?? 'default';
  const service  = group.labels.service ?? lead?.labels.alertname ?? 'Unknown';
  const colours  = COLOURS[severity] ?? COLOURS.default;
  const rest     = group.alerts.slice(1);

  return (
    <div style={{
      background: colours.bg,
      border: `1px solid ${colours.border}`,
      borderRadius: 6,
      marginBottom: 8,
      padding: '10px 14px',
    }}>
      {/* M-2: severity badge · service name · summary · firing duration */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* M-3: severity badge */}
          <span style={{
            background: colours.badge, color: '#fff',
            borderRadius: 4, padding: '2px 8px',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          }}>
            {severity}
          </span>
          {/* M-2: service name */}
          <strong style={{ color: '#111827' }}>{service}</strong>
          {/* M-2: alert summary */}
          <span style={{ color: '#4B5563' }}>{lead?.annotations.summary}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* M-2, US-4: firing duration */}
          {lead && (
            <span style={{ fontSize: 12, color: '#6B7280' }}>
              {formatDuration(lead.startsAt)}
            </span>
          )}
          {/* S-1, US-4: Grafana deeplink from generatorURL */}
          {lead?.generatorURL && (
            <a
              href={lead.generatorURL}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none' }}
            >
              View in Grafana ↗
            </a>
          )}
          {/* Expand/collapse additional alert instances in this group */}
          {rest.length > 0 && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                fontSize: 12, color: '#6B7280',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              {expanded ? '▲ collapse' : `▼ +${rest.length} more`}
            </button>
          )}
        </div>
      </div>

      {/* Expanded: render individual alert cards for remaining instances */}
      {expanded && rest.map((alert, i) => (
        <AlertCard key={i} alert={alert} formatDuration={formatDuration} />
      ))}
    </div>
  );
}
