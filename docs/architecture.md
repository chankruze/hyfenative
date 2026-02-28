# Architecture

## Runtime Composition

`src/app.tsx` composes providers in this order:

1. `PersistQueryClientProvider` (React Query + persisted cache)
2. `AppErrorBoundary` (global error capture + reset flow)
3. `SafeAreaProvider`
4. `NavigationContainer`
5. `RootNavigator`

Before rendering navigation, app startup blocks until both stores are hydrated:

- `useThemeHydrated()`
- `useLanguageHydrated()`

If hydration is incomplete, the app returns `null` to avoid flash-of-wrong-theme/language.

## Layered Structure

### 1. Presentation Layer

- `src/screens/**`: route screens and user workflows.
- `src/components/**`: reusable UI primitives (example: `Screen`).

Rules:

- Screens orchestrate user interactions.
- Shared UI logic belongs in components.
- Visual values should come from `theme` tokens.

### 2. Navigation Layer

- `src/navigation/routes.ts`: route names enum.
- `src/navigation/root-stack-param-list.ts`: typed params contract.
- `src/navigation/root-navigator.tsx`: stack setup.

Rules:

- Add route constants first.
- Add param types second.
- Add screen mapping last.

### 3. Domain/API Layer

- `src/api/client.ts`: shared HTTP client (`ky`) and hooks.
- `src/api/request.ts`: schema-validated request helpers.
- `src/api/endpoints/<domain>/`: endpoint modules + schemas + hooks.

Current auth pattern:

- `schema.ts` defines payload/response with Zod.
- `index.ts` validates payload and calls request helper.
- `use-auth-api.ts` wraps mutations and app-side post-processing.

### 4. State Layer

- Zustand stores in `src/stores/` and `src/theme/store.ts`.
- Persistence via MMKV adapters (`src/lib/storage`).
- Store reset coordination via `store-reset-registry.ts`.

State reset path:

- `resetAppState()` clears query cache + persisted query client + registered stores.

### 5. Cross-Cutting Concerns

- `src/providers/error-boundary/**`: error fallback and retry.
- `src/lib/error/**`: normalization + reporter abstraction.
- `src/i18n/**`: language resources and sync.

## Key Architecture Decisions

- **Zod at API boundary**: catches contract drift early and keeps downstream types stable.
- **Case transformation in HTTP client**: backend can stay snake_case while app code stays camelCase.
- **Persisted React Query + Zustand**: keeps network and preference state resilient across app restarts.
- **Theming as generated object, not raw tokens**: screens consume one resolved `Theme` object.
- **Reset registry pattern**: enables single recovery path from fatal boundary errors.

## Safe Extension Checklist

When adding a new feature module:

1. Create endpoint schemas first (`src/api/endpoints/<domain>/schema.ts`).
2. Add typed endpoint methods in `index.ts` using `*WithSchema` helpers.
3. Add React Query hooks for orchestration and invalidation.
4. Add/update store only if state must outlive component lifetime.
5. Register resetter if store has durable state.
6. Build screens from theme + typed navigation params.
7. Add unit tests for schema + endpoint function behavior.

## Known Constraints

- Route graph is currently a single stack; no auth/guest navigator split yet.
- Error reporting has a TODO hook for Sentry in `index.js`.
- Version bump automation currently has Android sync caveat (see `docs/versioning.md`).
