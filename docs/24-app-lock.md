# App lock (optional local password)

Opt-in **client-side password** that protects environment variables and BYOK API keys in the browser. Separate from the server **`BUILDER_API_KEY`** used when `BUILDER_AUTH_ENABLED=true` on shared or deployed installs.

**Ticket:** [DAS-71](https://planetkevin.atlassian.net/browse/DAS-71) · Branch: `feature/DAS-71-app-lock-and-content-library`

---

## Why it exists

BYOK keys and database URLs live in the browser only — but anyone with physical access to an unlocked machine could open `/environment` and read them. App lock adds a **local passphrase** so secrets stay encrypted until the user unlocks the vault for the session.

| Concept | Purpose | Storage |
|---------|---------|---------|
| **App lock password** | Protect env/AI keys in this browser | `localStorage` config + `sessionStorage` unlock flag |
| **`BUILDER_API_KEY`** | Gate the local NestJS builder API | Server env + browser session for API calls |
| **BYOK provider keys** | Call AI providers from the client | Encrypted in browser; never on server or in exports |

---

## How it works

1. User enables app lock on `/environment` with a passphrase.
2. Core creates PBKDF2 verifier + encryption salt (`packages/core/src/lib/vault/`).
3. Existing secrets are re-encrypted with the passphrase-derived AES-GCM key on save.
4. Until unlock, the environment page shows a gate component; passphrase stays in memory only for the session.
5. **Lock now** clears session unlock; **Disable lock** requires the current passphrase and removes vault config.

Storage keys:

```
dashbuilder:vault:config     → AppLockConfig JSON (verifier + encryption salt)
dashbuilder:vault:unlocked   → session flag ("1" when unlocked)
```

---

## Non-goals

- Not a substitute for OS-level login or full-disk encryption
- Not synced across devices or browsers
- Not used to authenticate against the NestJS builder API
- No recovery flow if the passphrase is forgotten (user must clear browser storage)

---

## Related documents

- [AI & BYOK Integration](./20-ai-and-byok-integration.md) — Phase 19 environment page
- [Roadmap](./10-roadmap.md) — DAS-71 active work
- [Planned Tickets](./11-planned-tickets.md) — Jira index
