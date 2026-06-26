# Restaurant OS

Operational platform boundary for the business copilot.

## Responsibilities

- Dashboard
- Owner experience
- Decision engine
- Knowledge graph
- Widgets
- Apple Watch surfaces
- Admin surfaces
- Shared platform services

## Exclusions

- Marketing pages
- Public menu
- Restaurant branding
- Customer-facing ordering flows

## Current Implementation Map

- `src/app/dashboard/`
- `src/features/dashboard/`
- `src/features/analytics/`
- `src/features/insights/`
- `src/features/reports/`
- `src/features/engines/`
- `src/features/living-background/`

## Notes

This directory is the future home for OS-specific modules. The active routes remain compatible through `src/app/` until a migration task explicitly moves them.
