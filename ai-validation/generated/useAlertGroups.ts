// =============================================================================
// hooks/useAlertGroups.ts — Fetch and poll Alertmanager API
// Generated from: PRD-PLATFORM-001 v0.1
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// States covered: loading · firing · healthy · error (all 4 from Component States)
// Req. traced:    M-1 M-2 M-3 M-5 M-6 S-1 S-2 US-1 US-4 US-5
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { fetchAlertGroups }                 from '../services/alertmanager';
import {
  AlertGroup,
  AlertPanelStatus,
  UseAlertGroupsReturn,
} from '../types/alertmanager';

// S-2: 60-second auto-refresh without full page reload
const REFRESH_MS = 60_000;

// M-3: sort order — critical first, then warning, then info
const SEVERITY_RANK: Record<string, number> = {
  critical: 0,
  warning:  1,
  info:     2,
};

function groupRank(group: AlertGroup): number {
  return Math.min(
    ...group.alerts.map(a => SEVERITY_RANK[a.labels.severity] ?? 3)
  );
}

/**
 * US-4: human-readable firing duration derived from startsAt (RFC3339).
 * Exported so components can call it directly without re-importing.
 * Examples: "firing 4m", "firing 2h 14m", "firing 3h"
 */
export function formatDuration(startsAt: string): string {
  const totalMins = Math.floor(
    (Date.now() - new Date(startsAt).getTime()) / 60_000
  );
  if (totalMins < 60) return `firing ${totalMins}m`;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return m > 0 ? `firing ${h}h ${m}m` : `firing ${h}h`;
}

export function useAlertGroups(): UseAlertGroupsReturn {
  const [status,      setStatus]      = useState<AlertPanelStatus>('loading');
  const [groups,      setGroups]      = useState<AlertGroup[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchAlertGroups(); // M-1: /api/v2/alerts/groups
      setLastChecked(new Date());
      setError(null);

      if (data.length === 0) {
        // M-5, US-5: healthy empty state — never a blank panel
        setStatus('healthy');
        setGroups([]);
      } else {
        // M-3: sort groups critical → warning → info
        setStatus('firing');
        setGroups([...data].sort((a, b) => groupRank(a) - groupRank(b)));
      }
    } catch (err) {
      // M-5: error state — never a blank panel
      // preserve lastChecked so Component States "last successful fetch" can display
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Unable to reach alerting service'
      );
    }
  }, []);

  useEffect(() => {
    load();                                    // US-1, M-6: fetch on mount, async
    const id = setInterval(load, REFRESH_MS); // S-2: poll every 60 seconds
    return () => clearInterval(id);            // cleanup on unmount
  }, [load]);

  return { status, groups, lastChecked, error, refresh: load };
}
