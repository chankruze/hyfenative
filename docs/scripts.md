# Scripts

## App Runtime

- `npm run start`
  - Starts Metro bundler.

- `npm run android:dev`
- `npm run android:staging`
- `npm run android:prod`
  - Runs Android app with matching `ENVFILE`.

- `npm run ios:dev`
- `npm run ios:staging`
- `npm run ios:prod`
  - Runs iOS app with matching `ENVFILE`.

## Project Automation

- `npm run configure -- --name="Client App" --id="com.client.app" [--dry-run] [--commit]`
  - Updates app metadata and Android package identifiers.
  - Creates backup directory `.hyfenative-backup` and restores on failure.

- `npm run icons`
  - Generates Android launcher icons and iOS AppIcon set from `hyfenative.config.ts` `assets.icon`.

- `npm run bump -- --patch|--minor|--major [--preid=beta] [--release] [--dry-run]`
  - Bumps semantic version and platform counters, including Android `versionCode`/`versionName` in `android/app/build.gradle`.

## Quality / Test

- `npm run lint`
  - Runs ESLint across project.

- `npm run test`
  - Runs Jest suite.

- `npm run test:integration`
  - Runs live API integration tests with `RUN_LIVE_API_TESTS=true`.
  - Requires relevant test env values (e.g. `TEST_AUTH_IDENTIFIER`, optional OTP code for verify flow).

## Script Safety Notes

- `configure` supports `--dry-run`; use this before identifier changes.
- `bump --release` performs git commit/tag/push; run only on intended release branch.
- `icons` overwrites platform icon outputs; keep source icon under version control and regenerate deterministically.
