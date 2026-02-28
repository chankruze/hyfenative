# Folder Structure

## Top Level

- `android/`: Android native project.
- `ios/`: iOS native project.
- `assets/`: source assets (including base app icon).
- `scripts/`: local automation scripts for configure/icon/version flows.
- `src/`: application source.
- `__tests__/`: integration and app-level tests.
- `hyfenative.config.ts`: central boilerplate metadata and asset references.
- `.env.*`: per-environment runtime variables.

## `src/` Layout

- `src/app.tsx`: root provider composition.
- `src/api/`: HTTP client, request wrappers, domain endpoints, shared schemas/errors.
- `src/components/`: reusable UI components.
- `src/config/`: runtime env access.
- `src/constants/`: app-wide constants (query keys, etc.).
- `src/devtools/`: dev-only tooling integration (Reactotron).
- `src/i18n/`: translation resources and language sync.
- `src/lib/`: storage adapters, query client, app reset, error helpers.
- `src/navigation/`: route contracts and navigator definitions.
- `src/providers/`: app-level providers (error boundary).
- `src/screens/`: feature screens.
- `src/stores/`: persisted store modules.
- `src/theme/`: theming engine, tokens, typography, store/hooks.
- `src/types/`: ambient type declarations for platform modules.
- `src/utils/`: pure utilities.

## Endpoint Module Convention

Each domain under `src/api/endpoints/<domain>/` should contain:

- `schema.ts`: Zod contracts.
- `index.ts`: typed transport functions.
- `use-<domain>-api.ts`: React Query hooks.
- `*.test.ts`: behavior and contract tests.

This keeps boundary validation, transport code, and UI hooks separated.

## Screen Module Convention

- Place route-specific screens in `src/screens/<domain>/`.
- Use typed navigation props from `src/navigation/navigation-types.ts`.
- Keep style factory local (`createStyles(theme)`) unless shared.

## Native/Config Touchpoints

- Android package/application ID: `android/app/build.gradle`, `android/gradle.properties`.
- iOS bundle identifier and display name: `ios/AppConfig.xcconfig` and Xcode project settings.
- Environment injection: `react-native-config` + `ENVFILE` scripts.
