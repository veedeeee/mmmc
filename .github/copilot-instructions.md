# Copilot Instructions

## Project Overview
This is a Single Page Application (SPA) built with React and TypeScript. The purpose of this application is to provide a user interface for some multiblock units from the Mekanism, a MOD for Minecraft. User can input some parameters like size, then the application will caluculate the required resouces like blocks, energy (RF/FE per tick) and fluids (mB per tick) for the unit. Also the application will show the efficiency of the unit.
In addition, the application will provide the graphical representation of the unit, which can be rotated and zoomed in/out. The application will also provide a list of all the blocks used in the unit, along with their quantities and other relevant information.

## Environment notes
- This repository will be hosted on GitHub and will use GitHub Actions for CI/CD. The application will be built using Node.js and npm, and will use Vitest for testing. The application will be deployed to GitHub Pages.
- No runner for GitHub Actions is ready yet. Configuration of GitHub Actions should be prepared, but it won't be executed so far.
- The workflow on git is based on git-flow, with `main` as the production branch, `develop` as the integration branch, and other branches like `feature/*`, `release/*`, and `hotfix/*` for development and maintenance.

## Release Flow (with GitHub Actions)
- Trigger this flow only when the user explicitly requests a release.
- Before release work, verify the working tree is clean. If not clean, stop and ask the user how to proceed.
- Use a 3-branch model: `main` (production), `develop` (integration), and `release/vX.Y.Z` (release prep).
- If the current branch is not `develop`, switch to `develop` before release work.
- Ensure local `develop` is up to date with remote before deciding the version.
- Determine the next version using SemVer 2.0.0 based on commits since the previous release tag.
- If commit messages are not sufficient to determine SemVer impact, ask the user clarifying questions before proposing a bump.
- Propose `major`/`minor`/`patch` to the user and get explicit approval before changing version.
- Create a release branch from `develop` using `release/vX.Y.Z`.
- Update only `package.json` `version`, then create a commit on the release branch that contains only that change. Commit message should be `:bookmark: Release vX.Y.Z` (with the new version).
- Build must pass locally (`npm run build`) on the release branch before PR approval is requested.
- Push the release branch and open a PR into `master`.
- Changes must reach `master` only through PR merge. Never commit or push directly to `master`.
- After release PR merge into `master`, sync release changes back to `develop` via PR (for example, `master` -> `develop`).
- After `master` is updated via PR merge, create a GitHub Release for the approved version.
- Use release tag format `vX.Y.Z`.
- Default to a full release (not prerelease) unless the user explicitly requests prerelease.
- If the same release tag already exists, stop and ask the user whether to reuse assets, replace assets, or create a new version.
- Build with `npm run build` and upload release artifacts to the GitHub Release.
- Release asset uploads can take a long time; once upload starts, do not interrupt or abort unless the user explicitly instructs abort.

## Development Commands
- Install: `npm ci` (or `npm install` if needed)
- Run dev app: `npm run dev`
- Build renderer only: `npm run build:renderer`
- Build Windows package: `npm run build`

## Coding Conventions
- Base UI is in English, and provide language switcher for other languages. Use English for all code comments and documentation.
- Only Japanese is supported as a alternative language for this application at this moment. Other languages may be added in the future.
- Preserve existing style and naming unless there is a clear reason to change.
- Prefer small, focused changes.

## Documentation Boundary
- Put implementation intent and coding decisions in code comments near the relevant logic.
- Put assistant behavior, workflow rules, and operational instructions in this `copilot-instructions.md` file.
- Do not place assistant-operation policies inside application source comments.

## External Coding Instructions
- Follow `.github/instructions/nodejs-javascript-vitest.instructions.md` for coding and Vitest testing guidance.
- Follow `.github/instructions/self-explanatory-code-commenting.instructions.md` for commenting guidance.

## Git Commit Rule For Assistant
- For assistant-created commits, set commit author name to `GitHub Copilot` while keeping the existing user email.
- Use this command form:
  - `git -c user.name="GitHub Copilot" -c user.email="copilot@local" commit -m "<message>"`
- Do not rewrite history unless explicitly requested.

## Commit Message Rule
- Commit message rules are managed in `.github/copilot-commit-message-instructions.md`.
- Always follow `.github/copilot-commit-message-instructions.md` when creating commit messages.

## Pull Request Rule
- When creating PRs with `gh pr create`, always pass a true multiline body (PowerShell here-string or `--body-file`) to avoid Markdown formatting collapse.
- Do not pass literal `\n` escape sequences as plain text for PR body formatting.
- Include a clear note in every PR body that it was prepared by Copilot.
- Recommended PR body footer line:
  - `:dependabot: This PR was prepared by GitHub Copilot`

## Safety
- Do not run destructive git commands (such as hard reset) unless explicitly requested.
- If unexpected local changes appear, stop and confirm before proceeding.

## Data Source
- Data source for this application must be from the official website of Mekanism MOD. Those pages should be;
  - https://github.com/mekanism/Mekanism
  - https://wiki.aidancbrady.com/wiki/Main_Page
- If these pages are not accessible or the data is not enough, ask the user for alternative data sources with the link. Do not use any other unofficial sources without explicit user approval.

### Supported Multiblocks
#### Mekanism
1. Dynamic Tank
2. Thermal Evaporation Plant
3. SPS
4. Thermoelectric Boiler
5. Induction Matrix

#### Mekanism Generators
1. Industrial Turbine
2. Fission Reactor
3. Fusion Reactor
