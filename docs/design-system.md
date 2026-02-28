# Design System

## Objective

Provide a stable, token-driven UI contract so screens are consistent across brands, modes, and accessibility font scales.

## Token Layers

### Foundational tokens

- `spacing` (`xs`..`xl`) in `src/theme/tokens/base.ts`
- `radius` (`sm`..`lg`) in `src/theme/tokens/base.ts`

### Semantic color tokens

`ThemeColors` contract in `src/theme/types.ts`:

- surfaces (`background`, `surface`, `surfaceAlt`)
- text (`text`, `textMuted`, `textInverse`)
- borders (`border`, `borderStrong`)
- actions (`primary`, `primaryMuted`, `accent`)
- feedback (`error`, `success`)
- inputs/overlays (`inputBackground`, `inputPlaceholder`, `screenOverlay`)

### Typography tokens

- Base style roles in `src/theme/typography/base.ts`
- Runtime scaled typography build in `src/theme/typography/build.ts`
- Font family mapping in `src/theme/font/families.ts`

## Theme Output Contract

Every consumer gets one `Theme` object:

- `id`, `mode`, `brand`, `isDark`
- `fontScale`, `fontScalePreference`
- `colors`, `spacing`, `typography`, `radius`

Do not bypass this object with ad-hoc constants in screens.

## Component Styling Rules

- Use `createStyles(theme)` and derive style values from tokens.
- Avoid raw numeric spacing/colors unless part of a reusable token update.
- Keep font sizes and weights sourced from `theme.typography.*`.
- Use semantic colors (`error`, `success`) instead of hardcoded hex values.

## Naming Conventions

- Files: kebab-case (e.g. `welcome-screen.tsx`, `use-auth-store.ts`).
- React components: PascalCase exports (`WelcomeScreen`).
- Hooks: `useXxx`.
- Types/interfaces: PascalCase (`Theme`, `RootStackParamList`).
- Constants: UPPER_SNAKE_CASE for static lists and keys (`QUERY_KEYS`, `OTP_PORTAL`).
- Route names: enum members in PascalCase with kebab-case string values.

## Safe Extension Checklist

1. Add/update tokens first.
2. Regenerate or adjust theme creation if token shape changes.
3. Update affected component style factories.
4. Verify light/dark + brand variants.
5. Verify text scaling behavior (`small`/`medium`/`large`/`system`).
6. Add tests for pure token/typography logic when behavior changes.
