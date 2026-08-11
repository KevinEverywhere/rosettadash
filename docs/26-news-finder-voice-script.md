# News finder voice script (DAS-75)

Dogfood script for building a news discovery dashboard with **AI assist + voice** on Chrome/macOS. In production, the user's BYOK/Ollama parses speech into structured actions; DashBuilder never pays for inference.

## Prerequisites

1. **Ollama** running locally with `llama3.2` (or your configured model on `/environment`).
2. **Chrome** on macOS with microphone permission for the builder origin.
3. **Admin → Feature toggles**: enable **AI drawer** and **Voice input**.
4. Open the builder on a fresh or empty canvas.

## Quick start (one shot)

Open **AI assist**, tap the mic, and say:

> Apply the news finder template.

The model should return `{ "op": "apply_template", "templateId": "news-finder" }` and lay down language, region, type, search, results table, and article detail with row binding.

## Bite-sized voice prompts (recommended)

Use one prompt per turn for better accuracy.

| Step | Say this |
|------|----------|
| 1 | Apply the news finder template. |
| 2 | Set the news search placeholder to "Search headlines, topics, or sources". |
| 3 | Set the results table page size to 15. |
| 4 | Move the article detail panel below the results table. |

## Build from scratch (no template)

| Step | Say this |
|------|----------|
| 1 | Add a news language selector at the top left. |
| 2 | Add a news region selector next to the language selector. |
| 3 | Add a news type selector next to the region selector. |
| 4 | Add a news search box below the filters, full width. |
| 5 | Add a news results table below the search box. |
| 6 | Add a news article detail panel below the results table. |
| 7 | Bind the results table selected row to the article detail row input. |

## Component types (for typed prompts)

| UI | Component type |
|----|----------------|
| Language filter | `visual.news.language-select` |
| Region filter | `visual.news.region-select` |
| Category filter | `visual.news.type-select` |
| Keyword search | `visual.news.search-box` |
| Headlines table | `visual.news.results-table` |
| Article reader | `visual.news.article-detail` |

Palette group: **News discovery** (`news-discovery`).

## Chrome / macOS mic tips

- Grant mic access when Chrome prompts.
- Speak after the mic icon shows **listening**; pause briefly between steps.
- If recognition stalls, click the mic off/on or type the same prompt in the text box.
- Safari: enable **System Settings → Keyboard → Dictation**; voice is less reliable than Chrome.

## What success looks like

- Preview shows filter dropdowns, search field, clickable headline rows, and article detail updating on row click.
- Canvas has a binding from `news-results` → `selected-row` to `news-article` → `row`.
- Export (React/Vue/Svelte/Angular) generates stub components for all six news types.

## Follow-up experiments (DAS-75 dogfood)

- Rebuild `/admin` panels inside the builder using these components.
- Save the composite to the content library and reopen from Admin → Saved content.
