# LeetLens

LeetLens is a lightweight, open-source Next.js app for analyzing and comparing LeetCode activity and skills. It provides dashboards for problems solved, contest history, topic breakdowns, and an option to compare multiple users side-by-side.

**Highlights**
- GitHub OAuth sign-in + repo-star gating for access control
- Server-side LeetCode profile and contest queries (GraphQL / public endpoints)
- Compare mode and reusable Tailwind-based UI components
- Small, focused codebase ideal for contributors and customization

## Tech stack
- Next.js (App Router)
- React + Tailwind CSS
- TypeScript


## Quick Start

Prerequisites
- Node.js 18+ (or an active Node 20 LTS) and a package manager (`pnpm` recommended, `npm` supported)
- Git

Clone and install

```bash
git clone https://github.com/vxrachit/LeetLens.git
cd LeetLens
pnpm install
# or: npm install
```

Environment
Create a `.env.local` in the project root and set the environment variables described below. The code centralizes runtime URLs in `lib/env.ts` and `lib/server/env.ts` — avoid hardcoding service URLs in components.

Important environment variables

- `NEXT_PUBLIC_APP_URL` — Public URL where the app runs (used for OAuth redirect). Example: `http://localhost:3000`
- `NEXT_PUBLIC_LEETCODE_BASE_URL` — LeetCode base URL (default `https://leetcode.com`)
- `NEXT_PUBLIC_LEETCODE_ASSETS_URL` — Optional CDN/asset base for LeetCode assets
- `LEETCODE_GRAPHQL_URL` — Optional override for LeetCode GraphQL endpoint
- `NEXT_PUBLIC_GITHUB_CLIENT_ID` — GitHub OAuth App client ID
- `GITHUB_CLIENT_SECRET` — GitHub OAuth App client secret (server-only)
- `NEXT_PUBLIC_GITHUB_OWNER` — GitHub owner/org used for repo-star gating (default: `vxrachit`)
- `NEXT_PUBLIC_GITHUB_REPO` — GitHub repo name used for gating (default: `LeetLens`)

See `/memories/repo/leetlens-env-convention.md` for internal env conventions used by the codebase.

Local development

```bash
pnpm dev
# open http://localhost:3000
```

Build for production

```bash
pnpm build
pnpm start
```

## GitHub OAuth configuration

1. Create a GitHub OAuth App at https://github.com/settings/developers with the application name and callback URL set to `${NEXT_PUBLIC_APP_URL}/api/auth/github/callback`.
2. Set `NEXT_PUBLIC_GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in `.env.local`.
3. The app enforces repo-star gating for the repo `vxrachit/LeetLens` by default. You can change the owner/repo using `NEXT_PUBLIC_GITHUB_OWNER` and `NEXT_PUBLIC_GITHUB_REPO`.

The relevant server routes are under `app/api/auth/github/*` and `app/api/auth/logout/route.ts`. Session information is exposed at `app/api/auth/github/session/route.ts` for client UI (profile menu).

See `/memories/repo/leetlens-github-auth.md` for additional notes about how auth and gating are used in this project.

## Project structure (high level)
- `app/` — Next.js App Router pages and API routes (auth, analyze, api endpoints)
- `components/` — Reusable UI components (dashboard, auth, compare views)
- `lib/` — Small libraries: `env.ts`, `github-auth.ts`, `leetcode/*` clients and types
- `server/` — server-side environment helpers
- `hooks/` — client hooks

## How it works (brief)
- Users sign in via GitHub OAuth. The server validates the session and ensures the user has starred the configured repo (gating).
- Authenticated users can analyze and compare LeetCode profiles. The server calls LeetCode public APIs and GraphQL endpoints, exposing minimal aggregated data to the client.

## Contributing
- Read the contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Keep env values in `.env.local` and never commit secrets.
- Add tests when adding significant business logic; update the README testing section accordingly.

## Troubleshooting
- OAuth redirect errors: verify `NEXT_PUBLIC_APP_URL` and the GitHub OAuth callback URL match exactly.
- 401/403 on analyze routes: confirm `NEXT_PUBLIC_GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set and the user has a valid session.
- LeetCode data failures: ensure `NEXT_PUBLIC_LEETCODE_BASE_URL` is correct and reachable.

## License
This project is released under the MIT License: [LICENSE](LICENSE)

## Contact
Open issues or pull requests for bugs, security reports, or feature requests.

---
If you'd like, I can also:
- add an example `.env.local.example` file with the required variables, or
- update `package.json` scripts to add `preview`, `format`, and `lint` scripts.
Tell me which you'd like next.
