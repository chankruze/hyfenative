# Versioning

## Intended Version Sources

The version script (`scripts/bump-version.ts`) treats these files as version targets:

- `hyfenative.config.ts`
  - `app.version`
  - `app.buildNumber`
  - `app.versionCode`
- `package.json`
  - `version`
- `android/gradle.properties`
  - `VERSION_NAME`
  - `VERSION_CODE`

## Bump Commands

```bash
npm run bump -- --patch
npm run bump -- --minor
npm run bump -- --major
npm run bump -- --patch --preid=beta
npm run bump -- --release
```

Supported flags:

- `--patch`, `--minor`, `--major`
- `--preid=<id>` (e.g. `beta`, `rc`)
- `--release` (defaults to patch if bump type omitted)
- `--dry-run`

## Release Mode Behavior

`--release` performs:

1. `git add .`
2. `git commit -m "release: v<version>"`
3. `git tag v<version>`
4. `git push`
5. `git push origin v<version>`

## Current Android Mismatch (Important)

Current repository state:

- `android/app/build.gradle` hardcodes:
  - `versionCode 1`
  - `versionName "1.0"`
- `android/gradle.properties` currently does not define `VERSION_NAME` / `VERSION_CODE`.

Impact:

- Running `npm run bump` updates files, but Android build version in `build.gradle` will not automatically reflect those updated values.

## Safe Fix Path

Choose one source of truth and align tooling.

Option A (recommended): use `gradle.properties`

1. Add `VERSION_NAME=<version>` and `VERSION_CODE=<int>` to `android/gradle.properties`.
2. In `android/app/build.gradle`, replace hardcoded values with project properties.
3. Keep `bump-version.ts` as-is.

Option B: keep hardcoded `build.gradle`

1. Update `bump-version.ts` to edit `android/app/build.gradle` directly.
2. Stop writing version keys in `gradle.properties`.

## Team Workflow Recommendation

- Use `--dry-run` in CI validation for release PRs.
- Keep pre-release tags for QA (`beta`, `rc`) and stable tags for production.
- Require clean working tree before `--release`.
