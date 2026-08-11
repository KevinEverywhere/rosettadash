# Dashboard starter templates (DAS-76)

Ten pre-built **dashboard** graphs available from **Select template → Apply template** and via AI `apply_template`. Each dashboard is a named singleton root whose children use stable ids for voice, BYOK prompts, and code export.

## Architecture

| Layer | Role |
|-------|------|
| **Dashboard** | Singleton template root (composite) — not the canvas itself |
| **Named children** | Filter, KPIs, table, chart, optional detail — each with a stable `id` |
| **Infra (hidden)** | `infra.postgresql` wired to table/chart `data` for strict validation and export |
| **Self-contained export** | Each visual becomes one directory with layout + script + CSS when exported |

Users typically **delete, swap, or re-bind** suggested parts rather than building from zero.

## Media

| Template ID | Name | Named children |
|-------------|------|----------------|
| `media-social-content` | Social & Content Performance | `channel-filter`, `kpi-engagement-rate`, `kpi-reach`, `content-table`, `engagement-chart` |
| `media-web-seo` | Web Traffic & SEO | `date-range`, `traffic-kpis-views`, `traffic-kpis-bounce`, `pages-table`, `rank-chart` |
| `media-campaign-roi` | Paid Media & Campaign ROI | `campaign-filter`, `spend-kpis-spend`, `spend-kpis-roas`, `campaigns-table`, `channel-chart` |

## Coders

| Template ID | Name | Named children |
|-------------|------|----------------|
| `dev-infra-monitor` | Infrastructure Monitoring | `time-preset`, `resource-kpis-cpu`, `resource-kpis-memory`, `hosts-table`, `utilization-chart` |
| `dev-apm-overview` | Application Performance (APM) | `service-filter`, `latency-kpis-p95`, `latency-kpis-errors`, `endpoints-table`, `errors-chart`, `trace-detail` |
| `dev-cicd-pipeline` | CI/CD Pipeline | `env-filter`, `pipeline-kpis-success`, `pipeline-kpis-frequency`, `builds-table`, `deploy-chart` |

## Office

| Template ID | Name | Named children |
|-------------|------|----------------|
| `office-project-sprint` | Project & Sprint Tracker | `sprint-preset`, `velocity-kpi`, `velocity-kpi-open`, `tickets-table`, `burndown-chart` |
| `office-sales-pipeline` | Sales Pipeline | `stage-filter`, `revenue-kpis-revenue`, `revenue-kpis-win-rate`, `deals-table`, `pipeline-chart` |
| `office-support-desk` | Customer Support Desk | `queue-filter`, `sla-kpis-open`, `sla-kpis-response`, `tickets-table`, `sla-chart`, `ticket-detail` |
| `office-executive-kpi` | Executive KPI Overview | `date-range`, `executive-kpis-revenue`, `executive-kpis-margin`, `executive-kpis-headcount`, `summary-table`, `trend-chart` |

## AI / voice examples

```
Apply the dev-apm-overview template.
```

```
Apply media-web-seo, then set the date range preset to last 30 days.
```

```
Replace endpoints-table with my custom API table and keep trace-detail bound.
```

## Implementation

- Specs: `packages/core/src/lib/templates/dashboard-starter-composites.ts`
- Builder: `packages/core/src/lib/templates/build-dashboard-starter.ts`
- Registry: `composite-template-registry.ts`

## Saving edited dashboards

Saved content lives in **localStorage** under `rosettadash:content-library:index`. Each entry stores the full composite (all node positions, labels, bindings, and properties) so moved or edited components are preserved.

| Action | Where |
|--------|--------|
| **Save to library** | Builder toolbar → saves current canvas layout |
| **Browse / reopen** | Admin → Saved content → Open in builder |
| **Restore handshake** | `sessionStorage` key `rosettadash:library-restore` (one-shot) |

Use **Save to library** after rearranging a template dashboard; reopen from Admin to continue editing or group with other composites.

## Related

- [News finder voice script](./26-news-finder-voice-script.md) — domain-specific news components
- [AI and BYOK](./20-ai-and-byok-integration.md) — structured actions and local Ollama default
