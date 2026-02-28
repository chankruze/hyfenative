# Hyfenative Boilerplate

React Native 0.84 TypeScript boilerplate focused on predictable app setup for multi-environment builds, typed API access, persisted state, runtime theming, and OTP auth flow scaffolding.

## What This Boilerplate Provides

- Environment-aware app runs (`dev`, `staging`, `prod`) via `react-native-config` and `ENVFILE` mapping.
- Central app metadata in `hyfenative.config.ts` (name/slug/scheme/package IDs/version/icon source).
- Scripted app configuration (`scripts/configure-app.ts`) for renaming + Android package updates.
- Scripted icon generation (`scripts/generate-icons.ts`) for Android/iOS assets from one source PNG.
- Typed API layer with:
  - `ky` HTTP client
  - automatic camelCase/snake_case key transforms
  - Zod request/response validation
  - normalized API error type (`ApiError`)
- React Query + persistent cache backed by MMKV.
- Zustand stores (auth, language, theme) with persistence and centralized reset support.
- Theme system with tokenized palettes, brand variants (`default`, `ocean`), light/dark modes, font scaling, and cached typography generation.
- i18n with `i18next` and runtime language sync (`en`, `hi`).
- Global error boundary and pluggable reporter hook for production observability.

## Documentation Map

- [Architecture](./docs/architecture.md)
- [Folder Structure](./docs/folder-structure.md)
- [Scripts](./docs/scripts.md)
- [Configuration](./docs/configuration.md)
- [Theming](./docs/theming.md)
- [Design System](./docs/design-system.md)
- [Versioning](./docs/versioning.md)
- [FCM](./docs/fcm.md)

## Quick Start

### 1. Install dependencies

```bash
npm install
bundle install
(cd ios && bundle exec pod install)
```

### 2. Configure environment files

Use the provided `.env.dev`, `.env.staging`, `.env.prod` patterns. See [Configuration](./docs/configuration.md).

### 3. Start Metro

```bash
npm run start
```

### 4. Run app per target environment

```bash
npm run android:dev
npm run android:staging
npm run android:prod

npm run ios:dev
npm run ios:staging
npm run ios:prod
```

## Core Workflows

### Rename/retarget app identifiers

```bash
npm run configure -- --name="Client App" --id="com.client.app"
```

### Regenerate launcher icons from `hyfenative.config.ts`

```bash
npm run icons
```

### Bump versions

```bash
npm run bump -- --patch
npm run bump -- --minor
npm run bump -- --major
```

Release mode (commit + tag + push):

```bash
npm run bump -- --release
```

Versioning details: [docs/versioning.md](./docs/versioning.md).

## Extension Rules (Short)

- Keep new API modules in `src/api/endpoints/<domain>/` with Zod schemas and typed helpers.
- Keep UI style values derived from `theme` tokens, not hard-coded literals.
- Persist only durable state in Zustand `partialize` payloads.
- Use alias imports (`@/...`) for app code and keep file naming conventions consistent.
- Register any resettable store in `store-reset-registry`.

Detailed guidance: [Architecture](./docs/architecture.md), [Design System](./docs/design-system.md), [Theming](./docs/theming.md).
