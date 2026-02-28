# Configuration

## Source of Truth

Project-level static configuration is in `hyfenative.config.ts`:

- app metadata (`name`, `slug`, `scheme`)
- semantic version
- iOS build number
- Android version code
- package/bundle identifiers
- icon source path

This file is consumed by local scripts (`configure`, `icons`, `bump`).

## Environment Configuration

Runtime environment values are injected by `react-native-config`.

Current env files:

- `.env.dev`
- `.env.staging`
- `.env.prod`
- `sample.env` (example template)

### Current keys

- `API_PROTOCOL`
- `API_HOST`
- `API_VERSION`
- `API_KEY`

Read path:

- Raw load: `src/config/env.ts`
- API URL assembly: `src/api/config.ts`

## Build Command Mapping

`package.json` maps `ENVFILE` to run scripts:

- `android:dev` -> `.env.dev`
- `android:staging` -> `.env.staging`
- `android:prod` -> `.env.prod`
- `ios:dev` -> `.env.dev`
- `ios:staging` -> `.env.staging`
- `ios:prod` -> `.env.prod`

## App Identifier / Rename Workflow

Use:

```bash
npm run configure -- --name="Client App" --id="com.client.app"
```

What it updates:

- `hyfenative.config.ts`
- `android/app/build.gradle` (`namespace`, `applicationId` line replacement)
- `android/app/src/main/AndroidManifest.xml` package attribute

Optional flags:

- `--dry-run`
- `--commit`

## Current Gap (Important)

`scripts/configure-app.ts` renders `hyfenative.config.ts` with:

- `import type { HyfenativeConfig } from './hyfenative.config.types';`

The repository currently has no `hyfenative.config.types` file. If `configure` is executed without adjusting the script, the generated config file import will be invalid.

Recommended fix:

- Update the renderer to import from `./hyfenative.config` (or emit an inline type), or
- Add a dedicated `hyfenative.config.types.ts` file and keep the renderer aligned.

## Native Identifier Files

- Android IDs: `android/app/build.gradle`, `android/gradle.properties` (`APP_ID`)
- iOS IDs: `ios/AppConfig.xcconfig` (`PRODUCT_BUNDLE_IDENTIFIER`)

## Safe Extension Guidelines

- Add new env keys to all `.env.*` files at once.
- Keep key names uppercase snake case.
- If a key is required at runtime, enforce in one place (a parser or runtime guard) before use.
- Avoid reading `react-native-config` directly from feature modules; prefer `src/config/env.ts`.

## Debug Logging Note

`src/config/env.ts` and `src/api/config.ts` currently log env values to console. Keep this only if required for active debugging; remove or guard for production privacy expectations.
