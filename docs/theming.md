# Theming

## Scope

The theme system resolves a single runtime `Theme` object from:

- mode (`light` | `dark` | `system`)
- brand (`default` | `ocean`)
- font scale preference (`system` | `small` | `medium` | `large`)
- system font scale

Implementation lives in:

- `src/theme/store.ts`
- `src/theme/core/create.ts`
- `src/theme/tokens/*`
- `src/theme/typography/*`

## Data Flow

1. `useSyncSystemTheme()` captures OS color scheme and font scale.
2. Theme store persists user preference values.
3. `themeStoreSelectors.theme` resolves and memoizes final `Theme`.
4. Components consume via `useThemeValue()`.

## Token Sources

- Base spacing/radius: `src/theme/tokens/base.ts`
- Default brand palettes: `src/theme/tokens/light.ts`, `src/theme/tokens/dark.ts`
- Ocean brand palettes: `src/theme/tokens/ocean.ts`
- Font families by brand/mode: `src/theme/font/families.ts`
- Typography scale/template: `src/theme/typography/base.ts`, `src/theme/typography/build.ts`

## Persisted Theme State

Persisted fields (`version: 2`):

- `preference`
- `brand`
- `fontScalePreference`

Non-persisted runtime fields:

- `systemMode`
- `systemFontScale`

Migration behavior for pre-v2 state adds `fontScalePreference: 'system'`.

## Usage Pattern in Screens

- Get resolved theme with `useThemeValue()`.
- Build styles through a factory: `createStyles(theme)`.
- Avoid hard-coded colors/spacing/typography values.

## Adding a New Brand

1. Add `ThemeBrand` union value in `src/theme/types.ts`.
2. Add light/dark color tokens under `src/theme/tokens/`.
3. Add font family mapping in `src/theme/font/families.ts`.
4. Register palette in `colorPaletteByBrand` (`src/theme/core/create.ts`).
5. Add UI control entry if end-user switching is exposed.

## Safety Rules

- Keep token object shape identical to `ThemeColors`.
- Keep theme creation deterministic (no async, no side effects).
- Do not read OS state directly in components; route all through theme store/hooks.
- For performance-sensitive lists, avoid recomputing style objects outside `StyleSheet.create`.
