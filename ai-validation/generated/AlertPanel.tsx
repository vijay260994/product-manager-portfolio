// =============================================================================
// AlertPanel.tsx — Main container
// Generated from: PRD-PLATFORM-001 v0.1 — Component States table, Solution section
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// Placement:      Top of SysAdmin UI landing page (Solution section, v0.1)
// =============================================================================

import React                                from 'react';
import { useAlertGroups, formatDuration }   from '../../hooks/useAlertGroups';
import { AlertGroup as AlertGroupRow }      from './AlertGroup';
import { AlertPanelEmpty }                  from './AlertPanelEmpty';
import { AlertPanelError }                  from './AlertPanelError';

// M-6: skeleton renders immediately — does not block page, < 2s load impact
function AlertPanelSkeleton() {
  return (
    <div aria-label="Loading system health" aria-busy="true"
         style={{ padding: '12px 0' }}>
      {/* 3 placeholder rows as specified in Component States table */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          height: 48,
          background: '#F3F4F6',
          borderRadius: 6,
          marginBottom: 8,
        }} />
      ))}
    </div>
  );
}

// Placement: top of the SysAdmin UI landing page (Solution section)
export function AlertPanel() {
  const { status, groups, lastChecked, error, refresh } = useAlertGroups();

  // M-5: never a blank panel — always one of the 4 defined Component States
  switch (status) {
    case 'loading':
      return <AlertPanelSkeleton />;

    case 'healthy':
      return <AlertPanelEmpty lastChecked={lastChecked} />;

    case 'error':
      return (
        <AlertPanelError
          error={error}
          lastChecked={lastChecked}
          onRetry={refresh}
        />
      );

    case 'firing':
      return (
        <section aria-label="Active system alerts" style={{ padding: '4px 0 16px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#111827' }}>
            System Health
            <span style={{ fontWeight: 400, color: '#6B7280', marginLeft: 8 }}>
              {groups.length} active {groups.length === 1 ? 'issue' : 'issues'}
            </span>
          </div>
          {/* M-3: groups already sorted critical → warning → info in hook */}
          {groups.map((group, i) => (
            <AlertGroupRow key={i} group={group} formatDuration={formatDuration} />
          ))}
        </section>
      );
  }
}
