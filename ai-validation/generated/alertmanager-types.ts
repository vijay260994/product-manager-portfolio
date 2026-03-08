// =============================================================================
// types/alertmanager.ts
// Generated from: PRD-PLATFORM-001 v0.1 — API Contract sample + Component States
// Generator:      Claude Sonnet — fresh run, PRD as sole input
// Date:           March 2026
// =============================================================================

// Inferred from API Contract: alerts[].labels.severity
export type Severity = 'critical' | 'warning' | 'info' | string;

// Inferred from Component States table — 4 named states
export type AlertPanelStatus = 'loading' | 'firing' | 'healthy' | 'error';

// Inferred from API Contract: alerts[].labels
export interface AlertLabels {
  alertname: string;
  severity:  Severity;
  service?:  string;
  [key: string]: string | undefined;
}

// Inferred from API Contract: alerts[].annotations
export interface AlertAnnotations {
  summary: string;      // M-2: displayed on every alert card
  [key: string]: string | undefined;
}

// Inferred from API Contract: individual alert object
export interface Alert {
  labels:       AlertLabels;
  annotations:  AlertAnnotations;
  startsAt:     string;  // RFC3339 — M-2: used to compute firing duration
  generatorURL: string;  // S-1, US-4: Grafana deeplink
}

// Inferred from API Contract: top-level array element
export interface AlertGroup {
  labels: {
    service?: string;
    [key: string]: string | undefined;
  };
  alerts: Alert[];
}

// Hook return — covers all 4 Component States
export interface UseAlertGroupsReturn {
  status:      AlertPanelStatus;
  groups:      AlertGroup[];
  lastChecked: Date | null;  // US-5 + error state: last-checked timestamp
  error:       string | null;
  refresh:     () => void;   // manual retry trigger for error state
}
