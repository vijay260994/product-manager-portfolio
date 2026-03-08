# PRD: SysAdmin Health Alert Panel
> **AI-Native PRD** — Structured for both human review and AI-assisted implementation.
> Requirements carry IDs, acceptance criteria are written as testable conditions,
> and code samples are illustrative. A full implementation spec can be generated from this document.

---

## Metadata

| Field | Value |
|---|---|
| **PRD ID** | PRD-PLATFORM-001 |
| **Status** | Draft v0.1 |
| **Author** | Platform PM |
| **Target** | Q2 2026 |
| **Stack** | RKE2 · Prometheus · Alertmanager · Grafana · Loki · Fluent Bit |

---

## Problem

SysAdmins log into the SysAdmin UI and see a static landing page.
Alerts exist in Prometheus and Loki but have no operator-facing surface.
Operators find out about incidents from user complaints — not from their tools.

**Impact:** High mean-time-to-awareness (MTTA). False confidence when nothing is visibly wrong.

---

## Solution

Embed a **Health Alert Panel** on the SysAdmin UI landing page, populated by
querying the Prometheus Alertmanager HTTP API on login and refreshing every 60 seconds.

No ML. No new infrastructure. Just the right signal, in the right place, at the right time.

---

## Users

| Persona | Need |
|---|---|
| **SysAdmin** (primary) | See system health at login without opening Grafana |
| **On-call Engineer** (secondary) | Quick triage — what's firing, how long, which service |

---

## User Stories

| ID | Story | Acceptance Criteria |
|---|---|---|
| US-1 | As a SysAdmin, I want to see active alerts on login | `[ ]` Panel visible without scrolling · `[ ]` Loads async, does not block page |
| US-2 | As a SysAdmin, I want alerts grouped by service | `[ ]` Groups sourced from `/api/v2/alerts/groups` · `[ ]` Sorted by severity |
| US-3 | As a SysAdmin, I want log and metric alerts in one view | `[ ]` Loki alerts route via Grafana → Alertmanager → same panel |
| US-4 | As an engineer, I want a Grafana deeplink per alert | `[ ]` `grafana_url` annotation rendered · `[ ]` Duration shown (e.g. "firing 14m") |
| US-5 | As a SysAdmin, I want a clear healthy state | `[ ]` "No active alerts" + last-checked timestamp when API returns empty |

---

## Requirements (MoSCoW)

**Must Have**
- `M-1` Alert panel on landing page, populated from Alertmanager `/api/v2/alerts/groups`
- `M-2` Per-alert: severity badge, service, summary, firing duration
- `M-3` Severity colours: critical → red · warning → amber · info → blue
- `M-4` Loki-based log alerts appear alongside Prometheus metric alerts
- `M-5` Empty state and error state — never a blank panel
- `M-6` Panel adds < 2 seconds to page load (async skeleton while loading)

**Should Have**
- `S-1` Grafana deeplinks per alert (from Alertmanager annotations)
- `S-2` Auto-refresh every 60 seconds without full page reload
- `S-3` Alertmanager inhibition rules (suppress pod alerts when root node is down)

**Will Not Have (v1)**
- No in-UI rule authoring · No ML/anomaly detection · No on-call paging · No write operations

---

## API Contract (sample)

```http
GET /api/v2/alerts/groups?active=true&silenced=false&inhibited=false
```

```json
[
  {
    "labels": { "service": "ingest-api" },
    "alerts": [{
      "labels": { "severity": "critical", "alertname": "HighErrorRate" },
      "annotations": {
        "summary": "Error rate > 2% for 5 minutes"
      },
      "startsAt": "2026-03-07T10:14:00Z",
      "generatorURL": "http://prometheus.internal/..."
    }]
  }
]
```

---

## Alert Rule Sample

```yaml
# prometheus-rules/service-health.yml
- alert: HighErrorRate
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
    / sum(rate(http_requests_total[5m])) by (service) > 0.02
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High error rate on {{ $labels.service }}"
```

---

## Component States

| State | Trigger | UI |
|---|---|---|
| `loading` | On mount | Skeleton (3 placeholder rows) |
| `firing` | API returns alerts | Grouped alert cards, severity sorted |
| `healthy` | API returns empty | "No active alerts" + last-checked time |
| `error` | API unreachable | Warning message + last successful fetch time |

---

## Success Metrics

| Metric | Target | When |
|---|---|---|
| MTTA — aware before user report | > 80% of P1/P2 incidents | 60 days |
| Signal-to-noise | < 10% alerts dismissed as irrelevant | 60 days |
| SysAdmin satisfaction | 3 of 4 users positive | 30-day retro |

---

## Open Questions

| # | Question | Owner |
|---|---|---|
| OQ-1 | Is Alertmanager accessible within the SysAdmin UI's auth/network context? | Platform Eng |
| OQ-2 | Can Grafana-managed Loki alerts route to the same Alertmanager instance? | Platform Eng |
| OQ-3 | Existing Prometheus rules to inherit, or starting from scratch? | Platform Eng |

---

## Suggested File Structure

```
sysadmin-ui/src/
├── components/AlertPanel/
│   ├── AlertPanel.tsx        # Main container
│   ├── AlertGroup.tsx        # Collapsible group row
│   ├── AlertCard.tsx         # Individual alert
│   ├── AlertPanelEmpty.tsx   # Healthy state
│   └── AlertPanelError.tsx   # Error state
├── hooks/useAlertGroups.ts   # Fetch + poll Alertmanager API
└── services/alertmanager.ts  # API client

observability-stack/alertmanager/
├── alertmanager.yml          # Grouping, routing, inhibition config
└── prometheus-rules/         # Alert rule YAML files
```

---

*PRD-PLATFORM-001 · v0.1 · March 2026 · Platform PM Portfolio · Details anonymised*
