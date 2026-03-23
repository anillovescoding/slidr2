# AGENTS.md — Slidr 2.0 Agent Configuration


## Project Overview
Slidr 2.0 is a full-stack AI carousel creator SaaS.
Monorepo: Turborepo | Web: Next.js 15 | Mobile: Expo 52 | API: FastAPI | DB: PocketBase


## Architecture Rules (MUST FOLLOW)
- Frontend NEVER calls AI APIs directly — all AI calls go through FastAPI
- Frontend NEVER decrypts API keys — decryption only in FastAPI
- Use PocketBase SDK in both web (JS) and api (Python)
- Shared types defined in packages/types/ — never duplicate type definitions
- All new Next.js pages use App Router (app/) — NEVER use pages/ router
- Tailwind classes only — no inline styles, no CSS modules
- Use Shadcn components before building custom UI components


## Key File Locations
apps/web/app/                → Next.js App Router pages
apps/web/components/ui/     → Shadcn auto-generated components
apps/web/components/        → Custom components
apps/web/lib/pocketbase.ts  → PocketBase client singleton
apps/web/lib/api.ts         → FastAPI client
apps/web/store/             → Zustand stores
apps/api/main.py            → FastAPI entry point
apps/api/services/          → All AI and business logic services
apps/api/models/            → Pydantic models
pocketbase/pb_migrations/   → PocketBase schema migrations
packages/types/src/         → Shared TypeScript interfaces


## Agent Personas


### Primary Agent (Gemini 3 Pro / Claude Sonnet 4.6)
Role: Lead developer. Handles architecture decisions, complex features, cross-file changes.
Use Plan Mode for: new screens, new services, database changes, API design
Use Fast Mode for: bug fixes, small UI tweaks, adding props, refactoring functions


### Subagents (Gemini 3 Flash)
Role: Specialized workers. Spin up subagents for:
  - Writing unit tests for existing services
  - Generating Shadcn component variations
  - Translating Python services to TypeScript types
  - Creating PocketBase migration files
  - Generating placeholder data for development


## Coding Standards
- TypeScript: strict mode, no "any" types
- Python: type hints on all functions, Pydantic models for all API bodies
- Components: named exports, Props interface defined above component
- Services: async/await throughout, explicit error handling
- No console.log in production code (use proper logging)
- Environment variables: always use process.env.NEXT_PUBLIC_* for client


## Verification Checklist (Before marking a task complete)
□ Code compiles without TypeScript errors
□ New PocketBase routes have proper auth rules
□ API keys never appear in network requests from browser
□ Admin routes check is_admin flag
□ Mobile: test on both iOS simulator and Android emulator
□ Responsive: test at 375px, 768px, 1280px breakpoints
□ Dark mode: all new components support both modes


## Model Switching Protocol
Primary: Gemini 3 Pro (default in Antigravity, generous free quota)
Switch to Claude Sonnet 4.6 when:
  - Complex TypeScript generic types or inference issues
  - Nuanced security/auth logic
  - Debugging hard-to-reproduce bugs
  - Writing comprehensive documentation
Switch to Gemini 3 Flash when:
  - Rate limited on Gemini 3 Pro
  - Simple repetitive tasks (generating test data, minor UI variants)
  - Quick bug fixes on isolated functions
