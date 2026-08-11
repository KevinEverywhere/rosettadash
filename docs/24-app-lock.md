# App lock (optional local password)

Opt-in **client-side password** that protects environment variables and BYOK API keys in the browser. Separate from the server **`BUILDER_API_KEY`** used when `BUILDER_AUTH_ENABLED=true` on shared or deployed installs.

**Ticket:** [DAS-71](https://planetkevin.atlassian.net/browse/DAS-71) (initial lock) · [DAS-72](https://planetkevin.atlassian.net/browse/DAS-72) (recovery codes)  
**Branch:** `feature/DAS-72-app-lock-recovery-codes`

---

## Why it exists

BYOK keys and database URLs live in the browser only — but anyone with physical access to an unlocked machine could open `/environment` and read them. App lock adds a **local passphrase** so secrets stay encrypted until the user unlocks the vault for the session.

| Concept | Purpose | Storage |
|---------|---------|---------|
| **App lock password** | Protect env/AI keys in this browser | `localStorage` config + `sessionStorage` unlock flag |
| **Recovery codes** | One-time unlock if password is forgotten | Hashed in config; passphrase wrapped per code |
| **`BUILDER_API_KEY`** | Gate the local NestJS builder API | Server env + browser session for API calls |
| **BYOK provider keys** | Call AI providers from the client | Encrypted in browser; never on server or in exports |

---

## How it works

1. User enables app lock on `/environment` with a passphrase and optional hint.
2. Core creates PBKDF2 verifier + encryption salt (`packages/core/src/lib/vault/`).
3. Eight single-use recovery codes are generated; each wraps an encrypted copy of the passphrase.
4. User must confirm they saved recovery codes before continuing.
5. Existing secrets are re-encrypted with the passphrase-derived AES-GCM key on save.
6. Until unlock, the environment page shows a gate component.
7. **Forgot password:** use a recovery code (single use) or **reset vault** (destructive — clears encrypted secrets).

Storage keys:

```
rosettadash:vault:config     → AppLockConfig JSON (verifier, encryption salt, recovery records, hint)
rosettadash:vault:unlocked   → session flag ("1" when unlocked)
```

---

## Lost password

| Path | Result |
|------|--------|
| **Recovery code** | Unlocks vault; code is consumed; user should set a new password by removing and re-enabling lock |
| **Reset vault** | Removes app lock and deletes encrypted secrets from the browser; user re-enters keys from provider dashboards |
| **Email recovery** | Not supported — no RosettaDash account or server-side escrow |

RosettaDash **cannot** recover a forgotten password without a saved recovery code.

---

## Non-goals

- Not a substitute for OS-level login or full-disk encryption
- Not synced across devices or browsers
- Not used to authenticate against the NestJS builder API
- No email-based recovery or server-side key escrow

---

## Related documents

- [AI & BYOK Integration](./20-ai-and-byok-integration.md) — Phase 19 environment page
- [Roadmap](./10-roadmap.md) — DAS-71 / DAS-72
- [Planned Tickets](./11-planned-tickets.md) — Jira index
