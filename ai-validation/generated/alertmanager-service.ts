// =============================================================================
// services/alertmanager.ts — Alertmanager HTTP API v2 client
// Generated from: PRD-PLATFORM-001 v0.1 — API Contract section
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// =============================================================================
// OQ-1: REACT_APP_ALERTMANAGER_URL must be confirmed by Platform Eng.
//       Auth/network accessibility from SysAdmin UI is an open question.

import { AlertGroup } from '../types/alertmanager';

const BASE_URL = process.env.REACT_APP_ALERTMANAGER_URL ?? '';

/**
 * M-1: Fetches active, non-silenced, non-inhibited alert groups.
 * Endpoint and query params taken verbatim from PRD API Contract section.
 */
export async function fetchAlertGroups(): Promise<AlertGroup[]> {
  const res = await fetch(
    `${BASE_URL}/api/v2/alerts/groups?active=true&silenced=false&inhibited=false`
  );
  if (!res.ok) {
    throw new Error(`Alertmanager ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<AlertGroup[]>;
}
