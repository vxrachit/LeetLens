# LeetLens

Analyze and compare LeetCode activity and skills with a lightweight, open-source Next.js app.

LeetLens provides a dashboard of LeetCode metrics, contest history, topic breakdowns, and GitHub-backed authentication so users can compare or analyze public profiles.

## Key features

- GitHub OAuth sign-in and session handling
- LeetCode profile, contest, and topic scraping via public endpoints
- Compare mode to view side-by-side user metrics
- Responsive UI built with Tailwind + reusable component library

## Quick start

Prerequisites

- Node.js 18+ and npm or pnpm
- Git

Clone and install

```bash
git clone https://github.com/vxrachit/LeetLens.git
cd LeetLens
pnpm install
```

Environment

Copy the example env file (create a `.env.local` in the project root) and set the required variables listed below.

Required environment variables

- `NEXT_PUBLIC_APP_URL` — Public URL where the app will run (used for OAuth redirect). Example: `http://localhost:3000`
- `GITHUB_CLIENT_ID` — GitHub OAuth app client ID (or `NEXT_PUBLIC_GITHUB_CLIENT_ID`)
- `GITHUB_CLIENT_SECRET` — GitHub OAuth app client secret
- `NEXT_PUBLIC_LEETCODE_BASE_URL` — Base URL for LeetCode (defaults to `https://leetcode.com`)
- Optional: `NEXT_PUBLIC_LEETCODE_ASSETS_URL`, `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`

Local development

```bash
pnpm dev
# open http://localhost:3000
```

Build

```bash
pnpm build
pnpm start
```

Testing

No automated tests are included by default. Add tests and update this section when present.

Contributing

See the contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)

License

This project is released under the MIT License: [LICENSE](LICENSE)

Contact

If you have questions or want to report security issues, please open an issue or a pull request.
