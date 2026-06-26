# Living Background Engine

## Purpose

The Living Background Engine is the single source of truth for visual atmosphere in Restaurant OS.

It controls:
- **Scene** — time-of-day atmosphere (Morning, Lunch, Afternoon, Golden Hour, Night, Closing)
- **Ambient lighting** — subtle radial lights and color washes
- **Atmosphere** — warmth, brightness, depth, contrast
- **Motion intensity** — suggested animation level for the current atmosphere
- **Visual transitions** — smooth crossfades between scenes

It does NOT know anything about restaurants.
It only exposes visual state.

## Architecture

```
src/features/living-background/
├── types/          — Semantic type definitions (no CSS values)
├── scenes/         — Scene definitions with atmosphere values
├── provider/       — React context provider
├── hooks/          — useLivingBackground hook
├── components/     — LivingBackground renderer + BackgroundLayer
└── index.ts        — Barrel export
```

## Principles

1. **CSS only.** No images, no videos, no canvas, no Three.js, no particles.
2. **Semantic values only.** Scenes expose warmth, brightness, depth, contrast — never CSS.
3. **Performance first.** Layers use `will-change`, `pointer-events: none`, and CSS transitions.
4. **Meaning before decoration.** Every visual layer has a purpose.
5. **Technology invisible.** The background should never be noticed — only felt.

## Scene System

| Scene        | Time     | Warmth | Brightness | Depth | Motion |
| :---         | :---     | :---   | :---       | :---  | :---   |
| Morning      | 06–09    | 1.0    | 0.8        | 0.4   | Soft   |
| Lunch        | 11–13    | 1.2    | 1.0        | 0.5   | Still  |
| Afternoon    | 14–17    | 1.5    | 0.9        | 0.6   | Soft   |
| Golden Hour  | 17–19    | 2.0    | 0.7        | 1.0   | Soft   |
| Night        | 19–22    | 0.4    | 0.3        | 1.6   | Soft   |
| Closing      | 22–06    | 0.2    | 0.15       | 2.0   | Still  |

## Integration

### ExperienceProvider

The Living Background integrates with the Experience System:

- **Morning mode** → warmer atmosphere (adds warmth)
- **Focus mode** → cleaner atmosphere (reduces warmth, contrast, depth)

No duplicated logic. The ExperienceProvider handles experience. The LivingBackgroundProvider handles scene.

### Providers

Add `LivingBackgroundProvider` inside `ExperienceProvider` in your providers wrapper.
Add `<LivingBackground />` inside your root layout body (before other content).

## Future

### Parallax

Architecture prepared for:
- Mouse-follow parallax
- Scroll-driven depth
- Touch gesture response

Enable via `parallaxEnabled` in context.

### Images

When images are available, they can replace gradient layers.
The component structure supports this without architectural changes.

### Motion Levels

Components should read `motionLevel` from `useLivingBackground()` and adjust their animation intensity accordingly.

## Adding a Scene

1. Add `SceneId` to `src/features/living-background/types/index.ts`
2. Add scene definition to `src/features/living-background/scenes/index.ts`
3. Add time range to `DEFAULT_SCENE_RANGES`
4. No existing code needs to change

---

*Architecture documentation for the Living Background Engine.*
