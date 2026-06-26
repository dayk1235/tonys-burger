# Apps Boundary

This folder declares the top-level product boundary for the repository.

## Products

- `restaurant-experience/` - public website, branding, menu, reservations, gallery, contact, ordering, and customer-facing flows.
- `restaurant-os/` - dashboard, owner experience, decision engine, intelligence, widgets, watch, admin, and platform services.

## Shared Layer

Shared infrastructure remains centralized in existing modules:

- `src/design-system/`
- `src/components/ui/`
- `src/constants/`
- `src/lib/`
- `src/localization/`

## Compatibility

The running project still serves routes from `src/app/`. This directory documents product ownership and future module boundaries without changing public URLs.
