# Contributing to LeetLens

Thanks for your interest in contributing! We welcome bug reports, improvements, and new features. This document describes the preferred workflow and expectations for contributions.

## Code of conduct

Please follow the project Code of Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## How to contribute

1. Fork the repository and create a feature branch named using the pattern `feature/<short-description>` or `fix/<short-description>`.
2. Keep changes focused and atomic. One logical change per pull request.
3. Write clear commit messages and reference related issues (if any).
4. Run the app locally and verify your change.
5. Open a pull request against the `main` branch with a descriptive title and summary.

## Development workflow

- Use `pnpm install` to install dependencies.
- Run the dev server with `pnpm dev` and verify UI & functionality.

## Pull request guidelines

- Include screenshots or short recordings for UI changes.
- Describe the problem, the solution, and any noteworthy implementation details.
- Add unit or integration tests if applicable.
- Link related issues using `#<issue-number>`.

## Coding style

- Follow existing code style patterns in the repository.
- Keep functions small and focused.
- Preferred formatting: TypeScript + React + Tailwind. Keep styling consistent with the `ui/` components.

## Security and sensitive data

Do not commit secrets (API keys, private tokens) to the repository. Use environment variables and add any local example files to `.gitignore`.

## Questions

If you are unsure where to start, open an issue to discuss your proposed change.
